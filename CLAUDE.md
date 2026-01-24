# WKU Software Crew - Project Context

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

## Contact & Resources

- **GitHub**: https://github.com/saintgo7/saas-crew
- **Cloudflare Dashboard**: https://one.dash.cloudflare.com/
- **Server**: ws-248-247 (SSH alias configured)
