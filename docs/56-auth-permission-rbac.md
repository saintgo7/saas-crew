# RBAC 매트릭스 (인증 및 권한)

**프로젝트**: saas-crew
**문서 번호**: AUTH-RBAC-01
**버전**: 1.0.0
**상태**: Draft

## 변경 이력
| 버전 | 날짜 | 작성자 | 변경 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| 1.0.0 | 2024-05-22 | 시스템 설계자 | 초기 RBAC 매트릭스 및 권한 체계 정의 | 신규 작성 |

---

## 1. 인증 방식 (NextAuth)
본 시스템은 `NextAuth.js v5 (Auth.js)`를 기반으로 한 **Credentials Provider** 인증 방식을 채택한다. 보안 및 성능 최적화를 위해 다음과 같은 메커니즘을 적용한다.

- **세션 관리**: JWT(JSON Web Token) 기반의 Stateless 세션을 사용하여 서버 부하를 최소화하며, `Next.js Middleware`를 통해 요청 단계에서 인증 여부를 검증한다.
- **토큰 구조**: JWT 페이로드 내에 `userId`, `role`, `organizationId`를 포함하여, API 요청 시마다 DB 조회 없이 1차적인 역할 기반 접근 제어(RBAC)를 수행한다.
- **인증 흐름**: 사용자 로그인 $\rightarrow$ Credentials 검증 $\rightarrow$ JWT 생성 및 쿠키 저장 $\rightarrow$ Middleware 권한 체크 $\rightarrow$ 페이지/API 접근 허용.
- **보안 강화**: HTTP-only, Secure, SameSite=Lax 설정의 쿠키를 사용하여 XSS 및 CSRF 공격을 방지하며, 비밀번호는 `bcrypt`를 통해 단방향 해싱 처리한다.

## 2. 역할 체계
시스템의 복잡한 스케줄링 및 정산 프로세스를 관리하기 위해 6가지 세분화된 역할을 정의한다. 각 역할은 상위 역할의 권한을 일부 포함하거나 특정 도메인에 특화된 권한을 가진다.

| 역할 코드 | 역할 명칭 | 페르소나 예시 | 주요 책임 및 권한 범위 |
| :--- | :--- | :--- | :--- |
| **G** | Global Admin | 시스템 운영자 | 전체 테넌트 관리, 시스템 설정, 마스터 데이터 제어 |
| **QM** | Quality Manager | 이정훈 (매니저) | 전 승무원 스케줄 확정, 자격 검증, 정산 최종 승인 |
| **PA** | Payroll Admin | 정산 담당자 | 비행 수당 계산, 토스페이먼츠 연동 지급 처리, 명세서 발행 |
| **SA** | Scheduling Asst | 스케줄 보조 | 초안 스케줄 작성, 승무원 휴가 요청 1차 검토 |
| **CA** | Cabin Chief | 사무장 | 소속 팀원 스케줄 조정 제안, 팀 내 자격 현황 모니터링 |
| **SC** | Crew | 박소희 (승무원) | 본인 스케줄 조회, 자격 증명 업로드, 정산 내역 확인 |

## 3. FN-ID 체계
기능 식별자(Function ID)는 `[도메인]-[대분류]-[순번]` 형식으로 정의하며, 이는 `matrix.ts`의 키 값과 1:1로 매칭된다.

| 도메인 | 식별자 | 설명 | 관련 기능 |
| :--- | :--- | :--- | :--- |
| **SCH** | Schedule | 스케줄 관리 | SCH-01(조회), SCH-02(작성), SCH-03(확정), SCH-04(수정) |
| **CERT** | Certification | 자격 관리 | CERT-01(조회), CERT-02(승인), CERT-03(업로드) |
| **PAY** | Payroll | 정산 관리 | PAY-01(계산), PAY-02(지급), PAY-03(명세서 발행) |
| **USER** | User/Org | 계정 및 조직 | USER-01(계정 생성), USER-02(역할 변경), USER-03(프로필 수정) |
| **SYS** | System | 시스템 설정 | SYS-01(로그 조회), SYS-02(API 설정), SYS-03(백업) |

## 4. 권한 매트릭스
각 역할별 기능 접근 권한을 정의한다. `O`: 허용, `X`: 거부, `C`: 조건부 허용(상세 섹션 참조).

| FN-ID | 기능명 | G | QM | PA | SA | CA | SC | 비고 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **SCH-01** | 스케줄 조회 | O | O | O | O | O | O | SC는 본인 것만 |
| **SCH-02** | 스케줄 작성 | O | O | X | O | C | X | CA는 팀 내 한정 |
| **SCH-03** | 스케줄 확정 | O | O | X | X | X | X | North Star 지표 관련 |
| **SCH-04** | 스케줄 수정 | O | O | X | O | C | X | 확정 전 단계만 가능 |
| **CERT-01** | 자격 현황 조회 | O | O | O | O | O | O | SC는 본인 것만 |
| **CERT-02** | 자격 승인/갱신 | O | O | X | X | X | X | QM 전담 |
| **CERT-03** | 자격 증빙 업로드 | O | O | X | X | X | O | R2 스토리지 연동 |
| **PAY-01** | 정산금 계산 | O | O | O | X | X | X | BullMQ 배치 처리 |
| **PAY-02** | 정산금 지급 | O | X | O | X | X | X | 토스페이먼츠 API |
| **PAY-03** | 명세서 PDF 발행 | O | O | O | X | X | O | Puppeteer 생성 |
| **USER-01** | 계정 생성/삭제 | O | X | X | X | X | X | G 전담 |
| **USER-02** | 역할 부여/변경 | O | X | X | X | X | X | G 전담 |
| **USER-03** | 프로필 정보 수정 | O | O | O | O | O | O | 본인 정보 한정 |
| **SYS-01** | 감사 로그 조회 | O | O | X | X | X | X | 보안 감사용 |
| **SYS-02** | 시스템 설정 변경 | O | X | X | X | X | X | G 전담 |

