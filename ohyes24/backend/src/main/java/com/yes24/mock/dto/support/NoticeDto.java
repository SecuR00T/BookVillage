package com.yes24.mock.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NoticeDto {
    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private LocalDateTime createdAt;
}
