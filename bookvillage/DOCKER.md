# Docker Compose 실행 가이드

의존성(Maven, Node, MySQL) 로컬 설치 없이 실행합니다.

## 1) Backend + MySQL 실행

```bash
cd backend
docker compose up -d --build
```

- API: `http://localhost:8080`
- DB: `localhost:3407` (`root` / `1234`)
- 동일한 네트워크 `bookvillage-net`이 생성됩니다.

## 2) Frontend 실행 (분리된 compose)

```bash
cd frontend
docker compose up -d --build
```

- Web: `http://localhost:8081`
- 프론트의 `/api` 요청은 내부적으로 `bookvillage-backend:8080`으로 프록시됩니다.

## 3) 상태 확인

```bash
docker ps
docker compose -f backend/docker-compose.yml logs -f backend
docker compose -f frontend/docker-compose.yml logs -f frontend
```

## 4) 종료

```bash
docker compose -f frontend/docker-compose.yml down
docker compose -f backend/docker-compose.yml down
```

DB 데이터까지 함께 제거하려면:

```bash
docker compose -f backend/docker-compose.yml down -v
```
