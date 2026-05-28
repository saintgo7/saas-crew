# API 명세서: saas-crew (Next.js Route Handlers)

## 1. 문서 정보

본 문서는 항공사 객실 승무원 스케줄, 자격 관리 및 정산 시스템인 `saas-crew`의 API 설계 표준을 정의한다. 본 시스템은 Next.js 14 App Router의 Route Handlers를 기반으로 하며, 서버리스 환경과 셀프 호스팅 환경 모두에서 일관된 인터페이스를 제공하는 것을 목적으로 한다.

### 1.1 변경 이력
| 버전 | 날짜 | 작성자 | 변경 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0.0 | 2024-05-22 | 시스템 설계팀 | 초기 API 명세 정의 및 RBAC 구조 설계 | 최초 작성 |

### 1.2 관련 문서
- 데이터 모델 정의서 (Drizzle ORM Schema)
- RBAC 권한 매트릭스 (Role-Based Access Control)
- 정산 로직 상세 설계서 (Toss Payments Integration)

---

## 2. API 원칙

`saas-crew` API는 개발 생산성 향상과 런타임 안정성을 위해 `createHandler` 패턴과 `Zod` 스키마 검증을 강제한다.

### 2.1 설계 원칙
- **Type-Safe Interface**: 모든 요청(Request)과 응답(Response)은 Zod 스키마를 통해 런타임 타입 검증을 수행하며, TypeScript 타입을 자동 추론하여 사용한다.
- **Stateless Architecture**: 모든 API 요청은 상태를 가지지 않으며, 인증 정보는 JWT(NextAuth.js)를 통해 전달된다.
- **Atomic Operations**: 정산 및 스케줄 확정 등 데이터 무결성이 중요한 작업은 PostgreSQL 트랜잭션을 통해 원자성을 보장한다.
- **Consistent Response**: 성공과 실패 여부와 관계없이 정의된 표준 응답 포맷을 준수하여 프론트엔드(TanStack Query)의 에러 핸들링을 최적화한다.

### 2.2 구현 패턴 (createHandler)
모든 Route Handler는 다음과 같은 래퍼 함수 구조를 따른다.
`createHandler(schema, handler, options)`
- `schema`: Zod 객체 (Request Body/Query 검증)
- `handler`: 실제 비즈니스 로직을 처리하는 함수
- `options`: RBAC 권한 설정 (`requiredRoles`)

---

## 3. 인증 (NextAuth)

본 시스템은 `NextAuth.js v5`를 사용하여 세션 기반 인증과 RBAC(역할 기반 접근 제어)를 구현한다.

### 3.1 인증 메커니즘
- **인증 방식**: Credentials Provider 기반의 JWT 전략을 사용한다.
- **세션 관리**: HTTP-only 쿠키를 통해 세션 토큰을 관리하며, CSRF 보호가 기본 적용된다.
- **권한 검증**: 미들웨어 및 Route Handler 레벨에서 `auth()` 함수를 호출하여 사용자의 Role을 확인한다.

### 3.2 RBAC 역할 정의
| 역할 코드 | 명칭 | 설명 | 주요 권한 |
| :--- | :--- | :--- | :--- |
| **G** | Guest | 미인증 사용자 | 공개 페이지 조회 |
| **CA** | Cabin Attendant | 객실 승무원 | 본인 스케줄 조회, 정산 내역 확인 |
| **SC** | Schedule Coordinator | 스케줄 조정자 | 승무원 스케줄 배정 및 수정 |
| **QM** | Qualification Manager | 자격 관리자 | 승무원 자격 갱신 및 인증서 관리 |
| **PA** | Payroll Admin | 정산 관리자 | 정산금 확정 및 토스페이먼츠 지급 처리 |
| **SA** | System Admin | 시스템 관리자 | 전체 설정, 사용자 계정 및 권한 관리 |

---

## 4. 엔드포인트 목록

