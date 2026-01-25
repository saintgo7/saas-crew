# WKU Software Crew - Project Context

---

## DEVELOPMENT STATUS (Updated: 2026-01-24)

### Current State: Git Flow Setup Complete

**Production (main)**: https://crew.abada.kr - LIVE
**Staging (develop)**: https://staging-crew.abada.kr - LIVE

### Environment URLs

| Environment | Frontend | API |
|-------------|----------|-----|
| Production | https://crew.abada.kr | https://crew-api.abada.kr |
| Staging | https://staging-crew.abada.kr | https://staging-api-crew.abada.kr |

### Completed Setup

- [x] develop 브랜치 생성
- [x] GitHub Secrets 설정
- [x] Branch Protection 설정
- [x] Cloudflare Staging Routes 설정
- [x] Staging 배포 테스트 완료

### Development Workflow

```bash
# 새 기능 개발
git checkout develop && git pull
git checkout -b feature/my-feature
# 개발 후 PR to develop → staging 자동 배포
# 테스트 후 PR to main → production 자동 배포
```

---

## Project Overview

WKU Software Crew is a web platform for Wonkwang University's software development club. It provides project management, course learning, and community features for club members.

**Live URLs:**
- Frontend: https://crew.abada.kr
- API: https://crew-api.abada.kr
- API Docs: https://crew-api.abada.kr/api/docs

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 16.1.4 |
| Frontend | React | 19.x |
| Frontend | TypeScript | 5.x |
| Backend | NestJS | 11.x |
| Backend | Prisma ORM | 5.22 |
| Database | PostgreSQL | 16 |
| Cache | Redis | 7 |
| Deployment | Docker + Cloudflare Tunnel | - |

---

## Project Structure

```
saas-crew/
├── apps/
│   ├── api/                 # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/        # GitHub OAuth authentication
│   │   │   ├── projects/    # Project CRUD
│   │   │   ├── courses/     # Course management
│   │   │   ├── users/       # User management
│   │   │   └── common/      # Shared utilities
│   │   └── prisma/          # Database schema & migrations
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   ├── lib/         # Utilities & API client
│       │   └── hooks/       # Custom React hooks
│       └── public/          # Static assets
├── packages/
│   └── shared/              # Shared types & utilities
├── deployments/
│   └── ws-248-247/          # Production deployment config
│       ├── docker-compose.yml
│       ├── deploy.sh
│       └── README.md
└── docs/                    # Documentation
```

---

## Deployment Architecture

```
Internet
    │
    ▼
Cloudflare Edge (DNS + CDN + SSL)
    │
    ▼
Cloudflare Tunnel (crew-api-tunnel)
    │
    ├── crew.abada.kr ──────► crew-web:3000 (Next.js)
    │
    └── crew-api.abada.kr ──► crew-api:4000 (NestJS)

ws-248-247 Server (Docker)
├── crew-web      (Next.js Frontend)
├── crew-api      (NestJS API)
├── crew-tunnel   (Cloudflared)
├── wm_postgres   (PostgreSQL - shared)
└── wm_redis      (Redis - shared)
```

---

## Key Files for Development

### Backend (API)
- `apps/api/src/main.ts` - Application bootstrap, CORS, security
- `apps/api/src/app.module.ts` - Module configuration
- `apps/api/prisma/schema.prisma` - Database schema
- `apps/api/src/auth/` - GitHub OAuth implementation

### Frontend (Web)
- `apps/web/src/app/` - Next.js App Router pages
- `apps/web/src/lib/api.ts` - API client
- `apps/web/next.config.js` - Next.js configuration

### Deployment
- `deployments/ws-248-247/docker-compose.yml` - Docker services
- `deployments/ws-248-247/deploy.sh` - Deployment script
- `deployments/ws-248-247/.env` - Environment variables (on server)

---

## Common Tasks

### Deploy to Production
```bash
ssh ws-248-247
cd ~/saas-crew
./deploy.sh
```

