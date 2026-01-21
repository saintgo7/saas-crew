# Phase 3: 프로젝트 관리 시스템 백엔드 구축 완료

## 구현 개요

WKU Software Crew 프로젝트의 Phase 3에서 프로젝트 관리 시스템의 백엔드 API를 성공적으로 구축했습니다.

## 구현된 파일 목록

### DTO (Data Transfer Objects)
```
apps/api/src/projects/dto/
├── create-project.dto.ts    # 프로젝트 생성 DTO
├── update-project.dto.ts    # 프로젝트 수정 DTO
├── project-query.dto.ts     # 쿼리 파라미터 DTO (필터링, 검색, 페이지네이션)
├── add-member.dto.ts        # 멤버 추가 DTO
└── index.ts                 # DTO exports
```

### Core Module Files
```
apps/api/src/projects/
├── projects.controller.ts   # HTTP 요청 처리 (7개 엔드포인트)
├── projects.service.ts      # 비즈니스 로직 및 권한 검증
├── projects.module.ts       # NestJS 모듈 정의
└── README.md               # API 문서
```

### Test Files
```
apps/api/test/
└── projects.http           # REST Client 테스트 파일 (16개 테스트 시나리오)
```

## 구현된 API 엔드포인트

### 1. GET /api/projects
- **기능**: 프로젝트 목록 조회
- **권한**: Public
- **필터링**: visibility, tags, search
- **페이지네이션**: page, limit
- **응답**: 프로젝트 목록 + 메타데이터

### 2. POST /api/projects
- **기능**: 프로젝트 생성
- **권한**: JWT 인증 필요
- **자동 처리**: 생성자를 OWNER로 자동 할당
- **검증**: slug 중복 체크

### 3. GET /api/projects/:id
- **기능**: 프로젝트 상세 조회
- **권한**: Public
- **포함**: 멤버 목록 및 사용자 정보

### 4. PATCH /api/projects/:id
- **기능**: 프로젝트 정보 수정
- **권한**: OWNER 또는 ADMIN
- **검증**: 역할 기반 권한 체크

### 5. DELETE /api/projects/:id
- **기능**: 프로젝트 삭제
- **권한**: OWNER만 가능
- **처리**: Cascade 삭제 (멤버 자동 제거)

### 6. POST /api/projects/:id/members
- **기능**: 프로젝트 멤버 추가
- **권한**: OWNER 또는 ADMIN
- **검증**:
  - 사용자 존재 확인
  - 중복 멤버 체크
  - ADMIN은 OWNER 역할 추가 불가

### 7. DELETE /api/projects/:id/members/:userId
- **기능**: 프로젝트 멤버 제거
- **권한**: OWNER 또는 ADMIN
- **제약**:
  - OWNER 제거 불가
  - ADMIN은 다른 ADMIN 제거 불가

## 권한 시스템 구현

### 역할 (ProjectRole)
1. **OWNER**: 프로젝트 소유자
   - 프로젝트 삭제 권한
   - 모든 멤버 관리
   - 프로젝트 수정

2. **ADMIN**: 관리자
   - 멤버 추가/제거 (OWNER 제외)
   - 프로젝트 수정

3. **MEMBER**: 일반 멤버
   - 프로젝트 참여

4. **VIEWER**: 조회 전용
   - 읽기 권한만

### 가시성 (Visibility)
- **PUBLIC**: 모든 사용자 조회 가능
- **PRIVATE**: 멤버만 조회 가능
- **TEAM**: 팀 멤버만 조회 가능

## 비즈니스 로직 구현

### ProjectsService 주요 메서드

```typescript
// 목록 조회 (필터링, 검색, 페이지네이션)
findAll(query: ProjectQueryDto)

// 프로젝트 생성 (OWNER 자동 할당)
create(dto: CreateProjectDto, userId: string)

// 프로젝트 상세 조회 (멤버 포함)
findById(id: string)

// 프로젝트 수정 (권한 검증)
update(id: string, dto: UpdateProjectDto, userId: string)

// 프로젝트 삭제 (OWNER만)
delete(id: string, userId: string)

// 멤버 추가 (권한 검증, 중복 체크)
addMember(projectId: string, dto: AddMemberDto, requesterId: string)

// 멤버 제거 (권한 검증)
removeMember(projectId: string, userId: string, requesterId: string)

// 접근 권한 체크 (헬퍼 메서드)
checkAccess(projectId: string, userId: string | null)
```

## 데이터 검증

### CreateProjectDto
- `name`: 2-100자, 필수
- `slug`: 2-100자, 필수, 고유
- `description`: 500자 이하, 선택
- `visibility`: enum, 선택
- `githubRepo`: URL 형식, 선택
- `deployUrl`: URL 형식, 선택
- `tags`: 문자열 배열, 선택
- `coverImage`: URL 형식, 선택

### UpdateProjectDto
- 모든 필드 optional
- CreateProjectDto에서 slug 제외

### ProjectQueryDto
- `visibility`: enum
- `tags`: 쉼표 구분 문자열
- `search`: 검색어
- `page`: 1 이상 정수
- `limit`: 1 이상 정수

### AddMemberDto
- `userId`: 문자열, 필수
- `role`: enum, 필수

## 에러 처리

