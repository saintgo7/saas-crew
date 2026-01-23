# WKU Software Crew Deployment for ws-248-247

## Domain Configuration

| Service | Domain | Location |
|---------|--------|----------|
| Frontend | `crew.abada.kr` | Cloudflare Pages |
| API | `crew-api.abada.kr` | Cloudflare Tunnel -> ws-248-247 |

## Cloudflare Tunnel Info

- **Tunnel Name**: `crew-api-tunnel`
- **Tunnel ID**: `e511a3df-e67f-45c3-bc15-428e4b8043b2`
- **Status**: Created (2026-01-24)
- **Token Location**: Cloudflare Zero Trust > Networks > Tunnels > crew-api-tunnel > Edit > Docker

---

## Architecture

```
                     Internet
                        |
           +------------+------------+
           |                         |
           v                         v
+---------------------+   +---------------------+
|  Cloudflare Pages   |   |  Cloudflare Tunnel  |
|   crew.abada.kr     |   |  crew-api.abada.kr  |
|  (Next.js Frontend) |   |                     |
+---------------------+   +---------------------+
                                    |
                         Outbound Connection
                          (No ports needed)
                                    |
                                    v
+----------------------------------------------------------+
|                    ws-248-247 Server                      |
|                                                          |
|   +--------------------------------------------------+   |
|   |         Docker: workstation_manager_network      |   |
|   |                                                  |   |
|   |   +-----------+  +-----------+  +-----------+   |   |
|   |   |crew-tunnel|  | crew-api  |  |wm_postgres|   |   |
|   |   |cloudflared|->|   :4000   |  |  :5432    |   |   |
|   |   +-----------+  +-----------+  +-----------+   |   |
|   |                                                  |   |
|   |                  +-----------+                   |   |
|   |                  | wm_redis  |                   |   |
|   |                  |   :6379   |                   |   |
|   |                  +-----------+                   |   |
|   +--------------------------------------------------+   |
+----------------------------------------------------------+
```

---

## Quick Start

### 1. Get Cloudflare Tunnel Token (Already Created)

The tunnel `crew-api-tunnel` is already configured. To get the token:

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to **Networks > Tunnels**
3. Click on `crew-api-tunnel`
4. Click **Edit** (or Configure)
5. Select **Docker** tab
6. Copy the token from the Docker command (the part after `--token`)

The token starts with `eyJ...` and is about 200+ characters long.

### 2. Upload files to server

```bash
# From local machine
scp -r deployments/ws-248-247/* ws-248-247:~/saas-crew/
```

### 3. Setup on server

```bash
ssh ws-248-247
cd ~/saas-crew

# Configure environment
cp .env.example .env
nano .env  # Set DATABASE_PASSWORD, JWT_SECRET, TUNNEL_TOKEN

# Make scripts executable
chmod +x deploy.sh setup.sh

# Clone application code
git clone https://github.com/saintgo7/saas-crew.git app

# Run initial setup
./setup.sh
```

### 4. Configure Cloudflare Pages

1. **Create Project**:
   - Cloudflare Dashboard > Pages > Create project
   - Connect to GitHub > Select `saintgo7/saas-crew`

2. **Build Settings**:
   ```
   Framework preset: Next.js
   Build command: cd apps/web && npm install && npm run build
   Build output directory: apps/web/.next
   Root directory: /
   ```

3. **Environment Variables**:
   ```
   NODE_VERSION=20
   NEXT_PUBLIC_API_URL=https://crew-api.abada.kr
   ```

4. **Custom Domain**:
   - Add `crew.abada.kr`

---

## Daily Operations

### Deploy new version

```bash
ssh ws-248-247
cd ~/saas-crew
./deploy.sh
```

### View logs

```bash
# API container logs
docker logs -f crew-api

# Tunnel logs
docker logs -f crew-tunnel

# Deployment logs
cat ~/saas-crew/logs/deploy-*.log
```

### Restart services

```bash
cd ~/saas-crew

# Restart API only
docker compose restart api

# Restart Tunnel only
docker compose restart tunnel

# Restart all
docker compose restart
```

### Database operations

```bash
# Connect to database
docker exec -it wm_postgres psql -U crew_user -d crew_production

# Backup
docker exec wm_postgres pg_dump -U crew_user crew_production > ~/saas-crew/backups/db-$(date +%Y%m%d).sql

# Restore
docker exec -i wm_postgres psql -U crew_user crew_production < ~/saas-crew/backups/db-20260124.sql
```

---

## Cost: $0/month

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Cloudflare Pages | $0 |
| Tunnel | Cloudflare Tunnel | $0 |
| Backend | Existing server | $0 |
| Database | Shared wm_postgres | $0 |
| Cache | Shared wm_redis | $0 |
| **Total** | | **$0** |

---

## Troubleshooting

### API not responding

```bash
# Check container status
docker ps | grep crew-api

# Check logs
docker logs crew-api --tail 100

# Restart
cd ~/saas-crew && docker compose restart api
```

### Tunnel not connecting

```bash
# Check tunnel status
docker logs crew-tunnel --tail 50

# Verify token is set
grep TUNNEL_TOKEN ~/saas-crew/.env

# Restart tunnel
docker compose restart tunnel
```

### Database connection error

```bash
# Verify network connectivity
docker exec crew-api ping -c 3 wm_postgres

# Check database exists
docker exec wm_postgres psql -U postgres -c "\l" | grep crew_production
```

### Check Cloudflare Dashboard

1. Go to [Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to **Networks > Tunnels**
3. Check tunnel status (should be **Healthy**)
