package com.bookvillage.mock.repository;

import com.bookvillage.mock.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    void deleteByUserId(Long userId);
}
