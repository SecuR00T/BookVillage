ALTER TABLE users
    ADD COLUMN membership_grade VARCHAR(20) NOT NULL DEFAULT 'BRONZE' AFTER status;

ALTER TABLE coupons
    ADD COLUMN target_grade VARCHAR(20) NOT NULL DEFAULT 'ALL' AFTER remaining_count;

CREATE TABLE IF NOT EXISTS user_coupon_issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    CONSTRAINT fk_user_coupon_issues_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_coupon_issues_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_coupon_issue (coupon_id, user_id)
);

UPDATE users
SET membership_grade = 'VIP'
WHERE role = 'ADMIN';
