# WKU Software Crew Deployment Guide

## Overview

This document describes the deployment process for the WKU Software Crew project.

---

## Deployment Architecture

### Infrastructure

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Docker + Cloudflare Tunnel | $0 |
| API | Docker + Cloudflare Tunnel | $0 |
| Database | PostgreSQL (shared) | $0 |
| Cache | Redis (shared) | $0 |
| SSL/CDN | Cloudflare | $0 |
| **Total** | | **$0/month** |

### Domains

| Service | URL |
|---------|-----|
| Frontend | https://crew.abada.kr |
| API | https://crew-api.abada.kr |
| API Docs | https://crew-api.abada.kr/api/docs |

---

## Deployment Methods

### 1. Automated Deployment (Recommended)

```bash
ssh ws-248-247
cd ~/saas-crew
./deploy.sh
```

The deployment script automatically:
1. Pulls latest code
2. Builds Docker images
3. Runs database migrations
4. Restarts containers
5. Performs health checks
6. Rolls back on failure

### 2. Manual Deployment

```bash
ssh ws-248-247
cd ~/saas-crew

# 1. Update code
cd app && git pull origin main && cd ..

# 2. Build images
docker compose build api web

# 3. Run migrations
docker compose exec api npx prisma migrate deploy

# 4. Restart containers
docker compose up -d api web
docker compose restart tunnel
```

---

## Environment Variables

### Server Environment (.env)

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

### Modifying Environment Variables

```bash
ssh ws-248-247
nano ~/saas-crew/.env
```

---

## Cloudflare Tunnel Configuration

### Tunnel Information

- **Tunnel Name**: crew-api-tunnel
- **Tunnel ID**: e511a3df-e67f-45c3-bc15-428e4b8043b2

### Route Configuration

| Hostname | Service |
|----------|---------|
| crew.abada.kr | http://crew-web:3000 |
| crew-api.abada.kr | http://crew-api:4000 |

### Token Renewal

1. Go to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
2. Navigate to Networks > Tunnels > crew-api-tunnel
3. Click Configure > Docker tab to copy token
4. Update `TUNNEL_TOKEN` in server's `.env` file
5. Run `docker compose restart tunnel`

---

## Viewing Logs

```bash
# Frontend logs
docker logs -f crew-web

# API logs
docker logs -f crew-api

# Tunnel logs
docker logs -f crew-tunnel

# Deployment logs
cat ~/saas-crew/logs/deploy-*.log
```

---

## Database Management

### Connection

```bash
docker exec -it wm_postgres psql -U crew_user -d crew_production
```

### Backup

```bash
docker exec wm_postgres pg_dump -U crew_user crew_production > ~/saas-crew/backups/db-$(date +%Y%m%d).sql
```

### Restore

```bash
docker exec -i wm_postgres psql -U crew_user crew_production < ~/saas-crew/backups/db-YYYYMMDD.sql
```

---

## Troubleshooting

### Frontend Not Accessible

```bash
# Check container status
docker ps | grep crew-web

# Check logs
docker logs crew-web --tail 50

# Restart
docker compose restart web
```

### API Not Accessible

```bash
# Check container status
docker ps | grep crew-api

# Check logs
docker logs crew-api --tail 50

# Restart
docker compose restart api
```

### CORS Error

Check API environment variable:
```bash
docker exec crew-api printenv | grep ALLOWED_ORIGINS
```

`ALLOWED_ORIGINS` must include the frontend domain.

### Tunnel Connection Failure

```bash
# Check logs
docker logs crew-tunnel --tail 30

# If "Invalid tunnel secret" error: Token renewal required
# Get new token from Cloudflare Dashboard and update .env
```

---

## Update History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-24 | 1.0.0 | Initial deployment (Cloudflare Tunnel) |
| 2026-01-24 | 1.0.1 | Next.js 16.1.4 upgrade |
| 2026-01-24 | 1.0.2 | CORS fix (ALLOWED_ORIGINS) |
