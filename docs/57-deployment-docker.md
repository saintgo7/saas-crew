# 배포 가이드 (Docker self-host)

## 1. 문서 정보

본 문서는 `saas-crew` 서비스의 안정적인 운영을 위한 Docker 기반 self-host 배포 절차를 정의한다. 본 시스템은 항공사 객실 승무원의 스케줄, 자격 관리 및 정산 처리를 목적으로 하며, 데이터 무결성과 가용성 확보를 최우선으로 한다.

### 1.1 문서 이력
| 버전 | 날짜 | 작성자 | 변경 내용 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2024-05-22 | 시스템 아키텍트 | 초기 배포 문서 작성 (sap-16doc 패턴) | 최초 작성 |

### 1.2 배포 목표
- **가용성**: Cloudflare Tunnel을 통한 외부 노출 및 보안 강화
- **효율성**: GHCR(GitHub Container Registry) 기반의 CI/CD 자동화
- **안정성**: PostgreSQL 16 및 PgBouncer를 통한 커넥션 관리 최적화

---

## 2. Docker 구성

`saas-crew`는 서비스 간 결합도를 낮추고 확장성을 확보하기 위해 컨테이너 기반의 마이크로 서비스 구조를 채택한다. 모든 이미지는 멀티 스테이지 빌드를 통해 최적화되며, 런타임 환경은 경량화된 Alpine Linux 또는 Distroless 이미지를 기반으로 한다.

### 2.1 컨테이너 아키텍처
| 구성 요소 | 이미지 기반 | 역할 | 주요 설정 |
| :--- | :--- | :--- | :--- |
| **App Server** | Node.js 20-alpine | Next.js 14 런타임 및 API 처리 | Port 3000, NextAuth.js v5 |
| **Database** | PostgreSQL 16 | 스케줄 및 정산 데이터 저장 | Range Types 활성화 |
| **Connection Pool** | PgBouncer | DB 커넥션 풀링 | Transaction mode |
| **Cache/Queue** | Redis 7 | BullMQ 작업 큐 및 세션 저장 | Persistence enabled |
| **Worker** | Node.js 20-alpine | Puppeteer PDF 생성 및 정산 배치 | Headless Chrome 설치 |

---

## 3. docker-compose 3종

인프라의 성격과 생명주기에 따라 `docker-compose` 파일을 3가지 레이어로 분리하여 관리한다. 이는 데이터베이스의 안정적인 유지와 애플리케이션의 빈번한 업데이트를 분리하기 위함이다.

### 3.1 `docker-compose.infra.yml` (인프라 레이어)
데이터베이스, Redis, PgBouncer 등 상태 저장(Stateful) 서비스들을 정의한다.
- **특징**: 서비스 업데이트 시에도 데이터 볼륨이 유지되어야 하며, 재시작 빈도가 낮다.
- **포함 서비스**: `db`, `pgbouncer`, `redis`

### 3.2 `docker-compose.app.yml` (애플리케이션 레이어)
Next.js 서버 및 BullMQ 워커 등 비즈니스 로직을 정의한다.
- **특징**: CI/CD 파이프라인에 의해 빈번하게 업데이트되며, 무중단 배포를 지향한다.
- **포함 서비스**: `web-app`, `worker-pdf`

### 3.3 `docker-compose.proxy.yml` (네트워크 레이어)
Cloudflare Tunnel 및 외부 진입점을 정의한다.
- **특징**: 내부 네트워크를 외부로 안전하게 노출하며, SSL/TLS 인증을 Cloudflare 단에서 처리한다.
- **포함 서비스**: `cloudflared`

---

## 4. 환경 변수

시스템 운영에 필요한 환경 변수는 `.env` 파일을 통해 관리하며, 보안을 위해 `abada-65` 표준(Secret 관리 체계)을 준수한다. 모든 비밀키는 최소 32자 이상의 무작위 문자열을 사용한다.

### 4.1 주요 환경 변수 정의
| 변수명 | 설명 | 필수 여부 | 기본값/예시 |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL 연결 문자열 | 필수 | `postgresql://user:pass@pgbouncer:6432/db` |
| `NEXTAUTH_SECRET` | NextAuth 세션 암호화 키 | 필수 | `32_char_random_string` |
| `REDIS_URL` | BullMQ 및 캐시 연결 주소 | 필수 | `redis://redis:6379` |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 접근 키 | 필수 | `access_key_id` |
| `TOSS_SECRET_KEY` | 토스페이먼츠 API 키 | 필수 | `toss_api_key` |
| `TUNNEL_TOKEN` | Cloudflare Tunnel 인증 토큰 | 필수 | `cf_tunnel_token` |

---

## 5. CI/CD 파이프라인

GitHub Actions와 GHCR을 연동하여 소스 코드 푸시부터 배포까지의 과정을 자동화한다.

### 5.1 파이프라인 흐름
1. **Build**: GitHub Actions에서 `Next.js` 빌드 및 Docker 이미지 생성
2. **Push**: 생성된 이미지를 `ghcr.io/org/saas-crew:latest` 및 `tag` 버전으로 푸시
3. **Deploy**: SSH를 통해 대상 서버 접속 $\rightarrow$ `docker-compose pull` $\rightarrow$ `docker-compose up -d` 실행
4. **Verify**: 헬스체크 엔드포인트(`/api/health`) 호출을 통한 배포 성공 여부 확인

### 5.2 배포 주기 및 전략
- **Dev/Staging**: `develop` 브랜치 머지 시 자동 배포
- **Production**: `main` 브랜치 태그 생성 시 승인 후 배포 (Rolling Update 방식)

---

## 6. 롤백 절차

배포 후 심각한 오류가 발견되거나 North Star 지표(스케줄 확정 소요 시간)가 급격히 악화될 경우, 다음 절차에 따라 즉시 롤백을 수행한다.

### 6.1 롤백 단계
1. **이미지 버전 확인**: GHCR에서 직전 안정 버전(Stable Tag)의 이미지 태그 확인
2. **버전 변경**: `.env` 또는 `docker-compose.app.yml` 내의 이미지 태그를 이전 버전으로 수정
3. **컨테이너 재시작**:
   ```bash
   docker-compose -f docker-compose.app.yml pull
   docker-compose -f docker-compose.app.yml up -d
   ```
4. **데이터 복구**: DB 스키마 변경이 포함된 경우, 배포 전 생성한 `pg_dump` 백업 파일을 통해 복구 수행

### 6.2 복구 기준 (SLA)
- **Critical**: 서비스 접속 불가 시 15분 이내 롤백 완료
- **Major**: 정산/스케줄링 로직 오류 시 1시간 이내 롤백 또는 핫픽스 적용