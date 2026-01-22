# E2E Testing Quick Start Guide

## 빠른 시작

### 1. Playwright 브라우저 설치

```bash
cd apps/web
npx playwright install
```

### 2. 개발 서버 실행

```bash
# 터미널 1
npm run dev
```

### 3. 테스트 실행

```bash
# 터미널 2
npm run test:e2e
```

## 주요 명령어

```bash
# 모든 테스트 실행
npm run test:e2e

# UI 모드 (추천)
npm run test:e2e:ui

# 특정 브라우저만
npm run test:e2e -- --project=chromium

# 특정 파일만
npm run test:e2e tests/home.spec.ts

# 리포트 보기
npm run test:e2e:report
```

## 테스트 파일 목록

| 파일 | 설명 | 테스트 수 |
|------|------|----------|
| home.spec.ts | 홈페이지 기능 | 12 |
| courses.spec.ts | 코스 페이지 | 15 |
| community.spec.ts | 커뮤니티 | 18 |
| navigation.spec.ts | 네비게이션 | 20 |
| authenticated.spec.ts | 인증 사용자 | 15 |
| search.spec.ts | 검색 기능 | 18 |
| performance.spec.ts | 성능 테스트 | 12 |
| accessibility.spec.ts | 접근성 | 16 |

**총 126개 이상의 테스트 케이스**

## 브라우저별 실행

```bash
# Chromium (Chrome/Edge)
npm run test:e2e -- --project=chromium

# Firefox
npm run test:e2e -- --project=firefox

# WebKit (Safari)
npm run test:e2e -- --project=webkit

# 모바일
npm run test:e2e -- --project="Mobile Chrome"
npm run test:e2e -- --project="Mobile Safari"
```

## 디버깅

```bash
# 디버그 모드 (단계별 실행)
npm run test:e2e:debug

# Headed 모드 (브라우저 표시)
npm run test:e2e:headed

# UI 모드 (가장 편리)
npm run test:e2e:ui
```

## 특정 테스트만 실행

```bash
# 테스트 이름으로 필터
npm run test:e2e -g "should display hero section"

# 파일 + 테스트 이름
npm run test:e2e tests/home.spec.ts -g "hero"
```

## CI/CD

GitHub에 push하면 자동으로 실행됩니다.

```bash
# 로컬에서 CI 환경 재현
CI=true npm run test:e2e
```

## 문제 해결

### Playwright 재설치

```bash
npx playwright install --with-deps
```

### 포트 충돌

```bash
# .env.local에서 포트 변경
BASE_URL=http://localhost:3001
```

### 타임아웃

```typescript
// playwright.config.ts에서 타임아웃 증가
timeout: 60 * 1000
```

## 더 자세한 정보

- [E2E 전체 문서](./e2e/README.md)
- [설정 가이드](./E2E_TESTING_SETUP.md)
