package com.bookvillage.mock.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class GuestOrderLookupDto {
    private String orderNumber;
    private String status;
    private BigDecimal totalAmount;
    private String maskedShippingAddress;
    private LocalDateTime createdAt;
}