### 구현된 예외 처리
- `NotFoundException`: 리소스 없음 (404)
- `ForbiddenException`: 권한 없음 (403)
- `ConflictException`: 중복 (409)
- `BadRequestException`: 잘못된 요청 (400)

### 권한 검증 시나리오
1. 프로젝트 수정: OWNER/ADMIN 확인
2. 프로젝트 삭제: OWNER 확인
3. 멤버 추가: OWNER/ADMIN 확인, OWNER 역할 추가 제한
4. 멤버 제거: OWNER/ADMIN 확인, OWNER 제거 금지, ADMIN 간 제거 금지

## Clean Architecture 패턴

### 계층 구조
```
Controller (HTTP Layer)
    ↓
Service (Business Logic Layer)
    ↓
Repository (Data Access Layer - Prisma)
```

### 의존성 방향
- Controller → Service
- Service → Prisma (Repository)
- DTO는 각 계층에서 사용

### 관심사 분리
- **Controller**: HTTP 요청/응답 처리, 인증 가드
- **Service**: 비즈니스 로직, 권한 검증, 데이터 변환
- **DTO**: 데이터 검증, 타입 안전성

## 데이터베이스 스키마

### Project 모델
```prisma
model Project {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  description String?      @db.Text
  visibility  Visibility   @default(PRIVATE)
  githubRepo  String?
  deployUrl   String?
  members     ProjectMember[]
  tags        String[]
  coverImage  String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

### ProjectMember 모델
```prisma
model ProjectMember {
  id        String      @id @default(cuid())
  projectId String
  userId    String
  role      ProjectRole @default(MEMBER)
  joinedAt  DateTime    @default(now())

  @@unique([projectId, userId])
}
```

## 테스트 가능성

### HTTP 테스트 파일 포함
- 16개 테스트 시나리오
- REST Client로 즉시 테스트 가능
- 다양한 권한 및 가시성 조합 테스트

### 테스트 시나리오
1. 기본 CRUD 작업
2. 필터링 및 검색
3. 페이지네이션
4. 멤버 관리
5. 권한 검증
6. 에러 케이스

## 보안 구현

### 인증
- JWT 기반 토큰 인증
- Passport Guard 사용

### 권한 체크
- 서비스 레이어에서 역할 기반 검증
- 프라이빗 헬퍼 메서드로 중복 제거

### 입력 검증
- class-validator를 통한 자동 검증
- DTO 레벨 타입 안전성

## 성능 고려사항

### 데이터베이스 쿼리 최적화
- `select`로 필요한 필드만 조회
- `include`로 관계 데이터 eager loading
- `_count`로 집계 최적화

### 페이지네이션
- `skip`/`take`를 사용한 오프셋 페이지네이션
- 메타데이터 포함 (total, totalPages)

### 인덱스 활용
- Prisma 스키마의 인덱스 정의 활용
- `slug`의 unique 인덱스 활용

## AppModule 통합

```typescript
// apps/api/src/app.module.ts
imports: [
  ConfigModule,
  PrismaModule,
  AuthModule,
  UsersModule,
  ProjectsModule,  // ✅ Phase 3에서 추가
]
```

## 빌드 확인

- TypeScript 컴파일 성공
- 모든 타입 에러 없음
- NestJS 빌드 완료

## 다음 단계 (Phase 4 준비)

### 권장 개선 사항
1. 단위 테스트 작성 (Jest)
2. E2E 테스트 작성
3. API 문서 자동화 (Swagger)
4. 프로젝트 통계 API
5. GitHub 연동 (커밋, 이슈 등)
6. 실시간 알림 (WebSocket)

### 프론트엔드 통합
- React Query로 API 연동
- 프로젝트 목록 페이지
- 프로젝트 상세 페이지
- 프로젝트 생성/수정 폼
- 멤버 관리 UI

## 참고 문서

- API 상세 문서: `/apps/api/src/projects/README.md`
- HTTP 테스트: `/apps/api/test/projects.http`
- Prisma 스키마: `/apps/api/prisma/schema.prisma`
- Users API (Phase 2): `/apps/api/src/users/`

## 구현 완료 체크리스트

- [x] DTO 정의 (4개)
- [x] Service 구현 (비즈니스 로직)
- [x] Controller 구현 (7개 엔드포인트)
- [x] Module 정의
- [x] 권한 시스템 구현
- [x] 에러 처리
- [x] 입력 검증
- [x] AppModule 통합
- [x] TypeScript 빌드 확인
- [x] API 문서 작성
- [x] HTTP 테스트 파일 작성

## 파일 경로 요약

### 메인 파일
- `/Users/saint/01_DEV/saas-crew/apps/api/src/projects/projects.controller.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/projects/projects.service.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/projects/projects.module.ts`

### DTO 파일
- `/Users/saint/01_DEV/saas-crew/apps/api/src/projects/dto/create-project.dto.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/projects/dto/update-project.dto.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/projects/dto/project-query.dto.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/projects/dto/add-member.dto.ts`

### 문서 및 테스트
- `/Users/saint/01_DEV/saas-crew/apps/api/src/projects/README.md`
- `/Users/saint/01_DEV/saas-crew/apps/api/test/projects.http`

Phase 3 구축 완료!
