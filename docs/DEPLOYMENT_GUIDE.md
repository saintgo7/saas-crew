# WKU Software Crew - Deployment Guide

This comprehensive guide covers the complete deployment process for the WKU Software Crew application, including both frontend (Next.js) and backend (NestJS) deployments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Local Development Setup](#local-development-setup)
4. [Frontend Deployment (Cloudflare Pages)](#frontend-deployment-cloudflare-pages)
5. [Backend Deployment (Docker)](#backend-deployment-docker)
6. [Database Setup](#database-setup)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Environment Variables](#environment-variables)
9. [SSL/TLS Configuration](#ssltls-configuration)
10. [Monitoring & Logging](#monitoring--logging)
11. [Backup & Recovery](#backup--recovery)
12. [Security Checklist](#security-checklist)
13. [Troubleshooting](#troubleshooting)
14. [Production Checklist](#production-checklist)

---

## Prerequisites

### Required Tools

- Node.js 20.x or later
- pnpm 8.x or later
- Docker 24.x or later
- Docker Compose 2.x or later
- Git

### Required Accounts

- GitHub account (for OAuth and repository)
- Cloudflare account (for Pages deployment)
- Domain name (for production)

---

## Architecture Overview

```
                                    ┌─────────────────┐
                                    │   Cloudflare    │
                                    │     Pages       │
                                    │   (Frontend)    │
                                    └────────┬────────┘
                                             │
                                             │ HTTPS
                                             │
┌───────────────────────────────────────────────────────────────────┐
│                         Production Server                         │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │    Nginx     │────│   NestJS     │────│  PostgreSQL  │       │
│  │  (Reverse    │    │    API       │    │   Database   │       │
│  │   Proxy)     │    │  (Docker)    │    │   (Docker)   │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                    │                                   │
│         │                    │            ┌──────────────┐       │
│         │                    └────────────│    Redis     │       │
│         │                                 │   (Cache)    │       │
│         │                                 └──────────────┘       │
│         │                                                        │
│  Port 80/443                Port 4000         Port 6379          │
└───────────────────────────────────────────────────────────────────┘
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/wku-software-crew.git
cd wku-software-crew
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

```bash
# Root configuration
cp .env.example .env

# API configuration
cp apps/api/.env.example apps/api/.env

# Web configuration
cp apps/web/.env.example apps/web/.env.local
```

Edit each `.env` file with your local configuration.

### 4. Start Development Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Run database migrations
pnpm --filter @wku-crew/api db:push

# Start API server (terminal 1)
pnpm dev:api

# Start web server (terminal 2)
pnpm dev
```

### 5. Verify Setup

- Frontend: http://localhost:3000
- API: http://localhost:4000/api/health

---

## Frontend Deployment (Cloudflare Pages)

### Option 1: Automatic Deployment via GitHub

1. **Connect Repository to Cloudflare Pages**
   - Go to Cloudflare Dashboard > Pages
   - Click "Create a project"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Build Settings**
   ```
   Framework preset: Next.js
   Build command: pnpm build
   Build output directory: apps/web/.next
   Root directory: apps/web
   ```

3. **Set Environment Variables**
   In Cloudflare Pages dashboard, add:
   ```
   NEXT_PUBLIC_API_URL=https://api.wku-crew.com
   NEXTAUTH_URL=https://wku-crew.com
   NEXTAUTH_SECRET=<your-secret>
   ```

4. **Configure Custom Domain**
   - Go to Custom domains
   - Add your domain (e.g., wku-crew.com)
   - Update DNS records as instructed

### Option 2: Manual Deployment via Wrangler

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the application
cd apps/web
pnpm build

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=wku-crew-web
```

### Cloudflare Pages Configuration Files

The following files are included in `apps/web/`:

- `wrangler.toml` - Wrangler configuration
- `_redirects` - URL redirects
- `_headers` - Security headers

---

## Backend Deployment (Docker)

### Option 1: Docker Compose (Recommended for Small Scale)

1. **Prepare the Server**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com | sh

   # Install Docker Compose
   sudo apt-get install docker-compose-plugin
   ```

2. **Clone and Configure**
   ```bash
   git clone https://github.com/your-org/wku-software-crew.git
   cd wku-software-crew

   # Create production environment file
   cp .env.production.example .env
   # Edit .env with production values
   ```

3. **Create SSL Certificates**
   ```bash
   # Create directories
   mkdir -p ssl nginx/conf.d

   # Option A: Let's Encrypt (recommended)
   certbot certonly --standalone -d api.wku-crew.com
   cp /etc/letsencrypt/live/api.wku-crew.com/fullchain.pem ssl/
   cp /etc/letsencrypt/live/api.wku-crew.com/privkey.pem ssl/

   # Option B: Self-signed (for testing only)
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout ssl/privkey.pem -out ssl/fullchain.pem
   ```

4. **Deploy**
   ```bash
   # Build and start services
   docker-compose -f docker-compose.prod.yml up -d --build

   # Run database migrations
   docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

   # Verify deployment
   curl https://api.wku-crew.com/api/health
   ```

### Option 2: Kubernetes Deployment

See the Kubernetes manifests in `/deployments/k8s/` (if applicable).

### Docker Image Management

```bash
# Build image locally
docker build -f apps/api/Dockerfile -t wku-crew-api:latest .

# Tag for registry
docker tag wku-crew-api:latest ghcr.io/your-org/wku-crew-api:latest

# Push to registry
docker push ghcr.io/your-org/wku-crew-api:latest
```

---

## Database Setup

### PostgreSQL Configuration

1. **Create Production Database**
   ```sql
   CREATE USER wku_crew_prod WITH PASSWORD 'secure_password';
   CREATE DATABASE wku_crew_prod OWNER wku_crew_prod;
   GRANT ALL PRIVILEGES ON DATABASE wku_crew_prod TO wku_crew_prod;
   ```

2. **Run Migrations**
   ```bash
   # From the API directory
   cd apps/api

   # Deploy migrations
   npx prisma migrate deploy

   # Generate Prisma Client
   npx prisma generate
   ```

3. **Verify Schema**
   ```bash
   npx prisma db pull  # Should show no differences
   ```

### Database Performance Tuning

Add to `postgresql.conf`:

```ini
# Connection settings
max_connections = 100
shared_buffers = 256MB

# Query optimization
effective_cache_size = 768MB
work_mem = 4MB
maintenance_work_mem = 64MB

# WAL settings
wal_buffers = 16MB
checkpoint_completion_target = 0.9
min_wal_size = 1GB
max_wal_size = 4GB

# Logging
log_statement = 'mod'
log_duration = on
log_min_duration_statement = 1000
```

---

## CI/CD Pipeline

### GitHub Actions Workflows

The following workflows are configured:

1. **CI (`ci.yml`)** - Runs on PRs and develop branch
   - Linting and type checking
   - Unit tests
   - E2E tests
   - Build verification
   - Security scanning

2. **Deploy (`deploy.yml`)** - Runs on main branch
   - Builds Docker images
   - Deploys to staging automatically
   - Deploys to production on manual approval

### Required GitHub Secrets

Configure these secrets in your repository settings:

```
CLOUDFLARE_API_TOKEN        # Cloudflare API token for Pages deployment
CLOUDFLARE_ACCOUNT_ID       # Cloudflare account ID
NEXTAUTH_SECRET            # NextAuth secret for production
```

### Required GitHub Variables

```
API_URL                    # Production API URL
NEXTAUTH_URL              # Production frontend URL
```

---

## Environment Variables

### API Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | Yes | `4000` |
| `NODE_ENV` | Environment | Yes | `production` |
| `DATABASE_URL` | PostgreSQL URL | Yes | `postgresql://...` |
| `JWT_SECRET` | JWT signing key | Yes | `openssl rand -base64 64` |
| `JWT_EXPIRES_IN` | Token expiry | No | `7d` |
| `FRONTEND_URL` | Frontend URL | Yes | `https://wku-crew.com` |
| `GITHUB_CLIENT_ID` | GitHub OAuth | Yes | From GitHub |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth | Yes | From GitHub |
| `GITHUB_CALLBACK_URL` | OAuth callback | Yes | `https://api.../callback` |

### Web Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | API URL | Yes | `https://api.wku-crew.com` |
| `NEXTAUTH_URL` | Site URL | Yes | `https://wku-crew.com` |
| `NEXTAUTH_SECRET` | Auth secret | Yes | `openssl rand -base64 32` |

---

## SSL/TLS Configuration

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d api.wku-crew.com

# Auto-renewal (add to crontab)
0 0 1 * * certbot renew --quiet && docker-compose restart nginx
```

### Certificate Locations

```
/etc/letsencrypt/live/api.wku-crew.com/
├── fullchain.pem   # Full certificate chain
├── privkey.pem     # Private key
├── cert.pem        # Domain certificate
└── chain.pem       # Intermediate certificates
```

---

## Monitoring & Logging

### Health Check Endpoints

- `GET /api/health` - Basic health check
- `GET /api/health/ready` - Readiness probe (checks database)
- `GET /api/health/live` - Liveness probe

### Log Access

```bash
# View API logs
docker-compose -f docker-compose.prod.yml logs -f api

# View Nginx access logs
docker-compose -f docker-compose.prod.yml logs -f nginx

# View all logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Recommended Monitoring Tools

- **Uptime**: UptimeRobot, Pingdom
- **APM**: New Relic, Datadog
- **Error Tracking**: Sentry
- **Logging**: Loki + Grafana, ELK Stack

---

## Backup & Recovery

### Automated Backups

Backups run automatically every 24 hours via the `db-backup` service:

```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec db-backup /backup.sh

# List backups
ls -la backups/
```

### Restore from Backup

```bash
# Stop API to prevent writes
docker-compose -f docker-compose.prod.yml stop api

# Restore database
./scripts/restore.sh backups/wku_crew_20240101_120000.sql.gz

# Restart API
docker-compose -f docker-compose.prod.yml start api
```

### Backup Retention

Configure `BACKUP_RETENTION_DAYS` in your `.env` file (default: 7 days).

---

## Security Checklist

### Pre-Deployment

- [ ] All secrets stored in environment variables (not in code)
- [ ] Strong passwords generated for all services
- [ ] JWT secret is at least 64 bytes
- [ ] OAuth credentials configured correctly
- [ ] CORS configured to allow only your domain

### Server Security

- [ ] Firewall configured (only ports 80, 443 open)
- [ ] SSH key authentication only (password disabled)
- [ ] Regular security updates enabled
- [ ] Fail2ban or similar installed

### Application Security

- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Security headers configured in Nginx
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (via Prisma ORM)
- [ ] XSS protection headers set

### Database Security

- [ ] Database not exposed to public internet
- [ ] Strong password for database user
- [ ] Minimal privileges for application user
- [ ] Regular backups configured and tested

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```
Error: P1001: Can't reach database server
```

**Solutions:**
- Check if PostgreSQL container is running: `docker ps`
- Verify DATABASE_URL format
- Check network connectivity between containers

#### 2. OAuth Callback Error

```
Error: redirect_uri_mismatch
```

**Solutions:**
- Ensure callback URL matches exactly in GitHub settings
- Check HTTPS vs HTTP
- Verify trailing slashes

#### 3. Build Failures

```
Error: Cannot find module '@wku-crew/shared'
```

**Solutions:**
- Run `pnpm install` at root level
- Check workspace configuration in `pnpm-workspace.yaml`
- Rebuild: `pnpm build --filter=@wku-crew/shared`

#### 4. Container Out of Memory

**Solutions:**
- Increase Docker memory limit
- Check for memory leaks in application
- Optimize Node.js memory: `NODE_OPTIONS=--max-old-space-size=512`

### Log Locations

| Service | Log Location |
|---------|--------------|
| API | `docker logs wku-crew-api` |
| Nginx | `/var/log/nginx/` |
| PostgreSQL | `docker logs wku-crew-postgres` |

---

## Production Checklist

### Before Go-Live

- [ ] All environment variables configured
- [ ] SSL certificates installed and valid
- [ ] Database migrations applied
- [ ] Backups configured and tested
- [ ] Monitoring alerts configured
- [ ] Error tracking enabled
- [ ] Rate limiting tested
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] DNS records configured
- [ ] CDN/caching configured

### After Go-Live

- [ ] Monitor error rates for 24 hours
- [ ] Verify all features working
- [ ] Check backup completion
- [ ] Monitor resource usage
- [ ] Verify SSL certificate auto-renewal
- [ ] Test OAuth flows
- [ ] Document any custom configurations

---

## Quick Reference Commands

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Stop all services
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker-compose -f docker-compose.prod.yml restart api

# Run database migrations
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

# Access PostgreSQL CLI
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d wku_crew

# Manual backup
docker-compose -f docker-compose.prod.yml exec db-backup /backup.sh

# Update to latest code
git pull && docker-compose -f docker-compose.prod.yml up -d --build api
```

---

## Support

For deployment issues or questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0.0
