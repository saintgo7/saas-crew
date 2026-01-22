# WKU Software Crew - Deployment Guide

## Prerequisites

- Docker 24.0+
- Docker Compose 2.20+
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/saas-crew.git
cd saas-crew
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```bash
# Required configurations
NODE_ENV=production

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=wku_crew

# JWT Secret (min 32 characters)
JWT_SECRET=<your-secure-jwt-secret>

# GitHub OAuth
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
GITHUB_CALLBACK_URL=https://your-domain.com/api/auth/github/callback

# URLs
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### 3. SSL Certificates

Place your SSL certificates in the `ssl` directory:

```bash
mkdir -p ssl
cp /path/to/your/certificate.crt ssl/
cp /path/to/your/private.key ssl/
```

### 4. Deploy

```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d --build

# Check service status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| web | 3000 | Next.js frontend |
| api | 4000 | NestJS backend |
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache |
| nginx | 80/443 | Reverse proxy |

## Database Migrations

Run migrations after deployment:

```bash
docker compose -f docker-compose.prod.yml exec api pnpm prisma migrate deploy
```

## Backup and Restore

### Automated Backups

Backups run daily and are stored in `./backups/`. Retention is controlled by `BACKUP_RETENTION_DAYS` (default: 7).

### Manual Backup

```bash
docker compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql
```

### Restore from Backup

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  psql -U $POSTGRES_USER $POSTGRES_DB < backup.sql
```

## Health Checks

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000/api/health`
- Database: `docker compose -f docker-compose.prod.yml exec postgres pg_isready`

## Scaling

For horizontal scaling, use Docker Swarm or Kubernetes:

```bash
# Docker Swarm
docker stack deploy -c docker-compose.prod.yml wku-crew
```

## Troubleshooting

### Container Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api
```

### Restart Services

```bash
docker compose -f docker-compose.prod.yml restart api
```

### Reset Everything

```bash
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build
```

## GitHub OAuth Setup

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create a new OAuth App:
   - Application name: WKU Software Crew
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-domain.com/api/auth/github/callback
3. Copy Client ID and Client Secret to `.env`
