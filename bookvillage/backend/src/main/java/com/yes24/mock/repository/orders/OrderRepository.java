package com.yes24.mock.repository.orders;

import com.yes24.mock.entity.orders.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    Optional<Order> findByOrderNumber(String orderNumber);
}

