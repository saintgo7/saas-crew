<!-- 프로젝트 현재 상태 및 마무리 가이드 — 포트폴리오 스윕 자동 생성 -->
# STATUS — saas-crew

> 작성: 2026-06-14 (claude/sweep-2026-06-13 브랜치, 자동 포트폴리오 스윕)
> 본 문서는 검증된 사실만 기록한다. 미검증 항목은 "미검증"으로 표시한다.

## 목적 (Purpose)

항공사 객실 승무원 관리 SaaS다. 세 도메인을 다룬다.
- 스케줄: 비행편 생성·승무원 배정·확정 (`flight-service.ts`).
- 자격: 자격증 부여·만료 임박 조회·교육 이력 (`qualification-service.ts`).
- 정산: 비행 수당 계산(기본급 + 야간 가산 + 장거리 가산)·월 집계 (`payment-service.ts`).

스택은 Next.js 14 App Router + Drizzle ORM(PostgreSQL) + NextAuth v5(Credentials, JWT 세션) + Tailwind다. Docker self-host 배포를 전제로 한다. 이 저장소는 vibe.abada.kr Topic Mode로 16개 설계 문서가 먼저 자동 생성되고, 이후 Sprint 0~7에 걸쳐 코드 스캐폴드가 수동으로 채워진 형태다.

## 현재 상태 (Current State)

핵심 비즈니스 로직(서비스 3종)과 API 라우트 6종, 프론트 페이지 3종(`/flights`, `/payments`, `/login`)이 존재한다. NextAuth v5 Credentials 로그인과 `/api/auth/signup`이 마지막 커밋(Sprint 7)에서 활성화됐다.

### 동작하는 것 (Works) — 검증 근거 포함
- **프로덕션 빌드 성공**: `npx next build` 종료코드 0. 11개 라우트 전부 컴파일·정적 생성 완료(`/`, `/flights`, `/login`, `/payments` + API 6종 + `_not-found`). 이 스윕에서 직접 실행해 확인했다.
- **의존성 설치**: `npm install` 44초에 466 패키지 설치 완료. `package-lock.json`을 이 브랜치에 커밋해 재현성을 확보했다.
- **수당 계산 로직**: `calculatePayment`는 야간(출/도착 22:00~06:00 UTC)·장거리(6시간 이상) 가산을 직급별 요율표로 계산한다. 순수 함수 부분의 로직은 읽고 확인했다(런타임 단위 테스트는 미검증, 아래 참조).

### 동작하지 않거나 미검증인 것 (Doesn't Work / Unverified)
- **테스트 0개**: `package.json`의 `test` 스크립트는 `vitest`지만 `*.test.ts` 파일이 한 개도 없다. `npm test`는 "테스트 없음"으로 끝난다. 트리아지의 `has tests: true`는 테스트 *스크립트* 존재를 의미할 뿐, 실제 테스트는 없다.
- **DB 연동 실행 경로 미검증**: 모든 서비스 함수는 실제 PostgreSQL을 요구한다. 이 스윕은 DB 컨테이너를 띄우지 않았으므로 `db:seed`·API 라우트의 런타임 동작은 미검증이다.
- **타입 체크(strict) 실패**: `npx tsc --noEmit`는 다수 오류를 낸다. 대부분 Drizzle `$inferInsert` 추론이 일부 컬럼만 잡는 알려진 타입 잡음이며, `next.config.js`의 `typescript.ignoreBuildErrors: true`로 빌드에서 무시된다. 단, `src/lib/auth/config.ts:27`의 `next-auth/jwt` 모듈 augmentation 오류와 `config.ts:84-85`의 `unknown→string/Role` 오류는 NextAuth v5 베타 타입과의 실제 불일치로 보인다(런타임 영향은 미검증).

### 이 스윕에서 고친 것 (Fixed in this sweep)
- **`src/db/seed.ts`의 잘못된 role 값**: `role: 'A'`(사무장)·`role: 'U'`(승무원)는 DB `roleEnum`(`G, CA, SC, QM, PA, SA`)에 없는 값이라, 실제 DB에 시드하면 Postgres enum이 INSERT를 거부한다. 구 역할 모델(U/A) → 현 6역할 모델로의 마이그레이션 누락이다. 김사무장 → `SA`, 이승무원 → `CA`로 매핑해 유효 값으로 교정했다. (이전 2단계 권한 구분 유지: 관리/일반.)
- **`src/lib/http/createHandler.ts`의 데모 세션 role**: `role: 'U' as Role`의 `'U'`는 유효한 `Role`이 아니다. 데모 핸들러가 RBAC에서 막히지 않도록 `'SA'`로 교정했다. (실제 세션 조회는 여전히 TODO다.)
- **`.gitignore`**: 자동 생성물 `next-env.d.ts`, `tsconfig.tsbuildinfo` 추가.

