INSERT IGNORE INTO users (id, email, password, name, phone, address, role, status) VALUES
(1, 'admin@bookvillage.mock', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'Admin', '010-0000-0000', 'Seoul', 'ADMIN', 'ACTIVE'),
(2, 'user@bookvillage.mock', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'Student User', '010-1234-5678', 'Seoul', 'USER', 'ACTIVE');

INSERT IGNORE INTO books (id, isbn, title, author, publisher, category, price, stock, description) VALUES
(1, '978-89-1234-567-0', 'Java Basics', 'Kim Dev', 'EduPress', 'IT', 32000, 100, 'Intro Java book for students'),
(2, '978-89-2345-678-1', 'Clean Coding Lab', 'Park Architect', 'Insight', 'IT', 33000, 50, 'Practical clean code patterns'),
(3, '978-89-3456-789-2', 'Network Security Intro', 'Lee Sec', 'Security House', 'IT', 36000, 30, 'Security fundamentals for beginners'),
(4, '978-89-4567-890-3', 'Korean Literature 101', 'Han Writer', 'BookTree', '??', 17000, 70, 'Classic literature for students');

INSERT IGNORE INTO coupons (id, code, discount_type, discount_value, remaining_count) VALUES
(1, 'WELCOME10', 'PERCENT', 10.00, 100),
(2, 'STUDENT5000', 'AMOUNT', 5000.00, 100),
(3, 'ONE-TIME', 'AMOUNT', 3000.00, 1);

INSERT IGNORE INTO faqs (id, category, question, answer, display_order) VALUES
(1, '??', '??? ??? ?????', '?? ? ?? 1~2 ??? ? ?????.', 1),
(2, '??', '????? ??????.', '???? ??? ???? ??? ??? ?????.', 2),
(3, '??', '??? ???? ?? ??? ? ????', '??? ?? ?? ????? ?? ??? ??? ? ????.', 3);

INSERT IGNORE INTO notices (id, title, content, author_id) VALUES
(1, '??? ?? ??', '?? ? ??? 02:00~03:00 ??? ??? ???? ????.', 1),
(2, '?? ?? ??', '???? ????? ??? ???????.', 1);

INSERT IGNORE INTO point_histories (id, user_id, change_type, amount, balance_after, description) VALUES
(1, 2, 'EARN', 1000, 1000, '???? ??'),
(2, 2, 'USE', -300, 700, '?? ?? ??');

INSERT IGNORE INTO favorite_posts (id, user_id, post_title, is_private) VALUES
(1, 2, '?? IT ?? ??', FALSE),
(2, 2, '?? ??? ??? ?', TRUE);

