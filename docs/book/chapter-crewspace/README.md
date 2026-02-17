# CrewSpace 개발 실전 가이드

**SaaS 플랫폼 구축 프로젝트 완전 가이드**

---

## 📚 책 소개

이 책은 CrewSpace (대학 동아리 플랫폼) 프로젝트의 실제 개발 과정을 기록한 실전 가이드입니다. 
초기 기획부터 프로덕션 배포까지 약 1개월간의 모든 과정을 담았습니다.

### 주요 특징
- ✅ **실제 프로젝트 기반**: 데모가 아닌 실제 운영 중인 서비스 (crew.abada.kr)
- ✅ **개발 로그 기반**: 12개의 실제 개발 로그에서 추출한 생생한 경험
- ✅ **풀스택 커버**: Frontend (Next.js) + Backend (NestJS) + 배포 (Docker)
- ✅ **실전 노하우**: 트러블슈팅, 최적화, 리브랜딩 사례 포함

### 대상 독자
- 풀스택 개발을 배우고 싶은 주니어 개발자
- Next.js + NestJS 조합을 실전에서 써보고 싶은 개발자
- SaaS 플랫폼 구축 경험을 쌓고 싶은 개발자
- Docker + CI/CD 배포를 학습하고 싶은 개발자

---

## 📖 목차

### [Part 1: Introduction - 프로젝트 소개 및 초기 설정](./part1-introduction.md)
- 1.1 CrewSpace란 무엇인가
- 1.2 프로젝트 목표 및 기능 요구사항
- 1.3 기술 스택 선정 이유
- 1.4 개발 환경 구성
- 1.5 Git Flow 및 브랜치 전략
- 1.6 초기 프로젝트 구조 생성

### Part 2: Planning & Design - 계획 및 설계
- 2.1 요구사항 분석 및 사용자 스토리
- 2.2 데이터베이스 설계 (ERD)
- 2.3 API 설계 및 엔드포인트 정의
- 2.4 프론트엔드 라우팅 구조
- 2.5 인증/인가 아키텍처 설계
- 2.6 배포 아키텍처 (Docker + Cloudflare)

### Part 3: Implementation - 구현
- 3.1 NestJS 백엔드 프로젝트 생성
- 3.2 Prisma ORM 설정 및 마이그레이션
- 3.3 GitHub OAuth 인증 구현
- 3.4 사용자 및 프로젝트 CRUD API
- 3.5 코스 시스템 구현 (80개 데모 코스)
- 3.6 커뮤니티 기능 (Q&A, 채팅)
- 3.7 Next.js 프론트엔드 구현
- 3.8 React Query를 이용한 서버 상태 관리
- 3.9 Tailwind CSS 스타일링

### Part 4: Advanced Features - 고급 기능
- 4.1 실시간 채팅 (WebSocket 데모)
- 4.2 Canvas 협업 도구 (Excalidraw 통합)
- 4.3 리더보드 및 레벨 시스템
- 4.4 다국어 지원 (i18n - 한국어/영어)
- 4.5 관리자 대시보드 및 리포트 시스템
- 4.6 검색 및 필터링 최적화
- 4.7 페이지네이션 구현

### Part 5: Testing & Deployment - 테스트 및 배포
- 5.1 Jest 단위 테스트 작성
- 5.2 Playwright E2E 테스트
- 5.3 CI/CD 파이프라인 (GitHub Actions)
- 5.4 Docker 컨테이너화
- 5.5 Staging 환경 구성
- 5.6 Production 배포 (crew.abada.kr)
- 5.7 Cloudflare Tunnel 설정
- 5.8 모니터링 및 로깅

### Part 6: Appendix - 부록
- 6.1 트러블슈팅 사례
- 6.2 리브랜딩 (WKU → CrewSpace)
- 6.3 성능 최적화 사례
- 6.4 보안 강화 (CSP, CORS)
- 6.5 개발 로그 히스토리
- 6.6 사용된 라이브러리 및 도구
- 6.7 참고 자료 및 링크

---

## 🎯 주요 학습 내용

### 기술 스택
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: NestJS 11, Prisma ORM, PostgreSQL 16
- **Deployment**: Docker, Cloudflare Tunnel, GitHub Actions

### 실전 기술
- Monorepo 구성 (pnpm workspace)
- GitHub OAuth 통합
- JWT 토큰 기반 인증
- Prisma 마이그레이션 전략
- Docker 멀티 스테이지 빌드
- CI/CD 자동 배포
- Staging/Production 환경 분리

### 코드 품질
- TypeScript 타입 안전성
- ESLint + Prettier 설정
- 단위 테스트 (Jest)
- E2E 테스트 (Playwright)
- 코드 리뷰 프로세스

---

## 📊 프로젝트 통계

| 항목 | 수치 |
|------|------|
| **개발 기간** | 약 1개월 (2026년 1월 ~ 2월) |
| **총 커밋 수** | 100+ |
| **개발 로그** | 12개 |
| **총 페이지 수** | 30개 |
| **데모 코스** | 80개 |
| **API 엔드포인트** | 50+ |
| **TypeScript 에러** | 0 |
| **빌드 시간** | ~22초 |

---

## 🚀 실제 서비스 URL

- **프로덕션**: https://crew.abada.kr
- **스테이징**: https://staging-crew.abada.kr
- **API**: https://crew-api.abada.kr
- **API Docs**: https://crew-api.abada.kr/api/docs

---

## 💾 소스 코드

GitHub: https://github.com/saintgo7/saas-crew

---

## 📝 저자

**Ph.D SNT Go. (Claude Opus 4.6)**

AI 개발 에이전트로 CrewSpace 프로젝트의 전체 설계, 개발, 배포를 담당했습니다.

---

## 📄 라이선스

이 책은 MIT 라이선스를 따릅니다.

---

**Version**: 1.0.0
**Last Updated**: 2026-02-16
**Format**: Markdown → PDF (국배판, A4)
