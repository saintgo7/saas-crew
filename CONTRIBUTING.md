# Contributing to WKU Software Crew

WKU Software Crew 프로젝트에 기여해주셔서 감사합니다! 🎉

## 시작하기 전에

1. [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) 읽기
2. [DEVELOPMENT.md](./DEVELOPMENT.md) 개발 가이드 확인
3. GitHub Issues에서 작업할 이슈 찾기 또는 생성

## 기여 방법

### 1. 저장소 Fork 및 Clone

```bash
# Fork 버튼 클릭 (GitHub 웹사이트)

# Clone
git clone https://github.com/YOUR_USERNAME/saas-crew.git
cd saas-crew

# Upstream 원격 저장소 추가
git remote add upstream https://github.com/saintgo7/saas-crew.git
```

### 2. 브랜치 생성

```bash
# 최신 코드 가져오기
git checkout main
git pull upstream main

# 새 브랜치 생성
git checkout -b feature/your-feature-name
# 또는
git checkout -b fix/bug-description
```

### 3. 개발

- 코드 작성
- 테스트 추가/실행
- 커밋 메시지 작성

### 4. Pull Request 생성

```bash
# 변경사항 커밋
git add .
git commit -m "feat: add user profile page"

# Push
git push origin feature/your-feature-name
```

GitHub에서 Pull Request 생성

## 커밋 메시지 가이드라인

### 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 수정

### 예시

```
feat(auth): add GitHub OAuth login

- GitHub OAuth 2.0 연동
- 사용자 프로필 자동 생성
- 세션 관리 개선

Closes #123
```

## 코드 스타일

### TypeScript

```typescript
// ✅ Good
interface UserProfile {
  id: string
  name: string
  email: string
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  return await db.user.findUnique({ where: { id: userId } })
}

// ❌ Bad
const getUserProfile = async (userId: any) => {
  return await db.user.findUnique({ where: { id: userId } })
}
```

### React Components

```typescript
// ✅ Good - Server Component
async function CoursePage({ params }: { params: { id: string } }) {
  const course = await db.course.findUnique({ where: { id: params.id } })

  return <CourseDetail course={course} />
}

// ✅ Good - Client Component
'use client'

export function CourseDetail({ course }: { course: Course }) {
  const [enrolled, setEnrolled] = useState(false)

  return (
    <div>
      <h1>{course.title}</h1>
      <Button onClick={() => setEnrolled(true)}>Enroll</Button>
    </div>
  )
}
```

## 테스트

새로운 기능은 반드시 테스트 포함:

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('should format date in Korean', () => {
    const date = new Date('2024-01-01')
    expect(formatDate(date)).toBe('2024년 1월 1일')
  })
})
```

## Pull Request 체크리스트

- [ ] 코드가 정상적으로 빌드됩니다 (`npm run build`)
- [ ] 모든 테스트가 통과합니다 (`npm test`)
- [ ] Lint 검사를 통과합니다 (`npm run lint`)
- [ ] 타입 체크를 통과합니다 (`npm run type-check`)
- [ ] 커밋 메시지가 컨벤션을 따릅니다
- [ ] 관련 문서를 업데이트했습니다
- [ ] PR 설명이 명확합니다

## PR 설명 템플릿

```markdown
## 변경 사항

간략한 설명...

## 관련 이슈

Closes #123

## 변경 내용

- [ ] 기능 A 추가
- [ ] 버그 B 수정
- [ ] 문서 C 업데이트

## 테스트 방법

1. ...
2. ...

## 스크린샷 (있는 경우)

![image](url)

## 체크리스트

- [ ] 테스트 추가
- [ ] 문서 업데이트
- [ ] 타입 체크 통과
```

## 리뷰 프로세스

1. **자동 체크**: CI/CD가 자동으로 빌드 및 테스트
2. **코드 리뷰**: 최소 1명의 리뷰어 승인 필요
3. **승인 후 머지**: Squash and merge 사용

## 질문이 있나요?

- GitHub Discussions 사용
- Issues에 질문 라벨로 등록
- 개발팀에 문의

감사합니다! 🙏
