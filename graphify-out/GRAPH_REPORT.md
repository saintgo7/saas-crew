# Graph Report - .  (2026-06-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 208 nodes · 252 edges · 27 communities (17 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2090acd0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Database Models|Database Models]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Authentication and RBAC|Authentication and RBAC]]
- [[_COMMUNITY_Flight and Crew Services|Flight and Crew Services]]
- [[_COMMUNITY_Project Scripts|Project Scripts]]
- [[_COMMUNITY_Development Dependencies|Development Dependencies]]
- [[_COMMUNITY_Project Dependencies|Project Dependencies]]
- [[_COMMUNITY_Crew Qualifications|Crew Qualifications]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Payment Services|Payment Services]]
- [[_COMMUNITY_System Architecture|System Architecture]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Flights Page|Flights Page]]
- [[_COMMUNITY_API and Permissions|API and Permissions]]
- [[_COMMUNITY_Payments Page|Payments Page]]
- [[_COMMUNITY_Tailwind Configuration|Tailwind Configuration]]
- [[_COMMUNITY_Project Root|Project Root]]
- [[_COMMUNITY_Project Overview|Project Overview]]
- [[_COMMUNITY_Functional Specifications|Functional Specifications]]
- [[_COMMUNITY_UI Specifications|UI Specifications]]
- [[_COMMUNITY_API Route Handlers|API Route Handlers]]
- [[_COMMUNITY_General Configuration|General Configuration]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `scripts` - 11 edges
3. `db` - 7 edges
4. `Role` - 7 edges
5. `users` - 6 edges
6. `North Star Metric: Time-to-Finalize Schedule` - 6 edges
7. `RBAC Roles (G, QM, PA, SA, CA, SC)` - 5 edges
8. `flights` - 4 edges
9. `crewAssignments` - 4 edges
10. `assignCrew()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `RBAC Matrix (Authentication & Permission)` --references--> `RBAC_MATRIX`  [EXTRACTED]
  docs/56-auth-permission-rbac.md → src/lib/permissions/matrix.ts
- `matrix.ts` --conceptually_related_to--> `Auth Permission RBAC`  [AMBIGUOUS]
  STATUS.md → README.md
- `flight-service.ts` --shares_data_with--> `schedules table`  [INFERRED]
  STATUS.md → docs/52-db-schema-saas.md
- `qualification-service.ts` --shares_data_with--> `qualifications table`  [INFERRED]
  STATUS.md → docs/52-db-schema-saas.md
- `Report System Design` --conceptually_related_to--> `payment-service.ts`  [INFERRED]
  docs/55-report-system.md → STATUS.md

## Import Cycles
- None detected.

## Communities (27 total, 10 thin omitted)

### Community 0 - "Database Models"
Cohesion: 0.10
Nodes (21): client, db, assignmentStatusEnum, CrewAssignment, crewAssignments, Flight, FlightPayment, flights (+13 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 2 - "Authentication and RBAC"
Cohesion: 0.15
Nodes (15): { handlers, auth, signIn, signOut }, JWT, Session, User, RBAC Matrix (Authentication & Permission), createHandler(), HandlerContext, checkPermission (+7 more)

### Community 3 - "Flight and Crew Services"
Cohesion: 0.19
Nodes (11): POST(), GET(), POST, RangeQuerySchema, assignCrew(), AssignmentInputSchema, createFlight(), FlightInput (+3 more)

### Community 4 - "Project Scripts"
Cohesion: 0.12
Nodes (15): description, name, private, scripts, build, db:generate, db:push, db:seed (+7 more)

### Community 5 - "Development Dependencies"
Cohesion: 0.14
Nodes (14): devDependencies, autoprefixer, drizzle-kit, eslint, eslint-config-next, @playwright/test, postcss, tailwindcss (+6 more)

### Community 6 - "Project Dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @auth/drizzle-adapter, bcryptjs, date-fns, drizzle-orm, next, next-auth, postgres (+5 more)

### Community 7 - "Crew Qualifications"
Cohesion: 0.22
Nodes (8): GET(), POST(), crewQualifications, trainings, findExpiringQualifications(), grantQualification(), GrantQualificationSchema, TrainingRecordSchema

### Community 8 - "Project Documentation"
Cohesion: 0.20
Nodes (11): Agent Orchestration Definition, Architecture Diagrams Definition, Code Architecture Document, North Star Metric: Time-to-Finalize Schedule, RBAC Roles (G, QM, PA, SA, CA, SC), Data Operations Document, Deployment Guide (Docker self-host), Development Workflow (+3 more)

### Community 9 - "Payment Services"
Cohesion: 0.35
Nodes (9): GET(), POST(), flightPayments, aggregateMonthlyPayout(), calculatePayment(), listPaymentsByPeriod(), PaymentCalcSchema, RATE_TABLE (+1 more)

### Community 10 - "System Architecture"
Cohesion: 0.20
Nodes (10): qualifications table, schedules table, settlements table, users table, DB Schema Definition, Report System Design, flight-service.ts, payment-service.ts (+2 more)

### Community 13 - "API and Permissions"
Cohesion: 0.50
Nodes (4): API Specification, Auth Permission RBAC, createHandler.ts, matrix.ts

## Ambiguous Edges - Review These
- `matrix.ts` → `Auth Permission RBAC`  [AMBIGUOUS]
  STATUS.md · relation: conceptually_related_to

## Knowledge Gaps
- **108 isolated node(s):** `name`, `version`, `private`, `description`, `dev` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `matrix.ts` and `Auth Permission RBAC`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `devDependencies` connect `Development Dependencies` to `Project Scripts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `db` connect `Database Models` to `Payment Services`, `Authentication and RBAC`, `Flight and Crew Services`, `Crew Qualifications`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Project Dependencies` to `Project Scripts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database Models` be split into smaller, more focused modules?**
  _Cohesion score 0.09655172413793103 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._