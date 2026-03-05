package com.yes24.mock.repository.support;

import com.yes24.mock.entity.support.CustomerService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerServiceRepository extends JpaRepository<CustomerService, Long> {
    List<CustomerService> findByUserIdOrderByCreatedAtDesc(Long userId);

    void deleteByUserId(Long userId);
}

