package com.yes24.mock.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MyReviewDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private Integer rating;
    private String content;
    private String summary;
    private String imageUrl;
    private Long likeCount;
    private Long reportCount;
    private LocalDateTime createdAt;
}

