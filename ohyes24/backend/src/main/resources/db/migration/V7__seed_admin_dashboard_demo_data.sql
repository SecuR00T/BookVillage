-- Seed minimal demo rows so admin dashboard has meaningful data.
-- This migration is idempotent: each row is inserted only if missing.

INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address, created_at)
SELECT 2, 'ORD-20260303-0001', 32000, 'PAID', 'CARD', 'Seoul Gangnam-gu 1', NOW() - INTERVAL 6 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_number = 'ORD-20260303-0001');

INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address, created_at)
SELECT 2, 'ORD-20260303-0002', 66000, 'SHIPPED', 'CARD', 'Seoul Gangnam-gu 1', NOW() - INTERVAL 5 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_number = 'ORD-20260303-0002');

INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address, created_at)
SELECT 2, 'ORD-20260303-0003', 36000, 'DELIVERED', 'CARD', 'Seoul Gangnam-gu 1', NOW() - INTERVAL 4 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_number = 'ORD-20260303-0003');

INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address, created_at)
SELECT 2, 'ORD-20260303-0004', 17000, 'PENDING', 'BANK', 'Seoul Gangnam-gu 1', NOW() - INTERVAL 3 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_number = 'ORD-20260303-0004');

INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address, created_at)
SELECT 2, 'ORD-20260303-0005', 50000, 'PAID', 'CARD', 'Seoul Gangnam-gu 1', NOW() - INTERVAL 2 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_number = 'ORD-20260303-0005');

INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address, created_at)
SELECT 2, 'ORD-20260303-0006', 24000, 'CANCELLED', 'CARD', 'Seoul Gangnam-gu 1', NOW() - INTERVAL 1 DAY
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_number = 'ORD-20260303-0006');

INSERT INTO order_items (order_id, book_id, quantity, unit_price)
SELECT o.id, 1, 1, 32000
FROM orders o
WHERE o.order_number = 'ORD-20260303-0001'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.book_id = 1);

INSERT INTO order_items (order_id, book_id, quantity, unit_price)
SELECT o.id, 2, 2, 33000
FROM orders o
WHERE o.order_number = 'ORD-20260303-0002'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.book_id = 2);

INSERT INTO order_items (order_id, book_id, quantity, unit_price)
SELECT o.id, 3, 1, 36000
FROM orders o
WHERE o.order_number = 'ORD-20260303-0003'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.book_id = 3);

INSERT INTO order_items (order_id, book_id, quantity, unit_price)
SELECT o.id, 4, 1, 17000
FROM orders o
WHERE o.order_number = 'ORD-20260303-0004'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.book_id = 4);

INSERT INTO order_items (order_id, book_id, quantity, unit_price)
SELECT o.id, 1, 1, 32000
FROM orders o
WHERE o.order_number = 'ORD-20260303-0005'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.book_id = 1);

INSERT INTO order_items (order_id, book_id, quantity, unit_price)
SELECT o.id, 4, 1, 17000
FROM orders o
WHERE o.order_number = 'ORD-20260303-0006'
  AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.book_id = 4);

INSERT INTO reviews (user_id, book_id, order_id, rating, content, summary, created_at)
SELECT 2, 1, o.id, 5, 'Great intro book for Java.', 'Great intro', NOW() - INTERVAL 2 DAY
FROM orders o
WHERE o.order_number = 'ORD-20260303-0001'
  AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.order_id = o.id AND r.user_id = 2 AND r.book_id = 1);

INSERT INTO reviews (user_id, book_id, order_id, rating, content, summary, created_at)
SELECT 2, 2, o.id, 4, 'Useful examples and clear structure.', 'Useful', NOW() - INTERVAL 1 DAY
FROM orders o
WHERE o.order_number = 'ORD-20260303-0002'
  AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.order_id = o.id AND r.user_id = 2 AND r.book_id = 2);

INSERT INTO reviews (user_id, book_id, order_id, rating, content, summary, created_at)
SELECT 2, 3, o.id, 5, 'Very helpful for security basics.', 'Helpful', NOW() - INTERVAL 1 HOUR
FROM orders o
WHERE o.order_number = 'ORD-20260303-0003'
  AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.order_id = o.id AND r.user_id = 2 AND r.book_id = 3);