### View Logs
```bash
# Frontend logs
docker logs -f crew-web

# API logs
docker logs -f crew-api

# Tunnel logs
docker logs -f crew-tunnel
```

### Database Access
```bash
docker exec -it wm_postgres psql -U crew_user -d crew_production
```

### Run Migrations
```bash
docker compose exec api npx prisma migrate deploy
```

---

## Environment Variables

### Required for API (see deployments/ws-248-247/.env.example)
- `DATABASE_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - JWT signing secret
- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret
- `TUNNEL_TOKEN` - Cloudflare Tunnel token

### Required for Frontend (build-time)
- `NEXT_PUBLIC_API_URL` - API base URL (https://crew-api.abada.kr)

---

## Important Notes

1. **CORS**: API uses `ALLOWED_ORIGINS` env var (not `CORS_ORIGIN`)
2. **Health Checks**: Docker compose uses node-based health checks for web container
3. **Standalone Output**: Next.js uses `output: 'standalone'` for Docker deployment
4. **Network**: All containers use `workstation_manager_network` (external)

---

## Secrets Location

All secrets are stored on the production server:
- **Path**: `~/saas-crew/.env`
- **Backup**: See `docs/secrets-backup.md` (encrypted)

Never commit secrets to git. Use `.env.example` for reference.

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start dev (frontend) | `pnpm --filter web dev` |
| Start dev (api) | `pnpm --filter api dev` |
| Build all | `pnpm build` |
| Deploy | `ssh ws-248-247 "cd ~/saas-crew && ./deploy.sh"` |
| DB migrate | `pnpm --filter api prisma migrate dev` |
| Generate types | `pnpm --filter api prisma generate` |

---

## Git Flow (Branching Strategy)

```
main (production) ← develop (staging) ← feature/*
```

| Branch | Purpose | Deploys To |
|--------|---------|------------|
| `main` | Production code | crew.abada.kr |
| `develop` | Integration & testing | staging-crew.abada.kr |
| `feature/*` | New features | Local only |
| `hotfix/*` | Emergency fixes | Direct to main |

### Development Workflow

```bash
# 1. Start new feature
git checkout develop && git pull
git checkout -b feature/my-feature

# 2. Develop & test locally
pnpm test && pnpm build

# 3. Push & create PR to develop
git push -u origin feature/my-feature

# 4. After PR merge, staging auto-deploys
# Test at staging-crew.abada.kr

# 5. Create PR from develop to main
# After approval, production auto-deploys
```

---

## Documentation Index

| Document | Description |
|----------|-------------|
| `docs/SETUP_CHECKLIST.md` | Git Flow 설정 체크리스트 |
| `docs/DEVELOPMENT_PLAN.md` | 개발 계획 및 브랜치 전략 |
| `docs/BRANCH_PROTECTION.md` | GitHub 브랜치 보호 규칙 |
| `docs/SECRETS.md` | 시크릿 관리 가이드 |
| `docs/DEPLOYMENT_KO.md` | 배포 가이드 (한국어) |
| `docs/PROMPT_HISTORY.md` | 사용된 프롬프트 기록 |
| `docs/dev-log/` | **개발 로그 디렉토리 (매 세션마다 작성)** |

---

## Development Log (개발 로그)

**경로**: `docs/dev-log/`

모든 개발 세션은 자동으로 개발 로그에 기록됩니다.

### 최근 로그
```bash
# 최신 로그 확인
ls -t docs/dev-log/ | head -5

# 특정 로그 읽기
cat docs/dev-log/010_ci_cd_fixes_20260125_0945.md
```

### 로그 네이밍 규칙
```
{순번}_{영문_내용}_{날짜_시간}.md
```

**세션 시작 시 항상 이전 로그를 먼저 읽습니다.**

---

## Contact & Resources

- **GitHub**: https://github.com/saintgo7/saas-crew
- **Cloudflare Dashboard**: https://one.dash.cloudflare.com/
- **Server**: ws-248-247 (SSH alias configured)
