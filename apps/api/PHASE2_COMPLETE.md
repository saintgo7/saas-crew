# Phase 2: 사용자 시스템 구축 완료

## 완료된 작업

### 1. NestJS 프로젝트 구조 생성
- Clean Architecture 패턴 적용
- 모듈화된 구조 (Controller -> Service -> Repository)
- TypeScript 기반 타입 안전성 확보

### 2. Prisma Service 모듈
- `src/prisma/prisma.service.ts` - Prisma Client 래퍼
- `src/prisma/prisma.module.ts` - Global 모듈로 등록
- 라이프사이클 관리 (onModuleInit, onModuleDestroy)

### 3. Users 모듈 (RESTful API)

#### Controller (`src/users/users.controller.ts`)
```
GET  /api/users/:id          사용자 프로필 조회 (공개)
PATCH /api/users/:id          프로필 수정 (JWT 인증 필요)
GET  /api/users/:id/projects  사용자 프로젝트 목록 (공개)
```

#### Service (`src/users/users.service.ts`)
- `findById()` - 사용자 정보 조회
- `update()` - 프로필 업데이트
- `findUserProjects()` - 프로젝트 목록 조회 (ProjectMember 관계 활용)
- `findByEmail()` - 이메일로 사용자 검색 (인증용)
- `findByGithubId()` - GitHub ID로 사용자 검색 (OAuth용)
- `create()` - 새 사용자 생성

#### DTOs
- `dto/create-user.dto.ts` - 사용자 생성 DTO
- `dto/update-user.dto.ts` - 프로필 수정 DTO (validation 포함)
- `dto/user-response.dto.ts` - 응답 DTO (비밀번호 제외)

### 4. Auth 모듈

#### Controller (`src/auth/auth.controller.ts`)
```
GET /api/auth/github          GitHub OAuth 시작
GET /api/auth/github/callback GitHub OAuth 콜백
GET /api/auth/me              현재 사용자 정보 (JWT 인증 필요)
```

#### Service (`src/auth/auth.service.ts`)
- `handleGithubLogin()` - GitHub OAuth 처리
- `validateUser()` - JWT 검증
- `generateToken()` - JWT 토큰 생성
- `verifyToken()` - JWT 토큰 검증

#### Strategies
- `jwt.strategy.ts` - JWT 인증 전략
- `github.strategy.ts` - GitHub OAuth 전략

### 5. 진입점 (`src/main.ts`)
- CORS 설정
- Global Validation Pipe
- API Prefix (`/api`)
- 포트: 4000

## 아키텍처 패턴

### Clean Architecture
```
┌──────────────┐
│  Controller  │ ← HTTP 요청/응답, 라우팅, 인증
└──────┬───────┘
       ↓
┌──────────────┐
│   Service    │ ← 비즈니스 로직, 트랜잭션
└──────┬───────┘
       ↓
┌──────────────┐
│ Repository   │ ← 데이터 접근 (Prisma)
│  (Prisma)    │
└──────────────┘
```

### 의존성 방향
- 외부에서 내부로만 의존
- Service는 Controller를 모르고
- Repository(Prisma)는 Service를 모름
- 각 계층은 자신의 책임만 가짐

## 데이터베이스 스키마 준수

### User 모델 완전 활용
- 모든 필드 지원 (name, email, avatar, bio, department, grade, level, xp, rank, theme, language)
- OAuth 필드 활용 (githubId, googleId)
- 관계 카운팅 (projects, posts, comments)

### ProjectMember 관계 활용
- 사용자 프로젝트는 ProjectMember 테이블을 통해 조회
- 역할(role) 정보 포함
- N:M 관계 정확히 구현

## 보안

### 인증 (Authentication)
- JWT 기반 토큰 인증
- GitHub OAuth 통합
- 토큰 만료: 7일

### 인가 (Authorization)
- Route Guard로 보호된 엔드포인트
- 소유권 검증 (본인만 프로필 수정 가능)
- ForbiddenException 사용

