package com.bookvillage.mock.repository;

import com.bookvillage.mock.entity.CustomerService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerServiceRepository extends JpaRepository<CustomerService, Long> {
    List<CustomerService> findByUserIdOrderByCreatedAtDesc(Long userId);

    void deleteByUserId(Long userId);
}