## 5. 조건부 권한
매트릭스 내 `C`로 표시된 권한은 다음과 같은 비즈니스 로직에 의해 동적으로 제어된다.

1. **SCH-02 / SCH-04 (CA 권한)**:
   - 조건: `User.teamId === TargetCrew.teamId`
   - 설명: 사무장(CA)은 자신이 관리하는 팀 소속 승무원의 스케줄에 대해서만 작성 및 수정 제안 권한을 가진다.
2. **SCH-01 / CERT-01 / USER-03 (SC 권한)**:
   - 조건: `User.id === TargetResource.ownerId`
   - 설명: 일반 승무원(SC)은 데이터의 소유자가 본인인 경우에만 조회 및 수정이 가능하다.
3. **SCH-04 (수정 권한 일반)**:
   - 조건: `Schedule.status === 'DRAFT'`
   - 설명: 스케줄 상태가 '확정(FINALIZED)'인 경우, QM 이상의 권한자라도 수정 시 별도의 '변경 이력 로그'를 남겨야 하며, 일반 수정은 불가능하다.

## 6. 코드 구현
본 매트릭스는 `src/lib/auth/matrix.ts` 파일에 상수로 정의되어 프론트엔드(UI 렌더링 제어)와 백엔드(API 가드)에서 동일하게 참조된다.

```typescript
// src/lib/auth/matrix.ts
export type Role = 'G' | 'QM' | 'PA' | 'SA' | 'CA' | 'SC';
export type Permission = 'O' | 'X' | 'C';

export const RBAC_MATRIX: Record<string, Record<Role, Permission>> = {
  'SCH-01': { G: 'O', QM: 'O', PA: 'O', SA: 'O', CA: 'O', SC: 'O' },
  'SCH-02': { G: 'O', QM: 'O', PA: 'X', SA: 'O', CA: 'C', SC: 'X' },
  'SCH-03': { G: 'O', QM: 'O', PA: 'X', SA: 'X', CA: 'X', SC: 'X' },
  'SCH-04': { G: 'O', QM: 'O', PA: 'X', SA: 'O', CA: 'C', SC: 'X' },
  'CERT-01': { G: 'O', QM: 'O', PA: 'O', SA: 'O', CA: 'O', SC: 'O' },
  'CERT-02': { G: 'O', QM: 'O', PA: 'X', SA: 'X', CA: 'X', SC: 'X' },
  'CERT-03': { G: 'O', QM: 'O', PA: 'X', SA: 'X', CA: 'X', SC: 'O' },
  'PAY-01': { G: 'O', QM: 'O', PA: 'O', SA: 'X', CA: 'X', SC: 'X' },
  'PAY-02': { G: 'O', QM: 'X', PA: 'O', SA: 'X', CA: 'X', SC: 'X' },
  'PAY-03': { G: 'O', QM: 'O', PA: 'O', SA: 'X', CA: 'X', SC: 'O' },
  'USER-01': { G: 'O', QM: 'X', PA: 'X', SA: 'X', CA: 'X', SC: 'X' },
  'USER-02': { G: 'O', QM: 'X', PA: 'X', SA: 'X', CA: 'X', SC: 'X' },
  'USER-03': { G: 'O', QM: 'O', PA: 'O', SA: 'O', CA: 'O', SC: 'O' },
  'SYS-01': { G: 'O', QM: 'O', PA: 'X', SA: 'X', CA: 'X', SC: 'X' },
  'SYS-02': { G: 'O', QM: 'X', PA: 'X', SA: 'X', CA: 'X', SC: 'X' },
};

export function checkPermission(role: Role, fnId: string): Permission {
  return RBAC_MATRIX[fnId]?.[role] ?? 'X';
}
```

## 7. 테스트
권한 검증의 무결성을 보장하기 위해 다음과 같은 테스트 케이스를 수행한다.

- **Positive Test**: QM 역할의 사용자가 `SCH-03`(스케줄 확정) API 호출 시 `200 OK` 응답을 받는지 확인.
- **Negative Test**: SC 역할의 사용자가 `PAY-02`(정산금 지급) API 호출 시 `403 Forbidden` 응답을 받는지 확인.
- **Conditional Test**: CA 역할의 사용자가 타 팀 승무원의 스케줄을 수정 시도할 때 `403 Forbidden`이 발생하는지 확인.
- **Session Test**: JWT 만료 후 `NextAuth` 세션 갱신 실패 시 모든 권한이 `X`로 처리되어 로그인 페이지로 리다이렉트 되는지 확인.

## 8. 감사 로그
권한 남용 방지 및 사고 추적을 위해 모든 권한 변경 및 중요 기능 실행 내역을 PostgreSQL `audit_logs` 테이블에 기록한다.

- **기록 대상**: 
  - `USER-02` (역할 변경) 모든 내역
  - `SCH-03` (스케줄 확정) 수행자 및 시각
  - `PAY-02` (정산금 지급) 처리 금액 및 승인자
  - `403 Forbidden` 발생 빈도가 높은 비정상 접근 시도
- **로그 필드**: `timestamp`, `userId`, `role`, `fnId`, `action`, `resourceId`, `ipAddress`, `userAgent`.
- **보관 주기**: 정산 데이터 관련 로그는 법적 근거에 따라 5년간 보관하며, 일반 접근 로그는 1년간 보관 후 아카이빙한다.