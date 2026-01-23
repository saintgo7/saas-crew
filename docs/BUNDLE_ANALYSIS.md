# Bundle Analysis Report

프론트엔드 번들 크기 분석 및 최적화 리포트입니다.

## 분석 방법

번들 분석 실행:
```bash
cd apps/web
pnpm analyze
```

개별 분석:
```bash
pnpm analyze:browser  # 브라우저 번들 분석
pnpm analyze:server   # 서버 번들 분석
```

## 목표 지표

| Metric | Target | Critical |
|--------|--------|----------|
| Total Bundle (gzip) | < 300KB | < 400KB |
| First Load JS | < 200KB | < 300KB |
| Largest Page Bundle | < 150KB | < 200KB |

## 번들 크기 (측정 필요)

### Before Optimization

| Route | First Load JS | Shared JS | Route JS |
|-------|---------------|-----------|----------|
| / | TBD | TBD | TBD |
| /projects | TBD | TBD | TBD |
| /courses | TBD | TBD | TBD |
| /courses/[slug] | TBD | TBD | TBD |
| /community | TBD | TBD | TBD |

### After Optimization

| Route | First Load JS | Shared JS | Route JS | Change |
|-------|---------------|-----------|----------|--------|
| / | TBD | TBD | TBD | TBD |
| /projects | TBD | TBD | TBD | TBD |
| /courses | TBD | TBD | TBD | TBD |
| /courses/[slug] | TBD | TBD | TBD | TBD |
| /community | TBD | TBD | TBD | TBD |

## 큰 의존성 (>50KB)

| Package | Size (gzip) | Usage | Optimization |
|---------|-------------|-------|--------------|
| react + react-dom | ~45KB | Core | Required |
| next | ~85KB | Framework | Required |
| lucide-react | ~30KB | Icons | Tree-shaking enabled |
| @tanstack/react-query | ~40KB | Data fetching | Required |
| TBD | TBD | TBD | TBD |

## 최적화 전략

### 완료된 최적화

- [x] SWC minifier 활성화
- [x] Tree-shaking 설정
- [x] Code splitting 구성
- [x] Font optimization (display: swap)
- [x] Image optimization (AVIF, WebP)
- [x] Remove console.log in production
- [x] Bundle analyzer 설정
- [x] Package import optimization

### 추가 최적화 계획

- [ ] Dynamic imports for heavy components
- [ ] Route-based code splitting
- [ ] Lazy load non-critical features
- [ ] Optimize third-party scripts
- [ ] Review and remove unused dependencies

## Dynamic Import 후보

### Heavy Components (>20KB)

```typescript
// Before
import { HeavyChart } from '@/components/charts'

// After
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  ssr: false,
  loading: () => <Spinner />,
})
```

### 후보 컴포넌트

1. **Chart Components** - 차트 라이브러리가 큰 경우
2. **Rich Text Editor** - 마크다운 에디터
3. **Admin Components** - 관리자 페이지는 일반 사용자에게 불필요
4. **Analytics** - 분석 대시보드

## 폰트 최적화

### 현재 설정

```typescript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})
```

### 개선 사항

- [x] font-display: swap 적용
- [x] Preload 활성화
- [x] CSS 변수로 폰트 정의
- [ ] 필요한 경우 subset 최적화 (한글 추가?)

## 이미지 최적화

### 현재 설정

```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24 * 30,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### 개선 사항

- [x] AVIF, WebP 포맷 지원
- [x] Responsive image sizes
- [x] Long-term caching (30 days)
- [ ] Placeholder blur 적용
- [ ] Priority loading for above-fold images

## Code Splitting 전략

### Vendor Chunk

```javascript
vendor: {
  name: 'vendor',
  chunks: 'all',
  test: /node_modules/,
  priority: 20,
}
```

### Common Chunk

```javascript
common: {
  name: 'common',
  minChunks: 2,
  chunks: 'all',
  priority: 10,
  reuseExistingChunk: true,
}
```

## 권장 사항

### Immediate Actions

1. 번들 분석 실행 및 큰 의존성 식별
2. Dynamic import 적용 (Admin, Charts, Editor)
3. 미사용 의존성 제거

### Medium-term

1. Route-based code splitting 검토
2. Third-party script 최적화
3. CSS 최적화 (PurgeCSS)

### Long-term

1. Micro-frontend 고려 (Admin 분리)
2. Progressive Web App (PWA) 구현
3. Service Worker 캐싱

## 측정 이력

| Date | Total Bundle | First Load | Changes |
|------|--------------|------------|---------|
| 2026-01-23 | TBD | TBD | Initial optimization setup |

## 다음 단계

1. `pnpm analyze` 실행하여 현재 번들 크기 측정
2. 큰 의존성 식별 및 최적화 우선순위 결정
3. Dynamic import 적용
4. 재측정 및 목표 달성 확인

---

Last Updated: 2026-01-23
