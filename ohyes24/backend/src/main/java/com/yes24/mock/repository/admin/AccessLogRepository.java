package com.yes24.mock.repository;

import com.yes24.mock.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    void deleteByUserId(Long userId);
}
