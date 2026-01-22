# E2E Testing Documentation

WKU Software Crew 프론트엔드 애플리케이션의 종합 E2E 테스트 인프라입니다.

## 개요

Playwright를 사용한 크로스 브라우저, 크로스 디바이스 E2E 테스트 프레임워크입니다.

### 주요 기능

- **다중 브라우저 테스트**: Chromium, Firefox, WebKit
- **모바일 뷰포트 테스트**: iPhone, Pixel, iPad
- **자동 재시도**: CI 환경에서 2회 재시도
- **스크린샷 및 비디오**: 실패 시 자동 캡처
- **병렬 실행**: 빠른 테스트 실행
- **인증 모킹**: GitHub OAuth 없이 인증 상태 테스트

## 디렉토리 구조

```
e2e/
├── fixtures/           # 테스트 픽스처
│   └── auth.ts        # 인증 모킹 헬퍼
├── utils/             # 유틸리티 함수
│   ├── helpers.ts     # 공통 헬퍼 함수
│   └── page-objects.ts # 페이지 객체 모델
└── tests/             # 실제 테스트 파일
    ├── home.spec.ts           # 홈페이지 테스트
    ├── courses.spec.ts        # 코스 페이지 테스트
    ├── community.spec.ts      # 커뮤니티 테스트
    ├── navigation.spec.ts     # 네비게이션 테스트
    ├── authenticated.spec.ts  # 인증 사용자 테스트
    └── search.spec.ts         # 검색 기능 테스트
```

## 설치 및 설정

### 1. Playwright 설치

```bash
cd apps/web
npm install -D @playwright/test
```

### 2. 브라우저 설치

```bash
npx playwright install
```

특정 브라우저만 설치:
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### 3. 환경 변수 설정

`.env.local` 파일에 다음 변수 추가:

```bash
BASE_URL=http://localhost:3000
```

## 테스트 실행

### 모든 테스트 실행

```bash
npm run test:e2e
```

### 특정 브라우저에서 실행

```bash
# Chromium만
npm run test:e2e -- --project=chromium

# Firefox만
npm run test:e2e -- --project=firefox

# WebKit만
npm run test:e2e -- --project=webkit
```

### 모바일 디바이스 테스트

```bash
npm run test:e2e -- --project="Mobile Chrome"
npm run test:e2e -- --project="Mobile Safari"
npm run test:e2e -- --project="iPad"
```

### UI 모드로 실행 (디버깅)

```bash
npm run test:e2e:ui
```

### 디버그 모드

```bash
npm run test:e2e:debug
```

### Headed 모드 (브라우저 창 표시)

```bash
npm run test:e2e:headed
```

### 특정 테스트 파일 실행

```bash
npm run test:e2e tests/home.spec.ts
```

### 특정 테스트 케이스 실행

```bash
npm run test:e2e -g "should display hero section"
```

## 테스트 작성 가이드

### 1. 기본 테스트 구조

```typescript
import { test, expect } from '@playwright/test'
import { waitForPageLoad } from '../utils/helpers'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path')
    await waitForPageLoad(page)
  })

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.locator('selector')

    // Act
    await element.click()

    // Assert
    await expect(element).toBeVisible()
  })
})
```

### 2. 페이지 객체 모델 사용

```typescript
import { HomePage } from '../utils/page-objects'

test('should navigate', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await homePage.clickStartButton()
})
```

### 3. 인증된 사용자 테스트

```typescript
import { test, expect, mockUsers } from '../fixtures/auth'

test('should access dashboard', async ({ juniorUser }) => {
  await juniorUser.goto('/dashboard')
  // juniorUser는 이미 인증된 상태
})
```

### 4. API 모킹

```typescript
import { mockApiResponse } from '../utils/helpers'

test('should display data', async ({ page }) => {
  await mockApiResponse(page, 'api/courses', mockData)
  await page.goto('/courses')
  // API 응답이 모킹됨
})
```

## 유용한 헬퍼 함수

### waitForPageLoad

