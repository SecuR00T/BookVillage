-- Seed predictable users for IDOR lab (dummy data only).
-- password (SHA-1): 5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8

INSERT IGNORE INTO users (id, email, password, name, phone, address, role, status) VALUES
(3, 'user2@bookvillage.mock', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'Second User', '010-2222-3333', 'Busan', 'USER', 'ACTIVE');
