#!/bin/bash
# WKU Software Crew Deployment Script for ws-248-247
# Domains: crew.abada.kr (Frontend), crew-api.abada.kr (API)
# Uses Cloudflare Tunnel

set -e

# Configuration
PROJ_DIR="$HOME/saas-crew"
APP_DIR="$PROJ_DIR/app"
LOG_DIR="$PROJ_DIR/logs"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Ensure log directory exists
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo -e "${GREEN}========================================"
echo "WKU Software Crew Deployment"
echo "Server: ws-248-247"
echo "Frontend: crew.abada.kr"
echo "API: crew-api.abada.kr"
echo "Time: $(date)"
echo -e "========================================${NC}"

cd "$PROJ_DIR"

# Check .env
if [ ! -f .env ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    exit 1
fi

# 1. Pull latest code
echo -e "${YELLOW}[1/6] Pulling latest code...${NC}"
cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main
COMMIT=$(git rev-parse --short HEAD)
echo "Commit: $COMMIT"
cd "$PROJ_DIR"

# 2. Build new images
echo -e "${YELLOW}[2/6] Building Docker images...${NC}"
docker compose build api web

# 3. Backup current images
echo -e "${YELLOW}[3/6] Backing up current images...${NC}"
docker tag crew-api:latest crew-api:backup 2>/dev/null || echo "No previous API image"
docker tag crew-web:latest crew-web:backup 2>/dev/null || echo "No previous Web image"

# 4. Run database migrations
echo -e "${YELLOW}[4/6] Running database migrations...${NC}"
docker compose run --rm api npx prisma migrate deploy || echo "Migration skipped or failed"

# 5. Restart containers
echo -e "${YELLOW}[5/6] Restarting containers...${NC}"
docker compose up -d api web
docker compose restart tunnel

# 6. Health checks (using Docker's built-in health status)
echo -e "${YELLOW}[6/6] Running health checks...${NC}"

MAX_RETRIES=12
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    API_STATUS=$(docker inspect --format='{{.State.Health.Status}}' crew-api 2>/dev/null || echo "unknown")
    WEB_STATUS=$(docker inspect --format='{{.State.Health.Status}}' crew-web 2>/dev/null || echo "unknown")

    echo "Health check attempt $((RETRY_COUNT + 1))/$MAX_RETRIES (API: $API_STATUS, Web: $WEB_STATUS)"

    if [ "$API_STATUS" = "healthy" ] && [ "$WEB_STATUS" = "healthy" ]; then
        echo -e "${GREEN}========================================"
        echo "Deployment Successful!"
        echo "Commit: $COMMIT"
        echo "API: https://crew-api.abada.kr"
        echo "Web: https://crew.abada.kr"
        echo "Time: $(date)"
        echo -e "========================================${NC}"

        # Cleanup
        docker rmi crew-api:backup 2>/dev/null || true
        docker rmi crew-web:backup 2>/dev/null || true
        docker image prune -f
        exit 0
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 10
done

# Rollback on failure
echo -e "${RED}========================================"
echo "Deployment Failed! Rolling back..."
echo -e "========================================${NC}"

if docker image inspect crew-api:backup > /dev/null 2>&1; then
    docker tag crew-api:backup crew-api:latest
    docker compose up -d api
    echo "Rolled back API to previous version"
fi

if docker image inspect crew-web:backup > /dev/null 2>&1; then
    docker tag crew-web:backup crew-web:latest
    docker compose up -d web
    echo "Rolled back Web to previous version"
fi

exit 1