INSERT IGNORE INTO security_lab_requirements (req_id, major_category, middle_category, feature_name, requirement_text, security_topic, required_role) VALUES
('REQ-COM-001', '회원', '회원관리', '회원가입', '아이디, 비번, 이메일 등 입력 및 가입', 'IDOR: 가입 후 user_id를 조작하여 타인 정보 탈취', 'USER'),
('REQ-COM-002', '회원', '프로필', '회원 탈퇴', '비밀번호 인증 후 탈퇴 처리', 'Logic Flaw: 인증 단계 우회하여 타인 계정 삭제', 'USER'),
('REQ-COM-003', '회원', '프로필', '비밀번호 변경', '기존 비밀번호 확인 후 새 비밀번호 설정', 'Parameter Tampering: 본인 확인 절차 변조 공격', 'USER'),
('REQ-COM-004', '회원', '인증', '비번 재설정', '이메일 인증을 통한 비밀번호 재설정', 'Auth Bypass: 재설정 토큰 무차별 대입(Brute Force)', 'USER'),
('REQ-COM-005', '회원', '인증', '아이디 찾기', '이름/이메일 정보로 아이디 조회', 'Info Disclosure: 타인의 아이디 무단 노출 확인', 'USER'),
('REQ-COM-006', '회원', '인증', '로그인', '아이디/비번 일치 확인 및 세션 발급', 'SQL Injection: 로그인 폼 우회를 통한 무단 접속', 'USER'),
('REQ-COM-007', '회원', '인증', '로그아웃', '세션 종료 및 페이지 리다이렉트', 'Session Fixation: 로그아웃 후 세션 미파기 취약점', 'USER'),
('REQ-COM-008', '회원', '검색', '주소 검색', '우편번호 및 주소 API 연동 검색', 'Client-side Attack: 검색 값 조작을 통한 XSS', 'USER'),
('REQ-COM-009', '회원', '마이페이지', '회원정보 조회', '가입 시 입력한 개인정보 노출', 'IDOR: URL의 회원번호 변조로 타인 정보 열람', 'USER'),
('REQ-COM-010', '도서', '도서검색', '통합 검색', '제목, 저자, ISBN 기반 도서 검색', 'Union SQLi: 검색창에 쿼리 주입하여 전체 DB 덤프', 'USER'),
('REQ-COM-011', '도서', '도서조회', '카테고리 별 조회', '카테고리 클릭 시 해당 목록 노출', 'Parameter Tampering: 카테고리 코드 변조 공격', 'USER'),
('REQ-COM-012', '도서', '상세조회', '도서 상세 페이지', '책 제목, 가격, 소개 내용 출력', 'XSS: 도서 소개란에 악성 스크립트 삽입 및 실행', 'USER'),
('REQ-COM-013', '도서', '상세조회', '배송정보 표시', '실시간 도착 예정일 계산 및 출력', 'API Abuse: 배송 정보 조회 API 과부하 공격', 'USER'),
('REQ-COM-014', '도서', '상세조회', '미리보기', '도서 본문 일부 미리보기 제공', 'File Download: 경로 조작으로 시스템 파일 다운로드', 'USER'),
('REQ-COM-015', '주문', '영수증', '영수증 출력', '결제 완료 후 PDF 영수증 제공', 'Path Traversal: ../etc/passwd 등 시스템 파일 탈취', 'USER'),
('REQ-COM-016', '주문', '장바구니', '장바구니 담기', '선택 상품 장바구니 DB 저장', 'Parameter Tampering: 담기 시 상품 가격을 0원으로 조작', 'USER'),
('REQ-COM-017', '주문', '장바구니', '수량 조절', '상품 수량 증감 및 금액 재계산', 'Integer Overflow: 수량을 마이너스(-)로 조작', 'USER'),
('REQ-COM-018', '주문', '결제', '결제 수단 선택', '카드, 무통장, 페이 결제 선택', 'Business Logic: 특정 결제 수단 인증 단계 우회', 'USER'),
('REQ-COM-019', '주문', '결제', '쿠폰 적용', '사용 가능한 쿠폰 조회 및 할인 적용', 'Logic Flaw: 동일 쿠폰 중복 사용 공격', 'USER'),
('REQ-COM-020', '주문', '결제', '포인트 사용', '보유 포인트 차감 및 결제', 'Race Condition: 다중 접속으로 포인트 초과 사용', 'USER'),
('REQ-COM-021', '주문', '결제완료', '주문 완료 페이지', '주문 번호 및 배송지 정보 요약', 'Info Disclosure: URL로 타인의 주문 번호 열람', 'USER'),
('REQ-COM-022', '주문', '배송조회', '실시간 위치 확인', '택배사 API 연동 배송 추적', 'SSRF: 배송 추적 URL 호출 시 내부망 서버 공격', 'USER'),
('REQ-COM-023', '고객센터', '공지사항', '공지사항 목록', '전체 공지 게시글 리스트 조회', 'SQL Injection: 검색 필터를 통한 데이터 탈취', 'USER'),
('REQ-COM-024', '고객센터', '공지사항', '공지 상세 내용', '특정 공지글 클릭 시 상세 내용 노출', 'Stored XSS: 공지사항 내부에 악성 코드 삽입', 'USER'),
('REQ-COM-025', '고객센터', '1:1문의', '문의글 작성', '비공개 상담 내용 작성', 'Stored XSS: 관리자가 읽을 때 세션을 가로채는 코드 주입', 'USER'),
('REQ-COM-026', '고객센터', '1:1문의', '', '문의 시 스크린샷 등 첨부 기능', 'File Upload: 이미지로 위장한 리버스 쉘 실행', 'USER'),
('REQ-COM-027', '고객센터', 'FAQ', '파일 첨부', '카테고리별 FAQ 조회', 'SQL Injection: 조회 쿼리 조작을 통한 정보 유출', 'USER'),
('REQ-COM-028', '마이페이지', '활동내역', '최근 본 상품', '사용자가 클릭한 도서 이력 저장/노출', 'Insecure Storage: 세션에 민감 데이터 평문 저장', 'USER'),
('REQ-COM-029', '마이페이지', '활동내역', '찜한 도서 목록', '사용자가 찜한 목록 조회', 'IDOR: 타인의 찜 목록 무단 조회 및 삭제', 'USER'),
('REQ-COM-030', '마이페이지', '활동내역', '나의 리뷰 관리', '본인이 쓴 리뷰 수정 및 삭제', 'CSRF: 리뷰를 강제로 삭제하게 만드는 공격', 'USER'),
('REQ-COM-031', '마이페이지', '통장내역', '포인트/쿠폰 내역', '획득/사용 히스토리 조회', 'Broken Auth: 타인의 포인트 내역 무단 열람', 'USER'),
('REQ-COM-032', '마이페이지', '주문관리', '주문 취소 요청', '배송 전 주문 건 취소 버튼 노출', 'Logic Flaw: 배송 중인 상품을 강제로 취소 처리', 'USER'),
('REQ-COM-033', '마이페이지', '주문관리', '반품/교환 요청', '사유 입력 및 반품 신청', 'Insecure File Upload: 반품 증빙 사진으로 웹쉘 업로드', 'USER'),
('REQ-COM-034', '마이페이지', '관심게시글', '즐겨찾기 삭제', '관심 게시글 목록에서 삭제', 'IDOR: 타인의 즐겨찾기 목록 무단 삭제', 'USER'),
('REQ-COM-035', '마이페이지', '관심게시글', '즐겨찾기 목록조회', '관심 게시글 페이지 리스트 출력', 'Insecure Direct Object Reference: 비공개 글 목록 조회', 'USER'),
('REQ-COM-036', '커뮤니티', '리뷰', '리뷰 작성', '별점 및 텍스트 리뷰 등록', 'SSTI: 리뷰 요약 템플릿에 표현식 주입 공격', 'USER'),
('REQ-COM-037', '커뮤니티', '리뷰', '리뷰 좋아요', '특정 리뷰 추천 기능', 'Rate Limiting: 자동화 툴로 특정 리뷰 추천 수 조작', 'USER'),
('REQ-COM-038', '커뮤니티', '리뷰', '리뷰 신고', '부적절한 리뷰 신고 처리', 'Denial of Service: 무차별 신고로 서비스 마비 유도', 'USER'),
('REQ-COM-039', '관리자', '대시보드', '통계 시각화', '가입자 및 매출 통계 그래프', 'Broken Access Control: 일반 유저의 관리자 페이지 접속', 'ADMIN'),
('REQ-COM-040', '관리자', '도서관리', '도서 등록/수정', '신규 도서 DB 입력 및 정보 변경', 'Privilege Escalation: 권한 상승을 통한 도서 가격 0원 수정', 'ADMIN'),
('REQ-COM-041', '관리자', '도서관리', '도서 삭제', '절판 도서 등 DB 데이터 삭제', 'Insecure Direct Object Reference: 전체 도서 일괄 삭제', 'ADMIN'),
('REQ-COM-042', '관리자', '주문관리', '배송 상태 변경', '준비중/배송중/완료 상태 업데이트', 'Logic Flaw: 결제 전인 주문을 배송 완료로 변경', 'ADMIN'),
('REQ-COM-043', '관리자', '회원관리', '회원 상태 관리', '불량 회원 정지 및 권한 변경', 'Broken Auth: 관리자 계정 탈취 및 계정 탈취 공격', 'ADMIN'),
('REQ-COM-044', '관리자', '고객센터', '문의 답변 작성', '1:1 문의글에 대한 운영자 답변', 'XSS: 관리자 답변 창에 악성 코드 삽입', 'ADMIN'),
('REQ-COM-045', '관리자', '도서', '도서 재고 조회', '조건(작가, ISBN)에 따른 재고 확인', 'SQL Injection: 재고 조회 필터를 통한 DB 덤프', 'ADMIN'),
('REQ-COM-046', '관리자', '도서', '도서 등록 (입고)', 'ISBN 입력을 통한 입고 처리', 'Command Injection: 입력값에 OS 명령어 삽입', 'ADMIN'),
('REQ-COM-047', '관리자', '도서', '도서 재고 수정', '상세 페이지에서 수량 변경/저장', 'Privilege Escalation: 관리자 권한 미검증 취약점', 'ADMIN'),
('REQ-COM-048', '서비스', '연동', '링크 미리보기', 'URL 입력 시 제목/썸네일 자동 추출', 'SSRF: AWS 메타데이터 탈취 및 내부망 스캔', 'USER');
