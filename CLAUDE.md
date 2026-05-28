# saas-crew - Project Plan

자동 생성 → Sprint 0 부트스트랩

## Project Overview

항공사 객실 승무원 관리 SaaS (스케줄 + 자격 + 정산)

- 패턴: sap-16doc
- 자동 점수 목표: 90+

## 1. Technology Stack

| 항목 | 기술 |
|------|------|
| Frontend | Next.js 14 + Tailwind + shadcn/ui |
| Backend | Next.js Route Handlers |
| DB | PostgreSQL 16 + Drizzle |
| Auth | NextAuth.js v5 |
| Deploy | Docker self-host |

## 2. Project Structure

```
saas-crew/
├── CLAUDE.md
├── README.md
├── package.json
├── drizzle.config.ts
├── docker-compose.dev.yml
├── docs/                    # 16 설계 문서
├── src/
│   ├── app/                 # Next.js App Router
│   ├── db/schema/           # Drizzle pgTable
│   └── lib/
│       ├── permissions/     # ⭐ RBAC matrix.ts
│       └── http/            # createHandler
└── tests/
```

## 3. Database Schema Design

`docs/52-db-schema-saas.md` 참조. 핵심 테이블:
- users / accounts / sessions
- crew_schedules
- qualifications
- payment_records

## 4. Implementation Plan

- Sprint 0: 환경 + 인증 (이번 주)
- Sprint 1-3: 핵심 도메인
- Sprint 4: RBAC 통합
- Sprint 5: 통합 + 배포

## 5. Report System (선택)

스케줄표 PDF 생성: Puppeteer + 한글 폰트.

## 6. Key Technical Challenges

- 6명 역할 매트릭스 1:1 코드 동기화
- 비행 수당 정확 계산 (시간대 / 야간 가산 / 환율)

## 7. Development Rules

- TypeScript strict
- Zod validation 강제
- 파일 800줄 / 함수 50줄
- Conventional Commits

## 8. Documentation Index

docs/50~65 참조.

## 9. File References

기준: app-sap-saas

## 10. Quick Start Commands

```bash
cp .env.example .env.local
docker-compose -f docker-compose.dev.yml up -d
npm install && npm run db:push && npm run dev
```

## 보안 체크리스트

- [ ] 하드코딩 시크릿 0
- [ ] Zod 검증 모든 API
- [ ] RBAC 미들웨어
