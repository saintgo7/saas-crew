# Quick Start - WKU Software Crew Deployment

5분 안에 배포하기 위한 빠른 가이드입니다.

## Prerequisites Checklist

- [ ] Cloudflare 계정 (Zero Trust 접근 가능)
- [ ] GitHub OAuth App 생성 완료
- [ ] ws-248-247 서버 SSH 접근 가능

---

## Step 1: Cloudflare Tunnel (2분)

1. https://one.dash.cloudflare.com/ 접속
2. **Networks > Tunnels > Create a tunnel**
3. 이름: `crew-api-tunnel`
4. Tunnel ID와 credentials.json 복사해두기
5. Public hostname 설정:
   - Subdomain: `crew-api`
   - Domain: `abada.kr`
   - Service Type: `HTTP`
   - URL: `crew-api:4000`

---

## Step 2: Server Setup (2분)

```bash
# SSH 접속
ssh ws-248-247

# 디렉토리 생성 및 클론
mkdir -p ~/saas-crew && cd ~/saas-crew
git clone https://github.com/saintgo7/saas-crew app

# 파일 복사
cp app/deployments/ws-248-247/docker-compose.yml .
cp app/deployments/ws-248-247/*.sh .
cp app/deployments/ws-248-247/.env.example .env
mkdir -p cloudflared
cp app/deployments/ws-248-247/cloudflared/config.yml cloudflared/

# 권한 설정
chmod +x setup.sh deploy.sh
```

---

## Step 3: Configuration (1분)

```bash
# .env 편집
vim .env
```

필수 값 설정:
```env
DATABASE_PASSWORD=SecurePassword123!
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
GITHUB_CLIENT_ID=Ov23li...
GITHUB_CLIENT_SECRET=abc123...
```

```bash
# Tunnel 설정
vim cloudflared/config.yml
# tunnel: YOUR_TUNNEL_ID_HERE 를 실제 ID로 변경

# Credentials 생성
vim cloudflared/credentials.json
# Cloudflare에서 받은 JSON 붙여넣기
```

---

## Step 4: Deploy

```bash
./setup.sh
```

완료되면 https://crew-api.abada.kr/api/health 확인

---

## Step 5: Frontend (Cloudflare Pages)

1. https://dash.cloudflare.com/ > Pages
2. Create application > Connect to Git
3. Repository: `saintgo7/saas-crew`
4. Settings:
   - Root directory: `apps/web`
   - Framework: `Next.js`
   - Build command: `npm run build`
5. Environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://crew-api.abada.kr`
6. Custom domain: `crew.abada.kr`

---

## Verify

```bash
# API
curl https://crew-api.abada.kr/api/health

# Frontend
# 브라우저에서 https://crew.abada.kr 접속
```

---

## Commands Reference

```bash
# 배포
./deploy.sh

# 로그 보기
docker logs crew-api -f

# 재시작
docker compose restart

# 상태 확인
docker ps
```
