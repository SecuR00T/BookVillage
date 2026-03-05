package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.ReviewDto;
import com.bookvillage.mock.dto.ReviewRequest;
import com.bookvillage.mock.security.UserPrincipal;
import com.bookvillage.mock.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/books/{bookId}/reviews")
    public ResponseEntity<List<ReviewDto>> listReviews(@PathVariable Long bookId) {
        return ResponseEntity.ok(reviewService.getReviewsByBook(bookId));
    }

    @PostMapping("/books/{bookId}/reviews")
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long bookId,
            @RequestBody(required = false) ReviewRequest request) {
        Long actorUserId = principal != null ? principal.getUserId() : 2L;
        Long orderId = (request != null && request.getOrderId() != null) ? request.getOrderId() : null;
        Integer rating = (request != null && request.getRating() != null) ? request.getRating() : 5;
        String content = (request != null && request.getContent() != null) ? request.getContent() : "";
        ReviewDto review = reviewService.createReview(actorUserId, bookId, orderId, rating, content);
        return ResponseEntity.ok(review);
    }

    @PostMapping("/reviews/{reviewId}/upload")
    public ResponseEntity<ReviewDto> uploadImage(
            @PathVariable Long reviewId,
            @RequestParam("file") MultipartFile file) {
        ReviewDto review = reviewService.uploadImage(reviewId, file);
        return ResponseEntity.ok(review);
    }

    @PostMapping("/reviews/{reviewId}/like")
    public ResponseEntity<ReviewDto> likeReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.likeReview(principal.getUserId(), reviewId));
    }

    @PostMapping("/reviews/{reviewId}/report")
    public ResponseEntity<Void> reportReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reviewId,
            @RequestBody(required = false) Map<String, String> request) {
        String reason = request != null ? request.get("reason") : null;
        reviewService.reportReview(principal.getUserId(), reviewId, reason);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-LAB-CSRF-TOKEN", required = false) String csrfToken) {
        reviewService.deleteMyReview(principal.getUserId(), reviewId, csrfToken);
        return ResponseEntity.noContent().build();
    }
}