교정 후 `next build`가 여전히 종료코드 0으로 성공함을 재확인했다.

## 알려진 불일치 / 위험 (Known Inconsistencies / Risks) — 변경하지 않고 기록만 함
- **역할 정의 충돌(문서 ↔ 코드)**: `docs/56-auth-permission-rbac.md`는 `SA`=Scheduling Asst(스케줄 보조), `CA`=Cabin Chief(사무장)로 정의한다. 반면 `src/lib/permissions/matrix.ts`는 `SA`=시스템 관리자(level 5), `CA`=객실 승무원(level 1)로 정의한다. **두 정의가 정반대다.** 이는 다중 파일 의미 변경이라 스윕에서 손대지 않았다. 마무리 시 어느 쪽을 정본으로 할지 결정이 필요하다.
- **RBAC 매트릭스가 거의 비어 있음**: `matrix.ts`의 `RBAC_MATRIX`에는 `FN-101` 하나만 있고 나머지는 `// TODO`다. 반면 문서(`51`, `56`)에는 SCH/CERT/PAY/USER/SYS 등 다수 FN-ID가 정의돼 있다. `createHandler`의 RBAC 게이트는 매트릭스에 없는 FN-ID에 대해 기본 `DENY`이므로, 실제로 `FN-1-FLIGHTS`(=`flights/route.ts`) 같은 라우트는 현재 데모 세션(`SA`)에서도 매트릭스에 없어 막힌다(미검증, 코드 흐름상 추정).
- **인증 미연결**: `createHandler`는 NextAuth 세션을 조회하지 않고 하드코딩 데모 세션을 쓴다(`// TODO: 실제 세션 조회`). API는 사실상 무인증 상태다.
- **NextAuth v5 베타 타입**: `next-auth@5.0.0-beta.20` 고정. 베타 API 변경 위험.
- **비밀번호 시드 해시가 placeholder**: 시드 사용자의 `passwordHash`가 `$2a$12$placeholder`라 실제 로그인 불가(시드 데이터 한정).

## 마무리까지 남은 구체적 단계 (Concrete Remaining Steps)
1. 역할 정의 정본 확정 후 `matrix.ts`와 `docs/56`을 1:1 동기화한다. → 검증: 양쪽 `Role` 유니온·설명이 일치.
2. `RBAC_MATRIX`에 문서의 전체 FN-ID를 채운다. → 검증: 각 라우트 `fnId`가 매트릭스에 존재하고 의도한 역할이 `ALLOW`.
3. `createHandler`에서 NextAuth `auth()`로 실제 세션을 조회하도록 교체한다. → 검증: 미인증 요청 401/403, 인증 요청 통과.
4. `src/lib/auth/config.ts`의 타입 오류(jwt augmentation, callback `unknown`) 해소. → 검증: 해당 파일 `tsc` 오류 0.
5. Vitest 단위 테스트 추가(우선 `calculatePayment` 야간/장거리 경계값, `aggregateMonthlyPayout` 월말 계산). → 검증: `npm test` 통과.
6. `docker-compose.dev.yml`로 Postgres 띄우고 `db:push` → `db:seed` → API 스모크 테스트. → 검증: 시드 성공, `/api/flights` GET 200.
7. (선택) `next.config.js`의 `ignoreBuildErrors`를 끄고 Drizzle 타입 잡음 해소.

## 빌드/테스트 명령 (Build/Test)
```bash
npm install                       # 44s, 466 packages (검증됨)
npx next build                    # 종료코드 0 (검증됨)
npm test                          # vitest — 테스트 파일 없음
cp .env.example .env.local
docker-compose -f docker-compose.dev.yml up -d
npm run db:push && npm run db:seed   # DB 필요 (미검증)
```

---

## BOOK / PAPER OUTLINE (기술 보고서 — 산출 가능)

이 저장소는 코드보다 설계 문서(`docs/50~65`, 16편)가 더 두텁다. 아래 보고서는 기존 자료만으로 대부분 작성 가능하다. 각 절에 활용할 기존 자료를 명시한다.

