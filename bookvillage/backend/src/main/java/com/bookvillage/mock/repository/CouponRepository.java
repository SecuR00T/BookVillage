package com.bookvillage.mock.repository;

import com.bookvillage.mock.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
}
