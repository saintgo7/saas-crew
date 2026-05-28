# 아키텍처 다이어그램 정의서 (saas-crew)

본 문서는 항공사 객실 승무원 스케줄, 자격 관리 및 정산 SaaS인 `saas-crew`의 시스템 구조를 정의한다. 본 설계는 `sap-16doc` 패턴을 준수하며, 복잡한 스케줄링 데이터의 무결성과 정산 프로세스의 정확성에 초점을 맞춘다.

## 변경 이력
| 버전 | 날짜 | 수정 내용 | 작성자 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-05-22 | 초기 아키텍처 설계 및 다이어그램 정의 | 시스템 설계자 | 최초 작성 |

---

## 1. 시스템 전체
시스템은 Next.js 14 기반의 단일 프로세스 아키텍처를 채택하여 개발 속도를 높이고, PostgreSQL의 Range Types를 통해 스케줄 중복을 방지한다. 외부 결제 및 PDF 생성 엔진을 통해 정산 및 명세서 발행 기능을 수행한다.

```mermaid
graph TD
    User((사용자)) --> CF[Cloudflare Tunnel]
    CF --> App[Next.js 14 App]
    
    subgraph "Application Layer"
        App --> Auth[NextAuth.js v5]
        App --> Logic[Route Handlers / Business Logic]
        Logic --> ORM[Drizzle ORM]
    end
    
    subgraph "Data Layer"
        ORM --> DB[(PostgreSQL 16)]
        DB --> PB[PgBouncer]
        Logic --> Redis[(Redis)]
        Redis --> BMQ[BullMQ]
    end
    
    subgraph "External Services"
        BMQ --> Puppeteer[Puppeteer PDF Gen]
        Logic --> Toss[Toss Payments]
        Logic --> R2[Cloudflare R2]
    end
```

## 2. 앱 내부 레이어
Frontend는 Zustand와 TanStack Query를 사용하여 승무원 상태와 서버 데이터를 분리 관리하며, Backend는 Route Handlers를 통해 서버 사이드 로직을 처리하는 계층 구조를 가진다.

```mermaid
graph TD
    subgraph "Client Layer (Next.js)"
        UI[shadcn/ui Components] --> State[Zustand Store]
        State --> Query[TanStack Query]
    end
    
    subgraph "Server Layer (Route Handlers)"
        Query --> API[API Endpoints]
        API --> Service[Business Service]
        Service --> Repository[Drizzle Repository]
    end
    
    subgraph "Persistence Layer"
        Repository --> DB[(PostgreSQL)]
    end
```

## 3. 도메인 핵심 플로우
스케줄링 매니저(이정훈)가 스케줄을 확정하면, 해당 데이터가 정산 엔진으로 전달되어 승무원(박소희)의 월별 정산금으로 산출되는 핵심 흐름을 정의한다.

```mermaid
sequenceDiagram
    participant QM as 스케줄 매니저 (QM)
    participant Sys as saas-crew System
    participant DB as PostgreSQL
    participant Toss as 토스페이먼츠
    
    QM->>Sys: 비행 스케줄 할당 및 확정
    Sys->>DB: 스케줄 데이터 저장 (Range Type 검증)
    DB-->>Sys: 저장 완료
    Sys->>Sys: 자격 요건(Qualification) 체크
    Sys->>Sys: 비행 시간 기반 정산금 계산
    Sys->>Toss: 정산금 지급 요청 API 호출
    Toss-->>Sys: 지급 처리 결과 반환
    Sys->>DB: 정산 상태 업데이트
```

## 4. 이벤트 플로우
비동기 처리가 필요한 PDF 명세서 생성 및 대량 알림 전송은 BullMQ와 Redis를 통해 큐잉 처리하여 메인 스레드의 블로킹을 방지한다.

```mermaid
graph LR
    Event[스케줄 확정 이벤트] --> Queue[BullMQ / Redis]
    Queue --> Worker1[PDF Generator Worker]
    Queue --> Worker2[Notification Worker]
    
    Worker1 --> Puppeteer[Puppeteer]
    Puppeteer --> R2[Cloudflare R2 Storage]
    
    Worker2 --> Email[Email/Push Service]
    R2 --> Link[명세서 다운로드 링크 생성]
```

## 5. RBAC 체계
역할 기반 접근 제어(RBAC)를 통해 권한을 세분화한다. G(Guest), CA(Cabin Attendant), SC(Scheduler), QM(Queue Manager), PA(Payroll Admin), SA(System Admin)로 구분한다.

```mermaid
graph TD
    Role[User Role] --> G[Guest: 조회 전용]
    Role --> CA[Crew: 본인 스케줄/정산 조회]
    Role --> SC[Scheduler: 스케줄 편성/수정]
    Role --> QM[Queue Mgr: 스케줄 최종 확정]
    Role --> PA[Payroll: 정산 승인/지급]
    Role --> SA[SysAdmin: 전체 설정/계정 관리]
    
    SC -.-> QM
    QM -.-> PA
```

## 6. AI Agent
스케줄 최적화 및 자격 누락 방지를 위한 AI Agent 구조이다. 승무원의 자격 만료일과 비행 스케줄을 분석하여 매니저에게 최적의 배정 안을 제안한다.

```mermaid
graph TD
    Data[Crew Qualification Data] --> Agent[Scheduling AI Agent]
    Sched[Flight Requirements] --> Agent
    
    Agent --> Analysis{자격 충족 여부 분석}
    Analysis -- 미충족 --> Alert[경고 및 대체 인원 추천]
    Analysis -- 충족 --> Suggest[최적 스케줄 안 제안]
    
    Suggest --> QM[스케줄 매니저 검토]
```

## 7. CI/CD
Docker self-host 환경을 기반으로 하며, Cloudflare Tunnel을 통해 외부 노출을 최소화하고 보안을 강화한 배포 파이프라인을 구성한다.

```mermaid
graph LR
    Code[Git Repository] --> Action[GitHub Actions]
    Action --> Build[Docker Image Build]
    Build --> Registry[Container Registry]
    Registry --> Deploy[Self-host Server]
    Deploy --> Tunnel[Cloudflare Tunnel]
    Tunnel --> Web[Public Access]
```

## 8. 백업
정산 데이터의 무결성을 위해 PostgreSQL의 WAL(Write Ahead Log) 기반 증분 백업과 R2 스토리지의 객체 버전 관리를 병행한다.

```mermaid
graph TD
    DB[(PostgreSQL)] --> WAL[WAL Log]
    WAL --> BackupSvr[Backup Server]
    BackupSvr --> S3[Cloudflare R2 Archive]
    
    R2[Cloudflare R2] --> Versioning[Object Versioning]
    Versioning --> Recovery[Point-in-Time Recovery]
```

## 9. 문서 관계
본 프로젝트의 표준 문서 체계 간의 상호 참조 관계를 정의한다.

```mermaid
graph TD
    PRD[제품 요구사항 정의서] --> Arch[아키텍처 다이어그램]
    Arch --> API[API 명세서]
    Arch --> DB_Schema[DB 스키마 설계서]
    API --> Test[테스트 케이스]
    DB_Schema --> Test
    Arch --> Ops[운영 매뉴얼]
```