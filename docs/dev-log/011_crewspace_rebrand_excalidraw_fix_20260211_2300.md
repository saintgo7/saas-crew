# Dev Log #011: CrewSpace 리브랜딩 + Excalidraw 캔버스 수정

**Date**: 2026-02-11 23:00
**Author**: Ph.D SNT Go.
**Phase**: Frontend - Branding & Canvas Fix

## Summary

WKU Software Crew에서 CrewSpace로 전체 리브랜딩 완료. Excalidraw 캔버스의 데모 페이지 렌더링, 아이콘 크기 문제, esm.sh 폰트 차단 문제를 연쇄적으로 해결.

## Previous Session Review

#010에서 CI/CD 파이프라인 수정 완료. 이번 세션에서 리브랜딩과 캔버스 기능 안정화 진행.

## Changes Made

### 1. CrewSpace 리브랜딩 (a68640d)

**Files Modified:**
- `apps/web/messages/ko.json` - 한국어 i18n: WKU/원광대 -> CrewSpace
- `apps/web/messages/en.json` - 영어 i18n: WKU -> CrewSpace
- `apps/web/src/app/layout.tsx` - metadata title/description 변경
- `apps/web/src/components/layout/Header.tsx` - 로고 "W" -> "C", 사이트명 -> "CrewSpace"
- `apps/web/src/components/landing/Footer.tsx` - 로고/사이트명 변경, university 줄 제거
- `apps/web/src/app/auth/login/page.tsx` - 로그인 페이지 로고/타이틀
- 기타 12개 파일: metadata title에서 "WKU Software Crew" -> "CrewSpace" 일괄 변경

**주요 변경:**
- 로고: 파란색 사각형 "W" -> "C"
- 사이트명: "WKU Software Crew" -> "CrewSpace"
- 태그라인: "팀 협업과 학습을 하나의 공간에서"
- CTA: "크루에 가입하기" -> "무료로 시작하기"
- footer.university 줄 완전 제거

### 2. 데모 캔버스 렌더링 수정 (f14a46e)

**Files Modified:**
- `apps/web/src/app/canvas/[id]/page.tsx` - 데모 캔버스 ID 감지 및 standalone Excalidraw 렌더링
- `apps/web/src/lib/hooks/use-canvas.ts` - `enabled` 옵션 추가

**문제:** 데모 캔버스(demo-1, demo-2) 클릭 시 "Canvas not found" 표시
**원인:** API에 데모 데이터가 없어서 useCanvas 훅이 에러 반환
**해결:** DEMO_CANVASES 맵으로 데모 ID 감지, API 호출 없이 standalone Excalidraw 렌더링

### 3. Excalidraw 아이콘 크기 수정 (f714b83)

**Files Modified:**
- `apps/web/src/app/canvas/[id]/page.tsx` - CSS import 추가
- `apps/web/src/components/canvas/CollaborativeCanvas.tsx` - CSS import 추가

**문제:** Excalidraw 툴바 아이콘이 화면을 가득 채울 정도로 거대하게 표시
**원인:** `@excalidraw/excalidraw/index.css` 미임포트
**해결:** 두 캔버스 컴포넌트에 CSS import 추가

### 4. esm.sh 폰트 차단 해결 (e94d8e1, 8380f0c)

**Files Created:**
- `apps/web/scripts/copy-excalidraw-assets.js` - 빌드 시 폰트 복사 스크립트
- `apps/web/src/types/excalidraw.d.ts` - EXCALIDRAW_ASSET_PATH 타입 선언

**Files Modified:**
- `apps/web/package.json` - build 스크립트에 폰트 복사 추가
- `apps/web/src/app/canvas/[id]/page.tsx` - window.EXCALIDRAW_ASSET_PATH 설정
- `apps/web/src/components/canvas/CollaborativeCanvas.tsx` - 동일 설정
- `apps/web/next.config.js` - CSP font-src에 esm.sh 추가
- `.gitignore` - public/excalidraw-assets/ 제외

**문제:** 콘솔에 esm.sh 폰트 로딩 에러 240개 발생
**원인:** CSP `font-src 'self' data:`가 외부 CDN(esm.sh) 폰트 차단
**해결:**
1. node_modules에서 public/excalidraw-assets/로 폰트 셀프 호스팅
2. `window.EXCALIDRAW_ASSET_PATH = '/excalidraw-assets/'` 설정
3. CSP font-src에 esm.sh 추가 (Excalidraw 내장 fallback URL 에러 방지)

### 5. 리스트 컴포넌트 개선 (b78ca5b)

**Files Modified:**
- `apps/web/src/components/community/PostList.tsx` - 데모 데이터 fallback
- `apps/web/src/components/courses/CourseList.tsx` - 데모 데이터 fallback
- `apps/web/src/components/qna/QuestionList.tsx` - 데모 데이터 fallback
- `apps/web/src/app/leaderboard/page.tsx` - 레이아웃 개선
- `apps/web/src/lib/hooks/use-community.ts` - retry: 1 추가
- `apps/web/src/lib/hooks/use-courses.ts` - retry: 1 추가
- `apps/web/src/lib/hooks/use-qna.ts` - retry: 1 추가

### 6. 배포 설정 변경 (d488998)

**Files Modified:**
- `deployments/ws-248-247/docker-compose.yml` - tunnel restart: unless-stopped -> always

## Technical Details

### Excalidraw 폰트 셀프 호스팅 구조

```
node_modules/@excalidraw/excalidraw/dist/prod/fonts/  (source, 13MB)
  ├── Excalifont/   (손글씨 스타일)
  ├── Virgil/       (레거시 손글씨)
  ├── Nunito/       (일반 텍스트)
  ├── ComicShanns/  (코믹 스타일)
  ├── Cascadia/     (코드 스타일)
  ├── Xiaolai/      (CJK, 12MB)
  └── ...

↓ build 시 copy-excalidraw-assets.js 실행

public/excalidraw-assets/fonts/  (gitignore 대상)
```

- `window.EXCALIDRAW_ASSET_PATH`는 Excalidraw 모듈 로드 전에 설정 필수
- Excalidraw는 항상 primary + fallback(esm.sh) URL 두 개를 시도
- CSP에 esm.sh를 추가하여 fallback 시도 시 CSP 에러 방지

### CSP 변경 내용

```
Before: font-src 'self' data:
After:  font-src 'self' data: https://esm.sh
```

## Test Results

- `pnpm --filter web build` 성공
- 스테이징 배포 확인 (staging-crew.abada.kr)
- Playwright 스크린샷으로 랜딩/코스/캔버스 페이지 정상 동작 확인
- 캔버스 데모: Excalidraw 툴바 정상 크기, esm.sh 폰트 에러 0개

## Deployment

- 스테이징 자동 배포 완료 (develop 브랜치 push -> GitHub Actions -> Docker)
- staging-crew.abada.kr 에서 전체 동작 확인

## Next Steps

- 프로덕션 배포 (develop -> main PR)
- 코스 페이지 데모 데이터 표시 확인 (현재 "표시할 코스가 없습니다")
- Excalidraw 텍스트 도구 폰트 렌더링 실사용 테스트
- CLAUDE.md 프로젝트명 "WKU Software Crew" -> "CrewSpace" 업데이트

## Related

- Commits: a68640d, f14a46e, f714b83, e94d8e1, 8380f0c, b78ca5b, d488998
- Branch: develop
- Staging: https://staging-crew.abada.kr
