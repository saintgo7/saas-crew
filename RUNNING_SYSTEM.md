# WKU Software Crew - 실행 시스템 가이드

**작성일**: 2026-01-22
**상태**: ✅ 전체 시스템 실행 중

---

## 현재 실행 중인 서비스

### Frontend (Next.js 14)
- **URL**: http://localhost:3000
- **프로세스**: Running in background
- **상태**: ✓ Ready

### Backend (NestJS)
- **URL**: http://localhost:4000
- **프로세스**: Running in background (PID in output file)
- **상태**: ✓ Ready

### Database (PostgreSQL 16)
- **컨테이너**: wku-postgres
- **포트**: 5433 (외부) → 5432 (내부)
- **사용자**: wku_user
- **비밀번호**: wku_pass123
- **데이터베이스**: wku_crew
- **상태**: ✓ Running

---

## 접속 가능한 페이지

### 메인 페이지
http://localhost:3000

### 대시보드
http://localhost:3000/dashboard
- 프로필 위젯
- 내 프로젝트
- 코스 진행률
- 레벨 진행률

### 코스 시스템
http://localhost:3000/courses
- 코스 목록 (Junior/Senior/Master 필터)
- 코스 상세 페이지
- 수강 신청/취소
- 진도 추적

### 커뮤니티
http://localhost:3000/community
- Q&A 게시글 목록
- 태그 필터, 검색
- 게시글 작성: http://localhost:3000/community/new
- 게시글 상세 (투표, 댓글, 베스트 답변)

---

## API 엔드포인트 테스트

### Health Check (없음)
```bash
# 서버 실행 확인
curl http://localhost:4000/api/courses
```

### 인증 (JWT 필요)
```bash
curl http://localhost:4000/api/auth/me
# Expected: 401 Unauthorized (JWT 토큰 없음)
```

### Courses API
```bash
# 코스 목록
curl http://localhost:4000/api/courses

# 필터링
curl "http://localhost:4000/api/courses?level=JUNIOR&published=true"
```

### Projects API
```bash
# 프로젝트 목록
curl http://localhost:4000/api/projects

# 검색
curl "http://localhost:4000/api/projects?search=react"
```

### Community API
```bash
# 게시글 목록
curl http://localhost:4000/api/posts

# 태그 필터
curl "http://localhost:4000/api/posts?tags=react,typescript"
```

---

## 서비스 관리

### 서버 중지

**Frontend 중지**
```bash
# 프로세스 찾기
lsof -i :3000
# 프로세스 종료
kill -9 <PID>
```

**Backend 중지**
```bash
# 프로세스 찾기
lsof -i :4000
# 프로세스 종료
kill -9 <PID>
```

**Database 중지**
```bash
docker stop wku-postgres
```

### 서버 재시작

**Frontend 재시작**
```bash
cd /Users/saint/01_DEV/saas-crew
npm run dev
```

**Backend 재시작**
```bash
cd /Users/saint/01_DEV/saas-crew
npm run dev:api
```

**Database 재시작**
```bash
docker start wku-postgres
```

### 전체 시스템 재시작

```bash
# Database 시작
docker start wku-postgres

# 백엔드 + 프론트엔드 동시 실행
cd /Users/saint/01_DEV/saas-crew
npm run dev:all
```

---

## 데이터베이스 관리

### Prisma Studio (GUI)
```bash
cd /Users/saint/01_DEV/saas-crew/apps/api
npm run db:studio
# 브라우저: http://localhost:5555
```

### psql 직접 접속
```bash
docker exec -it wku-postgres psql -U wku_user -d wku_crew
```

### 마이그레이션 실행
```bash
cd /Users/saint/01_DEV/saas-crew/apps/api
npm run db:migrate
```

### 데이터 초기화
```bash
docker exec -it wku-postgres psql -U wku_user -d wku_crew -c "
  TRUNCATE TABLE users, projects, courses, posts CASCADE;
"
```

---

## 환경 변수

### Backend (.env)
```bash
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://wku_user:wku_pass123@localhost:5433/wku_crew?schema=public"
JWT_SECRET="dev-jwt-secret-8KpZjH+4Xq2Nm9Lw3Tv6Yr1Uc5Bg0Oe8"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:4000/api/auth/github/callback"
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 트러블슈팅

### 포트 충돌
```bash
# 3000 포트 확인
lsof -i :3000
kill -9 <PID>

# 4000 포트 확인
lsof -i :4000
kill -9 <PID>
```

### 데이터베이스 연결 실패
```bash
# PostgreSQL 상태 확인
docker ps | grep wku-postgres

# 컨테이너 재시작
docker restart wku-postgres

# 연결 테스트
docker exec wku-postgres psql -U wku_user -d wku_crew -c "SELECT 1;"
```

### Prisma Client 오류
```bash
# Client 재생성
cd /Users/saint/01_DEV/saas-crew/apps/api
npm run db:generate
```

---

## 개발 워크플로우

### 1. 새 기능 개발
```bash
# 1. DB 스키마 수정
vim apps/api/prisma/schema.prisma

# 2. 마이그레이션 생성
npm run db:migrate -- --name new_feature

# 3. 코드 작성
# Backend: apps/api/src/
# Frontend: apps/web/src/

# 4. 서버 자동 재시작 (Watch 모드)
```

### 2. API 테스트
```bash
# REST Client 파일 사용
# apps/api/test/*.http
```

### 3. 프론트엔드 개발
```bash
# 브라우저 자동 새로고침
# http://localhost:3000
```

---

## 배포 준비

### 프로덕션 빌드
```bash
# 백엔드 빌드
cd apps/api
npm run build
npm run start:prod

# 프론트엔드 빌드
cd apps/web
npm run build
npm start
```

### 환경 변수 프로덕션
- DATABASE_URL: 프로덕션 PostgreSQL
- JWT_SECRET: 강력한 랜덤 문자열
- GITHUB_CLIENT_ID/SECRET: 프로덕션 OAuth App
- NODE_ENV: production

---

**업데이트**: 2026-01-22
**버전**: v1.0
**Status**: ✅ Production Ready
