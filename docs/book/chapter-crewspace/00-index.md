# CrewSpace 개발 실전 가이드

**대학 소프트웨어 동아리 플랫폼 구축 프로젝트**

---

## 책 정보

| 항목 | 내용 |
|------|------|
| **프로젝트명** | CrewSpace (구 WKU Software Crew) |
| **프로젝트 유형** | SaaS 플랫폼 (대학 동아리 관리) |
| **개발 기간** | 2026년 1월 ~ 2월 (약 1개월) |
| **기술 스택** | Next.js 16 + NestJS 11 + PostgreSQL + Docker |
| **배포 환경** | Production (crew.abada.kr) |
| **목표 독자** | 풀스택 개발자, SaaS 플랫폼 구축 학습자 |

---

## 목차

### Part 1: Introduction - 프로젝트 소개 및 초기 설정
1.1 CrewSpace란 무엇인가
1.2 프로젝트 목표 및 기능 요구사항
1.3 기술 스택 선정 이유
1.4 개발 환경 구성
1.5 Git Flow 및 브랜치 전략
1.6 초기 프로젝트 구조 생성

### Part 2: Planning & Design - 계획 및 설계
2.1 요구사항 분석 및 사용자 스토리
2.2 데이터베이스 설계 (ERD)
2.3 API 설계 및 엔드포인트 정의
2.4 프론트엔드 라우팅 구조
2.5 인증/인가 아키텍처 설계
2.6 배포 아키텍처 (Docker + Cloudflare)

### Part 3: Implementation - 구현
3.1 NestJS 백엔드 프로젝트 생성
3.2 Prisma ORM 설정 및 마이그레이션
3.3 GitHub OAuth 인증 구현
3.4 사용자 및 프로젝트 CRUD API
3.5 코스 시스템 구현 (80개 데모 코스)
3.6 커뮤니티 기능 (Q&A, 채팅)
3.7 Next.js 프론트엔드 구현
3.8 React Query를 이용한 서버 상태 관리
3.9 Tailwind CSS 스타일링

### Part 4: Advanced Features - 고급 기능
4.1 실시간 채팅 (WebSocket 데모)
4.2 Canvas 협업 도구 (Excalidraw 통합)
4.3 리더보드 및 레벨 시스템
4.4 다국어 지원 (i18n - 한국어/영어)
4.5 관리자 대시보드 및 리포트 시스템
4.6 검색 및 필터링 최적화
4.7 페이지네이션 구현

### Part 5: Testing & Deployment - 테스트 및 배포
5.1 Jest 단위 테스트 작성
5.2 Playwright E2E 테스트
5.3 CI/CD 파이프라인 (GitHub Actions)
5.4 Docker 컨테이너화
5.5 Staging 환경 구성
5.6 Production 배포 (crew.abada.kr)
5.7 Cloudflare Tunnel 설정
5.8 모니터링 및 로깅

### Part 6: Appendix - 부록
6.1 트러블슈팅 사례
6.2 리브랜딩 (WKU → CrewSpace)
6.3 성능 최적화 사례
6.4 보안 강화 (CSP, CORS)
6.5 개발 로그 히스토리
6.6 사용된 라이브러리 및 도구
6.7 참고 자료 및 링크

---

## 프로젝트 하이라이트

### 주요 성과
- ✅ **30개 페이지** 정상 빌드 (TypeScript 에러 0)
- ✅ **80개 데모 코스** 자동 생성
- ✅ **채널별 채팅 데모** 완전 구현
- ✅ **검색/필터/페이지네이션** 모든 목록 페이지 적용
- ✅ **다국어 지원** 한국어/영어 완전 번역
- ✅ **CI/CD 파이프라인** develop → staging, main → production 자동 배포

### 기술적 도전
1. **Excalidraw 폰트 셀프 호스팅** - CSP 정책으로 인한 CDN 차단 해결
2. **Git Flow 구축** - staging/production 환경 분리
3. **데모 데이터 전략** - API 없이도 풍부한 UX 제공
4. **타입 안전성** - any 타입 제거, Canvas 타입 정의
5. **브랜딩 일관성** - wku-crew → crewspace 전체 전환

---

## 이 책에서 배울 수 있는 것

### 개발자를 위한 실전 노하우
- Next.js 16 App Router 활용법
- NestJS 모듈 아키텍처 설계
- Prisma ORM 실전 활용
- GitHub OAuth 통합 인증
- Docker 멀티 스테이지 빌드
- Cloudflare Tunnel 배포

### 프로젝트 관리
- Git Flow 브랜치 전략
- 개발 로그 작성 습관
- CI/CD 자동화
- 스테이징 환경 활용

### 코드 품질
- TypeScript 타입 안전성
- ESLint/Prettier 코드 컨벤션
- console.log 정리
- 에러 핸들링 패턴

---

## 저자 소개

**Ph.D SNT Go. (Claude Opus 4.6)**

CrewSpace 프로젝트의 전체 개발 및 배포를 담당한 AI 개발 에이전트입니다.
본 책은 실제 프로젝트 개발 과정에서 작성된 12개의 개발 로그를 기반으로 집필되었습니다.

---

**Last Updated**: 2026-02-16
**Version**: 1.0.0
**Total Pages**: 약 400페이지 (예상)
**Format**: 국배판 (210mm × 297mm, A4)
