#!/bin/bash
# WKU Software Crew Backend Deployment Script for ws-248-247
# Domain: crew.abada.kr
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
echo "WKU Software Crew Backend Deployment"
echo "Server: ws-248-247"
echo "Domain: crew.abada.kr"
echo "Time: $(date)"
echo -e "========================================${NC}"

cd "$PROJ_DIR"

# Check .env
if [ ! -f .env ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    exit 1
fi

# 1. Pull latest code
echo -e "${YELLOW}[1/5] Pulling latest code...${NC}"
cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main
COMMIT=$(git rev-parse --short HEAD)
echo "Commit: $COMMIT"
cd "$PROJ_DIR"

# 2. Build new image
echo -e "${YELLOW}[2/5] Building Docker image...${NC}"
docker compose build api

# 3. Backup current image
echo -e "${YELLOW}[3/5] Backing up current image...${NC}"
docker tag crew-api:latest crew-api:backup 2>/dev/null || echo "No previous image"

# 4. Run database migrations
echo -e "${YELLOW}[4/5] Running database migrations...${NC}"
docker compose run --rm api npx prisma migrate deploy || echo "Migration skipped or failed"

# 5. Restart containers
echo -e "${YELLOW}[5/5] Restarting containers...${NC}"
docker compose up -d api
docker compose restart tunnel

# Health check
echo -e "${YELLOW}Running health check...${NC}"
sleep 10

MAX_RETRIES=6
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker compose exec -T api wget -qO- http://localhost:4000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}========================================"
        echo "Deployment Successful!"
        echo "Commit: $COMMIT"
        echo "Time: $(date)"
        echo -e "========================================${NC}"

        # Cleanup
        docker rmi crew-api:backup 2>/dev/null || true
        docker image prune -f
        exit 0
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Health check attempt $RETRY_COUNT/$MAX_RETRIES failed, retrying in 5s..."
    sleep 5
done

# Rollback on failure
echo -e "${RED}========================================"
echo "Deployment Failed! Rolling back..."
echo -e "========================================${NC}"

if docker image inspect crew-api:backup > /dev/null 2>&1; then
    docker tag crew-api:backup crew-api:latest
    docker compose up -d api
    echo "Rolled back to previous version"
fi

exit 1
