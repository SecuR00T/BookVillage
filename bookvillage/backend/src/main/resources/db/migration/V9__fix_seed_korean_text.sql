UPDATE books
SET category = '소설'
WHERE id = 4 AND category = '??';

UPDATE faqs
SET category = '주문',
    question = '배송은 얼마나 걸리나요?',
    answer = '보통 영업일 기준 1~2일 이내에 도착합니다.'
WHERE id = 1;

UPDATE faqs
SET category = '결제',
    question = '결제수단은 무엇인가요?',
    answer = '신용카드, 간편결제, 무통장입금을 지원합니다.'
WHERE id = 2;

UPDATE faqs
SET category = '계정',
    question = '비밀번호를 잊어버렸을 때 어떻게 하나요?',
    answer = '로그인 화면에서 비밀번호 찾기를 통해 재설정할 수 있습니다.'
WHERE id = 3;

UPDATE notices
SET title = '시스템 점검 안내',
    content = '더 나은 서비스를 위해 02:00~03:00 동안 시스템 점검이 진행됩니다.'
WHERE id = 1;

UPDATE notices
SET title = '이벤트 당첨 안내',
    content = '당첨자 발표는 이벤트 페이지에서 확인해주세요.'
WHERE id = 2;

UPDATE point_histories
SET description = '첫 구매 적립'
WHERE id = 1;

UPDATE point_histories
SET description = '도서 구매 사용'
WHERE id = 2;

UPDATE favorite_posts
SET post_title = '요즘 IT 추천 도서'
WHERE id = 1;

UPDATE favorite_posts
SET post_title = '다시 읽고 싶은 책'
WHERE id = 2;
