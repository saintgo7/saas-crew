# 인프라 패턴 정의서 (saas-crew)

## 1. 문서 정보

### 1.1 개요
본 문서는 `saas-crew` 프로젝트의 인프라 구성 요소 중 파일 저장, 감사 로그, 메시지 큐, 모니터링 체계에 대한 표준 패턴을 정의한다. 본 시스템은 항공사 승무원의 스케줄 및 정산 데이터를 다루므로 데이터 무결성과 추적 가능성을 최우선으로 설계되었다.

### 1.2 변경 이력
| 버전 | 날짜 | 작성자 | 변경 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-05-22 | 인프라 설계팀 | 초기 인프라 패턴 정의 (sap-16doc 기반) | 최초 작성 |

### 1.3 관련 정의
- **North Star**: 월간 활성 승무원당 스케줄 확정 소요 시간 (Time-to-Finalize Schedule per Crew)
- **RBAC 역할**: G(Global), CA(Chief), SC(Senior), QM(Manager), PA(Admin), SA(Staff)

---

## 2. R2 파일 업로드

### 2.1 저장소 전략
정산 명세서 및 증빙 서류 저장을 위해 S3 호환 스토리지인 Cloudflare R2를 사용한다. egress 비용이 발생하지 않는 특성을 활용하여 대규모 승무원 대상의 명세서 다운로드 부하를 최적화한다.

### 2.2 파일 처리 흐름
1. **업로드**: Puppeteer를 통해 생성된 PDF 명세서를 서버 사이드에서 R2 버킷으로 직접 전송한다.
2. **접근 제어**: 모든 파일은 Private으로 설정하며, Next.js Route Handlers를 통해 RBAC 권한 검증 후 `Presigned URL`을 생성하여 제공한다.
3. **생명 주기**: 정산 데이터 보존 법정 기간에 따라 5년 후 자동 삭제 정책(Lifecycle Rule)을 적용한다.

| 구분 | 설정 값 | 비고 |
| :--- | :--- | :--- |
| Storage | Cloudflare R2 | S3 API 호환 |
| Access | Presigned URL (Short-lived) | 보안 접근 제어 |
| Format | PDF (via Puppeteer) | 정산 명세서 표준 |

---

## 3. 감사 로그 (Audit Log)

### 3.1 기록 대상 및 범위
스케줄 변경 및 정산 금액 수정과 같이 민감한 데이터 변경 사항은 모두 감사 로그로 기록한다. 이는 운항관리팀(QM)과 관리자(PA) 간의 책임 소재를 명확히 하기 위함이다.

### 3.2 로그 스키마 및 저장
PostgreSQL 내 별도의 `audit_logs` 테이블에 저장하며, Drizzle ORM을 통해 트랜잭션 내에서 원자적으로 기록한다.

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `actor_id` | UUID | 변경을 수행한 사용자 ID |
| `action` | String | 수행 작업 (예: SCHEDULE_UPDATE, PAY_APPROVE) |
| `target_id` | UUID | 변경 대상 객체 ID |
| `before_value` | JSONB | 변경 전 데이터 스냅샷 |
| `after_value` | JSONB | 변경 후 데이터 스냅샷 |
| `timestamp` | Timestamptz | 이벤트 발생 시각 |

---

## 4. 이메일 큐 (Email Queue)

### 4.1 비동기 처리 아키텍처
스케줄 확정 알림 및 정산 완료 메일 발송 시 발생하는 지연 시간이 사용자 경험(UX)에 영향을 주지 않도록 BullMQ와 Redis를 이용한 비동기 큐 패턴을 적용한다.

### 4.2 큐 운영 프로세스
1. **Producer**: Next.js Route Handler에서 메일 발송 이벤트 발생 시 Redis 큐에 Job을 추가한다.
2. **Consumer**: 별도의 워커 프로세스가 큐를 모니터링하며 순차적으로 메일을 발송한다.
3. **Retry 전략**: 네트워크 오류 등으로 발송 실패 시 지수 백오프(Exponential Backoff) 전략을 사용하여 최대 3회 재시도한다.

| 구성 요소 | 기술 스택 | 역할 |
| :--- | :--- | :--- |
| Queue Manager | BullMQ | 작업 스케줄링 및 상태 관리 |
| Data Store | Redis | 메시지 브로커 및 상태 저장 |
| Worker | Node.js Process | 실제 메일 전송 로직 수행 |

---

## 5. 로깅 및 Sentry

### 5.1 구조화된 로깅 (Pino)
애플리케이션 로그는 JSON 형식의 구조화된 로그 라이브러리인 Pino를 사용한다. 이는 로그 수집 도구에서의 쿼리 효율성을 높이며, 운영 환경에서 불필요한 콘솔 출력으로 인한 성능 저하를 방지한다.

### 5.2 에러 추적 (Sentry)
런타임 에러 및 예외 상황은 Sentry를 통해 실시간으로 수집한다. 특히 정산 로직과 같은 핵심 비즈니스 로직에서 발생하는 Exception은 즉시 알림을 통해 대응한다.

- **로그 레벨**: `DEBUG` $\rightarrow$ `INFO` $\rightarrow$ `WARN` $\rightarrow$ `ERROR` $\rightarrow$ `FATAL`
- **Sentry 연동**: Next.js Client/Server 양단에 SDK를 설치하여 Source Map을 통한 정확한 에러 라인 추적을 수행한다.

---

## 6. Uptime 모니터링

### 6.1 가용성 체크
시스템의 가용성을 보장하기 위해 외부 모니터링 도구를 통해 1분 간격으로 Health Check API (`/api/health`)를 호출한다.

### 6.2 모니터링 지표 및 알림
단순 서버 생존 여부뿐만 아니라, 데이터베이스 커넥션 풀(PgBouncer) 상태와 Redis 연결 상태를 포함하여 응답한다.

| 체크 항목 | 임계치 | 알림 채널 |
| :--- | :--- | :--- |
| HTTP Response | $\ge$ 500ms (Warning), $\ge$ 2s (Critical) | Slack / Email |
| Error Rate | 5xx 응답 비율 1% 초과 시 | Slack / Email |
| Uptime | 99.9% 미만 하락 시 | Management Team |

- **Health Check 경로**: `https://{domain}/api/health`
- **검증 항목**: DB Connection, Redis Connectivity, Storage API Reachability