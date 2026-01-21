# Phase 5: 코스 시스템 프론트엔드 구현 완료

## 구현 개요

Next.js 14 App Router 기반 코스 시스템 프론트엔드 구축 완료
- Server/Client Component 분리
- React Query 캐싱 전략
- Suspense 로딩 상태
- TailwindCSS 반응형 디자인
- Vercel React Best Practices 적용

## 디렉토리 구조

```
apps/web/src/
├── app/
│   └── courses/
│       ├── page.tsx                 # 코스 목록 페이지 (Server Component)
│       └── [id]/
│           └── page.tsx             # 코스 상세 페이지 (Server Component)
├── components/
│   └── courses/
│       ├── CourseCard.tsx           # 코스 카드 컴포넌트
│       ├── CourseList.tsx           # 코스 목록 (Client Component)
│       ├── CourseDetail.tsx         # 코스 상세 (Client Component)
│       ├── ChapterList.tsx          # 챕터 목록
│       ├── ProgressBar.tsx          # 진도 표시 바
│       └── index.ts                 # Export barrel
├── lib/
│   ├── api/
│   │   ├── client.ts                # API 클라이언트 (PATCH 메서드 추가)
│   │   ├── courses.ts               # 코스 API 함수
│   │   ├── types.ts                 # 타입 정의 (코스 타입 추가)
│   │   └── index.ts                 # Export barrel
│   └── hooks/
│       ├── use-courses.ts           # 코스 관련 React Query 훅
│       └── index.ts                 # Export barrel
```

## 주요 기능

### 1. 코스 목록 페이지 (/courses)
- **레벨별 필터**: Junior/Senior/Master
- **코스 카드 그리드**: 반응형 레이아웃 (1/2/3 컬럼)
- **코스 정보 표시**:
  - 커버 이미지
  - 레벨 배지
  - 난이도 표시
  - 학습 시간, 챕터 수, 수강 인원
  - 태그
  - 강사 정보

### 2. 코스 상세 페이지 (/courses/[id])
- **코스 정보**:
  - 상세 설명
  - 학습 목표
  - 선수 과목
  - 메타 정보 (시간, 챕터 수 등)
- **수강 관리**:
  - 수강 신청/취소 버튼
  - 수강 상태 표시
  - 진도율 표시 (수강 중인 경우)
- **챕터 목록**:
  - 확장 가능한 챕터 카드
  - 완료 체크박스
  - 챕터 설명 및 학습 자료
  - 강의 영상 링크

### 3. 진도 관리
- 챕터별 완료 상태 토글
- 실시간 진도율 업데이트
- 마지막 학습 일자 표시

## API 엔드포인트

```typescript
// 코스 목록
GET /api/courses?level={level}&difficulty={difficulty}&page={page}&pageSize={pageSize}&search={search}

// 코스 상세 (챕터 포함)
GET /api/courses/:id

// 수강 신청
POST /api/courses/:id/enroll

// 수강 취소
DELETE /api/courses/:id/enroll

// 코스 진도 조회
GET /api/courses/:id/progress

// 챕터 진도 업데이트
PATCH /api/chapters/:id/progress
{
  "completed": boolean,
  "timeSpent": number
}

// 내 수강 코스 목록
GET /api/courses/enrolled
```

## 타입 정의

### Core Types
```typescript
type CourseLevel = 'junior' | 'senior' | 'master'

interface Course {
  id: string
  title: string
  description: string
  level: CourseLevel
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  coverImage?: string
  duration: number
  chaptersCount: number
  enrolledCount: number
  instructorId: string
  instructorName: string
  tags: string[]
  prerequisites?: string[]
  learningObjectives: string[]
}

interface Chapter {
  id: string
  courseId: string
  title: string
  description: string
  orderIndex: number
  duration: number
  content?: string
  videoUrl?: string
  resources?: Resource[]
}

interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  progress: number
  chaptersProgress: ChapterProgress[]
}
```

## React Query 훅

### 쿼리 훅
- `useCourses()` - 코스 목록 조회 (필터링 지원)
- `useCourse(courseId)` - 코스 상세 조회
- `useCourseProgress(courseId)` - 코스 진도 조회
- `useEnrolledCourses()` - 내 수강 코스 목록

