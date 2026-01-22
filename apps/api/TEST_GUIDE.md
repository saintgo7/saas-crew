# Backend Services Unit Testing Guide

WKU Software Crew 백엔드 서비스의 단위 테스트 가이드입니다.

## 테스트 개요

이 프로젝트는 Jest와 NestJS Testing utilities를 사용하여 포괄적인 단위 테스트를 구현했습니다.

### 테스트 커버리지 목표
- **Target**: 80%+ 커버리지
- Branches: 80%+
- Functions: 80%+
- Lines: 80%+
- Statements: 80%+

## 테스트된 서비스

### 1. Users Service (`users.service.spec.ts`)
사용자 관리 비즈니스 로직 테스트

**테스트 케이스:**
- `findById`: 사용자 조회 (성공/실패)
- `update`: 사용자 정보 업데이트 (전체/부분, 권한 검증)
- `findUserProjects`: 사용자 프로젝트 목록 조회
- `findByEmail`: 이메일로 사용자 조회
- `findByGithubId`: GitHub ID로 사용자 조회
- `create`: 새 사용자 생성 (일반/OAuth)

### 2. Projects Service (`projects.service.spec.ts`)
프로젝트 관리 및 멤버십 관리 테스트

**테스트 케이스:**
- `findAll`: 프로젝트 목록 조회 (필터링, 검색, 페이지네이션)
- `create`: 프로젝트 생성 (OWNER 자동 할당)
- `findById`: 프로젝트 상세 조회
- `update`: 프로젝트 업데이트 (권한 검증: OWNER/ADMIN)
- `delete`: 프로젝트 삭제 (OWNER 전용)
- `addMember`: 멤버 추가 (권한 검증, 중복 방지)
- `removeMember`: 멤버 제거 (권한 계층 검증)
- `checkAccess`: 접근 권한 검증 (PUBLIC/PRIVATE)

### 3. Courses Service (`courses.service.spec.ts`)
강의 관리 비즈니스 로직 테스트

**테스트 케이스:**
- `findAll`: 강의 목록 조회 (레벨, 카테고리, 태그 필터링)
- `create`: 강의 생성 (slug 중복 검증)
- `findById`: 강의 상세 조회 (챕터 포함)
- `update`: 강의 정보 업데이트 (slug 중복 검증)
- `delete`: 강의 삭제 (cascade)

### 4. Posts Service (`posts.service.spec.ts`)
게시글 관리 및 투표 시스템 테스트

**테스트 케이스:**
- `findAll`: 게시글 목록 조회 (투표 점수 포함)
- `create`: 게시글 작성 (slug 중복 검증)
- `findById`: 게시글 상세 조회 (조회수 증가)
- `update`: 게시글 수정 (작성자 검증)
- `delete`: 게시글 삭제 (작성자 검증, cascade)

### 5. Comments Service (`comments.service.spec.ts`)
댓글 및 답변 시스템 테스트

**테스트 케이스:**
- `findByPostId`: 계층적 댓글 조회 (답글 포함)
- `create`: 댓글/답글 작성 (부모 댓글 검증)
- `update`: 댓글 수정 (작성자 검증)
- `delete`: 댓글 삭제 (cascade)
- `acceptAnswer`: 베스트 답변 선택 (게시글 작성자 전용, 단일 선택)

### 6. Votes Service (`votes.service.spec.ts`)
투표 시스템 비즈니스 로직 테스트

**테스트 케이스:**
- `vote`: 투표 (upvote/downvote, 변경, 멱등성)
- `removeVote`: 투표 취소 (멱등성)
- `getVoteStats`: 투표 통계 조회 (사용자별 투표 상태)

## 테스트 실행 방법

### 1. 의존성 설치
```bash
cd apps/api
npm install
```

### 2. 전체 테스트 실행
```bash
npm test
```

### 3. 테스트 커버리지 확인
```bash
npm run test:cov
```

커버리지 리포트는 `apps/api/coverage` 디렉토리에 생성됩니다:
- `coverage/lcov-report/index.html` - HTML 리포트 (브라우저에서 확인)
- `coverage/coverage-summary.json` - JSON 요약

### 4. Watch 모드로 테스트 (개발 중)
```bash
npm run test:watch
```

### 5. 특정 테스트 파일만 실행
```bash
npm test users.service.spec.ts
npm test projects.service.spec.ts
```

### 6. 디버그 모드로 테스트
```bash
npm run test:debug
```

## 테스트 작성 패턴

### Mock 패턴
```typescript
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}
```

### 테스트 구조
```typescript
describe('ServiceName', () => {
  let service: ServiceName
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<ServiceName>(ServiceName)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('methodName', () => {
    it('should handle success case', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockData)

      // Act
      const result = await service.methodName(params)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(prisma.user.findUnique).toHaveBeenCalledWith(expectedParams)
    })

    it('should throw error on failure', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(service.methodName(params)).rejects.toThrow(ExpectedException)
    })
  })
})
```

## 테스트 커버리지 분석

### 현재 커버리지 확인
```bash
npm run test:cov
```

### HTML 리포트 확인
```bash
open coverage/lcov-report/index.html
```

### CI/CD 통합
GitHub Actions에서 자동으로 테스트 실행:
```yaml
- name: Run tests
  run: cd apps/api && npm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./apps/api/coverage/lcov.info
```

## 테스트 베스트 프랙티스

### 1. AAA 패턴 사용
- **Arrange**: 테스트 데이터 및 mock 설정
- **Act**: 테스트할 메서드 실행
- **Assert**: 결과 검증

### 2. 명확한 테스트 이름
```typescript
it('should throw NotFoundException when user does not exist', async () => {
  // ...
})
```

### 3. Mock 초기화
```typescript
beforeEach(() => {
  jest.clearAllMocks()
})
```

### 4. 독립적인 테스트
각 테스트는 다른 테스트에 의존하지 않아야 합니다.

### 5. Edge Case 테스트
- 빈 데이터
- null/undefined
- 권한 없음
- 중복 데이터
- 경계값

## 문제 해결

### 테스트 실패 시
1. 에러 메시지 확인
2. Mock 데이터 검증
3. 비동기 처리 확인 (await 누락)
4. Prisma 호출 파라미터 확인

### 커버리지가 낮을 때
1. 커버리지 리포트에서 누락된 라인 확인
2. Edge case 추가
3. 에러 처리 로직 테스트 추가

## 추가 리소스

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## 다음 단계

- [ ] Integration tests 추가
- [ ] E2E tests 구현
- [ ] Performance tests 추가
- [ ] API endpoint tests
- [ ] Database tests with test containers
