# E2E Testing Setup - WKU Software Crew

## 개요

Playwright를 사용한 종합 E2E 테스트 인프라가 성공적으로 구축되었습니다.

## 설치된 구성 요소

### 1. Playwright 테스트 프레임워크

**버전**: @playwright/test ^1.49.1

**지원 브라우저**:
- Chromium (Chrome, Edge 호환)
- Firefox
- WebKit (Safari 호환)

**모바일 디바이스**:
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- iPad Pro

### 2. 디렉토리 구조

```
apps/web/
├── e2e/
│   ├── config/
│   │   └── test.config.ts          # 테스트 환경 설정
│   ├── fixtures/
│   │   └── auth.ts                 # 인증 모킹 픽스처
│   ├── utils/
│   │   ├── helpers.ts              # 공통 헬퍼 함수
│   │   └── page-objects.ts         # 페이지 객체 모델
│   ├── tests/
│   │   ├── home.spec.ts            # 홈페이지 테스트
│   │   ├── courses.spec.ts         # 코스 페이지 테스트
│   │   ├── community.spec.ts       # 커뮤니티 테스트
│   │   ├── navigation.spec.ts      # 네비게이션 테스트
│   │   ├── authenticated.spec.ts   # 인증 사용자 테스트
│   │   ├── search.spec.ts          # 검색 기능 테스트
│   │   ├── performance.spec.ts     # 성능 테스트
│   │   └── accessibility.spec.ts   # 접근성 테스트
│   └── README.md                   # 상세 문서
├── playwright.config.ts            # Playwright 설정
└── E2E_TESTING_SETUP.md           # 이 파일
```

### 3. 테스트 커버리지

#### 핵심 사용자 시나리오

1. **비인증 사용자 플로우**
   - 홈페이지 탐색
   - 코스 목록 브라우징
   - 레벨별 필터링 (Junior/Senior/Master)
   - 커뮤니티 게시글 조회
   - 검색 기능 사용
   - 페이지 간 네비게이션

2. **인증 사용자 플로우** (OAuth 모킹)
   - 대시보드 접근
   - 코스 수강 신청
   - 커뮤니티 게시글 작성
   - 댓글 작성
   - 좋아요 기능
   - 프로필 정보 조회

3. **검색 기능**
   - 커뮤니티 게시글 검색
   - 코스 검색
   - 한글/영문 검색
   - 검색 결과 필터링

4. **성능 테스트**
   - 페이지 로딩 시간
   - First Contentful Paint (FCP)
   - Layout Shift (CLS)
   - 번들 사이즈 확인
   - 네트워크 요청 최적화

5. **접근성 테스트**
   - 헤딩 계층 구조
   - 이미지 alt 텍스트
   - 키보드 네비게이션
   - ARIA 속성
   - 색상 대비
   - 폼 레이블

### 4. CI/CD 통합

#### GitHub Actions 워크플로우

파일 위치: `.github/workflows/e2e-tests.yml`

**자동 실행 조건**:
- main/develop 브랜치 push
- Pull Request 생성
- apps/web 디렉토리 변경 시

**실행되는 테스트**:
1. Chromium, Firefox, WebKit 브라우저 테스트 (병렬)
2. 모바일 디바이스 테스트 (Mobile Chrome, Mobile Safari)
3. Lighthouse CI (성능 감사)
4. 접근성 테스트

**아티팩트**:
- HTML 테스트 리포트
- 실패 시 스크린샷
- 실패 시 비디오 녹화
- JSON/JUnit 테스트 결과

## 사용 방법

### 초기 설정

```bash
# 1. 웹 앱 디렉토리로 이동
cd apps/web

# 2. Playwright 브라우저 설치
npx playwright install

# 3. 시스템 종속성 포함 설치 (Linux)
npx playwright install --with-deps
```

### 테스트 실행

```bash
# 모든 테스트 실행
npm run test:e2e

# 특정 브라우저
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# UI 모드 (대화형 디버깅)
npm run test:e2e:ui

# 디버그 모드
npm run test:e2e:debug

# Headed 모드 (브라우저 창 표시)
npm run test:e2e:headed

# 특정 테스트 파일
npm run test:e2e tests/home.spec.ts

# 특정 테스트 케이스
npm run test:e2e -g "should display hero section"

# 리포트 보기
npm run test:e2e:report
```

### 개발 워크플로우

1. **로컬 개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **별도 터미널에서 테스트 실행**
   ```bash
   npm run test:e2e
   ```

3. **특정 기능 테스트 작성**
   ```bash
   # e2e/tests/ 디렉토리에 새 .spec.ts 파일 생성
   # 페이지 객체 모델 및 헬퍼 함수 활용
   ```

