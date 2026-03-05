ALTER TABLE users
    ADD COLUMN login_id VARCHAR(80) NULL AFTER id;

UPDATE users
SET login_id = SUBSTRING_INDEX(email, '@', 1)
WHERE (login_id IS NULL OR TRIM(login_id) = '')
  AND email IS NOT NULL
  AND TRIM(email) <> '';

UPDATE users u
JOIN (
    SELECT login_id
    FROM users
    WHERE login_id IS NOT NULL
      AND TRIM(login_id) <> ''
    GROUP BY login_id
    HAVING COUNT(*) > 1
) dup ON u.login_id = dup.login_id
SET u.login_id = CONCAT(u.login_id, '_', u.id);

UPDATE users
SET login_id = CONCAT('user', id)
WHERE login_id IS NULL OR TRIM(login_id) = '';

ALTER TABLE users
    MODIFY COLUMN login_id VARCHAR(80) NOT NULL;

ALTER TABLE users
    ADD UNIQUE KEY uk_users_login_id (login_id);
