# Cloudflare Staging Routes 설정 가이드

## 개요

Staging 환경을 위한 Cloudflare Tunnel 라우트 설정 가이드입니다.

---

## 설정 단계

### Step 1: Cloudflare 대시보드 접속

1. 브라우저에서 https://one.dash.cloudflare.com/ 열기
2. 로그인

### Step 2: Tunnel 설정 페이지 이동

1. 왼쪽 메뉴에서 **Networks** 클릭
2. **Tunnels** 클릭
3. **crew-api-tunnel** 클릭
4. **Configure** 버튼 클릭

### Step 3: 첫 번째 라우트 추가 (Frontend)

1. **Public Hostname** 탭 클릭
2. **Add a public hostname** 버튼 클릭
3. 다음 정보 입력:

```
Subdomain: staging
Domain: crew.abada.kr (드롭다운에서 선택)
Type: HTTP
URL: crew-web-staging:3001
```

4. **Save** 클릭

### Step 4: 두 번째 라우트 추가 (API)

1. 다시 **Add a public hostname** 버튼 클릭
2. 다음 정보 입력:

```
Subdomain: staging-api
Domain: crew.abada.kr (드롭다운에서 선택)
Type: HTTP
URL: crew-api-staging:4001
```

3. **Save** 클릭

---

## 설정 확인

설정 완료 후 Public Hostname 목록에 다음 4개가 있어야 합니다:

| Hostname | Service |
|----------|---------|
| crew.abada.kr | http://crew-web:3000 |
| crew-api.abada.kr | http://crew-api:4000 |
| staging.crew.abada.kr | http://crew-web-staging:3001 |
| staging-api.crew.abada.kr | http://crew-api-staging:4001 |

---

## 완료 후 테스트

Cloudflare 설정 완료 후 Claude에게 "완료"라고 알려주세요.

Staging 배포 테스트를 진행합니다.
