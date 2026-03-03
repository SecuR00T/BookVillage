CREATE TABLE IF NOT EXISTS board_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_board_comments_post FOREIGN KEY (post_id) REFERENCES board_posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_board_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_board_comments_post_created_at ON board_comments(post_id, created_at);
CREATE INDEX idx_board_comments_user_created_at ON board_comments(user_id, created_at);

CREATE TABLE IF NOT EXISTS board_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL UNIQUE,
    file_url VARCHAR(500) NOT NULL,
    content_type VARCHAR(120),
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_board_attachments_post FOREIGN KEY (post_id) REFERENCES board_posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_board_attachments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_board_attachments_post_created_at ON board_attachments(post_id, created_at);
CREATE INDEX idx_board_attachments_user_created_at ON board_attachments(user_id, created_at);
