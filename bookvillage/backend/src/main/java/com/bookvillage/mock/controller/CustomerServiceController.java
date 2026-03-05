package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.CustomerServiceRequest;
import com.bookvillage.mock.entity.CustomerService;
import com.bookvillage.mock.security.UserPrincipal;
import com.bookvillage.mock.service.CustomerServiceService;
import com.bookvillage.mock.service.SecurityLabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-service")
@RequiredArgsConstructor
public class CustomerServiceController {

    private final CustomerServiceService customerServiceService;
    private final SecurityLabService securityLabService;

    @GetMapping
    public ResponseEntity<List<CustomerService>> getMyInquiries(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(customerServiceService.getByUserId(principal.getUserId()));
    }

    @PostMapping
    public ResponseEntity<CustomerService> createInquiry(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CustomerServiceRequest request) {
        if (request == null || request.getSubject() == null || request.getSubject().trim().isEmpty()) {
            throw new IllegalArgumentException("subject is required");
        }
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("content is required");
        }
        securityLabService.simulate("REQ-COM-025", principal.getUserId(), "/api/customer-service", request.getContent());
        return ResponseEntity.ok(customerServiceService.create(principal.getUserId(), request));
    }
}
