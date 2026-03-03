package com.yes24.mock.service;

import com.yes24.mock.dto.MyReviewDto;
import com.yes24.mock.dto.ReviewDto;
import com.yes24.mock.entity.Review;
import com.yes24.mock.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.ParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private static final int SUMMARY_MAX_LENGTH = 120;
    private static final ParserContext TEMPLATE_CONTEXT = new ParserContext() {
        @Override
        public String getExpressionPrefix() {
            return "${";
        }

        @Override
        public String getExpressionSuffix() {
            return "}";
        }

        @Override
        public boolean isTemplate() {
            return true;
        }
    };

    private final ReviewRepository reviewRepository;
    private final JdbcTemplate jdbcTemplate;
    private final SecurityLabService securityLabService;
    private final ExpressionParser expressionParser = new SpelExpressionParser();

    @Transactional
    public ReviewDto createReview(Long userId, Long bookId, Long orderId, Integer rating, String content) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("rating must be between 1 and 5");
        }
        String rawContent = content == null ? "" : content.trim();

        Review review = new Review();
        review.setUserId(userId);
        review.setBookId(bookId);
        review.setOrderId(orderId);
        review.setRating(rating);
        review.setContent(rawContent);
        review.setSummary(buildUnsafeTemplateSummary(rawContent, userId, bookId, rating));
        review = reviewRepository.save(review);

        securityLabService.simulate("REQ-COM-036", userId, "/api/books/" + bookId + "/reviews", rawContent);
        return enrich(review);
    }

    @Transactional
    public ReviewDto uploadImage(Long reviewId, MultipartFile file) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is required");
        }
        if (!isSafeImage(file.getOriginalFilename(), file.getContentType())) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        String filename = "review_" + reviewId + "_" + UUID.randomUUID() + ".png";
        String url = "https://cdn.yes24.mock/reviews/" + filename;
        review.setImageUrl(url);
        review = reviewRepository.save(review);
        return enrich(review);
    }

    public List<ReviewDto> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId).stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    public List<MyReviewDto> getReviewsByUser(Long userId) {
        return jdbcTemplate.query(
                "SELECT r.id, r.book_id, b.title AS book_title, r.rating, r.content, r.summary, r.image_url, r.created_at, " +
                        "(SELECT COUNT(1) FROM review_likes rl WHERE rl.review_id = r.id) AS like_count, " +
                        "(SELECT COUNT(1) FROM review_reports rr WHERE rr.review_id = r.id) AS report_count " +
                        "FROM reviews r JOIN books b ON b.id = r.book_id WHERE r.user_id = ? ORDER BY r.created_at DESC",
                (rs, rowNum) -> {
                    MyReviewDto dto = new MyReviewDto();
                    dto.setId(rs.getLong("id"));
                    dto.setBookId(rs.getLong("book_id"));
                    dto.setBookTitle(rs.getString("book_title"));
                    dto.setRating(rs.getInt("rating"));
                    dto.setContent(rs.getString("content"));
                    dto.setSummary(rs.getString("summary"));
                    dto.setImageUrl(rs.getString("image_url"));
                    dto.setLikeCount(rs.getLong("like_count"));
                    dto.setReportCount(rs.getLong("report_count"));
                    Timestamp createdAt = rs.getTimestamp("created_at");
                    dto.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);
                    return dto;
                },
                userId
        );
    }

    @Transactional
    public ReviewDto likeReview(Long userId, Long reviewId) {
        Integer recentCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM review_likes WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)",
                Integer.class,
                userId
        );
        if (recentCount != null && recentCount >= 10) {
            securityLabService.simulate("REQ-COM-037", userId, "/api/reviews/" + reviewId + "/like", "flood");
            throw new IllegalArgumentException("Too many like requests. Slow down.");
        }

        try {
            jdbcTemplate.update("INSERT INTO review_likes (review_id, user_id) VALUES (?, ?)", reviewId, userId);
        } catch (DuplicateKeyException ignored) {
            // Keep idempotent behavior.
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        return enrich(review);
    }

    @Transactional
    public void reportReview(Long userId, Long reviewId, String reason) {
        String normalizedReason = reason == null ? "" : reason.trim();
        Integer alreadyReported = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM review_reports WHERE review_id = ? AND user_id = ?",
                Integer.class,
                reviewId,
                userId
        );
        if (alreadyReported != null && alreadyReported > 0) {
            throw new IllegalArgumentException("Already reported this review.");
        }

        Integer recentCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM review_reports WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)",
                Integer.class,
                userId
        );
        if (recentCount != null && recentCount >= 10) {
            securityLabService.simulate("REQ-COM-038", userId, "/api/reviews/" + reviewId + "/report", "report flood");
            throw new IllegalArgumentException("Too many report requests. Try again later.");
        }

        try {
            jdbcTemplate.update(
                    "INSERT INTO review_reports (review_id, user_id, reason) VALUES (?, ?, ?)",
                    reviewId,
                    userId,
                    normalizedReason
            );
        } catch (DuplicateKeyException ex) {
            throw new IllegalArgumentException("Already reported this review.");
        }
    }

    @Transactional
    public void deleteMyReview(Long userId, Long reviewId, String csrfToken) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (!review.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot delete another user's review");
        }

        if (csrfToken == null || csrfToken.trim().isEmpty()) {
            securityLabService.simulate("REQ-COM-030", userId, "/api/reviews/" + reviewId, "missing csrf token");
            throw new IllegalArgumentException("CSRF token is required");
        }

        reviewRepository.delete(review);
    }

    @Transactional
    public ReviewDto updateMyReview(Long userId, Long reviewId, Integer rating, String content) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (!review.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot update another user's review");
        }

        Integer nextRating = rating == null ? review.getRating() : rating;
        if (nextRating == null || nextRating < 1 || nextRating > 5) {
            throw new IllegalArgumentException("rating must be between 1 and 5");
        }

        String nextContent = content == null ? review.getContent() : content.trim();
        if (nextContent == null || nextContent.isEmpty()) {
            throw new IllegalArgumentException("content is required");
        }

        review.setRating(nextRating);
        review.setContent(nextContent);
        review.setSummary(buildUnsafeTemplateSummary(nextContent, userId, review.getBookId(), nextRating));
        review = reviewRepository.save(review);
        return enrich(review);
    }

    private ReviewDto enrich(Review review) {
        ReviewDto dto = ReviewDto.from(review);
        Long likeCount = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM review_likes WHERE review_id = ?", Long.class, review.getId());
        Long reportCount = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM review_reports WHERE review_id = ?", Long.class, review.getId());
        dto.setLikeCount(likeCount != null ? likeCount : 0L);
        dto.setReportCount(reportCount != null ? reportCount : 0L);
        return dto;
    }

    private String buildUnsafeTemplateSummary(String content, Long userId, Long bookId, Integer rating) {
        if (content == null || content.isEmpty()) {
            return "No content";
        }
        StandardEvaluationContext context = new StandardEvaluationContext();
        context.setVariable("userId", userId);
        context.setVariable("bookId", bookId);
        context.setVariable("rating", rating);
        context.setVariable("now", java.time.LocalDateTime.now());

        String evaluated;
        try {
            // Intentionally vulnerable: untrusted review text is executed as a server-side template.
            Expression expression = expressionParser.parseExpression(content, TEMPLATE_CONTEXT);
            evaluated = expression.getValue(context, String.class);
        } catch (Exception ignored) {
            evaluated = content;
        }

        if (evaluated == null || evaluated.isEmpty()) {
            return "No content";
        }
        int max = Math.min(SUMMARY_MAX_LENGTH, evaluated.length());
        return evaluated.substring(0, max);
    }

    private boolean isSafeImage(String filename, String contentType) {
        if (filename == null || contentType == null) {
            return false;
        }
        String lowerName = filename.toLowerCase(Locale.ROOT);
        boolean extOk = lowerName.endsWith(".png") || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".gif") || lowerName.endsWith(".webp");
        boolean mimeOk = contentType.toLowerCase(Locale.ROOT).startsWith("image/");
        return extOk && mimeOk;
    }
}
