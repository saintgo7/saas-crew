# Quick Start - 지금 바로 시작하기

## 🚀 5분 안에 시작하는 방법

### Step 1: 마일스톤 생성 (1분)

```bash
/gsd:new-milestone
```

**입력할 내용:**
```
Milestone Name: MVP Launch - Beta Release
Goal: 5주 내 베타 출시, 20+ 사용자 확보
Key Features:
- GitHub OAuth 인증
- 사용자 프로필 및 레벨 시스템
- 프로젝트 CRUD 및 쇼케이스
- 대시보드 및 활동 피드
- 코스 관리 및 진도 추적
- 커뮤니티 Q&A
```

---

### Step 2: 로드맵 생성 (2분)

```bash
/gsd:create-roadmap
```

**자동으로 생성될 Phase:**
- Phase 1: 환경 설정 및 기반 구축 (Week 1)
- Phase 2: 사용자 시스템 구축 (Week 1-2)
- Phase 3: 프로젝트 관리 시스템 (Week 2-3)
- Phase 4: 대시보드 (Week 3)
- Phase 5: 코스 시스템 (Week 3-4)
- Phase 6: 커뮤니티 기능 (Week 4)
- Phase 7: 테스트 및 품질 관리 (Week 4-5)
- Phase 8: 문서화 및 배포 (Week 5)

---

### Step 3: Phase 1 시작 (2분)

```bash
# Phase 1 계획 수립
/gsd:plan-phase

# Phase 1 실행
/gsd:execute-phase
```

**Phase 1이 자동으로 수행할 작업:**
1. npm install (모든 패키지 설치)
2. .env 파일 생성 및 설정
3. PostgreSQL 데이터베이스 생성
4. Prisma 마이그레이션 실행
5. 개발 서버 실행 테스트
6. GitHub OAuth App 생성 가이드
7. 인증 시스템 완성

---

## 🔄 Ralph Loop 활성화

### Step 4: Ralph Loop 시작

```bash
/ralph-loop
```

**Ralph가 자동으로 학습할 패턴:**
- RESTful API Controller
- NestJS Service
- React Page Component
- React List Component
- Test Cases

---

## 📋 첫 날 목표

### 오전 (2-3시간)
- [x] 마일스톤 생성
- [x] 로드맵 생성
- [x] Phase 1 실행
- [x] 개발 환경 완전 구축
- [x] GitHub OAuth 설정

### 오후 (2-3시간)
- [ ] Phase 2.1 실행 (프로필 페이지)
- [ ] Phase 2.2 실행 (사용자 API)
- [ ] Ralph Loop로 패턴 학습
- [ ] 첫 번째 레벨업 로직 테스트

---

## 📊 주간 목표

### Week 1
```bash
# Phase 1-2 완료
✅ 개발 환경 구축
✅ 인증 시스템
✅ 사용자 프로필
✅ 레벨 시스템
```

### Week 2
```bash
# Phase 3 완료
✅ 프로젝트 CRUD
✅ 프로젝트 목록/상세
✅ 쇼케이스
```

### Week 3
```bash
# Phase 4-5 완료
✅ 대시보드
✅ 활동 피드
✅ 코스 시스템
```

### Week 4
```bash
# Phase 6-7 완료
✅ 커뮤니티 Q&A
✅ 테스트 80%+
✅ 성능 최적화
```

### Week 5
```bash
# Phase 8 완료
✅ 문서화
✅ 배포
✅ 베타 테스트
```

---

## 🎯 핵심 명령어

### 진행 상황 확인
```bash
/gsd:progress        # 전체 진행률
/gsd:status          # 백그라운드 에이전트 상태
```

### Phase 관리
```bash
/gsd:plan-phase      # Phase 계획 수립
/gsd:execute-phase   # Phase 실행
/gsd:verify-work     # 수동 검증
```

### 문제 해결
```bash
/gsd:plan-fix        # 버그 수정 계획
/gsd:insert-phase    # 긴급 작업 추가
/gsd:add-todo        # 나중에 할 일 추가
```

### Ralph Loop
```bash
/ralph-loop          # Ralph 시작
/cancel-ralph        # Ralph 종료
```

### 작업 중단/재개
```bash
/gsd:pause-work      # 컨텍스트 저장하고 중단
/gsd:resume-work     # 이전 작업 재개
```

---

## 💡 Pro Tips

### 1. 병렬 실행 활용
Frontend와 Backend를 동시에 작업하세요:
```bash
# 한 메시지에서 두 에이전트 동시 호출
Task(frontend-developer) + Task(backend-developer)
```

### 2. Ralph Loop 최대 활용
첫 번째 리소스를 완벽하게 만들면, 나머지는 자동:
```
Users → Projects → Courses → Posts → Comments
(수동)   (90% 자동) (95% 자동) (95% 자동) (95% 자동)
```

### 3. 테스트 자동 생성
```bash
/testing-suite:generate-tests
```
80% 테스트 커버리지를 자동으로 생성합니다.

### 4. 보안 자동 검토
```bash
/security-pro:security-audit
```
SQL Injection, XSS 등을 자동으로 확인합니다.

### 5. 성능 자동 최적화
```bash
/performance-optimizer:performance-audit
```
페이지 로딩 속도, 번들 크기 등을 분석합니다.

---

## 🔧 트러블슈팅

### 문제: npm install 실패
```bash
# 캐시 삭제 후 재시도
npm cache clean --force
npm install
```

### 문제: Prisma 마이그레이션 실패
```bash
# DB 초기화 후 재시도
npm run db:push --workspace=apps/api
```

### 문제: GitHub OAuth 실패
1. GitHub OAuth App에서 Callback URL 확인
2. .env 파일의 CLIENT_ID/SECRET 확인
3. 포트 번호 일치 확인 (4000)

### 문제: Ralph Loop가 잘못된 패턴 학습
```bash
# Ralph 중지 후 재시작
/cancel-ralph
# 첫 번째 패턴 수정
# Ralph 재시작
/ralph-loop
```

---

## 📞 도움이 필요하면

### GSD 도움말
```bash
/gsd:help
```

### Phase 가정사항 확인
```bash
/gsd:list-phase-assumptions
```

### 이슈 검토
```bash
/gsd:consider-issues
```

---

## 🎉 첫 날 완료 체크리스트

- [ ] Milestone 생성 완료
- [ ] Roadmap 생성 완료
- [ ] Phase 1 실행 완료
- [ ] `npm run dev:all` 정상 실행
- [ ] GitHub 로그인 성공
- [ ] Ralph Loop 활성화
- [ ] 첫 번째 API 생성 (Users)

**축하합니다! 이제 본격적으로 개발을 시작할 준비가 되었습니다!**

---

## 다음 단계

```bash
# Phase 2 시작
/gsd:plan-phase
/gsd:execute-phase

# 진행 상황 확인
/gsd:progress
```

**Happy Coding!**

---

**작성일**: 2026-01-22
**버전**: v1.0
**예상 소요 시간**: 첫 날 4-6시간
