# YES24 Security Learning Bookshop

학생용 도서 구매 사이트를 기반으로 한 보안학습/실습 프로젝트입니다.

- 실제 공격 실행은 금지되고, 모든 취약점 학습 포인트는 **통제된 시뮬레이션**으로 재현됩니다.
- 48개 요구사항(REQ-COM-001~048)을 `Security Labs` 페이지와 도메인 기능 API에 매핑했습니다.

## 프로젝트 구조

```text
2.25/
├─ backend/                    # Spring Boot + JPA + MySQL + Flyway
├─ frontend/                   # React + Vite
├─ android/                    # WebView 앱(선택)
├─ docker-compose.back.yml     # 백엔드 + MySQL
├─ docker-compose.front.yml    # 프론트엔드
└─ docs/
   ├─ requirements-mapping.md
   ├─ security-labs.md
   └─ yes24-labs.http
```

## 실행 방법

### 1) 백엔드 + MySQL

```bash
docker compose -f docker-compose.back.yml up -d --build
```

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Flyway가 `V3__seed_kyobo_600_books.sql`까지 적용되어 도서 600권이 `books` 테이블에 적재됩니다.
- 기존 MySQL 볼륨을 이미 사용 중이면 아래처럼 초기화 후 재기동해야 새 마이그레이션이 반영됩니다.

```bash
docker compose -f docker-compose.back.yml down -v
docker compose -f docker-compose.back.yml up -d --build
```

### 2) 프론트엔드

```bash
docker compose -f docker-compose.front.yml up -d --build
```

- Web: `http://localhost:8081`

### 3) 종료

```bash
docker compose -f docker-compose.front.yml down
docker compose -f docker-compose.back.yml down
```

## 기본 계정

- 관리자: `admin@yes24.mock` / `password`
- 학생: `user@yes24.mock` / `password`

## 주요 데모 시나리오

1. 학생 계정 로그인 후 도서 검색/상세/장바구니/결제 진행
2. `Security Labs`(`/security-labs`)에서 REQ ID별 시뮬레이션 실행
3. 마이페이지에서 최근조회/찜/포인트/관심게시글 확인
4. 고객센터(문의, 첨부, 공지/FAQ) 확인
5. 관리자 로그인 후 대시보드/주문상태/회원상태/재고/문의답변 처리

## 문서 및 API 샘플

- 요구사항 매핑표: `docs/requirements-mapping.md`
- 보안학습 문서: `docs/security-labs.md`
- REST Client 샘플: `docs/yes24-labs.http`

## 테스트

백엔드 통합 테스트(10개):

```bash
cd backend
java "-Dmaven.multiModuleProjectDirectory=." -classpath .mvn/wrapper/maven-wrapper.jar org.apache.maven.wrapper.MavenWrapperMain test
```

## 참고

- 현재 환경에서 `npm` CLI가 없으면 프론트 로컬 빌드는 실행되지 않습니다. 이 경우 Docker 방식을 사용하세요.