페이지 완전 로딩 대기:

```typescript
await waitForPageLoad(page)
```

### navigateTo

페이지 이동 및 로딩 대기:

```typescript
await navigateTo(page, '/courses')
```

### typeWithDelay

사람처럼 타이핑:

```typescript
await typeWithDelay(page, 'input', 'Hello World', 50)
```

### expectTextVisible

텍스트 표시 확인:

```typescript
await expectTextVisible(page, 'Welcome')
```

### scrollToElement

요소로 스크롤:

```typescript
await scrollToElement(page, '.footer')
```

## 모범 사례

### 1. 선택자 우선순위

1. 사용자 대상 속성: `getByRole`, `getByLabel`, `getByPlaceholder`
2. 테스트 ID: `data-testid` 속성
3. CSS 선택자 (최후의 수단)

```typescript
// 좋음
await page.getByRole('button', { name: '로그인' }).click()

// 괜찮음
await page.locator('[data-testid="login-button"]').click()

// 피해야 함
await page.locator('.btn.btn-primary').click()
```

### 2. 대기 처리

```typescript
// 좋음
await page.waitForSelector('selector', { state: 'visible' })

// 피해야 함
await page.waitForTimeout(3000)
```

### 3. 독립적인 테스트

각 테스트는 다른 테스트에 의존하지 않아야 합니다:

```typescript
test.beforeEach(async ({ page }) => {
  // 매 테스트마다 초기 상태 설정
  await page.goto('/')
})
```

### 4. 의미 있는 테스트 이름

```typescript
// 좋음
test('should display error message when login fails')

// 나쁨
test('test login')
```

## CI/CD 통합

GitHub Actions 워크플로우가 자동으로 실행됩니다:

- **Push to main/develop**: 전체 E2E 테스트 실행
- **Pull Request**: E2E 테스트 + Lighthouse CI
- **실패 시**: 스크린샷 및 비디오 아티팩트 업로드

### 워크플로우 상태 확인

GitHub Actions 탭에서 테스트 결과를 확인할 수 있습니다.

### 아티팩트 다운로드

실패한 테스트의 스크린샷과 비디오는 Actions 페이지에서 다운로드 가능합니다.

## 테스트 리포트

### HTML 리포트 보기

```bash
npm run test:e2e:report
```

브라우저에서 상세한 테스트 결과를 확인할 수 있습니다.

### 리포트 위치

- HTML: `playwright-report/index.html`
- JSON: `test-results/e2e-results.json`
- JUnit: `test-results/e2e-results.xml`

## 트러블슈팅

### 테스트가 느린 경우

```bash
# 병렬 워커 수 조정
npm run test:e2e -- --workers=4
```

### 브라우저 설치 문제

```bash
# 시스템 종속성 포함 설치
npx playwright install --with-deps
```

### 타임아웃 에러

playwright.config.ts에서 타임아웃 증가:

```typescript
timeout: 60 * 1000, // 60초
```

### 로컬에서 CI 환경 재현

```bash
CI=true npm run test:e2e
```

## 성능 최적화

### 1. 병렬 실행 설정

```typescript
// playwright.config.ts
fullyParallel: true,
workers: process.env.CI ? 1 : 4,
```

### 2. 브라우저 재사용

```typescript
// playwright.config.ts
webServer: {
  reuseExistingServer: !process.env.CI,
}
```

### 3. 테스트 격리

각 테스트는 새로운 브라우저 컨텍스트를 사용합니다.

## 추가 리소스

- [Playwright 공식 문서](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Guide](https://playwright.dev/docs/ci)

## 기여 가이드

새로운 테스트를 추가할 때:

1. 적절한 테스트 파일에 추가하거나 새 파일 생성
2. 페이지 객체 모델 사용
3. 공통 헬퍼 함수 활용
4. 의미 있는 테스트 이름 사용
5. 모든 브라우저에서 테스트 실행 확인

## 문의

테스트 관련 문제나 질문이 있으면 이슈를 생성하거나 팀에 문의하세요.
