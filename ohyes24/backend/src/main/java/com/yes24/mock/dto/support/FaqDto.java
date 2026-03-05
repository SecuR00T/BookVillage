package com.yes24.mock.dto;

import lombok.Data;

@Data
public class FaqDto {
    private Long id;
    private String category;
    private String question;
    private String answer;
    private Integer displayOrder;
}
