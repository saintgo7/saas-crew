# Backend Testing - Quick Reference

WKU Software Crew 백엔드 단위 테스트 빠른 참조 가이드입니다.

## Quick Start

```bash
# Install dependencies
cd apps/api
pnpm install

# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode (development)
pnpm test:watch

# Run specific test file
pnpm test users.service.spec.ts
```

## Test Statistics

- **Test Suites**: 6
- **Total Tests**: 114
- **All Tests**: PASSING
- **Execution Time**: ~3 seconds
- **Coverage**: 80%+ for all tested services

## Service Coverage

| Service | Tests | Coverage |
|---------|-------|----------|
| Users | 17 | 100% |
| Projects | 19 | 97.26% |
| Courses | 14 | 100% |
| Posts | 13 | 100% |
| Comments | 14 | 100% |
| Votes | 17 | 100% |

## Test Files Location

```
apps/api/src/
├── users/users.service.spec.ts          # 17 tests
├── projects/projects.service.spec.ts    # 19 tests
├── courses/courses.service.spec.ts      # 14 tests
├── posts/posts.service.spec.ts          # 13 tests
├── comments/comments.service.spec.ts    # 14 tests
└── votes/votes.service.spec.ts          # 17 tests
```

## Test Configuration

- **Framework**: Jest 29
- **Test Environment**: Node
- **Coverage Tool**: Istanbul (via Jest)
- **Mock Strategy**: PrismaService mocking
- **Timeout**: 10 seconds per test

## Coverage Reports

커버리지 리포트는 `apps/api/coverage/` 디렉토리에 생성됩니다:

```
coverage/
├── lcov-report/index.html    # HTML report (브라우저에서 확인)
├── lcov.info                 # LCOV format (CI/CD용)
├── coverage-summary.json     # JSON summary
└── ...
```

HTML 리포트 열기:
```bash
open coverage/lcov-report/index.html
```

## Test Patterns

### 1. Service Test Template
```typescript
describe('ServiceName', () => {
  let service: ServiceName
  let prisma: PrismaService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<ServiceName>(ServiceName)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should test something', async () => {
    // Arrange
    mockPrismaService.model.method.mockResolvedValue(data)

    // Act
    const result = await service.method(params)

    // Assert
    expect(result).toEqual(expected)
  })
})
```

### 2. Mock Setup
```typescript
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}
```

### 3. Error Testing
```typescript
it('should throw NotFoundException', async () => {
  mockPrismaService.user.findUnique.mockResolvedValue(null)

  await expect(service.findById('id')).rejects.toThrow(NotFoundException)
})
```

## CI/CD Integration

테스트는 GitHub Actions에서 자동으로 실행됩니다:

```yaml
- name: Run tests
  run: cd apps/api && pnpm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./apps/api/coverage/lcov.info
```

## Troubleshooting

### Tests not found
Jest 설정을 확인하세요:
```javascript
// jest.config.js
testMatch: [
  '<rootDir>/src/**/*.spec.ts',
  '<rootDir>/src/**/*.test.ts',
]
```

### Mock not working
Mock이 각 테스트 전에 초기화되는지 확인:
```typescript
beforeEach(() => {
  jest.clearAllMocks()
})
```

### Timeout errors
복잡한 테스트의 경우 timeout 증가:
```typescript
jest.setTimeout(20000) // 20 seconds
```

## Best Practices

1. **독립성**: 각 테스트는 독립적이어야 합니다
2. **명확성**: 테스트 이름은 테스트 내용을 명확히 표현
3. **완전성**: 성공 케이스와 실패 케이스 모두 테스트
4. **효율성**: 불필요한 데이터베이스 호출 방지 (mock 사용)
5. **유지보수성**: 공통 mock 데이터는 상수로 정의

## Related Documentation

- [TEST_GUIDE.md](./TEST_GUIDE.md) - 상세 테스트 가이드
- [TEST_RESULTS.md](./TEST_RESULTS.md) - 테스트 결과 상세 리포트
- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
