# Git Flow 설정 체크리스트

## 개요

WKU Software Crew 프로젝트의 Git Flow 환경 설정을 위한 단계별 가이드입니다.

**목표**: 안전한 개발 워크플로우 구축
- develop 브랜치에서 개발 및 스테이징 테스트
- main 브랜치는 프로덕션 전용
- 모든 변경은 PR을 통해 진행

---

## Phase 1: 코드 설정 (완료)

- [x] develop 브랜치 생성 및 push
- [x] docker-compose.staging.yml 생성
- [x] deploy-staging.sh 스크립트 생성
- [x] deploy.yml 워크플로우 업데이트 (SSH 배포)
- [x] 문서 작성 (DEVELOPMENT_PLAN.md, BRANCH_PROTECTION.md)

---

## Phase 2: GitHub Secrets 설정

### Step 2.1: SSH 키 생성

```bash
# 로컬 머신에서 실행
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/crew_deploy_key

# 출력 예시:
# Generating public/private ed25519 key pair.
# Enter passphrase (empty for no passphrase): [Enter 입력]
# Your identification has been saved in ~/.ssh/crew_deploy_key
# Your public key has been saved in ~/.ssh/crew_deploy_key.pub
```

### Step 2.2: 서버에 공개키 등록

```bash
# 공개키 내용 확인
cat ~/.ssh/crew_deploy_key.pub

# 서버에 공개키 추가
ssh saint@ws-248-247 "mkdir -p ~/.ssh && chmod 700 ~/.ssh"
cat ~/.ssh/crew_deploy_key.pub | ssh saint@ws-248-247 "cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# 연결 테스트
ssh -i ~/.ssh/crew_deploy_key saint@ws-248-247 "echo 'SSH connection successful'"
```

### Step 2.3: GitHub Secrets 추가

1. GitHub 저장소로 이동
2. Settings > Secrets and variables > Actions
3. "New repository secret" 클릭

| Secret Name | 값 | 설명 |
|-------------|-----|------|
| `SERVER_HOST` | `서버IP` | 배포 서버 IP 주소 |
| `SERVER_USER` | `saint` | SSH 사용자명 |
| `SERVER_SSH_KEY` | (개인키 전체) | `cat ~/.ssh/crew_deploy_key` 출력값 |

**개인키 복사 방법:**
```bash
cat ~/.ssh/crew_deploy_key
# -----BEGIN OPENSSH PRIVATE KEY----- 부터
# -----END OPENSSH PRIVATE KEY----- 까지 전체 복사
```

### Step 2.4: 검증

- [ ] SERVER_HOST 시크릿 추가됨
- [ ] SERVER_USER 시크릿 추가됨
- [ ] SERVER_SSH_KEY 시크릿 추가됨

---

## Phase 3: Branch Protection 설정

### Step 3.1: main 브랜치 보호 규칙

1. GitHub 저장소 > Settings > Branches
2. "Add branch protection rule" 클릭
3. 설정:

| 항목 | 값 |
|------|-----|
| Branch name pattern | `main` |
| Require a pull request before merging | On |
| Require approvals | `1` |
| Dismiss stale PR approvals | On |
| Require status checks to pass | On |
| Status checks | `Lint & Type Check`, `API Tests`, `Build Check` |
| Require conversation resolution | On |

4. "Create" 클릭

### Step 3.2: develop 브랜치 보호 규칙

1. "Add branch protection rule" 클릭
2. 설정:

| 항목 | 값 |
|------|-----|
| Branch name pattern | `develop` |
| Require a pull request before merging | On |
| Require approvals | `0` (선택사항) |
| Require status checks to pass | On |
| Status checks | `Lint & Type Check`, `API Tests`, `Build Check` |

3. "Create" 클릭

### Step 3.3: 검증

- [ ] main 브랜치 보호 규칙 생성됨
- [ ] develop 브랜치 보호 규칙 생성됨
- [ ] 직접 push 시 거부되는지 테스트

---

## Phase 4: Cloudflare Tunnel 설정

### Step 4.1: Cloudflare 대시보드 접속

1. https://one.dash.cloudflare.com/ 접속
2. 로그인
3. Networks > Tunnels 이동
4. `crew-api-tunnel` 클릭
5. Configure 클릭

### Step 4.2: Staging 라우트 추가

"Public Hostname" 탭에서 "Add a public hostname" 클릭

**첫 번째 라우트 (Frontend):**

| 항목 | 값 |
|------|-----|
| Subdomain | `staging` |
| Domain | `crew.abada.kr` |
| Type | `HTTP` |
| URL | `crew-web-staging:3001` |

Save 클릭

**두 번째 라우트 (API):**

| 항목 | 값 |
|------|-----|
| Subdomain | `staging-api` |
| Domain | `crew.abada.kr` |
| Type | `HTTP` |
| URL | `crew-api-staging:4001` |

