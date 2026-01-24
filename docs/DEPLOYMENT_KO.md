# WKU Software Crew 배포 가이드

## 개요

이 문서는 WKU Software Crew 프로젝트의 배포 과정을 설명합니다.

---

## 배포 아키텍처

### 인프라 구성

| 구성요소 | 서비스 | 비용 |
|----------|--------|------|
| Frontend | Docker + Cloudflare Tunnel | $0 |
| API | Docker + Cloudflare Tunnel | $0 |
| Database | PostgreSQL (공유) | $0 |
| Cache | Redis (공유) | $0 |
| SSL/CDN | Cloudflare | $0 |
| **총 비용** | | **$0/월** |

### 도메인

| 서비스 | URL |
|--------|-----|
| Frontend | https://crew.abada.kr |
| API | https://crew-api.abada.kr |
| API Docs | https://crew-api.abada.kr/api/docs |

---

## 배포 방법

### 1. 자동 배포 (권장)

```bash
ssh ws-248-247
cd ~/saas-crew
./deploy.sh
```

배포 스크립트가 다음을 자동으로 수행합니다:
1. 최신 코드 pull
2. Docker 이미지 빌드
3. 데이터베이스 마이그레이션
4. 컨테이너 재시작
5. 헬스체크
6. 실패 시 롤백

### 2. 수동 배포

```bash
ssh ws-248-247
cd ~/saas-crew

# 1. 코드 업데이트
cd app && git pull origin main && cd ..

# 2. 이미지 빌드
docker compose build api web

# 3. 마이그레이션
docker compose exec api npx prisma migrate deploy

# 4. 컨테이너 재시작
docker compose up -d api web
docker compose restart tunnel
```

---

## 환경변수 설정

### 서버 환경변수 (.env)

```bash
# Database
DATABASE_PASSWORD=<postgresql_password>

# JWT
JWT_SECRET=<jwt_secret_key>

# GitHub OAuth
GITHUB_CLIENT_ID=<github_oauth_client_id>
GITHUB_CLIENT_SECRET=<github_oauth_client_secret>

# Cloudflare Tunnel
TUNNEL_TOKEN=<cloudflare_tunnel_token>
```

### 환경변수 수정

```bash
ssh ws-248-247
nano ~/saas-crew/.env
```

---

## Cloudflare Tunnel 설정

### Tunnel 정보

- **Tunnel Name**: crew-api-tunnel
- **Tunnel ID**: e511a3df-e67f-45c3-bc15-428e4b8043b2

### 라우트 설정

| Hostname | Service |
|----------|---------|
| crew.abada.kr | http://crew-web:3000 |
| crew-api.abada.kr | http://crew-api:4000 |

### 토큰 갱신 방법

1. [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) 접속
2. Networks > Tunnels > crew-api-tunnel
3. Configure > Docker 탭에서 토큰 복사
4. 서버의 `.env` 파일에서 `TUNNEL_TOKEN` 업데이트
5. `docker compose restart tunnel` 실행

---

## 로그 확인

```bash
# Frontend 로그
docker logs -f crew-web

# API 로그
docker logs -f crew-api

# Tunnel 로그
docker logs -f crew-tunnel

# 배포 로그
cat ~/saas-crew/logs/deploy-*.log
```

---

## 데이터베이스 관리

### 접속

```bash
docker exec -it wm_postgres psql -U crew_user -d crew_production
```

### 백업

```bash
docker exec wm_postgres pg_dump -U crew_user crew_production > ~/saas-crew/backups/db-$(date +%Y%m%d).sql
```

### 복원

```bash
docker exec -i wm_postgres psql -U crew_user crew_production < ~/saas-crew/backups/db-YYYYMMDD.sql
```

---

## 문제 해결

### Frontend 접속 불가

```bash
# 컨테이너 상태 확인
docker ps | grep crew-web

# 로그 확인
docker logs crew-web --tail 50

# 재시작
docker compose restart web
```

### API 접속 불가

```bash
# 컨테이너 상태 확인
docker ps | grep crew-api

# 로그 확인
docker logs crew-api --tail 50

# 재시작
docker compose restart api
```

### CORS 에러

API의 환경변수 확인:
```bash
docker exec crew-api printenv | grep ALLOWED_ORIGINS
```

`ALLOWED_ORIGINS`에 프론트엔드 도메인이 포함되어야 함.

### Tunnel 연결 실패

```bash
# 로그 확인
docker logs crew-tunnel --tail 30

# "Invalid tunnel secret" 에러 시: 토큰 갱신 필요
# Cloudflare Dashboard에서 새 토큰 발급 후 .env 업데이트
```

---

## 업데이트 이력

| 날짜 | 버전 | 변경사항 |
|------|------|----------|
| 2026-01-24 | 1.0.0 | 초기 배포 (Cloudflare Tunnel) |
| 2026-01-24 | 1.0.1 | Next.js 16.1.4 업그레이드 |
| 2026-01-24 | 1.0.2 | CORS 설정 수정 (ALLOWED_ORIGINS) |
