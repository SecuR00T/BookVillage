package com.bookvillage.mock.dto;

import com.bookvillage.mock.entity.Order;
import com.bookvillage.mock.entity.OrderItem;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderDto {
    private Long id;
    private Long userId;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String shippingAddress;
    private String receiptFilePath;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;

    @Data
    public static class OrderItemDto {
        private Long bookId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }

    public static OrderDto from(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setReceiptFilePath(order.getReceiptFilePath());
        dto.setCreatedAt(order.getCreatedAt());
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream()
                    .map(OrderDto::fromItem)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private static OrderItemDto fromItem(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setBookId(item.getBookId());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        return dto;
    }
}
