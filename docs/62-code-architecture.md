# 코드 아키텍처 문서: saas-crew

## 1. 문서 정보

본 문서는 항공사 객실 승무원 스케줄, 자격 관리 및 정산 시스템인 `saas-crew`의 소프트웨어 아키텍처 설계를 정의한다. 본 시스템은 복잡한 시간 범위 데이터 처리와 엄격한 권한 제어가 필요하며, 이를 위해 `sap-16doc` 패턴을 기반으로 설계되었다.

### 1.1 문서 이력
| 버전 | 날짜 | 작성자 | 변경 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-05-22 | 아키텍트 | 초기 아키텍처 설계 및 디렉토리 구조 정의 | 초안 |

### 1.2 핵심 지표 (North Star Metric)
- **지표**: 월간 활성 승무원당 스케줄 확정 소요 시간 (Time-to-Finalize Schedule per Crew)
- **목표**: 스케줄링 매니저(QM)의 수동 배정 시간을 단축하고, 승무원(CA/SC)의 스케줄 확인 및 확정 프로세스를 자동화하여 운영 효율을 극대화한다.

---

## 2. 디렉토리 트리

`Next.js 14 App Router` 구조를 기반으로 하며, 비즈니스 로직의 응집도를 높이기 위해 `src/` 하위에 도메인 중심의 레이어를 구성한다.

```text
src/
├── app/                    # Next.js App Router (Routing & UI)
│   ├── (auth)/             # 인증 관련 페이지
│   ├── (dashboard)/        # 권한별 대시보드 (QM, CA, SA 등)
│   └── api/                # Route Handlers (HTTP Entry Point)
├── components/             # UI 컴포넌트
│   ├── ui/                 # shadcn/ui 공통 컴포넌트
│   └── shared/             # 도메인 공통 컴포넌트
├── lib/                    # 인프라 및 공통 유틸리티
│   ├── http/               # createHandler, Response Wrapper
│   ├── permissions/        # RBAC (Role-Based Access Control) 로직
│   ├── services/           # 비즈니스 로직 (Domain Services)
│   └── db/                 # Drizzle ORM 설정 및 Schema
├── store/                  # Zustand 상태 관리
├── hooks/                  # TanStack Query 커스텀 훅
└── types/                  # TypeScript 타입 정의
```

---

## 3. createHandler 패턴

`lib/http/createHandler`는 API Route Handler의 반복적인 try-catch 블록을 제거하고, 일관된 응답 형식을 보장하기 위한 고차 함수(Higher-Order Function) 패턴이다.

### 3.1 구현 구조
모든 API 핸들러는 `createHandler`로 래핑되어 실행되며, 내부적으로 `DomainError`를 감지하여 적절한 HTTP 상태 코드로 변환한다.

| 구성 요소 | 역할 | 비고 |
| :--- | :--- | :--- |
| `Request` | 클라이언트 요청 데이터 및 인증 세션 수신 | NextRequest 기반 |
| `Handler` | 실제 비즈니스 로직을 호출하는 비동기 함수 | `Promise<Response>` 반환 |
| `Wrapper` | 에러 핸들링 및 표준 JSON 응답 포맷팅 | `createHandler` 내부 로직 |

### 3.2 처리 흐름
`Client Request` $\rightarrow$ `createHandler` $\rightarrow$ `RBAC 검증` $\rightarrow$ `Service 호출` $\rightarrow$ `Standard Response`

---

## 4. DomainError 계층

시스템 내에서 발생하는 예외를 체계적으로 관리하기 위해 `DomainError` 클래스 계층을 운용한다. 이는 단순한 런타임 에러와 비즈니스 규칙 위반을 구분하여 클라이언트에게 정확한 피드백을 제공하기 위함이다.

### 4.1 에러 분류
| 에러 클래스 | HTTP 상태 코드 | 발생 상황 | 예시 |
| :--- | :--- | :--- | :--- |
| `BadRequestError` | 400 | 입력 값 검증 실패 | 잘못된 비행 시간 범위 입력 |
| `UnauthorizedError` | 401 | 인증 세션 만료 또는 부재 | 로그인하지 않은 사용자의 접근 |
| `ForbiddenError` | 403 | RBAC 권한 부족 | CA가 QM의 스케줄 수정 시도 |
| `NotFoundError` | 404 | 리소스 존재하지 않음 | 존재하지 않는 승무원 ID 조회 |
| `ConflictError` | 409 | 비즈니스 제약 조건 충돌 | 승무원 자격(Qualification) 미달 배정 |

---

## 5. 서비스 레이어

`lib/services`는 데이터베이스 접근(Drizzle ORM)과 비즈니스 로직을 결합한 레이어이다. API 핸들러는 서비스 레이어의 메서드만 호출하며, 직접적인 DB 쿼리를 수행하지 않는다.

### 5.1 주요 서비스 도메인
- **ScheduleService**: PostgreSQL의 `tstzrange` 타입을 활용하여 비행 스케줄의 중복을 방지하고, 승무원별 가용 시간을 계산한다.
- **QualificationService**: 승무원의 자격증 만료일 및 기종 자격을 검증하여 배정 가능 여부를 판단한다.
- **SettlementService**: 토스페이먼츠 API와 연동하여 비행 수당을 계산하고 정산금을 지급 처리한다.
- **DocumentService**: Puppeteer를 통해 월별 정산 명세서를 PDF로 생성하고 Cloudflare R2에 저장한다.

---

## 6. Zustand 스토어

`Zustand`는 클라이언트 사이드에서 전역적으로 공유되어야 하는 가벼운 상태를 관리한다. 복잡한 서버 데이터는 TanStack Query가 담당하며, Zustand는 UI 상태 및 사용자 세션 정보에 집중한다.

### 6.1 스토어 설계
| 스토어 명 | 관리 상태 | 업데이트 트리거 |
| :--- | :--- | :--- |
| `useAuthStore` | 현재 사용자 프로필, RBAC 역할 (G, CA, SC, QM, PA, SA) | 로그인/로그아웃 |
| `useScheduleStore` | 캘린더 뷰 필터, 선택된 승무원 ID, 드래그 앤 드롭 임시 상태 | UI 인터랙션 |
| `useUiStore` | 사이드바 개폐 여부, 모달 상태, 알림 메시지 | 사용자 이벤트 |

---

## 7. React Query

`TanStack Query`는 서버 상태(Server State)의 캐싱 및 동기화를 담당한다. 특히 승무원 스케줄과 같이 빈번하게 조회되지만 업데이트 주기가 정해진 데이터를 효율적으로 관리한다.

### 7.1 캐싱 전략
- **Query Keys**: `['schedules', crewId, month]`와 같이 계층적 키 구조를 사용하여 특정 승무원의 특정 월 데이터만 정밀하게 무효화(Invalidation)한다.
- **Stale Time**: 스케줄 확정 전 데이터는 `5분`으로 설정하여 빈번한 API 호출을 방지하고, 확정 후 데이터는 `30분`으로 설정하여 성능을 최적화한다.
- **Optimistic Updates**: 스케줄 변경 시 UI에 즉시 반영하고, 서버 응답 실패 시 롤백하는 낙관적 업데이트를 적용하여 사용자 경험을 개선한다.