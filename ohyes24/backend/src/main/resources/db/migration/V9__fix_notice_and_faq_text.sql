UPDATE notices
SET title = '시스템 점검 안내',
    content = '서비스 안정화를 위해 02:00~03:00 사이 점검이 진행됩니다.'
WHERE id = 1;

UPDATE notices
SET title = '신규 도서 입고 안내',
    content = '3월 추천 도서가 입고되었습니다. 도서 상세 페이지에서 확인해주세요.'
WHERE id = 2;

UPDATE faqs
SET category = '주문',
    question = '배송은 얼마나 걸리나요?',
    answer = '결제 완료 후 평균 1~2영업일 내 출고됩니다.'
WHERE id = 1;

UPDATE faqs
SET category = '결제',
    question = '쿠폰은 어떻게 사용하나요?',
    answer = '주문서 화면에서 보유 쿠폰을 선택해 적용할 수 있습니다.'
WHERE id = 2;

UPDATE faqs
SET category = '회원',
    question = '비밀번호를 잊어버렸어요.',
    answer = '로그인 화면의 비밀번호 재설정 메뉴에서 인증코드를 받아 변경할 수 있습니다.'
WHERE id = 3;
