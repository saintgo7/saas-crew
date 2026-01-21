# WKU Software Crew - 프로젝트 명세서

## 1. 프로젝트 정의

### 한 줄 정의
> **"원광대학교 학생들이 개인 프로젝트를 통해 Junior → Senior → Master로 성장하는 동아리식 크루 플랫폼"**

### 핵심 가치
- **개인 성장**: 바이브코딩으로 자기 프로젝트 개발
- **크루 문화**: 동아리처럼 함께 배우고 성장
- **레벨 시스템**: 명확한 성장 경로 (Junior/Senior/Master)
- **실전 경험**: 기업 연계 프로젝트 참여 기회

---

## 2. 사용자 유형

### 2.1 학생 (크루 멤버)
```
Junior (Lv.1-10)
├── 프로그래밍 입문자
├── 기본 문법 학습
└── 첫 개인 프로젝트 완성

Senior (Lv.11-30)
├── 중급 개발자
├── 풀스택 프로젝트 경험
└── 크루 내 멘토링 참여

Master (Lv.31-50)
├── 고급 개발자
├── 기업 연계 프로젝트 참여
└── 크루 리더, 신입 멘토링
```

### 2.2 관리자/교수
- 크루 관리
- 코스/프로젝트 승인
- 기업 연계 관리

### 2.3 기업 파트너 (Phase 2)
- 프로젝트 의뢰
- 인턴/채용 연계

---

## 3. 핵심 기능 (우선순위)

### Phase 1: MVP (4주)
```
✅ P0 - 필수
├── 1. 회원가입/로그인 (GitHub OAuth)
├── 2. 프로필 (레벨, 스킬, 소개)
├── 3. 코스 시스템 (Junior/Senior/Master)
├── 4. 프로젝트 등록 및 관리
└── 5. 크루 대시보드
```

### Phase 2: 핵심 기능 (4주)
```
✅ P1 - 중요
├── 6. 프로젝트 쇼케이스 (포트폴리오)
├── 7. 레벨업 시스템 (XP, 배지)
├── 8. 크루원 활동 피드
├── 9. 프로젝트 리뷰/피드백
└── 10. 간단한 Q&A
```

### Phase 3: 확장 (이후)
```
⏸️ P2 - 나중에
├── 11. 기업 연계 프로젝트
├── 12. 멘토링 매칭
├── 13. 온라인 IDE (CodeSandbox 연동)
└── 14. 스터디 그룹
```

---

## 4. 기술 스택

### Frontend
```
Framework: Next.js 14 (App Router)
Language:  TypeScript
Styling:   TailwindCSS
UI:        Shadcn/ui (필요한 것만)
State:     Zustand + React Query
Deploy:    Cloudflare Pages
```

### Backend (학교 서버)
```
Framework: NestJS (or Express)
Language:  TypeScript
Database:  PostgreSQL
ORM:       Prisma
Auth:      JWT + GitHub OAuth
Deploy:    학교 서버 (Docker)
```

### 아키텍처
```
┌─────────────────┐     ┌─────────────────┐
│  Cloudflare     │────▶│  학교 서버       │
│  Pages          │     │  (NestJS API)   │
│  (Frontend)     │◀────│  (PostgreSQL)   │
└─────────────────┘     └─────────────────┘
      │
      ▼
┌─────────────────┐
│  GitHub OAuth   │
│  (인증)          │
└─────────────────┘
```

---

## 5. 데이터 모델 (핵심)

### User (사용자)
```typescript
{
  id: string
  email: string
  name: string
  githubId: string
  avatar: string

  // 레벨 시스템
  rank: 'JUNIOR' | 'SENIOR' | 'MASTER'
  level: number (1-50)
  xp: number

  // 프로필
  bio: string
  skills: string[]
  department: string
  grade: number

  createdAt: Date
}
```

### Project (프로젝트)
```typescript
{
  id: string
  title: string
  description: string

  ownerId: string

  // 상태
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
  visibility: 'PUBLIC' | 'PRIVATE' | 'CREW_ONLY'

  // 코스 연동
  courseLevel: 'JUNIOR' | 'SENIOR' | 'MASTER'

  // 기술 스택
  techStack: string[]

  // 링크
  githubUrl: string
  deployUrl: string
  thumbnailUrl: string

  // 메타
  viewCount: number
  likeCount: number

  createdAt: Date
  completedAt: Date
}
```

### Course (코스)
```typescript
{
  id: string
  title: string
  description: string
  level: 'JUNIOR' | 'SENIOR' | 'MASTER'

  // 완료 조건
  requiredProjects: number
  requiredXP: number

  // 콘텐츠
  chapters: Chapter[]

  createdAt: Date
}
```

---

## 6. 화면 구성

### 6.1 랜딩 페이지 (/)
```
┌────────────────────────────────────┐
│  WKU Software Crew                │
│  ────────────────                  │
│  "함께 성장하는 개발자 크루"        │
│                                    │
│  [GitHub로 시작하기]               │
│                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐      │
│  │Junior│ │Senior│ │Master│      │
│  │ 입문 │ │ 성장 │ │ 전문 │      │
│  └──────┘ └──────┘ └──────┘      │
│                                    │
│  최근 프로젝트 쇼케이스...          │
└────────────────────────────────────┘
```

