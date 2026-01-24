# WKU Software Crew Deployment for ws-248-247

## Domain Configuration

| Service | Domain | Location |
|---------|--------|----------|
| Frontend | `crew.abada.kr` | Cloudflare Tunnel -> ws-248-247:3000 |
| API | `crew-api.abada.kr` | Cloudflare Tunnel -> ws-248-247:4000 |

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
                        v
              +-------------------+
              | Cloudflare Edge   |
              | (DNS + CDN + SSL) |
              +-------------------+
                        |
           +------------+------------+
           |                         |
           v                         v
    crew.abada.kr           crew-api.abada.kr
           |                         |
           +------------+------------+
                        |
              Cloudflare Tunnel
              (Outbound connection)
                        |
                        v
+----------------------------------------------------------+
|                    ws-248-247 Server                      |
|                                                          |
|   +--------------------------------------------------+   |
|   |         Docker: workstation_manager_network      |   |
|   |                                                  |   |
|   |   +-----------+  +-----------+  +-----------+   |   |
|   |   |crew-tunnel|  | crew-web  |  | crew-api  |   |   |
|   |   |cloudflared|->|   :3000   |  |   :4000   |   |   |
|   |   +-----------+  +-----------+  +-----------+   |   |
|   |                                                  |   |
|   |   +-----------+  +-----------+                   |   |
|   |   |wm_postgres|  | wm_redis  |                   |   |
|   |   |  :5432    |  |   :6379   |                   |   |
|   |   +-----------+  +-----------+                   |   |
|   +--------------------------------------------------+   |
+----------------------------------------------------------+
```

---

## Quick Start

### 1. Configure Cloudflare Tunnel Routes

Add both domains to the tunnel:

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to **Networks > Tunnels**
3. Click on `crew-api-tunnel` > **Configure**
4. In **Public Hostnames**, add:

| Subdomain | Domain | Service |
|-----------|--------|---------|
| crew-api | abada.kr | http://crew-api:4000 |
| crew | abada.kr | http://crew-web:3000 |

5. Save changes

### 2. Get Tunnel Token

1. In the tunnel configuration, click **Edit**
2. Select **Docker** tab
3. Copy the token from the Docker command (the part after `--token`)

The token starts with `eyJ...` and is about 200+ characters long.

### 3. Upload files to server

```bash
# From local machine
scp -r deployments/ws-248-247/* ws-248-247:~/saas-crew/
```

### 4. Setup on server

```bash
ssh ws-248-247
cd ~/saas-crew

# Configure environment
cp .env.example .env
nano .env  # Set DATABASE_PASSWORD, JWT_SECRET, TUNNEL_TOKEN, GITHUB_*

# Make scripts executable
chmod +x deploy.sh setup.sh

# Clone application code
git clone https://github.com/saintgo7/saas-crew.git app

# Run initial setup
./setup.sh
```

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
# Frontend logs
docker logs -f crew-web

# API logs
docker logs -f crew-api

# Tunnel logs
docker logs -f crew-tunnel

# Deployment logs
cat ~/saas-crew/logs/deploy-*.log
```

### Restart services

```bash
cd ~/saas-crew

# Restart Frontend only
docker compose restart web

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
docker exec -i wm_postgres psql -U crew_user crew_production < ~/saas-crew/backups/db-YYYYMMDD.sql
```

---

## Cost: $0/month

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Cloudflare Tunnel | $0 |
| API | Cloudflare Tunnel | $0 |
| Server | Existing ws-248-247 | $0 |
| Database | Shared wm_postgres | $0 |
| Cache | Shared wm_redis | $0 |
| **Total** | | **$0** |

---

## Troubleshooting

### Frontend not loading

```bash
# Check container status
docker ps | grep crew-web

# Check logs
docker logs crew-web --tail 100

# Restart
cd ~/saas-crew && docker compose restart web
```

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

### Check Cloudflare Dashboard

1. Go to [Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to **Networks > Tunnels**
3. Check tunnel status (should be **Healthy**)
4. Verify both hostnames are configured:
   - `crew.abada.kr` -> `http://crew-web:3000`
   - `crew-api.abada.kr` -> `http://crew-api:4000`
