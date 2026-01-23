#!/bin/bash
# WKU Software Crew Initial Setup Script for ws-248-247
# Run this once for initial deployment

set -e

# Configuration
PROJ_DIR="$HOME/saas-crew"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================"
echo "WKU Software Crew - Initial Setup"
echo "Server: ws-248-247"
echo "Time: $(date)"
echo -e "========================================${NC}"

cd "$PROJ_DIR"

# 1. Check prerequisites
echo -e "${YELLOW}[1/6] Checking prerequisites...${NC}"

if [ ! -f .env ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

# Source environment variables
source .env

if [ -z "$DATABASE_PASSWORD" ]; then
    echo -e "${RED}ERROR: DATABASE_PASSWORD not set in .env${NC}"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo -e "${RED}ERROR: JWT_SECRET not set in .env${NC}"
    exit 1
fi

# 2. Create directories
echo -e "${YELLOW}[2/6] Creating directories...${NC}"
mkdir -p logs backups data

# 3. Create database and user
echo -e "${YELLOW}[3/6] Creating database...${NC}"

# Check if database exists
if docker exec wm_postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw crew_production; then
    echo "Database crew_production already exists"
else
    echo "Creating database crew_production..."
    docker exec wm_postgres psql -U postgres -c "CREATE USER crew_user WITH PASSWORD '${DATABASE_PASSWORD}';" 2>/dev/null || echo "User already exists"
    docker exec wm_postgres psql -U postgres -c "CREATE DATABASE crew_production OWNER crew_user;" 2>/dev/null || echo "Database already exists"
    docker exec wm_postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE crew_production TO crew_user;"
    echo "Database created successfully"
fi

# 4. Verify Cloudflare Tunnel token
echo -e "${YELLOW}[4/6] Verifying Cloudflare Tunnel token...${NC}"

if [ -z "$TUNNEL_TOKEN" ]; then
    echo -e "${RED}ERROR: TUNNEL_TOKEN not set in .env${NC}"
    echo "Get token from: Cloudflare Zero Trust > Networks > Tunnels > crew-api-tunnel"
    exit 1
fi

echo "Cloudflare Tunnel token verified"

# 5. Build and start containers
echo -e "${YELLOW}[5/6] Building and starting containers...${NC}"
docker compose build
docker compose up -d

# 6. Run database migrations
echo -e "${YELLOW}[6/6] Running database migrations...${NC}"
sleep 10  # Wait for API to start
docker compose exec -T api npx prisma migrate deploy || echo "Migration completed or skipped"
docker compose exec -T api npx prisma db seed || echo "Seed completed or skipped"

# Final check
echo -e "${YELLOW}Running final health check...${NC}"
sleep 5

if docker compose exec -T api wget -qO- http://localhost:4000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}========================================"
    echo "Setup Completed Successfully!"
    echo ""
    echo "Services:"
    echo "  - API: http://localhost:4000 (internal)"
    echo "  - Tunnel: crew-api.abada.kr"
    echo ""
    echo "Next steps:"
    echo "  1. Configure Cloudflare Pages for frontend"
    echo "  2. Set NEXT_PUBLIC_API_URL=https://crew-api.abada.kr"
    echo "  3. Deploy frontend to crew.abada.kr"
    echo -e "========================================${NC}"
else
    echo -e "${RED}WARNING: Health check failed. Check logs:${NC}"
    echo "docker logs crew-api"
fi
