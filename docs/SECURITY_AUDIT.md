# OWASP Top 10 보안 감사 체크리스트

**프로젝트**: WKU Software Crew SaaS Platform  
**날짜**: 2026-01-23  
**버전**: Beta Pre-launch  
**평가 기준**: OWASP Top 10 (2021)

## Executive Summary

본 문서는 WKU Software Crew 플랫폼의 베타 런칭 전 보안 검토를 OWASP Top 10 기준으로 수행한 결과입니다.

---

## 1. Broken Access Control (취약한 접근 제어)

### 현재 상태
- [ ] JWT 토큰 검증 (모든 보호된 라우트)
- [ ] 역할 기반 접근 제어 (RBAC: OWNER, ADMIN, MEMBER)
- [ ] 소유권 검증 (본인 리소스만 수정)
- [ ] API 엔드포인트 권한 매트릭스 작성
- [ ] 수평적 권한 상승 방지 (다른 사용자 리소스 접근 차단)
- [ ] 수직적 권한 상승 방지 (일반 사용자가 관리자 권한 획득 차단)

### 구현 계획
```typescript
// JWT Auth Guard - 모든 보호된 라우트에 적용
@UseGuards(JwtAuthGuard)
@Controller('users')

// Roles Guard - 역할 기반 접근 제어
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OWNER)

// Ownership Guard - 리소스 소유자만 수정 가능
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Patch(':id')
```

### 위험도: ⚠️ HIGH
### 조치 필요: JWT Guard, Roles Guard, Ownership Guard 구현

---

## 2. Cryptographic Failures (암호화 실패)

### 현재 상태
- [ ] JWT 시크릿 강도 (32+ characters)
- [x] bcrypt 해시 라운드 (10 rounds - auth.service.ts)
- [ ] HTTPS 강제 (프로덕션)
- [ ] 민감 데이터 암호화 (DB 레벨)
- [ ] 환경 변수 보안 (.env.example 제공, .env 제외)
- [ ] JWT 알고리즘 검증 (HS256 or RS256)

### 구현 상태
```typescript
// bcrypt 해시 (현재 구현됨)
const hashedPassword = await bcrypt.hash(password, 10);

// JWT 토큰 생성
this.jwtService.sign(payload, { expiresIn: '1h' });
```

### 개선 사항
- JWT 시크릿 길이 검증 (최소 32자)
- 토큰 만료 시간 정책 (1시간 + 리프레시 토큰)
- HTTPS 강제 미들웨어 추가

### 위험도: ⚠️ MEDIUM
### 조치 필요: JWT 시크릿 강도 검증, HTTPS 강제

---

## 3. Injection (인젝션 공격)

### 현재 상태
- [x] Prisma ORM 사용 (SQL Injection 자동 방어)
- [x] React 기본 XSS 이스케이핑
- [x] class-validator 입력 검증
- [ ] 출력 인코딩 검증
- [ ] NoSQL Injection 방지 (해당 없음)
- [ ] Command Injection 방지

### 구현 상태
```typescript
// Prisma ORM - 파라미터화된 쿼리
await this.prisma.user.findUnique({ where: { email } });

// class-validator - 입력 검증
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### 추가 보안
- DTO에 whitelist: true 설정
- forbidNonWhitelisted: true 설정
- HTML 입력 sanitization (DOMPurify)

### 위험도: ✅ LOW
### 조치 필요: DTO 검증 강화

---

## 4. Insecure Design (안전하지 않은 설계)

### 현재 상태
- [x] Clean Architecture (Handler -> Service -> Repository)
- [x] 멀티테넌시 설계 (Workspace 기반)
- [ ] Threat Modeling 수행
- [ ] 보안 설계 검토 회의
- [ ] 비즈니스 로직 보안 검증

### 아키텍처 보안
```
┌─────────────┐
│  Frontend   │ (React - Next.js)
└──────┬──────┘
       │ HTTPS
       v
┌─────────────┐
│   API GW    │ (Rate Limiting, CORS)
└──────┬──────┘
       v
