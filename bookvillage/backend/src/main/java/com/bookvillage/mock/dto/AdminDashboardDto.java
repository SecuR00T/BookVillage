package com.bookvillage.mock.dto;

import lombok.Data;

@Data
public class AdminDashboardDto {
    private Long totalUsers;
    private Long totalBooks;
    private Long totalOrders;
    private Long openInquiries;
    private Long securityEvents;
}
