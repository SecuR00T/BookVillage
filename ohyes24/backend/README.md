# YES24 Mock - Backend

보안 교육 및 모의해킹 테스트용 목업 서버입니다. **실제 서비스 환경에 배포하지 마세요.**

## Tech Stack
- Spring Boot 2.6.5
- Java 11
- MySQL 8.4
- Tomcat 9.0.50

## 사전 요구사항
- Java 11+
- Maven 3.6+
- MySQL 8.4

## DB 설정
1. MySQL에서 데이터베이스 생성:
   ```sql
   CREATE DATABASE yes24_mock;
   ```
2. `application.yml`에서 연결 정보 수정 (username, password)

## 실행
```bash
# 스키마 및 초기 데이터는 앱 시작 시 자동 적용 (spring.sql.init.mode=always)
mvn spring-boot:run
```

## API 엔드포인트
| Method | URI | 설명 |
|--------|-----|------|
| POST | /api/auth/register | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/users/{userId} | 마이페이지 조회 |
| PUT | /api/users/{userId} | 회원정보 수정 |
| GET | /api/users/{userId}/orders | 주문 내역 조회 |
| GET | /api/books/search?q=&category= | 도서 검색 |
| GET | /api/books/categories | 카테고리 목록 |
| GET | /api/books/{bookId} | 도서 상세 |
| POST | /api/orders/cart | 장바구니/결제 |
| POST | /api/orders/checkout | 결제 처리 |
| GET | /api/orders | 주문 목록 |
| GET | /api/download?file= | 영수증 다운로드 |
| POST | /api/books/{bookId}/reviews | 리뷰 작성 |
| POST | /api/reviews/{reviewId}/upload | 리뷰 이미지 업로드 |
| GET/POST/PUT/DELETE | /api/admin/* | 관리자 API |

## 기본 계정 (data.sql)
- admin@yes24.mock / password (ADMIN)
- user@yes24.mock / password (USER)
