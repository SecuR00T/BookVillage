package com.yes24.mock.service.support;

import com.yes24.mock.dto.support.CustomerServiceRequest;
import com.yes24.mock.entity.support.CustomerService;
import com.yes24.mock.repository.support.CustomerServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceService {

    private final CustomerServiceRepository customerServiceRepository;

    public List<CustomerService> getByUserId(Long userId) {
        return customerServiceRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public CustomerService create(Long userId, CustomerServiceRequest request) {
        CustomerService cs = new CustomerService();
        cs.setUserId(userId);
        cs.setSubject(request.getSubject());
        cs.setContent(request.getContent());
        cs.setStatus("OPEN");
        return customerServiceRepository.save(cs);
    }

    public CustomerService reply(Long inquiryId, String answer) {
        CustomerService inquiry = customerServiceRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("Inquiry not found"));
        inquiry.setAdminAnswer(answer);
        inquiry.setStatus("ANSWERED");
        return customerServiceRepository.save(inquiry);
    }
}

