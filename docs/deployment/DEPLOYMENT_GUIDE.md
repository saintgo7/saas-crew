# WKU Software Crew - Deployment Guide

## Overview

WKU Software Crew 플랫폼 배포 가이드입니다.

| 항목 | 값 |
|------|-----|
| Frontend URL | https://crew.abada.kr |
| API URL | https://crew-api.abada.kr |
| Server | ws-248-247 |
| Database | PostgreSQL (wm_postgres) |
| Cache | Redis (wm_redis, DB 3) |

## Architecture

```
                                 ┌─────────────────────────────────────┐
                                 │         Cloudflare Network          │
                                 │                                     │
    [Users]                      │  ┌─────────────────────────────┐   │
       │                         │  │    Cloudflare Pages         │   │
       │   HTTPS                 │  │    crew.abada.kr            │   │
       ├────────────────────────────►    (Next.js Frontend)       │   │
       │                         │  └─────────────────────────────┘   │
       │                         │                                     │
       │   HTTPS                 │  ┌─────────────────────────────┐   │
       └────────────────────────────►    Cloudflare Tunnel        │   │
                                 │  │    crew-api.abada.kr        │   │
                                 │  └──────────────┬──────────────┘   │
                                 │                 │                   │
                                 └─────────────────┼───────────────────┘
                                                   │
                                                   │ Secure Tunnel
                                                   │
                                 ┌─────────────────┼───────────────────┐
                                 │   ws-248-247    │                   │
                                 │                 ▼                   │
                                 │  ┌─────────────────────────────┐   │
                                 │  │     cloudflared (tunnel)    │   │
                                 │  └──────────────┬──────────────┘   │
                                 │                 │                   │
                                 │                 ▼                   │
                                 │  ┌─────────────────────────────┐   │
                                 │  │     crew-api (NestJS)       │   │
                                 │  │     Port: 4000              │   │
                                 │  └──────────────┬──────────────┘   │
                                 │                 │                   │
                                 │       ┌─────────┴─────────┐        │
                                 │       ▼                   ▼        │
                                 │  ┌─────────┐       ┌───────────┐   │
                                 │  │ wm_postgres │   │ wm_redis  │   │
                                 │  │ DB: crew_   │   │ DB: 3     │   │
                                 │  │ production  │   │           │   │
                                 │  └─────────┘       └───────────┘   │
                                 │                                     │
                                 └─────────────────────────────────────┘
```

## Prerequisites

### Server Requirements
- Docker & Docker Compose
- Git
- Network: `workstation_manager_network` (existing)
- PostgreSQL: `wm_postgres` container (existing)
- Redis: `wm_redis` container (existing)

### Cloudflare Requirements
- Cloudflare account with domain configured
- Zero Trust access (free tier available)
- Pages access (free tier available)

### GitHub OAuth App
- Create at: https://github.com/settings/developers
- Authorization callback URL: `https://crew-api.abada.kr/api/auth/github/callback`

---

## Step 1: Cloudflare Tunnel Setup

### 1.1 Create Tunnel

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to: **Networks > Tunnels**
3. Click **Create a tunnel**
4. Choose **Cloudflared** connector
5. Name: `crew-api-tunnel`
6. Save the tunnel

### 1.2 Get Credentials

After creating the tunnel, you'll receive:
- **Tunnel ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Credentials file**: Download or copy the JSON content

Example credentials.json:
```json
{
  "AccountTag": "your_account_id",
  "TunnelSecret": "your_tunnel_secret_base64",
  "TunnelID": "your_tunnel_id"
}
```

### 1.3 Configure Public Hostname

In the tunnel configuration:
- **Public hostname**: `crew-api.abada.kr`
- **Service**: `http://crew-api:4000`
- **Additional settings**: Keep defaults

---

## Step 2: Server Setup

### 2.1 SSH to Server

```bash
ssh ws-248-247
```

### 2.2 Create Directory Structure

```bash
mkdir -p ~/saas-crew/cloudflared
cd ~/saas-crew
```

### 2.3 Clone Repository

```bash
git clone https://github.com/saintgo7/saas-crew app
```

### 2.4 Copy Deployment Files

```bash
cp app/deployments/ws-248-247/docker-compose.yml .
cp app/deployments/ws-248-247/deploy.sh .
cp app/deployments/ws-248-247/setup.sh .
cp app/deployments/ws-248-247/.env.example .env
cp app/deployments/ws-248-247/cloudflared/config.yml cloudflared/
```

### 2.5 Configure Environment

Edit `.env` file:
```bash
vim .env
```