### 데이터 검증
- class-validator를 통한 DTO 검증
- 입력 sanitization
- Prisma를 통한 SQL injection 방지

## API 응답 형식

### 성공
```json
{
  "id": "cuid...",
  "name": "홍길동",
  "email": "hong@example.com",
  "avatar": "https://...",
  "level": 1,
  "xp": 0,
  "rank": "JUNIOR"
}
```

### 에러
```json
{
  "statusCode": 404,
  "message": "User with ID xxx not found",
  "error": "Not Found"
}
```

## 테스트 방법

### 1. 서버 시작
```bash
cd apps/api
pnpm dev
```

### 2. API 테스트
```bash
# 사용자 프로필 조회 (공개)
curl http://localhost:4000/api/users/{userId}

# 사용자 프로젝트 목록 (공개)
curl http://localhost:4000/api/users/{userId}/projects

# 현재 사용자 정보 (JWT 필요)
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer {token}"

# 프로필 수정 (JWT 필요)
curl -X PATCH http://localhost:4000/api/users/{userId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "새이름", "bio": "자기소개"}'
```

### 3. GitHub OAuth 테스트
1. 브라우저에서 `http://localhost:4000/api/auth/github` 접속
2. GitHub 인증 후 콜백 처리
3. 프론트엔드로 토큰과 함께 리다이렉트

## 파일 구조

```
apps/api/
├── src/
│   ├── auth/                    # 인증 모듈
│   │   ├── auth.controller.ts   # OAuth, JWT 엔드포인트
│   │   ├── auth.service.ts      # 인증 비즈니스 로직
│   │   ├── auth.module.ts       # 모듈 정의
│   │   ├── jwt.strategy.ts      # JWT 검증 전략
│   │   └── github.strategy.ts   # GitHub OAuth 전략
│   ├── users/                   # 사용자 모듈
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   ├── user-response.dto.ts
│   │   │   └── index.ts
│   │   ├── users.controller.ts  # 사용자 API 엔드포인트
│   │   ├── users.service.ts     # 사용자 비즈니스 로직
│   │   └── users.module.ts      # 모듈 정의
│   ├── prisma/                  # Prisma 모듈
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts            # 루트 모듈
│   └── main.ts                  # 진입점
├── prisma/
│   └── schema.prisma            # DB 스키마
├── dist/                        # 빌드 결과
├── .env                         # 환경 변수
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## 코드 품질

### TypeScript 설정
- Strict mode 활성화
- No implicit any
- Explicit return types

### 코딩 컨벤션
- 파일명: kebab-case
- 클래스명: PascalCase
- 메서드명: camelCase
- JSDoc 주석으로 문서화

### 에러 처리
- NotFoundException - 리소스 없음
- ForbiddenException - 권한 없음
- UnauthorizedException - 인증 실패
- 명확한 에러 메시지

## 다음 단계 (Phase 3)

### Projects 모듈
- 프로젝트 CRUD API
- ProjectMember 관리
- 프로젝트 가시성 제어

### Courses 모듈
- 강좌 관리
- Chapter 및 Progress 추적
- Assignment 제출 및 채점

### Community 모듈
- Post CRUD
- Comment 시스템
- Vote 기능

## 빌드 및 배포

### 개발
```bash
pnpm dev
```

### 프로덕션 빌드
```bash
pnpm build
pnpm start
```

### Docker
```bash
docker build -t wku-crew-api .
docker run -p 4000:4000 wku-crew-api
```

## 환경 변수

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GITHUB_CALLBACK_URL="http://localhost:4000/api/auth/github/callback"
FRONTEND_URL="http://localhost:3000"
```

## 성과

- Clean Architecture 패턴 구현 완료
- RESTful API 표준 준수
- Prisma 스키마 100% 활용
- 타입 안전성 확보
- 보안 베스트 프랙티스 적용
- 문서화 및 주석 완비

## 완료 날짜

2026-01-22