┌─────────────┐
│  NestJS API │ (JWT Auth, Guards)
└──────┬──────┘
       v
┌─────────────┐
│  PostgreSQL │ (Prisma ORM)
└─────────────┘
```

### 위험도: ✅ LOW
### 조치 필요: Threat Modeling 문서 작성 (추후)

---

## 5. Security Misconfiguration (보안 구성 오류)

### 현재 상태
- [ ] 보안 헤더 설정 (Helmet 미사용)
- [ ] CORS 정책 설정
- [ ] 에러 메시지 보안 (스택 트레이스 노출 금지)
- [ ] 기본 비밀번호/계정 제거
- [ ] 불필요한 기능 비활성화
- [ ] 서버 정보 숨김 (X-Powered-By 제거)

### 필수 보안 헤더
```typescript
// Helmet 미들웨어 (구현 필요)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy
- Referrer-Policy: strict-origin-when-cross-origin
```

### 위험도: ⚠️ HIGH
### 조치 필요: Helmet 설치 및 설정, CORS 정책 강화

---

## 6. Vulnerable and Outdated Components (취약한 구성 요소)

### 현재 상태
- [ ] 정기적 의존성 업데이트
- [ ] npm audit 자동화
- [ ] Dependabot 설정
- [ ] 보안 패치 모니터링

### 발견된 취약점 (2026-01-23)
```
Critical: 1 - Next.js Authorization Bypass
High: 2 - Next.js DoS vulnerabilities
Moderate: 6 - Next.js cache issues, js-yaml, lodash
Low: 2 - Next.js dev server issues
```

### 조치 계획
1. Next.js 14.2.35+ 업데이트
2. js-yaml 4.1.1+ 업데이트
3. lodash 4.17.23+ 업데이트
4. CI/CD에 보안 스캔 추가

### 위험도: 🔴 CRITICAL
### 조치 필요: 즉시 의존성 업데이트

---

## 7. Identification and Authentication Failures (인증 실패)

### 현재 상태
- [x] JWT 기반 인증
- [x] GitHub OAuth 2.0
- [ ] 토큰 만료 처리
- [ ] 리프레시 토큰 구현
- [ ] 비밀번호 정책 (최소 8자)
- [ ] 계정 잠금 (무차별 대입 방지)
- [ ] 다중 인증 (MFA) - 추후 계획

### 구현 상태
```typescript
// JWT 인증 (현재 구현됨)
@Post('login')
async login(@Body() loginDto: LoginDto) {
  const user = await this.authService.validateUser(loginDto.email, loginDto.password);
  return this.authService.login(user);
}

// GitHub OAuth (설정 필요)
@Get('github/callback')
@UseGuards(AuthGuard('github'))
async githubCallback(@Req() req) {
  return this.authService.oauthLogin(req.user);
}
```

### 개선 사항
- 리프레시 토큰 구현 (장기 세션 유지)
- 로그인 시도 횟수 제한 (Rate Limiting)
- 비밀번호 복잡도 검증

### 위험도: ⚠️ MEDIUM
### 조치 필요: 리프레시 토큰, Rate Limiting

---

## 8. Software and Data Integrity Failures (무결성 실패)

### 현재 상태
- [ ] CI/CD 파이프라인 보안
- [ ] 패키지 무결성 검증 (package-lock.json)
- [ ] 코드 서명
- [ ] 자동 업데이트 보안
- [ ] Subresource Integrity (SRI)

### 구현 계획
```yaml
# GitHub Actions - CI/CD 보안
- pnpm audit
- TypeScript 타입 체크
- 테스트 커버리지 검증
- 보안 스캔 (Snyk, OWASP Dependency-Check)
```

### 위험도: ⚠️ MEDIUM
### 조치 필요: CI/CD 보안 스캔 자동화

---

## 9. Security Logging and Monitoring Failures (로깅 및 모니터링 실패)

### 현재 상태
- [ ] 보안 이벤트 로깅
- [ ] 로그인 실패 기록
- [ ] 권한 상승 시도 기록
- [ ] 중앙 로그 수집
- [ ] 알림 시스템
- [ ] 감사 추적 (Audit Trail)

### 로깅 전략
```typescript
// 보안 이벤트 로깅 (구현 필요)
- 로그인 성공/실패
- 권한 거부 (403)
- 토큰 검증 실패
- 비정상적 활동 패턴
```

### 위험도: ⚠️ MEDIUM
### 조치 필요: Winston Logger 보안 이벤트 추가

---

## 10. Server-Side Request Forgery (SSRF)

### 현재 상태
- [ ] 외부 URL 요청 제한
- [ ] IP 화이트리스트
- [ ] URL 검증
- [ ] 내부 네트워크 접근 차단

### 현재 외부 요청
```typescript
// GitHub OAuth - 안전 (공식 API)
https://api.github.com/user