Required variables:
```env
# Database
DATABASE_PASSWORD=your_secure_password_here

# JWT
JWT_SECRET=your_jwt_secret_minimum_32_characters

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 2.6 Configure Cloudflare Tunnel

Edit `cloudflared/config.yml`:
```bash
vim cloudflared/config.yml
```

Replace `YOUR_TUNNEL_ID_HERE` with your actual tunnel ID.

Create credentials file:
```bash
vim cloudflared/credentials.json
```

Paste the credentials JSON from Cloudflare.

### 2.7 Run Initial Setup

```bash
chmod +x setup.sh deploy.sh
./setup.sh
```

This will:
1. Verify prerequisites
2. Create database and user
3. Build Docker images
4. Start containers
5. Run database migrations
6. Seed initial data

---

## Step 3: Frontend Deployment (Cloudflare Pages)

### 3.1 Connect Repository

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **Create application** > **Connect to Git**
3. Select **GitHub** and authorize
4. Choose repository: `saintgo7/saas-crew`

### 3.2 Configure Build Settings

| Setting | Value |
|---------|-------|
| Project name | `crew-web` |
| Production branch | `main` |
| Framework preset | `Next.js` |
| Root directory | `apps/web` |
| Build command | `npm run build` |
| Build output directory | `.next` |

### 3.3 Environment Variables

Add these environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://crew-api.abada.kr` |
| `NODE_VERSION` | `20` |

### 3.4 Custom Domain

1. After deployment, go to **Custom domains**
2. Add domain: `crew.abada.kr`
3. Follow DNS configuration instructions

---

## Step 4: Verification

### 4.1 Check API Health

```bash
# From server
curl http://localhost:4000/api/health

# From external
curl https://crew-api.abada.kr/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-24T..."
}
```

### 4.2 Check Containers

```bash
docker ps
```

Expected containers:
- `crew-api` - Running, healthy
- `crew-tunnel` - Running

### 4.3 Check Frontend

Visit https://crew.abada.kr in browser.

---

## Operations

### Daily Deployment

```bash
cd ~/saas-crew
./deploy.sh
```

This will:
1. Pull latest code from `main` branch
2. Build new Docker image
3. Backup current image
4. Run database migrations
5. Restart containers
6. Health check with auto-rollback on failure

### View Logs

```bash
# API logs
docker logs crew-api -f

# Tunnel logs
docker logs crew-tunnel -f

# All logs
docker compose logs -f
```

### Database Access

```bash
# Connect to database
docker exec -it wm_postgres psql -U crew_user -d crew_production

# Run Prisma Studio (development only)
docker compose exec api npx prisma studio
```

### Restart Services

```bash
cd ~/saas-crew
docker compose restart api
docker compose restart tunnel
```

### Full Restart

```bash
cd ~/saas-crew
docker compose down
docker compose up -d
```

---

## Troubleshooting

### API Not Starting

```bash
# Check logs
docker logs crew-api

# Common issues:
# - DATABASE_URL incorrect
# - Missing environment variables
# - Port conflict
```

### Tunnel Not Connecting

```bash
# Check logs
docker logs crew-tunnel

# Common issues:
# - Invalid credentials.json
# - Wrong tunnel ID in config.yml
# - Network connectivity
```

### Database Connection Failed

```bash
# Verify PostgreSQL is running
docker ps | grep wm_postgres

# Test connection
docker exec wm_postgres psql -U postgres -c "SELECT 1"

# Check network
docker network inspect workstation_manager_network
```

### Migration Failed

```bash
# Run migration manually
docker compose exec api npx prisma migrate deploy

# Reset database (CAUTION: deletes all data)
docker compose exec api npx prisma migrate reset
```

---

## Backup & Recovery

### Database Backup

```bash
# Manual backup
docker exec wm_postgres pg_dump -U crew_user crew_production > backup_$(date +%Y%m%d).sql

# Automated backup (add to crontab)
0 2 * * * docker exec wm_postgres pg_dump -U crew_user crew_production > ~/saas-crew/backups/crew_$(date +\%Y\%m\%d).sql
```

### Database Restore

```bash
# Restore from backup
docker exec -i wm_postgres psql -U crew_user -d crew_production < backup_20260124.sql
```

### Application Rollback

```bash
# If deployment failed and auto-rollback didn't work
docker tag crew-api:backup crew-api:latest
docker compose up -d api
```

---

## Security Checklist

- [ ] Strong DATABASE_PASSWORD (min 16 chars)
- [ ] Strong JWT_SECRET (min 32 chars)
- [ ] GitHub OAuth credentials secured
- [ ] Cloudflare tunnel credentials not exposed
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (via Cloudflare)

---

## Contact

- Repository: https://github.com/saintgo7/saas-crew
- Issues: https://github.com/saintgo7/saas-crew/issues
