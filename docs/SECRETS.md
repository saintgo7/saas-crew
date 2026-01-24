# Secrets Management Guide

## Overview

This document describes how to manage secrets and credentials for the WKU Software Crew project.

**IMPORTANT**: Never commit actual secrets to version control.

---

## Secret Locations

### Production Server (ws-248-247)

```
~/saas-crew/.env          # Main environment file
~/saas-crew/.env.backup   # Backup of environment file
```

### Local Development

```
apps/api/.env.local       # API local environment
apps/web/.env.local       # Web local environment
```

---

## Required Secrets

### 1. Database (PostgreSQL)

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_PASSWORD` | PostgreSQL password for crew_user | Server admin |

**Connection String Format**:
```
postgresql://crew_user:${DATABASE_PASSWORD}@wm_postgres:5432/crew_production
```

### 2. JWT Authentication

| Variable | Description | How to Generate |
|----------|-------------|-----------------|
| `JWT_SECRET` | Secret key for signing JWTs | `openssl rand -hex 64` |

**Security Notes**:
- Minimum 256 bits (64 hex characters)
- Rotate every 6 months
- Never share or log

### 3. GitHub OAuth

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GITHUB_CLIENT_ID` | OAuth App Client ID | GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | OAuth App Client Secret | GitHub Developer Settings |

**Setup Steps**:
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: `WKU Software Crew`
   - Homepage URL: `https://crew.abada.kr`
   - Authorization callback URL: `https://crew-api.abada.kr/api/auth/github/callback`
4. Copy Client ID and Client Secret

### 4. Cloudflare Tunnel

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `TUNNEL_TOKEN` | Cloudflare Tunnel authentication token | Cloudflare Zero Trust Dashboard |

**How to Get Token**:
1. Go to https://one.dash.cloudflare.com/
2. Navigate to Networks > Tunnels
3. Click on `crew-api-tunnel`
4. Click Configure > Docker tab
5. Copy token from the command (starts with `eyJ...`)

---

## Secret Rotation

### JWT Secret Rotation

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -hex 64)

# Update on server
ssh ws-248-247
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$NEW_SECRET/" ~/saas-crew/.env

# Restart API
cd ~/saas-crew && docker compose restart api
```

**Note**: All existing user sessions will be invalidated.

### Tunnel Token Rotation

1. Delete old token in Cloudflare Dashboard
2. Generate new token
3. Update `.env` on server
4. Restart tunnel: `docker compose restart tunnel`

---

## Backup Secrets

### Create Encrypted Backup

```bash
# On server
cd ~/saas-crew
gpg -c .env
# Enter passphrase when prompted
# Creates .env.gpg
```

### Restore from Backup

```bash
gpg -d .env.gpg > .env
# Enter passphrase when prompted
```

---

## Environment File Template

Create `deployments/ws-248-247/.env.example`:

```bash
# Database
DATABASE_PASSWORD=your_database_password_here

# JWT (generate with: openssl rand -hex 64)
JWT_SECRET=your_jwt_secret_here

# GitHub OAuth (from github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Cloudflare Tunnel (from Cloudflare Zero Trust Dashboard)
TUNNEL_TOKEN=your_tunnel_token_here
```

---

## Security Checklist

- [ ] All secrets are stored in `.env` file on server only
- [ ] `.env` is in `.gitignore`
- [ ] No secrets in Docker images or compose files
- [ ] GitHub OAuth redirect URL matches production domain
- [ ] JWT secret is at least 256 bits
- [ ] Tunnel token is valid and not expired
- [ ] Backup of secrets exists (encrypted)

---

## Quick Reference

| Secret | Rotation Period | Impact of Rotation |
|--------|-----------------|-------------------|
| DATABASE_PASSWORD | As needed | Service restart required |
| JWT_SECRET | 6 months | All sessions invalidated |
| GITHUB_CLIENT_SECRET | As needed | Re-authentication required |
| TUNNEL_TOKEN | As needed | Brief connectivity loss |
