# Contributing to WKU Software Crew

WKU Software Crew 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 📋 목차

- [행동 강령](#행동-강령)
- [기여 방법](#기여-방법)
- [개발 환경 설정](#개발-환경-설정)
- [코드 스타일](#코드-스타일)
- [커밋 컨벤션](#커밋-컨벤션)
- [Pull Request 프로세스](#pull-request-프로세스)
- [이슈 리포팅](#이슈-리포팅)

## 행동 강령

### 우리의 약속

우리는 모든 기여자에게 열려있고 환영하는 환경을 만들기 위해 노력합니다. 기여자와 유지관리자로서 우리는 다음을 약속합니다:

- 경험 수준, 성별, 성별 정체성 및 표현, 성적 지향, 장애, 외모, 신체 크기, 인종, 민족, 나이, 종교 또는 국적에 관계없이 모든 사람을 존중합니다
- 건설적인 피드백을 제공하고 받아들입니다
- 커뮤니티에 가장 좋은 것에 집중합니다

### 허용되지 않는 행동

다음 행동은 허용되지 않습니다:

- 성적인 언어나 이미지 사용
- 모욕적이거나 경멸적인 댓글
- 개인 또는 정치적 공격
- 공개 또는 사적 괴롭힘
- 명시적인 허가 없이 다른 사람의 개인 정보 게시

## 기여 방법

### 버그 리포트

버그를 발견하셨나요? GitHub Issues를 통해 알려주세요.

버그 리포트에는 다음을 포함해주세요:
- 명확하고 설명적인 제목
- 버그를 재현하는 단계
- 예상 동작과 실제 동작
- 스크린샷 (해당되는 경우)
- 환경 정보 (OS, Node.js 버전, 브라우저 등)

### 기능 제안

새로운 기능을 제안하고 싶으신가요?

1. GitHub Issues에서 먼저 검색하여 중복되지 않는지 확인
2. 새 이슈 생성
3. 기능의 필요성과 이점을 명확하게 설명
4. 가능하다면 사용 사례 제공

### 코드 기여

코드 기여는 다음 단계를 따릅니다:

1. 이슈를 먼저 생성하거나 기존 이슈에 댓글로 작업 의사 표시
2. 저장소 Fork
3. Feature 브랜치 생성
4. 코드 작성 및 테스트
5. Pull Request 생성

## 개발 환경 설정

### 사전 요구사항

- Node.js 20.x 이상
- pnpm 9.x 이상
- PostgreSQL 16 (또는 Docker)
- Git

### 설치

```bash
# 1. Fork한 저장소 클론
git clone https://github.com/YOUR_USERNAME/saas-crew.git
cd saas-crew

# 2. upstream 원격 저장소 추가
git remote add upstream https://github.com/saintgo7/saas-crew.git

# 3. 의존성 설치
pnpm install

# 4. 환경 변수 설정
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 5. 데이터베이스 설정 (Docker 사용)
docker run -d \
  --name wku-postgres \
  -e POSTGRES_USER=wku_user \
  -e POSTGRES_PASSWORD=wku_pass123 \
  -e POSTGRES_DB=wku_crew \
  -p 5433:5432 \
  postgres:16-alpine

# 6. Prisma 마이그레이션
cd apps/api
npx prisma migrate deploy
npx prisma db seed

# 7. 개발 서버 실행
cd ../..
npm run dev:all
```

### 브랜치 전략

- `main`: 프로덕션 준비 완료 코드
- `develop`: 개발 중인 코드 (선택사항)
- `feature/*`: 새로운 기능
- `fix/*`: 버그 수정
- `docs/*`: 문서 수정
- `refactor/*`: 리팩토링
- `test/*`: 테스트 추가/수정

**브랜치 생성 예시:**
```bash
git checkout -b feature/add-notification-system
git checkout -b fix/course-enrollment-bug
git checkout -b docs/update-api-documentation
```

## 코드 스타일

### TypeScript/JavaScript

- **Prettier** 사용 (자동 포맷팅)
- **ESLint** 규칙 준수
- **명명 규칙**:
  - 변수/함수: camelCase
  - 클래스/인터페이스: PascalCase
  - 상수: UPPER_SNAKE_CASE
  - 파일명: kebab-case.ts

```typescript
// ✅ Good
const userProfile = getUserProfile()
interface UserProfile {}
const MAX_RETRY_COUNT = 3

// ❌ Bad
const UserProfile = GetUserProfile()
interface userProfile {}
const max_retry_count = 3
```

### NestJS Backend

- **모듈화**: 기능별로 모듈 분리
- **의존성 주입**: Constructor injection 사용
- **DTOs**: 모든 입력/출력에 DTO 사용
- **Swagger**: 모든 엔드포인트에 @ApiOperation, @ApiResponse 추가

```typescript
// ✅ Good
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }
}
```

### Next.js Frontend

- **Server Components 우선**: 가능한 경우 Server Component 사용
- **'use client' 명시**: Client Component에만 추가
- **컴포넌트 구조**:
  ```
  components/
  ├── ui/           # 재사용 가능한 UI 컴포넌트
  ├── features/     # 기능별 컴포넌트
  └── layouts/      # 레이아웃 컴포넌트
  ```

```typescript
// ✅ Good - Server Component
export async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId)
  return <div>{user.name}</div>
}

// ✅ Good - Client Component
'use client'
export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 테스트

- **커버리지**: 최소 80% 유지
- **테스트 파일명**: `*.spec.ts` (단위), `*.e2e-spec.ts` (E2E)
- **테스트 구조**: AAA 패턴 (Arrange, Act, Assert)

```typescript
// ✅ Good
describe('UsersService', () => {
  describe('findOne', () => {
    it('should return a user when found', async () => {
      // Arrange
      const userId = 'user_001'
      const expectedUser = { id: userId, name: 'John' }

      // Act
      const result = await service.findOne(userId)

      // Assert
      expect(result).toEqual(expectedUser)
    })
  })
})
```

## 커밋 컨벤션

**Conventional Commits** 형식을 따릅니다:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `perf`: 성능 개선
- `test`: 테스트 추가/수정
- `build`: 빌드 시스템 변경
- `ci`: CI 설정 변경
- `chore`: 기타 변경사항

### Scope (선택사항)

- `api`: 백엔드 관련
- `web`: 프론트엔드 관련
- `db`: 데이터베이스 관련
- `docs`: 문서 관련

### 예시

```bash
# 기능 추가
feat(api): add email verification endpoint

# 버그 수정
fix(web): correct course level filter values

# 문서 수정
docs: update README with deployment guide

# 성능 개선
perf(api): optimize N+1 queries in posts service

# Breaking change
feat(api)!: change user authentication to use JWT

BREAKING CHANGE: Session-based auth is no longer supported
```

### 커밋 메시지 작성 팁

- 제목은 50자 이내
- 본문은 72자에서 줄바꿈
- 명령형 동사 사용 ("Add" not "Added" or "Adds")
- 본문에 변경 이유 설명
- Breaking changes는 BREAKING CHANGE로 시작하는 footer 추가

## Pull Request 프로세스

### PR 생성 전 체크리스트

- [ ] 최신 main 브랜치와 동기화
- [ ] 모든 테스트 통과
- [ ] 린트 및 포맷 규칙 준수
- [ ] 새로운 기능은 테스트 추가
- [ ] 문서 업데이트 (필요한 경우)

### PR 생성

1. **의미 있는 제목 작성**
   ```
   feat: Add real-time notification system
   fix: Correct course enrollment bug
   ```

2. **PR 설명 작성**
   ```markdown
   ## 변경 사항
   - 실시간 알림 시스템 추가
   - WebSocket을 사용한 양방향 통신 구현

   ## 관련 이슈
   Closes #123

   ## 테스트 방법
   1. 알림 설정 페이지로 이동
   2. 알림 권한 허용
   3. 새 댓글이 달리면 알림 확인

   ## 스크린샷
   (해당되는 경우 추가)
   ```

3. **리뷰어 지정**
   - 최소 1명의 리뷰어 필요

### PR 리뷰 프로세스

1. **자동화된 검사**
   - CI/CD 파이프라인 통과
   - 테스트 통과
   - 린트 검사 통과

2. **코드 리뷰**
   - 리뷰어가 코드 검토
   - 피드백 제공
   - 승인 또는 변경 요청

3. **변경 사항 반영**
   - 리뷰 피드백에 따라 수정
   - 추가 커밋 또는 force push

4. **병합**
   - 모든 검사 통과 및 승인 후 병합
   - Squash and merge 권장

## 이슈 리포팅

### 버그 리포트 템플릿

```markdown
**버그 설명**
명확하고 간결한 버그 설명

**재현 단계**
1. '...'로 이동
2. '....' 클릭
3. '....' 까지 스크롤
4. 오류 확인

**예상 동작**
무엇이 일어날 것으로 예상했는지 설명

**실제 동작**
실제로 무엇이 일어났는지 설명

**스크린샷**
해당되는 경우 추가

**환경**
 - OS: [e.g. macOS 14.0]
 - Browser: [e.g. chrome 120]
 - Node.js: [e.g. 20.10.0]
 - Version: [e.g. 1.0.0]

**추가 정보**
기타 추가 정보
```

### 기능 제안 템플릿

```markdown
**기능 설명**
제안하는 기능에 대한 명확한 설명

**문제점**
이 기능이 해결하는 문제 설명

**제안하는 해결책**
어떻게 구현할 것인지 설명

**대안**
고려한 다른 해결책

**추가 정보**
기타 스크린샷, 참고 자료 등
```

## 질문이 있나요?

- GitHub Discussions에서 질문하기
- Issue를 생성하여 문의하기

---

**감사합니다!** 여러분의 기여가 WKU Software Crew를 더 나은 플랫폼으로 만듭니다.
