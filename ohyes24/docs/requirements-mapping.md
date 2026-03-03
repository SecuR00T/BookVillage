# ???? 48? ???

| ???? ID | ??? | ?? ?? | ??? API | ??? ?? | DB ?? |
|---|---|---|---|---|---|
| REQ-COM-001 | 회원가입 | ???/?? | `POST /api/auth/register` | `Register.tsx` | `users + security_lab_events` |
| REQ-COM-002 | 회원 탈퇴 | ???/?? | `DELETE /api/users/me` | `Mypage.tsx` | `users, orders, reviews, customer_service` |
| REQ-COM-003 | 비밀번호 변경 | ???/?? | `PUT /api/users/me/password` | `Mypage.tsx` | `users` |
| REQ-COM-004 | 비번 재설정 | ?? | `POST /api/auth/password-reset/request|confirm` | `SecurityLabs.tsx` | `password_reset_tokens` |
| REQ-COM-005 | 아이디 찾기 | ?? | `POST /api/auth/find-id` | `SecurityLabs.tsx` | `id_lookup_logs` |
| REQ-COM-006 | 로그인 | ???/?? | `POST /api/auth/login` | `Login.tsx` | `users + security_lab_events` |
| REQ-COM-007 | 로그아웃 | ?? | `POST /api/auth/logout` | `Header/AuthContext` | `user_sessions` |
| REQ-COM-008 | 주소 검색 | ?? | `GET /api/users/me/address-search` | `SecurityLabs.tsx` | `address_search_logs` |
| REQ-COM-009 | 회원정보 조회 | ???/?? | `GET /api/users/{id}` | `Mypage.tsx` | `users + security_lab_events` |
| REQ-COM-010 | 통합 검색 | ???/?? | `GET /api/books/search` | `BookSearch.tsx` | `books + security_lab_events` |
| REQ-COM-011 | 카테고리 별 조회 | ???/?? | `GET /api/books/search?category=` | `BookSearch.tsx` | `books + security_lab_events` |
| REQ-COM-012 | 도서 상세 페이지 | ???/?? | `GET /api/books/{id}` | `BookDetail.tsx` | `books + security_lab_events` |
| REQ-COM-013 | 배송정보 표시 | ?? | `GET /api/books/{id}/shipping-info` | `SecurityLabs.tsx` | `security_lab_events` |
| REQ-COM-014 | 미리보기 | ?? | `GET /api/books/{id}/preview` | `SecurityLabs.tsx` | `security_lab_events` |
| REQ-COM-015 | 영수증 출력 | ???/?? | `GET /api/download` | `Orders.tsx` | `orders.receipt_file_path + security_lab_events` |
| REQ-COM-016 | 장바구니 담기 | ?? | `POST /api/cart` | `Cart.tsx` | `cart_items + security_lab_events` |
| REQ-COM-017 | 수량 조절 | ???/?? | `PUT /api/cart/{id}` | `Cart.tsx` | `cart_items + security_lab_events` |
| REQ-COM-018 | 결제 수단 선택 | ?? | `POST /api/orders/checkout(paymentMethod)` | `Cart.tsx` | `orders,payment_transactions` |
| REQ-COM-019 | 쿠폰 적용 | ?? | `POST /api/orders/checkout(coupon)` | `Cart.tsx` | `coupons,payment_transactions` |
| REQ-COM-020 | 포인트 사용 | ?? | `POST /api/orders/checkout(usePoints)` | `Cart.tsx` | `point_histories,payment_transactions` |
| REQ-COM-021 | 주문 완료 페이지 | ???/?? | `GET /api/orders/lookup` | `GuestOrderLookup.tsx` | `orders + security_lab_events` |
| REQ-COM-022 | 실시간 위치 확인 | ?? | `GET /api/orders/{id}/tracking` | `Orders.tsx` | `shipping_tracking_logs` |
| REQ-COM-023 | 공지사항 목록 | ?? | `GET /api/notices` | `CustomerService.tsx` | `notices + security_lab_events` |
| REQ-COM-024 | 공지 상세 내용 | ?? | `GET /api/notices/{id}` | `CustomerService.tsx` | `notices + security_lab_events` |
| REQ-COM-025 | 문의글 작성 | ???/?? | `POST /api/customer-service` | `CustomerService.tsx` | `customer_service + security_lab_events` |
| REQ-COM-026 |  | ?? | `POST /api/customer-service/{id}/attachments` | `CustomerService.tsx` | `customer_service_attachments` |
| REQ-COM-027 | 파일 첨부 | ?? | `GET /api/faqs` | `CustomerService.tsx` | `faqs + security_lab_events` |
| REQ-COM-028 | 최근 본 상품 | ?? | `GET /api/mypage/recent-views` | `Mypage.tsx` | `recent_views` |
| REQ-COM-029 | 찜한 도서 목록 | ?? | `GET/POST/DELETE /api/mypage/wishlist` | `Mypage.tsx` | `wishlist_items + security_lab_events` |
| REQ-COM-030 | 나의 리뷰 관리 | ???/?? | `DELETE /api/mypage/reviews/{id}` | `Mypage.tsx` | `reviews + security_lab_events` |
| REQ-COM-031 | 포인트/쿠폰 내역 | ?? | `GET /api/mypage/wallet` | `Mypage.tsx` | `point_histories,coupons` |
| REQ-COM-032 | 주문 취소 요청 | ?? | `POST /api/mypage/orders/{id}/cancel` | `Mypage.tsx` | `order_action_requests` |
| REQ-COM-033 | 반품/교환 요청 | ?? | `POST /api/mypage/orders/{id}/return` | `Mypage.tsx` | `order_action_requests` |
| REQ-COM-034 | 즐겨찾기 삭제 | ?? | `DELETE /api/mypage/favorite-posts/{id}` | `Mypage.tsx` | `favorite_posts + security_lab_events` |
| REQ-COM-035 | 즐겨찾기 목록조회 | ?? | `GET /api/mypage/favorite-posts` | `Mypage.tsx` | `favorite_posts + security_lab_events` |
| REQ-COM-036 | 리뷰 작성 | ???/?? | `POST /api/books/{id}/reviews` | `BookDetail.tsx` | `reviews(summary) + security_lab_events` |
| REQ-COM-037 | 리뷰 좋아요 | ?? | `POST /api/reviews/{id}/like` | `BookDetail.tsx` | `review_likes + security_lab_events` |
| REQ-COM-038 | 리뷰 신고 | ?? | `POST /api/reviews/{id}/report` | `BookDetail.tsx` | `review_reports + security_lab_events` |
| REQ-COM-039 | 통계 시각화 | ???/?? | `GET /api/admin/dashboard` | `Admin.tsx` | `security_lab_events` |
| REQ-COM-040 | 도서 등록/수정 | ???/?? | `POST/PUT /api/admin/books` | `Admin.tsx` | `books + security_lab_events` |
| REQ-COM-041 | 도서 삭제 | ???/?? | `DELETE /api/admin/books/{id}` | `Admin.tsx` | `books + security_lab_events` |
| REQ-COM-042 | 배송 상태 변경 | ?? | `PUT /api/admin/orders/{id}/status` | `Admin.tsx` | `orders + security_lab_events` |
| REQ-COM-043 | 회원 상태 관리 | ?? | `PUT /api/admin/users/{id}/status` | `Admin.tsx` | `users + security_lab_events` |
| REQ-COM-044 | 문의 답변 작성 | ?? | `POST /api/admin/customer-service/{id}/reply` | `Admin.tsx` | `customer_service + security_lab_events` |
| REQ-COM-045 | 도서 재고 조회 | ?? | `GET /api/admin/books/stock` | `Admin.tsx` | `books + security_lab_events` |
| REQ-COM-046 | 도서 등록 (입고) | ?? | `POST /api/admin/books/inbound` | `Admin.tsx` | `books + access_logs + security_lab_events` |
| REQ-COM-047 | 도서 재고 수정 | ?? | `PUT /api/admin/books/{id}/stock` | `Admin.tsx` | `books + security_lab_events` |
| REQ-COM-048 | 링크 미리보기 | ?? | `POST /api/integration/link-preview` | `SecurityLabs.tsx` | `link_previews + security_lab_events` |