### 6.2 대시보드 (/dashboard)
```
┌─────────────────────────────────────────┐
│  [로고]  대시보드  프로젝트  크루  내정보  │
├─────────────────────────────────────────┤
│                                          │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ 내 프로필    │  │ 내 프로젝트       │  │
│  │ Lv.15       │  │ ┌────┐ ┌────┐   │  │
│  │ Senior      │  │ │진행│ │완료│   │  │
│  │ XP: 2,450   │  │ │ 2  │ │ 5  │   │  │
│  └─────────────┘  │ └────┘ └────┘   │  │
│                    │                 │  │
│  ┌─────────────┐  │ [+ 새 프로젝트]  │  │
│  │ 현재 코스    │  └──────────────────┘  │
│  │ Senior 1    │                        │
│  │ 진도: 60%   │  ┌──────────────────┐  │
│  └─────────────┘  │ 크루 활동 피드    │  │
│                    │ ...              │  │
│                    └──────────────────┘  │
└─────────────────────────────────────────┘
```

### 6.3 프로젝트 상세 (/projects/[id])
```
┌─────────────────────────────────────────┐
│  Todo App - React 첫 프로젝트           │
│  ─────────────────────────────           │
│  by 홍길동 (@gildong) · Junior 코스     │
│                                          │
│  [GitHub] [Demo] [좋아요 23]            │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ 📸 스크린샷/미리보기            │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ## 프로젝트 소개                        │
│  React를 처음 배우며 만든 Todo 앱...    │
│                                          │
│  ## 기술 스택                            │
│  React, TypeScript, TailwindCSS         │
│                                          │
│  ## 배운 점                              │
│  - useState, useEffect 이해             │
│  - 컴포넌트 분리                         │
│                                          │
│  ────────────────────────────────       │
│  💬 피드백 (3)                           │
│  - "깔끔하게 잘 만들었네요!"             │
└─────────────────────────────────────────┘
```

---

## 7. 개발 로드맵

### Week 1-2: 기반 구축
- [ ] 프로젝트 셋업 (Next.js, NestJS)
- [ ] GitHub OAuth 연동
- [ ] 기본 UI (레이아웃, 네비게이션)
- [ ] DB 스키마 및 API 기본 구조

### Week 3-4: MVP 완성
- [ ] 프로필 페이지
- [ ] 프로젝트 CRUD
- [ ] 코스 시스템 (레벨별 조회)
- [ ] 대시보드

### Week 5-6: 핵심 기능
- [ ] 프로젝트 쇼케이스
- [ ] 레벨업 시스템
- [ ] 크루 피드
- [ ] 리뷰/피드백

### Week 7-8: 마무리
- [ ] 테스트 및 버그 수정
- [ ] 배포 (Cloudflare + 학교 서버)
- [ ] 베타 테스트 (10-20명)

---

## 8. API 설계 (핵심)

### Auth
```
POST   /api/auth/github     - GitHub 로그인
POST   /api/auth/logout     - 로그아웃
GET    /api/auth/me         - 현재 사용자
```

### Users
```
GET    /api/users/:id       - 프로필 조회
PATCH  /api/users/:id       - 프로필 수정
GET    /api/users/:id/projects - 사용자 프로젝트
```

### Projects
```
GET    /api/projects        - 프로젝트 목록 (필터: level, status)
POST   /api/projects        - 프로젝트 생성
GET    /api/projects/:id    - 프로젝트 상세
PATCH  /api/projects/:id    - 프로젝트 수정
DELETE /api/projects/:id    - 프로젝트 삭제
POST   /api/projects/:id/like - 좋아요
```

### Courses
```
GET    /api/courses         - 코스 목록
GET    /api/courses/:id     - 코스 상세
GET    /api/courses/:id/progress - 내 진도
```

---

## 9. 성공 지표

### MVP (1개월)
- [ ] 가입자: 20명
- [ ] 등록 프로젝트: 10개
- [ ] 기능 정상 동작

### Phase 2 (3개월)
- [ ] 가입자: 100명
- [ ] 활성 사용자(MAU): 50명
- [ ] 완료 프로젝트: 50개
- [ ] Senior 레벨 도달: 10명

---

## 10. 핵심 원칙

### DO ✅
1. **작게 시작** - MVP는 핵심만
2. **빠르게 배포** - 2주마다 릴리스
3. **피드백 반영** - 사용자 의견 즉시 반영
4. **단순하게** - 복잡한 기능은 나중에

### DON'T ❌
1. 처음부터 완벽하게 만들려 하지 않기
2. 사용하지 않을 기능 미리 만들지 않기
3. 과도한 기술 도입하지 않기
4. 기획만 하고 개발 안 하기

---

**작성일**: 2026-01-22
**버전**: v2.0 (재정립)
**상태**: 개발 시작 준비 완료