- **1. 서론 — 도메인과 문제 정의**: 항공사 객실 승무원 스케줄·자격·정산의 통합 관리. 자료: `docs/50-project-overview-saas.md`, `README.md`.
- **2. 요구사항과 기능 명세(FN-ID 매트릭스)**: 자료: `docs/51-functional-spec.md`.
- **3. 도메인 모델과 DB 스키마**: 6개 핵심 테이블(users/flights/crew_assignments/flight_payments/qualifications/crew_qualifications/trainings). 자료: `docs/52-db-schema-saas.md` + 실제 `src/db/schema/*.ts`.
- **4. API 설계(Route Handlers)**: 자료: `docs/53-api-spec-saas.md` + 실제 `src/app/api/**`.
- **5. RBAC 권한 모델 — 설계와 현실의 간극**: 6역할 매트릭스. **사례 연구로서 가치 있음**: 문서와 코드의 역할 정의가 정반대로 어긋난 실태(위 "알려진 불일치" 참조)를 "자동 생성 산출물의 표류(drift)" 사례로 분석. 자료: `docs/56-auth-permission-rbac.md` + `src/lib/permissions/matrix.ts`.
- **6. 비행 수당 정산 알고리즘**: 직급별 요율 + 야간/장거리 가산 + 월 집계. 자료: `src/lib/services/payment-service.ts`(실제 구현 존재) + `docs/55-report-system.md`.
- **7. 아키텍처와 인프라**: Mermaid 9개 다이어그램, Docker self-host. 자료: `docs/60-architecture-diagrams-mermaid.md`, `docs/62-code-architecture.md`, `docs/63-infrastructure-patterns.md`, `docs/57-deployment-docker.md`.
- **8. Agent 오케스트레이션 / 개발 워크플로우 / 데이터 운영**: 자료: `docs/61`, `docs/64`, `docs/65`.
- **9. 테스트 계획과 검증 격차**: 계획 문서는 있으나 실제 테스트 0개. 자료: `docs/59-test-plan-saas.md` + 본 STATUS의 검증 결과.
- **10. 결론 — LLM 자동 생성 → 수동 완성의 교훈**: 자동 점수 58/D(`docs/REVIEW.md`)에서 시작해 Sprint 7까지의 진행과 남은 격차.

**도서/논문 잠재력: 높음(high).** 특히 5절(설계-구현 표류)과 10절(LLM 스캐폴드의 완성 과정)은 "AI 자동 생성 코드베이스의 실증 분석"이라는 독립된 사례 연구로 충분한 1차 자료를 이미 보유한다. 단, 모든 정량 주장(빌드 통과, 테스트 0개 등)은 본 STATUS의 검증 근거에 한정해 기술해야 한다(§11 논문 정직성).

---

## English Summary

**Purpose**: A SaaS for airline cabin-crew management — scheduling (flights/assignments), qualifications (grants/expiry/training), and payroll (flight-pay with night & long-haul surcharges). Stack: Next.js 14 App Router + Drizzle (PostgreSQL) + NextAuth v5 (Credentials/JWT) + Tailwind, Docker self-host.

**What works (verified)**: `npm install` succeeds (44s, 466 pkgs); `npx next build` exits 0 with all 11 routes compiled and statically generated. `package-lock.json` committed for reproducibility.

**What doesn't / unverified**: Zero actual tests despite a `vitest` script (triage `has tests:true` only meant the script exists). DB-dependent paths (seed, API runtime) unverified — no Postgres was started. Strict `tsc --noEmit` fails: mostly Drizzle `$inferInsert` type noise (suppressed via `ignoreBuildErrors`), but `src/lib/auth/config.ts` has genuine NextAuth-v5-beta type mismatches.

**Fixed in this sweep (minimal, reversible)**: (1) `src/db/seed.ts` used invalid enum roles `'A'`/`'U'` that the Postgres `roleEnum` would reject at INSERT — remapped to `'SA'`/`'CA'`. (2) `src/lib/http/createHandler.ts` demo session used invalid `'U' as Role` — fixed to `'SA'`. (3) `.gitignore` += build artifacts. Re-ran `next build` → still exit 0.

**Key risk (documented, not changed)**: The role model is defined *oppositely* in docs vs code — `docs/56` says `SA`=Scheduling Asst / `CA`=Cabin Chief, while `matrix.ts` says `SA`=System Admin / `CA`=Cabin Crew. Also `RBAC_MATRIX` is nearly empty (only `FN-101`), and `createHandler` does not yet read the real NextAuth session (hardcoded demo session → effectively unauthenticated API).

**Remaining to finish**: reconcile the role model, fill `RBAC_MATRIX`, wire real session into `createHandler`, fix NextAuth type errors, add Vitest unit tests (start with payment surcharge boundaries), then DB smoke test via docker-compose.

**Book/paper potential: high** — the design-vs-implementation drift (esp. the inverted role model) and the LLM-scaffold-to-manual-completion arc are strong, well-documented case-study material; 16 design docs already exist.