Save 클릭

### Step 4.3: 검증

- [ ] staging-crew.abada.kr 라우트 추가됨
- [ ] staging-api-crew.abada.kr 라우트 추가됨

---

## Phase 5: 서버 설정

### Step 5.1: 배포 스크립트 업로드

```bash
# 로컬에서 실행
scp deployments/ws-248-247/docker-compose.staging.yml saint@ws-248-247:~/saas-crew/
scp deployments/ws-248-247/deploy-staging.sh saint@ws-248-247:~/saas-crew/deployments/ws-248-247/

# 실행 권한 부여
ssh saint@ws-248-247 "chmod +x ~/saas-crew/deployments/ws-248-247/deploy-staging.sh"
```

### Step 5.2: Staging 환경변수 설정 (선택사항)

```bash
ssh saint@ws-248-247

# .env 파일 편집
nano ~/saas-crew/.env

# 다음 추가 (별도 staging 설정 원할 경우)
# JWT_SECRET_STAGING=별도시크릿
# GITHUB_CLIENT_ID_STAGING=별도OAuth앱ID
# GITHUB_CLIENT_SECRET_STAGING=별도OAuth시크릿
# TUNNEL_TOKEN_STAGING=별도터널토큰 (별도 터널 사용시)
```

### Step 5.3: Staging 데이터베이스 생성

```bash
ssh saint@ws-248-247

# PostgreSQL에 staging DB 생성
docker exec wm_postgres psql -U crew_user -d postgres -c "CREATE DATABASE crew_staging;"
```

### Step 5.4: 검증

- [ ] docker-compose.staging.yml 업로드됨
- [ ] deploy-staging.sh 업로드 및 실행권한 부여됨
- [ ] crew_staging 데이터베이스 생성됨

---

## Phase 6: 테스트

### Step 6.1: Staging 수동 배포 테스트

```bash
ssh saint@ws-248-247

cd ~/saas-crew
./deployments/ws-248-247/deploy-staging.sh
```

### Step 6.2: 사이트 접속 확인

- [ ] https://staging-crew.abada.kr 접속 가능
- [ ] https://staging-api-crew.abada.kr/api/health 응답 확인
- [ ] https://staging-api-crew.abada.kr/api/docs Swagger 확인

### Step 6.3: CI/CD 파이프라인 테스트

```bash
# 로컬에서 테스트 커밋
git checkout develop
echo "# test" >> README.md
git add README.md
git commit -m "test: verify CI/CD pipeline"
git push origin develop
```

GitHub Actions 탭에서 워크플로우 실행 확인

### Step 6.4: 검증

- [ ] Staging 수동 배포 성공
- [ ] Staging 사이트 접속 가능
- [ ] CI/CD 자동 배포 성공

---

## 완료 체크리스트

### 필수 항목

- [ ] Phase 2: GitHub Secrets 설정 완료
- [ ] Phase 3: Branch Protection 설정 완료
- [ ] Phase 4: Cloudflare Tunnel 설정 완료
- [ ] Phase 5: 서버 설정 완료
- [ ] Phase 6: 테스트 성공

### 선택 항목

- [ ] Staging용 별도 GitHub OAuth App 생성
- [ ] Staging용 별도 JWT Secret 설정
- [ ] Slack/Discord 알림 연동

---

## 워크플로우 요약

설정 완료 후 개발 워크플로우:

```
1. feature 브랜치 생성
   git checkout develop
   git pull origin develop
   git checkout -b feature/새기능

2. 개발 및 테스트
   pnpm test
   pnpm build

3. PR 생성 (feature → develop)
   git push -u origin feature/새기능
   # GitHub에서 PR 생성

4. CI 체크 통과 → develop 머지
   # staging-crew.abada.kr 에서 자동 배포 및 테스트

5. PR 생성 (develop → main)
   # 충분한 테스트 후

6. 리뷰 → main 머지
   # crew.abada.kr 에 프로덕션 배포
```

---

## 문제 해결

### CI가 실패하는 경우

1. GitHub Actions 탭에서 로그 확인
2. 실패한 job 클릭하여 상세 로그 확인
3. 로컬에서 동일 명령어 실행하여 재현

### SSH 연결 실패

```bash
# 디버그 모드로 연결 테스트
ssh -vvv -i ~/.ssh/crew_deploy_key saint@ws-248-247
```

### Staging 배포 실패

```bash
# 서버에서 로그 확인
ssh saint@ws-248-247
docker logs crew-api-staging
docker logs crew-web-staging
```

---

## 관련 문서

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - 전체 개발 계획
- [BRANCH_PROTECTION.md](./BRANCH_PROTECTION.md) - 브랜치 보호 상세
- [SECRETS.md](./SECRETS.md) - 시크릿 관리
- [DEPLOYMENT_KO.md](./DEPLOYMENT_KO.md) - 배포 가이드