// 향후 추가될 수 있는 외부 요청
- Webhook 호출
- 외부 API 통합
```

### 보안 조치
```typescript
// URL 검증 함수 (구현 필요)
function isAllowedUrl(url: string): boolean {
  const allowedDomains = ['api.github.com', 'github.com'];
  const hostname = new URL(url).hostname;
  return allowedDomains.includes(hostname);
}
```

### 위험도: ✅ LOW
### 조치 필요: URL 검증 유틸리티 추가 (추후)

---

## 종합 평가

### 위험도 분포
- 🔴 **CRITICAL**: 1 (취약한 의존성)
- ⚠️ **HIGH**: 2 (접근 제어, 보안 구성)
- ⚠️ **MEDIUM**: 4 (암호화, 인증, 무결성, 로깅)
- ✅ **LOW**: 3 (인젝션, 설계, SSRF)

### 즉시 조치 필요 (P0)
1. ✅ 의존성 업데이트 (Next.js, js-yaml, lodash)
2. ✅ Helmet 보안 헤더 설정
3. ✅ JWT/Roles/Ownership Guards 구현
4. ✅ Rate Limiting 구현

### 베타 런칭 전 필수 (P1)
1. ⚠️ CORS 정책 강화
2. ⚠️ 보안 테스트 자동화
3. ⚠️ 리프레시 토큰 구현
4. ⚠️ CI/CD 보안 스캔

### 향후 개선 (P2)
1. ⬜ MFA (다중 인증)
2. ⬜ 중앙 로그 수집
3. ⬜ Threat Modeling
4. ⬜ 침투 테스트

---

## 체크리스트 진행 상황

**전체 진행률**: 15/45 (33%)

- [x] Prisma ORM (SQL Injection 방어)
- [x] bcrypt 해시 (비밀번호 암호화)
- [x] JWT 인증 (기본 구현)
- [x] GitHub OAuth (기본 구현)
- [x] class-validator (입력 검증)
- [x] Clean Architecture
- [x] 멀티테넌시 설계
- [x] React XSS 방어
- [x] 환경 변수 분리
- [x] TypeScript 타입 안전성
- [x] Prisma Client 자동 생성
- [x] pnpm 워크스페이스
- [x] Git 버전 관리
- [x] .env 파일 제외
- [x] 비밀번호 최소 길이 (8자)
- [ ] JWT Guard 구현
- [ ] Roles Guard 구현
- [ ] Ownership Guard 구현
- [ ] Helmet 보안 헤더
- [ ] CORS 정책
- [ ] Rate Limiting
- [ ] 의존성 업데이트
- [ ] 보안 테스트
- [ ] CI/CD 보안 스캔
- [ ] 리프레시 토큰
- [ ] 에러 메시지 보안
- [ ] HTTPS 강제
- [ ] JWT 시크릿 검증
- [ ] 로그인 시도 제한
- [ ] 보안 이벤트 로깅
- [ ] URL 검증 유틸리티

---

**최종 업데이트**: 2026-01-23  
**담당자**: Security Team  
**다음 검토 예정**: 베타 런칭 전 (2026-01-25)
