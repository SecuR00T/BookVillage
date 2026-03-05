-- Sample data for BOOKVILLAGE Mock (보안 교육용)
-- schema.sql 실행 후 데이터베이스가 비어있는 경우에만 실행

INSERT IGNORE INTO users (email, password, name, phone, address, role) VALUES
('admin@bookvillage.mock', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'Admin', '010-0000-0000', 'Seoul', 'ADMIN'),
('user@bookvillage.mock', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'Test User', '010-1234-5678', 'Seoul', 'USER');
-- password above is SHA1 of 'password'

INSERT IGNORE INTO books (isbn, title, author, publisher, category, price, stock, description) VALUES
('978-89-1234-567-0', '자바의 정석', '남궁성', '도우출판', 'IT', 32000, 100, 'Java 입문서'),
('978-89-2345-678-1', '클린 코드', '로버트 마틴', '인사이트', 'IT', 33000, 50, '클린 코드 작성법'),
('978-89-3456-789-2', '이펙티브 자바', '조슈아 블로크', '인사이트', 'IT', 36000, 30, 'Java Best Practices');
