package com.yes24.mock.repository.admin;

import com.yes24.mock.entity.admin.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    void deleteByUserId(Long userId);
}

