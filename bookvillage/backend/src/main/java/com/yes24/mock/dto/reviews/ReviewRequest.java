package com.yes24.mock.dto.reviews;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long orderId;
    private Integer rating;
    private String content;
}

