UPDATE point_histories
SET description = '도서 구매 적립'
WHERE LOWER(TRIM(description)) = 'checkout reward';

UPDATE point_histories
SET description = '도서 구매 시 포인트 사용'
WHERE LOWER(TRIM(description)) = 'checkout point use';
