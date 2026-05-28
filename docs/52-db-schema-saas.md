# DB 스키마 정의서 (Drizzle pgTable)

## 1. 문서 정보

본 문서는 `saas-crew` 프로젝트의 데이터 구조를 정의하며, PostgreSQL 16의 특성과 Drizzle ORM의 타입 안정성을 기반으로 설계되었다. 항공사 객실 승무원의 복잡한 스케줄링, 자격 검증, 정산 프로세스를 처리하기 위한 관계형 데이터 모델을 포함한다.

### 1.1 문서 이력
| 버전 | 날짜 | 작성자 | 변경 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-05-22 | 시스템 설계자 | 초기 스키마 설계 및 RBAC 정의 | 최초 작성 |

### 1.2 설계 원칙
- **무결성**: 정산 데이터의 정확성을 위해 `decimal` 타입 및 외래 키 제약 조건을 엄격히 적용한다.
- **성능**: 스케줄 조회 빈도가 높으므로 시간 범위(tsrange) 및 복합 인덱스를 활용한다.
- **확장성**: RBAC(Role-Based Access Control)를 통해 G, CA, SC, QM, PA, SA 역할별 접근 권한을 분리한다.

---

## 2. ER 다이어그램

데이터 모델은 크게 **사용자/권한**, **스케줄/비행**, **자격/인증**, **정산/결제**의 4가지 도메인으로 구성된다.

- **Users $\rightarrow$ Schedules**: 1:N 관계. 승무원 한 명은 여러 개의 스케줄을 가진다.
- **Users $\rightarrow$ Qualifications**: 1:N 관계. 승무원은 여러 개의 자격증(기종, 안전 교육 등)을 보유한다.
- **Schedules $\rightarrow$ Settlements**: 1:1 또는 N:1 관계. 확정된 비행 스케줄은 정산 내역으로 변환된다.
- **Roles $\rightarrow$ Users**: 1:N 관계. RBAC 모델에 따라 사용자에게 특정 역할이 부여된다.

---

## 3. 테이블 정의 (pgTable)

Drizzle ORM 문법을 사용하여 정의된 핵심 테이블 스키마이다.

### 3.1 사용자 및 권한 (Users & Auth)
```typescript
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  role: varchar("role", { length: 10 }).notNull(), // G, CA, SC, QM, PA, SA
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### 3.2 스케줄 관리 (Schedules)
```typescript
export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  flightNumber: varchar("flight_number", { length: 20 }).notNull(),
  departureAirport: varchar("dep_airport", { length: 10 }).notNull(),
  arrivalAirport: varchar("arr_airport", { length: 10 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // PENDING, CONFIRMED, CANCELLED
  dutyType: varchar("duty_type", { length: 20 }).notNull(), // FLIGHT, STANDBY, TRAINING
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 3.3 자격 관리 (Qualifications)
```typescript
export const qualifications = pgTable("qualifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  certName: varchar("cert_name", { length: 100 }).notNull(),
  issueDate: date("issue_date").notNull(),
  expiryDate: date("expiry_date").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
});
```

### 3.4 정산 관리 (Settlements)
```typescript
export const settlements = pgTable("settlements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  scheduleId: uuid("schedule_id").references(() => schedules.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull(), // UNPAID, PAID
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 4. 인덱스 전략

조회 성능 최적화를 위해 다음과 같은 인덱스를 설정한다. 특히 North Star Metric인 '스케줄 확정 소요 시간'을 단축하기 위해 스케줄 조회 쿼리를 최적화한다.

| 테이블 | 컬럼 | 인덱스 유형 | 목적 |
| :--- | :--- | :--- | :--- |
| `users` | `email` | B-Tree (Unique) | 로그인 및 사용자 식별 속도 향상 |
| `schedules` | `userId`, `startTime` | Composite | 특정 승무원의 기간별 스케줄 조회 최적화 |
| `schedules` | `status` | B-Tree | 미확정 스케줄 필터링 성능 향상 |
| `qualifications` | `userId`, `expiryDate` | Composite | 자격 만료 대상자 추출 쿼리 최적화 |
| `settlements` | `userId`, `processedAt` | Composite | 월별 정산 내역 조회 성능 보장 |

---

## 5. 마이그레이션

Drizzle Kit을 사용하여 스키마 변경 사항을 관리하며, 데이터 무결성을 위해 다음과 같은 절차를 준수한다.

1. **생성**: `npx drizzle-kit generate:pg` 명령어를 통해 SQL 마이그레이션 파일을 생성한다.
2. **검증**: 생성된 `.sql` 파일을 검토하여 `NOT NULL` 제약 조건이나 `DEFAULT` 값 설정이 기존 데이터와 충돌하지 않는지 확인한다.
3. **적용**: `npx drizzle-kit push:pg` 또는 커스텀 마이그레이션 러너를 통해 운영 DB에 적용한다.
4. **롤백**: 모든 마이그레이션 적용 전 `pg_dump`를 통한 스냅샷을 생성하여 장애 시 즉시 복구 가능하도록 한다.

---

## 6. 백업 정책

정산 데이터의 중요성을 고려하여 PostgreSQL 16의 물리적/논리적 백업을 병행한다.

- **전체 백업 (Full Backup)**: 매일 03:00 (KST) `pg_dump`를 사용하여 전체 DB를 백업하며, Cloudflare R2 스토리지에 저장한다.
- **증분 백업 (Incremental Backup)**: WAL(Write-Ahead Logging) 아카이빙을 통해 실시간 데이터 변경분을 기록하며, RPO(복구 지점 목표)를 5분 이내로 유지한다.
- **보관 주기**: 일일 백업본은 30일간 보관하며, 월말 정산 완료 후의 스냅샷은 1년간 보관한다.
- **복구 테스트**: 분기별 1회 테스트 환경에서 백업 데이터를 복원하여 데이터 정합성을 검증한다.