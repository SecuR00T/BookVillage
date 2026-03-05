package com.yes24.mock.repository.admin;

import com.yes24.mock.entity.admin.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
}