### 4.1 스케줄 관리 (Scheduling)
| 메서드 | 엔드포인트 | 권한 | 설명 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/schedule` | CA, SC, SA | 월간 스케줄 목록 조회 | 쿼리 파라미터(month) 필수 |
| POST | `/api/schedule/assign` | SC, SA | 승무원별 비행 스케줄 배정 | Drizzle Range Type 활용 |
| PATCH | `/api/schedule/confirm` | SC, SA | 스케줄 최종 확정 처리 | North Star Metric 측정 지점 |

### 4.2 자격 관리 (Qualification)
| 메서드 | 엔드포인트 | 권한 | 설명 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/qualifications` | CA, QM, SA | 승무원 자격 보유 현황 조회 | - |
| PUT | `/api/qualifications/update` | QM, SA | 자격 만료일 및 등급 갱신 | - |

### 4.3 정산 관리 (Payroll)
| 메서드 | 엔드포인트 | 권한 | 설명 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/payroll/me` | CA | 본인 월별 정산 명세서 조회 | - |
| POST | `/api/payroll/calculate` | PA, SA | 비행 시간 기반 정산금 자동 계산 | BullMQ 비동기 처리 |
| POST | `/api/payroll/disburse` | PA, SA | 토스페이먼츠 API 연동 지급 실행 | 외부 API 연동 |

---

## 5. 요청/응답 포맷

### 5.1 요청 포맷 (Request)
- **Content-Type**: `application/json`
- **Body**: Zod 스키마에 정의된 JSON 객체

```json
// 예시: 스케줄 배정 요청
{
  "crewId": "crew_12345",
  "flightId": "KE101",
  "startTime": "2024-06-01T08:00:00Z",
  "endTime": "2024-06-01T15:00:00Z"
}
```

### 5.2 응답 포맷 (Response)
모든 응답은 일관된 래퍼 객체를 가진다.

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": { ... },
  "message": "요청이 성공적으로 처리되었습니다."
}
```

**실패 응답 (4xx, 5xx)**
```json
{
  "success": false,
  "error": {
    "code": "ERR_AUTH_FORBIDDEN",
    "message": "해당 리소스에 접근할 권한이 없습니다."
  }
}
```

---

## 6. 에러 응답 표준

시스템 전반에서 발생하는 에러는 정의된 에러 코드를 사용하여 프론트엔드에서 대응한다.

| 에러 코드 | HTTP 상태 코드 | 의미 | 대응 방안 |
| :--- | :--- | :--- | :--- |
| `ERR_INVALID_INPUT` | 400 | Zod 검증 실패 | 입력 폼 유효성 검사 메시지 출력 |
| `ERR_AUTH_REQUIRED` | 401 | 인증 토큰 누락/만료 | 로그인 페이지로 리다이렉트 |
| `ERR_AUTH_FORBIDDEN` | 403 | RBAC 권한 부족 | 접근 제한 안내 모달 표시 |
| `ERR_NOT_FOUND` | 404 | 리소스 존재하지 않음 | 404 페이지 또는 알림 표시 |
| `ERR_CONFLICT` | 409 | 스케줄 중복/충돌 | 스케줄 조정 제안 UI 표시 |
| `ERR_INTERNAL_SERVER` | 500 | 서버 내부 오류 | 시스템 관리자 문의 안내 |

---

## 7. Rate Limiting

시스템 자원 보호 및 API 남용 방지를 위해 Redis 기반의 Rate Limiting을 적용한다.

### 7.1 제한 정책
- **일반 사용자 (CA)**: 엔드포인트당 분당 60회 요청 제한.
- **관리자 (SC, QM, PA, SA)**: 엔드포인트당 분당 200회 요청 제한.
- **외부 API (Toss Payments)**: 토스페이먼츠 API 가이드라인에 따른 요청 제한 준수.

### 7.2 초과 시 처리
- **HTTP 상태 코드**: `429 Too Many Requests` 반환.
- **응답 헤더**: `Retry-After` 헤더를 통해 재시도 가능 시간을 초 단위로 명시한다.
- **처리 로직**: Redis의 Fixed Window Counter 알고리즘을 사용하여 요청 수를 카운팅한다.