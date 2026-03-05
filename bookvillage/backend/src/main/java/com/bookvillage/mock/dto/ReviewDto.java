package com.bookvillage.mock.dto;

import com.bookvillage.mock.entity.Review;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private Long id;
    private Long userId;
    private Long bookId;
    private Long orderId;
    private Integer rating;
    private String content;
    private String summary;
    private String imageUrl;
    private Long likeCount;
    private Long reportCount;
    private LocalDateTime createdAt;

    public static ReviewDto from(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setUserId(review.getUserId());
        dto.setBookId(review.getBookId());
        dto.setOrderId(review.getOrderId());
        dto.setRating(review.getRating());
        dto.setContent(review.getContent());
        dto.setSummary(review.getSummary());
        dto.setImageUrl(review.getImageUrl());
        dto.setLikeCount(0L);
        dto.setReportCount(0L);
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
