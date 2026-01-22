# Swagger API 문서 빠른 시작 가이드

WKU Software Crew API의 Swagger 문서를 5분 안에 확인하는 방법입니다.

## 1단계: 패키지 설치

프로젝트 루트에서:

```bash
cd /Users/saint/01_DEV/saas-crew/apps/api
npm install
```

## 2단계: 개발 서버 실행

```bash
npm run dev
```

서버가 시작되면 다음 메시지가 표시됩니다:

```
WKU Crew API running on http://localhost:4000
API Documentation available at http://localhost:4000/api/docs
```

## 3단계: Swagger UI 열기

브라우저에서 접속:

```
http://localhost:4000/api/docs
```

## 4단계: API 탐색

### 태그별 엔드포인트 그룹

- **Authentication** - GitHub OAuth 인증
- **Users** - 사용자 프로필 관리
- **Projects** - 프로젝트 협업
- **Courses** - 온라인 강좌
- **Chapters** - 강좌 챕터 및 진행률
- **Enrollments** - 강좌 등록
- **Posts** - 커뮤니티 게시글
- **Comments** - 댓글 및 답변
- **Votes** - 투표 시스템

### 엔드포인트 테스트하기

1. 원하는 엔드포인트 클릭
2. "Try it out" 버튼 클릭
3. 파라미터 입력
4. "Execute" 버튼 클릭
5. 응답 확인

## 5단계: 인증 설정 (보호된 엔드포인트용)

### JWT 토큰 획득

먼저 GitHub OAuth로 로그인하여 JWT 토큰을 받아야 합니다:

1. `GET /api/auth/github` 엔드포인트로 이동
2. 브라우저에서 직접 접속: `http://localhost:4000/api/auth/github`
3. GitHub 인증 완료 후 프론트엔드로 리다이렉트됩니다
4. URL에서 `token=` 파라미터의 JWT 토큰 복사

### Swagger에서 인증 설정

1. 페이지 상단의 **"Authorize"** 버튼 클릭
2. "Value" 필드에 JWT 토큰 붙여넣기 (Bearer 제외)
3. **"Authorize"** 버튼 클릭
4. **"Close"** 버튼 클릭

이제 모든 보호된 엔드포인트를 테스트할 수 있습니다!

## 주요 기능

### 1. 스키마 확인

각 엔드포인트를 클릭하면:
- Request body 스키마
- Response 스키마
- 파라미터 설명
- 예제 값

### 2. 실시간 테스트

"Try it out" 기능으로:
- 실제 API 호출
- 응답 확인
- 에러 테스트

### 3. 코드 예제

"Example Value"를 클릭하면:
- JSON 구조 확인
- 복사하여 사용 가능

## OpenAPI 스펙 생성

API 클라이언트 도구에서 사용할 OpenAPI JSON 파일 생성:

```bash
npm run swagger:generate
```

생성된 파일 위치:
```
/Users/saint/01_DEV/saas-crew/apps/api/openapi.json
```

### 사용처

- **Postman**: File > Import > openapi.json
- **Insomnia**: Create > Import From > File
- **OpenAPI Generator**: 클라이언트 SDK 자동 생성
- **API 문서 사이트**: ReDoc, Stoplight 등

## 트러블슈팅

### 서버가 시작되지 않는 경우

1. PostgreSQL이 실행 중인지 확인
2. `.env` 파일의 `DATABASE_URL` 확인
3. 데이터베이스 스키마 푸시: `npm run db:push`

### Swagger UI가 표시되지 않는 경우

1. 브라우저 캐시 삭제
2. 서버 재시작: `Ctrl+C` 후 `npm run dev`
3. 올바른 URL 확인: `http://localhost:4000/api/docs`

### 인증이 작동하지 않는 경우

1. JWT 토큰에 "Bearer" 접두사가 없는지 확인
2. 토큰 만료 여부 확인 (7일 유효)
3. 다시 로그인하여 새 토큰 발급

## 다음 단계

### 상세 문서 읽기

- [API Documentation](./API_DOCUMENTATION.md) - 완전한 API 가이드
- [Swagger Setup Guide](./SWAGGER_SETUP.md) - 개발자 가이드

### API 통합

1. Swagger UI에서 원하는 엔드포인트 테스트
2. Request/Response 형식 확인
3. 프론트엔드 코드에서 API 호출 구현

### 예제 요청

**사용자 프로필 조회:**
```bash
curl http://localhost:4000/api/users/:userId
```

**프로젝트 생성 (인증 필요):**
```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "slug": "my-project",
    "description": "A sample project"
  }'
```

**게시글 목록 조회:**
```bash
curl http://localhost:4000/api/posts?page=1&limit=10
```

## 요약

1. `npm install` - 패키지 설치
2. `npm run dev` - 서버 실행
3. `http://localhost:4000/api/docs` - Swagger UI 열기
4. 엔드포인트 탐색 및 테스트
5. (선택) `npm run swagger:generate` - OpenAPI 스펙 생성

**API 문서화 완료! 즐거운 개발 되세요!**
