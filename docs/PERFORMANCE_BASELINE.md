# Performance Baseline

성능 측정 베이스라인 문서입니다. 최적화 전후 비교를 위한 기준점을 제공합니다.

## 측정 환경

- **Node.js**: v20.x
- **PostgreSQL**: 16-alpine
- **Hardware**: Local development machine
- **Load**: 10 concurrent connections, 10 seconds duration

## 성능 목표

| Metric | Target | Critical |
|--------|--------|----------|
| API p50 | < 100ms | < 150ms |
| API p95 | < 200ms | < 300ms |
| API p99 | < 500ms | < 1000ms |
| Database Query | < 100ms | < 200ms |
| First Load JS | < 200KB | < 300KB |
| Lighthouse Performance | > 90 | > 80 |

## API 엔드포인트 성능

### Before Optimization (측정 필요)

실행 명령어:
```bash
cd scripts/performance
tsx api-benchmark.ts
```

| Endpoint | Method | p50 | p95 | p99 | RPS | Status |
|----------|--------|-----|-----|-----|-----|--------|
| /api/health | GET | TBD | TBD | TBD | TBD | 🔵 Pending |
| /api/projects | GET | TBD | TBD | TBD | TBD | 🔵 Pending |
| /api/courses | GET | TBD | TBD | TBD | TBD | 🔵 Pending |
| /api/posts | GET | TBD | TBD | TBD | TBD | 🔵 Pending |

### After Optimization

| Endpoint | Method | p50 | p95 | p99 | RPS | Status |
|----------|--------|-----|-----|-----|-----|--------|
| /api/health | GET | TBD | TBD | TBD | TBD | 🔵 Pending |
| /api/projects | GET | TBD | TBD | TBD | TBD | 🔵 Pending |
| /api/courses | GET | TBD | TBD | TBD | TBD | 🔵 Pending |
| /api/posts | GET | TBD | TBD | TBD | TBD | 🔵 Pending |

## 병목 지점

### 데이터베이스 쿼리

실행 명령어:
```bash
cd scripts/db
tsx analyze-queries.ts
```

| Query | Avg Time | p95 | Issues | Solution |
|-------|----------|-----|--------|----------|
| TBD | TBD | TBD | TBD | TBD |

### N+1 쿼리

- [ ] Projects.findAll() - members 포함 시 N+1 발생 가능
- [ ] Courses.findAll() - chapters, enrollments 포함 시 N+1
- [ ] Posts.findAll() - author, votes, comments 포함 시 N+1

## 프론트엔드 성능

### 번들 크기

실행 명령어:
```bash
cd apps/web
pnpm analyze
```

| Bundle | Before | After | Reduction |
|--------|--------|-------|-----------|
| Total | TBD | TBD | TBD |
| First Load JS | TBD | TBD | TBD |
| /projects | TBD | TBD | TBD |
| /courses | TBD | TBD | TBD |

### Lighthouse 점수

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Home | TBD | TBD | TBD | TBD |
| Projects | TBD | TBD | TBD | TBD |
| Courses | TBD | TBD | TBD | TBD |

## 최적화 계획

### Phase 1: 데이터베이스
- [ ] Add indexes to frequently queried fields
- [ ] Eliminate N+1 queries
- [ ] Implement cursor-based pagination
- [ ] Add database query logging

### Phase 2: API
- [ ] Implement Redis caching
- [ ] Add response compression (already done)
- [ ] Optimize Prisma queries
- [ ] Add API response logging

### Phase 3: 프론트엔드
- [ ] Code splitting
- [ ] Dynamic imports for heavy components
- [ ] Image optimization
- [ ] Font optimization
- [ ] Bundle size reduction

### Phase 4: 모니터링
- [ ] Performance logging interceptor
- [ ] Lighthouse CI
- [ ] Automated performance tests
- [ ] Performance regression alerts

## 측정 이력

| Date | Type | Changes | Impact |
|------|------|---------|--------|
| 2026-01-23 | Initial | Baseline measurement setup | N/A |

## 다음 단계

1. API 서버 실행 후 벤치마크 실행
2. 병목 지점 식별
3. 우선순위 기반 최적화 수행
4. 재측정 및 개선 확인

---

Last Updated: 2026-01-23
