package com.bookvillage.mock.dto;

import lombok.Data;

import java.util.List;

@Data
public class CartRequest {
    private List<CartItem> items;
    private String paymentMethod;
    private String couponCode;
    private Integer usePoints;
    private String shippingAddress;
    private Boolean skipVerification;

    @Data
    public static class CartItem {
        private Long bookId;
        private Integer quantity;
    }
}
