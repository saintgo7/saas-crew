#!/bin/bash
# WKU Software Crew - Staging Deployment Script
# Deploys develop branch to staging environment
# Domains: staging.crew.abada.kr, staging-api.crew.abada.kr

set -e

# Configuration
PROJ_DIR="$HOME/saas-crew"
APP_DIR="$PROJ_DIR/app"
LOG_DIR="$PROJ_DIR/logs"
COMPOSE_FILE="docker-compose.staging.yml"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Ensure log directory exists
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/deploy-staging-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo -e "${CYAN}========================================"
echo "WKU Software Crew - STAGING Deployment"
echo "Server: ws-248-247"
echo "Frontend: staging.crew.abada.kr"
echo "API: staging-api.crew.abada.kr"
echo "Time: $(date)"
echo -e "========================================${NC}"

cd "$PROJ_DIR"

# Check .env
if [ ! -f .env ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    exit 1
fi

# Check staging tunnel token
if ! grep -q "TUNNEL_TOKEN_STAGING" .env; then
    echo -e "${YELLOW}WARNING: TUNNEL_TOKEN_STAGING not found in .env${NC}"
    echo "Staging tunnel will not start without it."
fi

# 1. Pull latest code from develop branch
echo -e "${YELLOW}[1/5] Pulling develop branch...${NC}"
cd "$APP_DIR"
git fetch origin develop
git checkout develop
git reset --hard origin/develop
COMMIT=$(git rev-parse --short HEAD)
echo "Commit: $COMMIT"
cd "$PROJ_DIR"

# 2. Build staging images
echo -e "${YELLOW}[2/5] Building staging Docker images...${NC}"
docker compose -f "$COMPOSE_FILE" build api-staging web-staging

# 3. Run database migrations for staging
echo -e "${YELLOW}[3/5] Running staging database migrations...${NC}"
# Create staging database if not exists
docker exec wm_postgres psql -U crew_user -d postgres -c "CREATE DATABASE crew_staging;" 2>/dev/null || echo "Staging database already exists"
docker compose -f "$COMPOSE_FILE" run --rm api-staging npx prisma migrate deploy || echo "Migration skipped or failed"

# 4. Restart staging containers
echo -e "${YELLOW}[4/5] Restarting staging containers...${NC}"
docker compose -f "$COMPOSE_FILE" up -d api-staging web-staging
if grep -q "TUNNEL_TOKEN_STAGING" .env; then
    docker compose -f "$COMPOSE_FILE" up -d tunnel-staging
fi

# 5. Health checks
echo -e "${YELLOW}[5/5] Running health checks...${NC}"

MAX_RETRIES=12
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    API_STATUS=$(docker inspect --format='{{.State.Health.Status}}' crew-api-staging 2>/dev/null || echo "unknown")
    WEB_STATUS=$(docker inspect --format='{{.State.Health.Status}}' crew-web-staging 2>/dev/null || echo "unknown")

    echo "Health check attempt $((RETRY_COUNT + 1))/$MAX_RETRIES (API: $API_STATUS, Web: $WEB_STATUS)"

    if [ "$API_STATUS" = "healthy" ] && [ "$WEB_STATUS" = "healthy" ]; then
        echo -e "${GREEN}========================================"
        echo "Staging Deployment Successful!"
        echo "Commit: $COMMIT (develop)"
        echo "API: https://staging-api.crew.abada.kr"
        echo "Web: https://staging.crew.abada.kr"
        echo "Time: $(date)"
        echo -e "========================================${NC}"

        # Cleanup old images
        docker image prune -f
        exit 0
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 10
done

# Deployment failed
echo -e "${RED}========================================"
echo "Staging Deployment Failed!"
echo "Check logs: docker logs crew-api-staging"
echo "            docker logs crew-web-staging"
echo -e "========================================${NC}"

exit 1
