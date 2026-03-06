ALTER TABLE users
    ADD COLUMN username VARCHAR(50) NULL AFTER email;

UPDATE users
SET username = LOWER(SUBSTRING_INDEX(email, '@', 1))
WHERE username IS NULL OR TRIM(username) = '';

UPDATE users
SET username = CONCAT('user', id)
WHERE username IS NULL OR TRIM(username) = '';

CREATE INDEX idx_users_username ON users(username);