### 뮤테이션 훅
- `useEnrollCourse()` - 수강 신청
- `useUnenrollCourse()` - 수강 취소
- `useUpdateChapterProgress()` - 챕터 진도 업데이트

### 캐싱 전략
```typescript
// 코스 목록: 5분
staleTime: 5 * 60 * 1000

// 코스 상세: 5분
staleTime: 5 * 60 * 1000

// 진도 정보: 2분
staleTime: 2 * 60 * 1000
```

### 쿼리 무효화
```typescript
// 수강 신청/취소 시
- ['course', courseId]
- ['courses']
- ['courseProgress', courseId]
- ['enrolledCourses']

// 챕터 진도 업데이트 시
- ['courseProgress']
```

## UI 컴포넌트

### ProgressBar
진도 표시 바 컴포넌트
- Props: `progress`, `size`, `showLabel`, `className`
- 크기: sm/md/lg
- 애니메이션 전환 효과

### CourseCard
코스 카드 컴포넌트
- 커버 이미지 호버 확대 효과
- 레벨 배지 색상 구분
- 반응형 레이아웃
- 링크 네비게이션

### ChapterList
챕터 목록 컴포넌트
- 확장 가능한 아코디언
- 완료 체크박스 (수강자만)
- 챕터 내용, 영상, 자료 표시
- 낙관적 업데이트

## 스타일링

### TailwindCSS 클래스 패턴
```typescript
// 카드 컨테이너
"rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"

// 레벨 배지
levelColors = {
  junior: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  senior: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  master: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

// 버튼
"rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
```

### 반응형 그리드
```typescript
// 모바일: 1열
// 태블릿: 2열
// 데스크톱: 3열
"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
```

## 성능 최적화

### 1. Server Component 활용
- 페이지 레벨: Server Component (SEO 최적화)
- 인터랙티브 컴포넌트: Client Component

### 2. Suspense 경계
- 페이지별 로딩 상태 분리
- Skeleton UI 제공

### 3. React Query 최적화
- 적절한 staleTime 설정
- 쿼리 무효화 전략
- 낙관적 업데이트

### 4. 이미지 최적화
- Next.js Image 컴포넌트 사용
- fill 레이아웃으로 반응형 지원

### 5. 코드 스플리팅
- 페이지별 자동 코드 스플리팅
- 동적 import 준비 완료

## 접근성 (A11y)

- 시맨틱 HTML 태그 사용
- ARIA 레이블 적용 준비
- 키보드 네비게이션 지원
- 다크 모드 완벽 지원
- 색상 대비 최적화

## 다음 단계

### Phase 6 권장 사항
1. **검색 기능**: 코스 제목/설명 전문 검색
2. **정렬 옵션**: 인기순, 최신순, 난이도순
3. **페이지네이션**: 무한 스크롤 또는 페이지 버튼
4. **필터 확장**: 난이도, 태그별 필터
5. **코스 리뷰**: 평점 및 후기 시스템
6. **학습 통계**: 대시보드에 진도율 차트 추가
7. **알림**: 새 챕터 업데이트 알림

## 테스트 시나리오

### 단위 테스트
- [ ] API 클라이언트 함수
- [ ] React Query 훅
- [ ] 유틸리티 함수

### 통합 테스트
- [ ] 코스 목록 로딩
- [ ] 코스 상세 페이지 렌더링
- [ ] 수강 신청/취소 플로우
- [ ] 챕터 진도 업데이트

### E2E 테스트
- [ ] 코스 검색 및 필터링
- [ ] 코스 수강 전체 플로우
- [ ] 진도 완료 시나리오

## 알려진 이슈

없음

## 기술 스택 버전

- Next.js: 14.x (App Router)
- React: 18.x
- TypeScript: 5.x
- TanStack Query: 5.x
- TailwindCSS: 3.x
- Lucide React: 최신

---

**구현 완료**: 2026-01-22
**개발자**: Claude Code
**패턴**: Dashboard Phase 4 동일 패턴 적용
