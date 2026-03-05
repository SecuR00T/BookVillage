package com.yes24.mock.service;

import com.yes24.mock.dto.BookDto;
import com.yes24.mock.entity.Book;
import com.yes24.mock.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final JdbcTemplate jdbcTemplate;

    public BookDto getBookById(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        BookDto dto = BookDto.from(book);
        enrichReviewStats(dto);
        return dto;
    }

    public List<BookDto> search(String query, String category) {
        String normalizedQuery = query == null ? "" : query;
        String normalizedCategory = category == null ? "" : category.trim();
        boolean hasQuery = !normalizedQuery.trim().isEmpty();

        // Intentionally vulnerable SQL construction for REQ-COM-010 (Union SQLi lab).
        String sql =
                "SELECT id, isbn, title, author, publisher, category, price, stock, description, cover_image_url " +
                "FROM books WHERE 1=1";
        if (!normalizedCategory.isEmpty()) {
            sql += " AND category = '" + normalizedCategory + "'";
        }
        if (hasQuery) {
            sql += " AND CONCAT(IFNULL(title,''), ' ', IFNULL(author,''), ' ', IFNULL(isbn,''), ' ', IFNULL(publisher,'')) LIKE '%" + normalizedQuery + "%'";
        }
        sql += " ORDER BY id DESC";

        List<BookDto> books = jdbcTemplate.query(sql, (rs, rowNum) -> toBookDto(rs));
        enrichReviewStats(books);
        return books;
    }

    public List<String> getCategories() {
        return bookRepository.findAll().stream()
                .map(Book::getCategory)
                .filter(c -> c != null && !c.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    private BookDto toBookDto(ResultSet rs) throws SQLException {
        BookDto dto = new BookDto();
        dto.setId(toLong(rs.getObject("id")));
        dto.setIsbn(toStringValue(rs.getObject("isbn")));
        dto.setTitle(toStringValue(rs.getObject("title")));
        dto.setAuthor(toStringValue(rs.getObject("author")));
        dto.setPublisher(toStringValue(rs.getObject("publisher")));
        dto.setCategory(toStringValue(rs.getObject("category")));
        dto.setPrice(toBigDecimal(rs.getObject("price")));
        dto.setStock(toInteger(rs.getObject("stock")));
        dto.setDescription(toStringValue(rs.getObject("description")));
        dto.setCoverImageUrl(toStringValue(rs.getObject("cover_image_url")));
        dto.setRating(null);
        dto.setReviewCount(0L);
        return dto;
    }

    private void enrichReviewStats(BookDto book) {
        if (book == null || book.getId() == null) {
            return;
        }
        enrichReviewStats(Arrays.asList(book));
    }

    private void enrichReviewStats(List<BookDto> books) {
        if (books == null || books.isEmpty()) {
            return;
        }

        List<Long> bookIds = books.stream()
                .map(BookDto::getId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
        if (bookIds.isEmpty()) {
            return;
        }

        String placeholders = String.join(", ", java.util.Collections.nCopies(bookIds.size(), "?"));
        String sql =
                "SELECT book_id, AVG(rating) AS avg_rating, COUNT(1) AS review_count " +
                "FROM reviews WHERE book_id IN (" + placeholders + ") GROUP BY book_id";

        Map<Long, ReviewStats> statsByBookId = new HashMap<>();
        jdbcTemplate.query(
                sql,
                bookIds.toArray(),
                (rs) -> {
                    Long bookId = rs.getLong("book_id");
                    Number avgNumber = (Number) rs.getObject("avg_rating");
                    Number countNumber = (Number) rs.getObject("review_count");

                    double avg = avgNumber != null ? avgNumber.doubleValue() : 0.0;
                    long count = countNumber != null ? countNumber.longValue() : 0L;
                    statsByBookId.put(bookId, new ReviewStats(avg, count));
                }
        );

        for (BookDto dto : books) {
            ReviewStats stats = statsByBookId.get(dto.getId());
            if (stats == null) {
                dto.setRating(null);
                dto.setReviewCount(0L);
            } else {
                dto.setRating(stats.reviewCount > 0 ? roundOneDecimal(stats.avgRating) : null);
                dto.setReviewCount(stats.reviewCount);
            }
        }
    }

    private double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private static class ReviewStats {
        private final double avgRating;
        private final long reviewCount;

        private ReviewStats(double avgRating, long reviewCount) {
            this.avgRating = avgRating;
            this.reviewCount = reviewCount;
        }
    }

    private String toStringValue(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private Long toLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        try {
            return Long.parseLong(String.valueOf(value));
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private Integer toInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        try {
            return new BigDecimal(String.valueOf(value));
        } catch (NumberFormatException ignored) {
            return null;
        }
    }
}