4. **테스트 실행 및 검증**
   ```bash
   npm run test:e2e tests/your-new-test.spec.ts
   ```

## 주요 기능

### 1. 인증 모킹

GitHub OAuth 없이 인증 상태 테스트:

```typescript
import { test, expect, mockUsers } from '../fixtures/auth'

test('authenticated test', async ({ juniorUser }) => {
  // juniorUser는 이미 로그인된 상태
  await juniorUser.goto('/dashboard')
})
```

### 2. 페이지 객체 모델

재사용 가능한 페이지 컴포넌트:

```typescript
import { HomePage } from '../utils/page-objects'

const homePage = new HomePage(page)
await homePage.goto()
await homePage.clickStartButton()
```

### 3. API 모킹

네트워크 요청 모킹:

```typescript
import { mockApiResponse } from '../utils/helpers'

await mockApiResponse(page, 'api/courses', mockData)
```

### 4. 크로스 브라우저 테스트

설정 없이 자동으로 모든 브라우저에서 실행됩니다.

### 5. 모바일 반응형 테스트

```typescript
await page.setViewportSize({ width: 375, height: 667 })
```

### 6. 성능 모니터링

```typescript
const startTime = Date.now()
await page.goto('/')
const loadTime = Date.now() - startTime
expect(loadTime).toBeLessThan(3000)
```

### 7. 접근성 검증

```typescript
// 헤딩 계층, ARIA 속성, 키보드 네비게이션 등
await expect(page.locator('h1')).toBeVisible()
```

## 테스트 작성 가이드라인

### 1. 명명 규칙

```typescript
test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // 테스트 코드
  })
})
```

### 2. AAA 패턴

```typescript
test('example', async ({ page }) => {
  // Arrange (준비)
  await page.goto('/courses')

  // Act (실행)
  await page.click('button')

  // Assert (검증)
  await expect(page).toHaveURL('/courses/1')
})
```

### 3. 선택자 우선순위

1. 사용자 대상: `getByRole`, `getByLabel`, `getByText`
2. 테스트 ID: `data-testid` 속성
3. CSS 선택자 (최후의 수단)

### 4. 대기 처리

```typescript
// 좋음
await page.waitForSelector('selector', { state: 'visible' })

// 피해야 함
await page.waitForTimeout(3000)
```

## 성능 최적화

### 병렬 실행

```typescript
// playwright.config.ts
fullyParallel: true,
workers: process.env.CI ? 1 : 4,
```

### 브라우저 재사용

```typescript
webServer: {
  reuseExistingServer: !process.env.CI,
}
```

### 선택적 테스트 실행

```bash
# 특정 태그만 실행
npm run test:e2e -- --grep "@smoke"

# 태그 제외
npm run test:e2e -- --grep-invert "@slow"
```

## CI/CD 통합 상세

### 워크플로우 단계

1. **코드 체크아웃**
2. **Node.js 설정 및 의존성 설치**
3. **Playwright 브라우저 설치**
4. **애플리케이션 빌드**
5. **E2E 테스트 실행** (병렬)
6. **테스트 결과 업로드**
7. **실패 시 스크린샷/비디오 업로드**

### 매트릭스 전략

```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
```

각 브라우저가 독립적으로 테스트됩니다.

## 트러블슈팅

### 테스트가 느린 경우

```bash
npm run test:e2e -- --workers=4
```

### 브라우저 설치 문제

```bash
npx playwright install --with-deps
```

### 타임아웃 에러

```typescript
// playwright.config.ts
timeout: 60 * 1000,
```

### 로컬에서 CI 재현

```bash
CI=true npm run test:e2e
```

## 리포팅

### HTML 리포트

```bash
npm run test:e2e:report
```

### JSON 리포트

위치: `test-results/e2e-results.json`

### JUnit XML

위치: `test-results/e2e-results.xml`

## 향후 개선 사항

1. **Visual Regression Testing**: 스크린샷 비교 추가
2. **API 계약 테스트**: MSW를 통한 API 모킹 강화
3. **테스트 데이터 관리**: 전용 테스트 데이터베이스
4. **코드 커버리지**: E2E 커버리지 리포팅
5. **성능 벤치마크**: 시간 경과에 따른 성능 추이

## 참고 자료

- [E2E 테스트 상세 문서](./e2e/README.md)
- [Playwright 공식 문서](https://playwright.dev)
- [GitHub Actions 워크플로우](../.github/workflows/e2e-tests.yml)

## 문의

테스트 관련 질문이나 이슈가 있으면 GitHub Issues에 등록해주세요.
