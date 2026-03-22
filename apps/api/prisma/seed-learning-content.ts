import { PrismaClient, QuestionType, CourseLevel } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================================
// CHAPTER CONTENT - Rich markdown for each course's chapters
// ============================================================

const chapterContents: Record<string, Record<string, string>> = {}

// ─────────────────────────────────────────────
// Course 1: Git & GitHub 완전 정복
// ─────────────────────────────────────────────

chapterContents['git-github-mastery'] = {
  'intro-and-setup': `# Git 소개와 설치

## 학습 목표
- Git이 무엇이고 왜 필요한지 이해한다
- Git을 설치하고 초기 설정을 완료한다
- 기본적인 Git 워크플로우를 이해한다

---

## Git이란?

**Git**은 2005년 리누스 토르발즈(Linus Torvalds)가 리눅스 커널 개발을 위해 만든 **분산 버전 관리 시스템(DVCS)**입니다. 파일의 변경 이력을 추적하고, 여러 사람이 동시에 작업할 수 있게 해줍니다.

### 왜 Git을 사용하는가?

1. **버전 관리**: 파일의 모든 변경 이력이 기록됩니다
2. **협업**: 여러 개발자가 동시에 같은 프로젝트를 작업할 수 있습니다
3. **백업**: 분산 저장으로 데이터 손실을 방지합니다
4. **브랜치**: 독립적인 작업 공간을 만들어 안전하게 실험할 수 있습니다

### 중앙집중식 vs 분산형

\`\`\`
중앙집중식 (SVN)          분산형 (Git)
┌──────────┐           ┌──────────┐
│  Server  │           │  Remote  │
└────┬─────┘           └────┬─────┘
     │                      │
  ┌──┴──┐              ┌───┴────┐
  │     │              │        │
 PC1   PC2          ┌──┴──┐ ┌──┴──┐
(일부) (일부)       │ PC1 │ │ PC2 │
                    │전체 │ │전체 │
                    └─────┘ └─────┘
\`\`\`

분산형에서는 각 개발자가 **전체 저장소의 복사본**을 가집니다.

---

## Git 설치

### macOS
\`\`\`bash
# Homebrew를 이용한 설치
brew install git

# 설치 확인
git --version
\`\`\`

### Windows
[git-scm.com](https://git-scm.com)에서 설치 파일을 다운로드합니다. 설치 시 **Git Bash**도 함께 설치됩니다.

### Linux (Ubuntu/Debian)
\`\`\`bash
sudo apt update
sudo apt install git

git --version
\`\`\`

---

## 초기 설정

Git을 설치한 후 **사용자 정보**를 반드시 설정해야 합니다. 이 정보는 모든 커밋에 기록됩니다.

\`\`\`bash
# 사용자 이름 설정
git config --global user.name "홍길동"

# 이메일 설정 (GitHub 계정 이메일과 동일하게)
git config --global user.email "gildong@example.com"

# 기본 브랜치 이름 설정
git config --global init.defaultBranch main

# 설정 확인
git config --list
\`\`\`

> **\`--global\`** 플래그는 시스템 전체에 적용됩니다. 특정 프로젝트에서만 다른 설정을 사용하려면 프로젝트 디렉토리에서 \`--global\` 없이 실행하세요.

---

## 첫 번째 저장소 만들기

\`\`\`bash
# 프로젝트 폴더 생성
mkdir my-first-project
cd my-first-project

# Git 저장소 초기화
git init

# .git 폴더가 생성된 것을 확인
ls -la
\`\`\`

\`git init\` 명령어를 실행하면 숨겨진 \`.git\` 폴더가 생성됩니다. 이 폴더에 모든 버전 관리 정보가 저장됩니다.

---

## 핵심 정리

| 개념 | 설명 |
|------|------|
| **Git** | 분산 버전 관리 시스템 |
| **DVCS** | 각 개발자가 전체 저장소를 로컬에 보유 |
| **git config** | 사용자 정보 및 Git 설정 관리 |
| **git init** | 새 Git 저장소 생성 |
| **.git 폴더** | 모든 버전 관리 데이터가 저장되는 곳 |
`,

  'basic-commands': `# Git 기본 명령어

## 학습 목표
- Git의 세 가지 영역(Working Directory, Staging Area, Repository)을 이해한다
- add, commit, status, log 명령어를 자유롭게 사용한다
- Conventional Commits 규칙에 따라 커밋 메시지를 작성한다

---

## Git의 세 가지 영역

Git은 파일을 세 가지 영역에서 관리합니다:

\`\`\`
Working Directory    Staging Area     Repository
(작업 디렉토리)      (스테이징 영역)    (저장소)
    │                    │                │
    │   git add ──────►  │                │
    │                    │  git commit ──► │
    │                    │                │
    │   ◄──────────── git checkout ──────│
\`\`\`

- **Working Directory**: 실제 파일을 편집하는 공간
- **Staging Area**: 다음 커밋에 포함할 변경사항을 모아두는 공간
- **Repository**: 커밋된 스냅샷이 영구 저장되는 공간

---

## 기본 명령어

### 1. git status - 상태 확인

현재 작업 디렉토리의 상태를 확인합니다.

\`\`\`bash
git status

# 출력 예시:
# On branch main
# Changes not staged for commit:
#   modified:   index.html
# Untracked files:
#   style.css
\`\`\`

### 2. git add - 스테이징

변경된 파일을 Staging Area에 추가합니다.

\`\`\`bash
# 특정 파일 추가
git add index.html

# 여러 파일 추가
git add index.html style.css

# 변경된 모든 파일 추가
git add .

# 패턴으로 추가
git add *.js
\`\`\`

### 3. git commit - 커밋

Staging Area의 변경사항을 저장소에 기록합니다.

\`\`\`bash
# 기본 커밋
git commit -m "feat: 로그인 페이지 구현"

# 자세한 메시지 작성 (에디터 열림)
git commit

# add + commit 동시에 (tracked 파일만)
git commit -am "fix: 로그인 버그 수정"
\`\`\`

### 4. git log - 이력 조회

커밋 이력을 확인합니다.

\`\`\`bash
# 기본 로그
git log

# 한 줄씩 보기
git log --oneline

# 그래프로 보기
git log --oneline --graph --all

# 최근 5개만 보기
git log -5
\`\`\`

### 5. git diff - 변경사항 확인

\`\`\`bash
# 작업 디렉토리 변경사항
git diff

# 스테이징된 변경사항
git diff --staged

# 특정 파일의 변경사항
git diff index.html
\`\`\`

---

## Conventional Commits

커밋 메시지를 **일관된 형식**으로 작성하면 이력 추적이 쉬워집니다.

\`\`\`
<타입>: <설명>

[본문 (선택)]
\`\`\`

### 주요 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| **feat** | 새 기능 추가 | \`feat: 회원가입 폼 구현\` |
| **fix** | 버그 수정 | \`fix: 이메일 유효성 검사 오류 수정\` |
| **docs** | 문서 변경 | \`docs: README 업데이트\` |
| **style** | 코드 포맷팅 | \`style: 들여쓰기 수정\` |
| **refactor** | 리팩토링 | \`refactor: 로그인 로직 분리\` |
| **test** | 테스트 추가 | \`test: 로그인 단위 테스트 추가\` |
| **chore** | 빌드/도구 변경 | \`chore: ESLint 설정 추가\` |

---

## 실습: 첫 번째 커밋

\`\`\`bash
# 1. 프로젝트 초기화
mkdir git-practice && cd git-practice
git init

# 2. 파일 생성
echo "# My Project" > README.md

# 3. 상태 확인
git status

# 4. 스테이징
git add README.md

# 5. 커밋
git commit -m "docs: 프로젝트 README 추가"

# 6. 로그 확인
git log --oneline
\`\`\`

---

## 핵심 정리

| 명령어 | 역할 |
|--------|------|
| \`git status\` | 작업 디렉토리 상태 확인 |
| \`git add\` | 파일을 Staging Area에 추가 |
| \`git commit\` | 스테이징된 변경사항 기록 |
| \`git log\` | 커밋 이력 확인 |
| \`git diff\` | 파일 변경사항 비교 |
`,

  'branching-and-merging': `# 브랜치와 병합

## 학습 목표
- 브랜치의 개념과 필요성을 이해한다
- 브랜치를 생성, 전환, 병합, 삭제할 수 있다
- merge와 rebase의 차이를 이해하고 충돌을 해결할 수 있다

---

## 브랜치란?

**브랜치(Branch)**는 독립적인 작업 공간입니다. 메인 코드에 영향을 주지 않고 새로운 기능을 개발하거나 버그를 수정할 수 있습니다.

\`\`\`
main:     A ── B ── C ─────────── F (merge commit)
                     \\           /
feature:              D ── E ──
\`\`\`

---

## 브랜치 명령어

### 브랜치 생성 및 전환

\`\`\`bash
# 브랜치 목록 확인
git branch

# 새 브랜치 생성
git branch feature/login

# 브랜치 전환
git checkout feature/login
# 또는 (Git 2.23+)
git switch feature/login

# 생성과 동시에 전환
git checkout -b feature/login
# 또는
git switch -c feature/login
\`\`\`

### 브랜치 삭제

\`\`\`bash
# 병합 완료된 브랜치 삭제
git branch -d feature/login

# 강제 삭제 (병합 안 된 경우)
git branch -D feature/login
\`\`\`

---

## 병합 (Merge)

### Fast-Forward Merge

분기 이후 main에 새 커밋이 없으면 포인터만 이동합니다.

\`\`\`bash
git checkout main
git merge feature/login
# Fast-forward 발생
\`\`\`

\`\`\`
Before:  main: A ── B
                     \\
         feat:        C ── D

After:   main: A ── B ── C ── D
\`\`\`

### 3-Way Merge

양쪽 모두 커밋이 있으면 **merge commit**이 생성됩니다.

\`\`\`bash
git checkout main
git merge feature/login
# Merge commit 생성
\`\`\`

\`\`\`
Before:  main: A ── B ── E
                     \\
         feat:        C ── D

After:   main: A ── B ── E ── F (merge commit)
                     \\       /
         feat:        C ── D
\`\`\`

---

## 충돌 해결 (Conflict Resolution)

두 브랜치가 같은 파일의 같은 부분을 수정하면 **충돌**이 발생합니다.

\`\`\`bash
git merge feature/login
# CONFLICT (content): Merge conflict in index.html
\`\`\`

충돌 파일을 열면 다음과 같은 마커가 보입니다:

\`\`\`html
<<<<<<< HEAD
<h1>Welcome to Main</h1>
=======
<h1>Welcome to Login Page</h1>
>>>>>>> feature/login
\`\`\`

해결 방법:
1. 충돌 마커(\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`)를 제거
2. 원하는 코드만 남기기
3. 저장 후 커밋

\`\`\`bash
# 충돌 해결 후
git add index.html
git commit -m "fix: merge conflict 해결"
\`\`\`

---

## Rebase

커밋 이력을 깔끔하게 정리하고 싶을 때 사용합니다.

\`\`\`bash
git checkout feature/login
git rebase main
\`\`\`

\`\`\`
Before:  main: A ── B ── E
                     \\
         feat:        C ── D

After:   main: A ── B ── E
                          \\
         feat:             C' ── D'
\`\`\`

> **주의**: 이미 push한 브랜치에서는 rebase를 사용하지 마세요. 커밋 해시가 변경되어 다른 사람의 작업에 영향을 줄 수 있습니다.

### Merge vs Rebase

| 항목 | Merge | Rebase |
|------|-------|--------|
| **이력** | 분기/합류가 보임 | 일직선 |
| **커밋** | merge commit 생성 | 기존 커밋 재작성 |
| **안전성** | 안전 (이력 보존) | push 전에만 사용 |
| **용도** | PR 병합, 협업 | 로컬 정리 |

---

## 브랜치 전략 (Git Flow)

\`\`\`
main ────────────────────────────── (프로덕션)
  │
  └── develop ───────────────────── (개발 통합)
        │
        ├── feature/login ────────── (기능 개발)
        ├── feature/signup ───────── (기능 개발)
        │
        └── hotfix/bug-123 ──────── (긴급 수정)
\`\`\`

---

## 핵심 정리

| 명령어 | 역할 |
|--------|------|
| \`git branch\` | 브랜치 목록/생성/삭제 |
| \`git switch -c\` | 브랜치 생성 + 전환 |
| \`git merge\` | 브랜치 병합 |
| \`git rebase\` | 커밋 이력 재배치 |
| **충돌 해결** | 마커 제거 → add → commit |
`,

  'github-workflow': `# GitHub 협업

## 학습 목표
- Remote 저장소와 로컬 저장소를 연결하고 동기화할 수 있다
- Fork & Pull Request 워크플로우를 이해하고 실행할 수 있다
- 코드 리뷰를 통한 협업 프로세스를 이해한다

---

## Remote 저장소

### 저장소 연결

\`\`\`bash
# 새 원격 저장소 추가
git remote add origin https://github.com/username/repo.git

# 원격 저장소 확인
git remote -v

# 원격 저장소 URL 변경
git remote set-url origin https://github.com/username/new-repo.git
\`\`\`

### Push와 Pull

\`\`\`bash
# 로컬 → 원격 (업로드)
git push origin main

# 첫 push 시 upstream 설정
git push -u origin main

# 원격 → 로컬 (다운로드 + 병합)
git pull origin main

# 원격 → 로컬 (다운로드만)
git fetch origin
\`\`\`

### clone

\`\`\`bash
# 저장소 복제
git clone https://github.com/username/repo.git

# 특정 브랜치만 clone
git clone -b develop https://github.com/username/repo.git
\`\`\`

---

## Fork & Pull Request 워크플로우

오픈소스 기여나 팀 협업에서 가장 많이 사용하는 워크플로우입니다.

### 전체 흐름

\`\`\`
1. Fork (GitHub에서)
   원본 저장소 ──► 내 저장소 (복사본)

2. Clone (로컬로)
   내 저장소 ──► 로컬 PC

3. Branch → Commit → Push
   로컬 작업 ──► 내 원격 저장소

4. Pull Request (GitHub에서)
   내 저장소 ──► 원본 저장소 (리뷰 요청)

5. Code Review → Merge
   리뷰어 확인 후 병합
\`\`\`

### 실제 명령어

\`\`\`bash
# 1. Fork 후 Clone
git clone https://github.com/MY-USERNAME/original-repo.git
cd original-repo

# 2. 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/ORIGINAL/original-repo.git

# 3. 기능 브랜치 생성
git checkout -b feature/add-search

# 4. 코드 작성 & 커밋
git add .
git commit -m "feat: 검색 기능 구현"

# 5. 내 저장소에 Push
git push origin feature/add-search

# 6. GitHub에서 Pull Request 생성
\`\`\`

### upstream과 동기화

\`\`\`bash
# 원본 저장소의 최신 코드 가져오기
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
\`\`\`

---

## Pull Request 작성법

### 좋은 PR의 구성요소

\`\`\`markdown
## 개요
검색 기능을 구현했습니다. 제목과 내용으로 게시글을 검색할 수 있습니다.

## 변경사항
- 검색 API 엔드포인트 추가 (\`GET /api/search\`)
- 검색 입력 컴포넌트 구현
- 검색 결과 페이지 추가

## 테스트
- [x] 제목 검색 동작 확인
- [x] 내용 검색 동작 확인
- [x] 빈 검색어 처리 확인

## 스크린샷
(UI 변경 시 첨부)
\`\`\`

### PR 리뷰 가이드

코드 리뷰 시 확인할 사항:
1. **기능**: 요구사항을 올바르게 구현했는가?
2. **코드 품질**: 변수명이 명확한가? 중복 코드는 없는가?
3. **에러 처리**: 예외 상황을 처리했는가?
4. **테스트**: 테스트가 충분한가?
5. **성능**: 불필요한 연산이 없는가?

---

## Git 고급 명령어

### git stash - 임시 저장

\`\`\`bash
# 변경사항 임시 저장
git stash

# 저장 목록 확인
git stash list

# 복원
git stash pop

# 특정 stash 복원
git stash apply stash@{1}
\`\`\`

### git cherry-pick - 특정 커밋 가져오기

\`\`\`bash
# 다른 브랜치의 특정 커밋 가져오기
git cherry-pick abc1234
\`\`\`

### .gitignore

버전 관리에서 제외할 파일을 지정합니다.

\`\`\`
# .gitignore
node_modules/
.env
dist/
*.log
.DS_Store
\`\`\`

---

## 핵심 정리

| 개념 | 설명 |
|------|------|
| **remote** | 원격 저장소 관리 |
| **push/pull** | 원격 저장소와 동기화 |
| **Fork** | 원본 저장소의 개인 복사본 |
| **Pull Request** | 코드 변경 리뷰 요청 |
| **upstream** | 원본 저장소 (Fork한 곳) |
| **stash** | 변경사항 임시 저장 |
`,
}

// ─────────────────────────────────────────────
// Course 2: HTML/CSS 웹 기초
// ─────────────────────────────────────────────

chapterContents['html-css-fundamentals'] = {
  'html-basics': `# HTML 기초 구조와 시맨틱 태그

## 학습 목표
- HTML 문서의 기본 구조를 이해한다
- 시맨틱 태그의 의미와 사용법을 익힌다
- 자주 사용하는 HTML 요소를 활용할 수 있다

---

## HTML이란?

**HTML(HyperText Markup Language)**은 웹 페이지의 **구조**를 정의하는 마크업 언어입니다. 브라우저에게 "이것은 제목이고, 이것은 문단이며, 이것은 이미지다"라고 알려주는 역할을 합니다.

---

## HTML 문서 기본 구조

\`\`\`html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>페이지 제목</title>
</head>
<body>
  <h1>안녕하세요!</h1>
  <p>HTML을 배우고 있습니다.</p>
</body>
</html>
\`\`\`

### 각 요소 설명

| 태그 | 역할 |
|------|------|
| \`<!DOCTYPE html>\` | HTML5 문서 선언 |
| \`<html>\` | 문서의 루트 요소 |
| \`<head>\` | 메타데이터 영역 (브라우저 표시 X) |
| \`<meta charset>\` | 문자 인코딩 (한글 깨짐 방지) |
| \`<meta viewport>\` | 반응형 웹을 위한 뷰포트 설정 |
| \`<title>\` | 브라우저 탭에 표시되는 제목 |
| \`<body>\` | 실제 화면에 표시되는 콘텐츠 |

---

## 시맨틱 태그 (Semantic Tags)

시맨틱 태그는 콘텐츠의 **의미**를 전달합니다. \`<div>\`로만 구성하면 구조를 알 수 없지만, 시맨틱 태그를 사용하면 검색 엔진과 스크린 리더가 페이지 구조를 이해할 수 있습니다.

\`\`\`html
<!-- 나쁜 예: div만 사용 -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="content">...</div>

<!-- 좋은 예: 시맨틱 태그 사용 -->
<header>사이트 헤더</header>
<nav>내비게이션</nav>
<main>
  <article>
    <h2>게시글 제목</h2>
    <p>게시글 내용</p>
  </article>
  <aside>사이드바</aside>
</main>
<footer>사이트 푸터</footer>
\`\`\`

### 주요 시맨틱 태그

| 태그 | 의미 | 용도 |
|------|------|------|
| \`<header>\` | 머리글 | 로고, 제목, 내비게이션 |
| \`<nav>\` | 내비게이션 | 메뉴, 링크 모음 |
| \`<main>\` | 주요 콘텐츠 | 페이지의 핵심 내용 (문서당 1개) |
| \`<article>\` | 독립 콘텐츠 | 블로그 글, 뉴스 기사 |
| \`<section>\` | 구역 | 주제별 콘텐츠 그룹 |
| \`<aside>\` | 부가 콘텐츠 | 사이드바, 관련 링크 |
| \`<footer>\` | 바닥글 | 저작권, 연락처 |

---

## 자주 사용하는 HTML 요소

### 텍스트 요소

\`\`\`html
<h1>제목 1 (가장 중요)</h1>
<h2>제목 2</h2>
<h3>제목 3</h3>
<p>단락(paragraph)</p>
<strong>굵은 글씨 (의미: 중요)</strong>
<em>기울임 (의미: 강조)</em>
<br> <!-- 줄바꿈 -->
<hr> <!-- 수평선 -->
\`\`\`

### 링크와 이미지

\`\`\`html
<a href="https://example.com" target="_blank">외부 링크</a>
<a href="/about">내부 링크</a>

<img src="photo.jpg" alt="사진 설명" width="300">
\`\`\`

### 리스트

\`\`\`html
<!-- 순서 없는 목록 -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<!-- 순서 있는 목록 -->
<ol>
  <li>첫 번째</li>
  <li>두 번째</li>
</ol>
\`\`\`

### 폼 요소

\`\`\`html
<form action="/submit" method="POST">
  <label for="email">이메일:</label>
  <input type="email" id="email" name="email" required>

  <label for="pw">비밀번호:</label>
  <input type="password" id="pw" name="password">

  <button type="submit">제출</button>
</form>
\`\`\`

---

## 핵심 정리

- HTML은 웹 페이지의 **구조**를 담당한다
- **시맨틱 태그**를 사용하면 접근성과 SEO가 향상된다
- \`<div>\`/\`<span>\`은 의미가 없는 범용 컨테이너이므로, 가능하면 시맨틱 태그를 우선 사용한다
- **alt 속성**은 이미지의 대체 텍스트로, 접근성을 위해 반드시 작성한다
`,

  'css-basics': `# CSS 선택자와 박스 모델

## 학습 목표
- CSS의 역할과 적용 방법을 이해한다
- 다양한 선택자를 사용하여 요소를 스타일링할 수 있다
- 박스 모델의 구성 요소를 이해하고 활용할 수 있다

---

## CSS란?

**CSS(Cascading Style Sheets)**는 HTML 요소의 **스타일(디자인)**을 정의합니다. HTML이 집의 구조라면, CSS는 페인트, 가구, 인테리어입니다.

### CSS 적용 방법 3가지

\`\`\`html
<!-- 1. 인라인 스타일 (비추천) -->
<p style="color: red;">빨간 글씨</p>

<!-- 2. 내부 스타일 시트 -->
<style>
  p { color: red; }
</style>

<!-- 3. 외부 스타일 시트 (추천) -->
<link rel="stylesheet" href="style.css">
\`\`\`

---

## CSS 선택자

### 기본 선택자

\`\`\`css
/* 요소 선택자 */
p { color: blue; }
h1 { font-size: 2rem; }

/* 클래스 선택자 (.) */
.highlight { background-color: yellow; }
.btn { padding: 8px 16px; }

/* ID 선택자 (#) - 페이지에서 유일 */
#main-title { font-size: 3rem; }

/* 전체 선택자 */
* { margin: 0; padding: 0; box-sizing: border-box; }
\`\`\`

### 결합 선택자

\`\`\`css
/* 자손 선택자 (공백) */
nav a { text-decoration: none; }

/* 자식 선택자 (>) */
ul > li { list-style: none; }

/* 인접 형제 선택자 (+) */
h2 + p { margin-top: 0; }

/* 그룹 선택자 (,) */
h1, h2, h3 { font-family: 'Noto Sans KR', sans-serif; }
\`\`\`

### 가상 클래스 선택자

\`\`\`css
/* 마우스 올리면 */
a:hover { color: red; }

/* 클릭 중 */
button:active { transform: scale(0.95); }

/* 포커스 */
input:focus { border-color: blue; outline: none; }

/* 첫 번째/마지막 자식 */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }

/* n번째 자식 */
tr:nth-child(even) { background-color: #f5f5f5; }
\`\`\`

### 선택자 우선순위 (Specificity)

\`\`\`
!important > 인라인 > ID > 클래스 > 요소 > *

점수 계산:
요소(p, div) = 1점
클래스(.btn) = 10점
ID(#main)    = 100점
인라인       = 1000점
\`\`\`

---

## 박스 모델 (Box Model)

모든 HTML 요소는 **박스**로 구성됩니다.

\`\`\`
┌────────────── margin (바깥 여백) ──────────────┐
│  ┌──────────── border (테두리) ──────────────┐  │
│  │  ┌──────── padding (안쪽 여백) ────────┐  │  │
│  │  │                                     │  │  │
│  │  │          content (콘텐츠)            │  │  │
│  │  │         width x height              │  │  │
│  │  │                                     │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
\`\`\`

\`\`\`css
.box {
  width: 200px;
  height: 100px;
  padding: 20px;        /* 안쪽 여백 */
  border: 2px solid #333; /* 테두리 */
  margin: 10px;          /* 바깥 여백 */
}
\`\`\`

### box-sizing

기본적으로 \`width\`는 content만의 너비입니다. padding과 border를 포함하려면:

\`\`\`css
/* 추천: 모든 요소에 적용 */
* {
  box-sizing: border-box;
}
\`\`\`

| 값 | 계산 방식 |
|----|-----------|
| \`content-box\` (기본) | width = content만 |
| \`border-box\` | width = content + padding + border |

---

## 자주 사용하는 속성

\`\`\`css
/* 색상 */
color: #333;                    /* 글자색 */
background-color: #f0f0f0;     /* 배경색 */

/* 텍스트 */
font-size: 16px;               /* 크기 */
font-weight: bold;             /* 굵기 */
line-height: 1.6;              /* 줄 높이 */
text-align: center;            /* 정렬 */

/* 크기 단위 */
/* px: 고정값, rem: 루트 기준 상대값 */
/* %: 부모 기준, vh/vw: 뷰포트 기준 */
font-size: 1rem;    /* 16px (기본) */
width: 80%;         /* 부모의 80% */
height: 100vh;      /* 뷰포트 높이 100% */
\`\`\`

---

## 핵심 정리

- **선택자 우선순위**: ID > 클래스 > 요소
- **박스 모델**: margin → border → padding → content
- \`box-sizing: border-box\` 를 전역으로 적용하면 크기 계산이 직관적
- \`rem\` 단위를 사용하면 반응형 디자인에 유리
`,

  'flexbox-layout': `# Flexbox와 Grid 레이아웃

## 학습 목표
- Flexbox의 핵심 속성을 이해하고 활용할 수 있다
- CSS Grid의 기본 개념을 이해한다
- 상황에 따라 Flexbox와 Grid를 적절히 선택할 수 있다

---

## Flexbox란?

**Flexbox**는 1차원(행 또는 열) 레이아웃 시스템입니다. 요소들을 수평/수직으로 유연하게 배치할 수 있습니다.

### 기본 사용법

\`\`\`css
.container {
  display: flex;
}
\`\`\`

이것만으로 자식 요소들이 가로로 나란히 배치됩니다.

---

## Flex Container 속성 (부모)

\`\`\`css
.container {
  display: flex;

  /* 방향 */
  flex-direction: row;          /* 가로 (기본) */
  flex-direction: column;       /* 세로 */

  /* 줄 바꿈 */
  flex-wrap: nowrap;            /* 한 줄 (기본) */
  flex-wrap: wrap;              /* 여러 줄 */

  /* 주축 정렬 (가로 방향일 때 좌우) */
  justify-content: flex-start;  /* 왼쪽 정렬 */
  justify-content: center;      /* 가운데 정렬 */
  justify-content: flex-end;    /* 오른쪽 정렬 */
  justify-content: space-between; /* 양끝 + 균등 */
  justify-content: space-around;  /* 균등 (양쪽 여백 포함) */

  /* 교차축 정렬 (가로 방향일 때 상하) */
  align-items: stretch;         /* 늘림 (기본) */
  align-items: flex-start;      /* 위쪽 정렬 */
  align-items: center;          /* 세로 가운데 */
  align-items: flex-end;        /* 아래쪽 정렬 */

  /* 요소 간 간격 */
  gap: 16px;
}
\`\`\`

### 완벽한 가운데 정렬

\`\`\`css
.center {
  display: flex;
  justify-content: center;   /* 가로 가운데 */
  align-items: center;       /* 세로 가운데 */
  height: 100vh;
}
\`\`\`

---

## Flex Item 속성 (자식)

\`\`\`css
.item {
  /* 늘어나는 비율 */
  flex-grow: 1;     /* 남은 공간 차지 */

  /* 줄어드는 비율 */
  flex-shrink: 0;   /* 줄어들지 않음 */

  /* 기본 크기 */
  flex-basis: 200px;

  /* 단축 속성 */
  flex: 1;          /* grow: 1, shrink: 1, basis: 0 */
  flex: 0 0 200px;  /* 고정 200px */
}
\`\`\`

### 실전 예: 내비게이션 바

\`\`\`html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="menu">
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</nav>
\`\`\`

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 60px;
  background: #1a1a2e;
  color: white;
}

.menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}
\`\`\`

---

## CSS Grid

**Grid**는 2차원(행 + 열) 레이아웃 시스템입니다.

\`\`\`css
.grid-container {
  display: grid;

  /* 열 정의 */
  grid-template-columns: 200px 1fr 200px;   /* 3열 */
  grid-template-columns: repeat(3, 1fr);     /* 3등분 */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 반응형 */

  /* 행 정의 */
  grid-template-rows: auto 1fr auto;

  /* 간격 */
  gap: 20px;
}
\`\`\`

### 실전 예: 카드 그리드

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}
\`\`\`

---

## Flexbox vs Grid 선택 가이드

| 상황 | 추천 |
|------|------|
| 한 줄로 나란히 배치 | **Flexbox** |
| 내비게이션 바 | **Flexbox** |
| 카드 그리드 레이아웃 | **Grid** |
| 전체 페이지 레이아웃 | **Grid** |
| 요소 간 간격만 조절 | **Flexbox** |
| 복잡한 2차원 배치 | **Grid** |

---

## 핵심 정리

- **Flexbox**: 1차원 레이아웃 → \`display: flex\`
- **Grid**: 2차원 레이아웃 → \`display: grid\`
- \`justify-content\`: 주축 정렬 / \`align-items\`: 교차축 정렬
- \`gap\`: 요소 간 간격 (Flexbox, Grid 모두 사용 가능)
- **\`repeat(auto-fit, minmax(250px, 1fr))\`**: 반응형 그리드의 마법 공식
`,

  'responsive-design': `# 반응형 웹 디자인

## 학습 목표
- 반응형 디자인의 원리를 이해한다
- 미디어 쿼리를 사용하여 화면 크기별 스타일을 적용할 수 있다
- 모바일 퍼스트 디자인 접근법을 적용할 수 있다

---

## 반응형 웹이란?

**반응형 웹 디자인(Responsive Web Design)**은 하나의 웹 사이트가 **모든 화면 크기**(데스크톱, 태블릿, 모바일)에 맞게 자동으로 조정되는 디자인 방식입니다.

### 뷰포트 설정 (필수!)

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

이 태그가 없으면 모바일 브라우저가 데스크톱 크기로 렌더링합니다.

---

## 미디어 쿼리 (Media Queries)

화면 크기에 따라 다른 CSS를 적용합니다.

\`\`\`css
/* 기본 스타일 (모바일) */
.container {
  padding: 16px;
}

/* 태블릿 (768px 이상) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* 데스크톱 (1024px 이상) */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

/* 와이드 데스크톱 (1280px 이상) */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
\`\`\`

### 일반적인 브레이크포인트

| 이름 | 크기 | 대상 기기 |
|------|------|-----------|
| sm | 640px | 모바일 (가로) |
| md | 768px | 태블릿 |
| lg | 1024px | 데스크톱 |
| xl | 1280px | 와이드 데스크톱 |

---

## 모바일 퍼스트 vs 데스크톱 퍼스트

### 모바일 퍼스트 (추천)

\`\`\`css
/* 기본 = 모바일 스타일 */
.nav { flex-direction: column; }

/* 큰 화면으로 확장 */
@media (min-width: 768px) {
  .nav { flex-direction: row; }
}
\`\`\`

### 데스크톱 퍼스트

\`\`\`css
/* 기본 = 데스크톱 스타일 */
.nav { flex-direction: row; }

/* 작은 화면으로 축소 */
@media (max-width: 767px) {
  .nav { flex-direction: column; }
}
\`\`\`

> **모바일 퍼스트**가 더 좋은 이유: 모바일 사용자가 50% 이상이며, 작은 화면에서 큰 화면으로 확장하는 것이 더 쉽습니다.

---

## 반응형 유닛

\`\`\`css
/* 상대 단위 사용 권장 */
.container {
  width: 90%;              /* 부모 기준 */
  max-width: 1200px;       /* 최대 너비 제한 */
  font-size: 1rem;         /* 16px 기준 */
  padding: 2rem;           /* 32px */
  margin-bottom: 1.5em;    /* 현재 폰트 크기 기준 */
}

/* 뷰포트 단위 */
.hero {
  height: 100vh;           /* 뷰포트 높이 100% */
  width: 100vw;            /* 뷰포트 너비 100% */
}
\`\`\`

---

## 반응형 이미지

\`\`\`css
/* 기본: 컨테이너에 맞게 조정 */
img {
  max-width: 100%;
  height: auto;
}

/* 배경 이미지 */
.hero {
  background-image: url('hero.jpg');
  background-size: cover;
  background-position: center;
}
\`\`\`

### picture 태그로 다른 이미지 제공

\`\`\`html
<picture>
  <source media="(min-width: 768px)" srcset="hero-desktop.jpg">
  <source media="(min-width: 480px)" srcset="hero-tablet.jpg">
  <img src="hero-mobile.jpg" alt="히어로 이미지">
</picture>
\`\`\`

---

## 실전 예: 반응형 레이아웃

\`\`\`css
/* 모바일: 1열 */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

/* 태블릿: 2열 */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 24px;
  }
}

/* 데스크톱: 3열 */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
\`\`\`

---

## 핵심 정리

- **반응형 웹**: 모든 기기에서 최적의 경험을 제공
- **viewport 메타 태그**는 반드시 포함
- **모바일 퍼스트** 접근법 추천 (\`min-width\` 사용)
- 상대 단위(\`rem\`, \`%\`, \`vw/vh\`)를 적극 활용
- \`max-width: 100%\`로 이미지 반응형 처리
`,
}

// ─────────────────────────────────────────────
// Course 3: JavaScript 프로그래밍
// ─────────────────────────────────────────────

chapterContents['javascript-programming'] = {
  'js-intro': `# 변수, 타입, 연산자

## 학습 목표
- JavaScript의 변수 선언 방식(var, let, const)의 차이를 이해한다
- 7가지 원시 타입과 참조 타입을 구별할 수 있다
- 비교 연산자와 논리 연산자를 올바르게 사용할 수 있다

---

## 변수 선언

### let vs const vs var

\`\`\`javascript
// const: 재할당 불가 (기본으로 사용)
const PI = 3.14159;
const name = '홍길동';
// PI = 3.14;  // Error: Assignment to constant variable

// let: 재할당 가능 (값이 변하는 경우)
let count = 0;
count = 1;  // OK

// var: 사용하지 마세요 (레거시)
// 호이스팅, 함수 스코프 등 예측하기 어려운 동작
var oldStyle = '쓰지 마세요';
\`\`\`

### 변수 네이밍 규칙

\`\`\`javascript
// camelCase 사용
const userName = '홍길동';
const isLoggedIn = true;
const maxRetryCount = 3;

// 상수는 UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
\`\`\`

---

## 데이터 타입

### 원시 타입 (Primitive Types) - 7가지

\`\`\`javascript
// 1. string (문자열)
const greeting = '안녕하세요';
const template = \\\`이름: \\\${name}\\\`;  // 템플릿 리터럴

// 2. number (숫자 - 정수와 소수 구분 없음)
const age = 25;
const price = 19900;
const pi = 3.14;

// 3. boolean (참/거짓)
const isStudent = true;
const hasPermission = false;

// 4. null (의도적으로 비어있음)
const selectedItem = null;

// 5. undefined (값이 할당되지 않음)
let result;
console.log(result);  // undefined

// 6. bigint (아주 큰 정수)
const bigNumber = 9007199254740991n;

// 7. symbol (유일한 식별자)
const id = Symbol('id');
\`\`\`

### 참조 타입 (Reference Types)

\`\`\`javascript
// 객체 (Object)
const user = {
  name: '홍길동',
  age: 25,
  email: 'gildong@example.com'
};

// 배열 (Array) - 순서가 있는 목록
const fruits = ['사과', '바나나', '딸기'];

// 함수 (Function)
const add = (a, b) => a + b;
\`\`\`

### typeof 연산자

\`\`\`javascript
typeof 'hello'    // 'string'
typeof 42         // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof null       // 'object' (JavaScript의 유명한 버그!)
typeof {}         // 'object'
typeof []         // 'object' (배열도 객체)
\`\`\`

---

## 연산자

### 비교 연산자

\`\`\`javascript
// == (느슨한 비교) - 타입 변환 후 비교
'5' == 5     // true (문자열 '5'가 숫자로 변환)
null == undefined  // true

// === (엄격한 비교) - 항상 이것을 사용!
'5' === 5    // false (타입이 다름)
null === undefined  // false
\`\`\`

> **규칙**: 항상 \`===\`(엄격한 비교)를 사용하세요. \`==\`는 예측하기 어려운 타입 변환이 발생합니다.

### 논리 연산자

\`\`\`javascript
// && (AND) - 둘 다 true여야 true
true && true    // true
true && false   // false

// || (OR) - 하나라도 true이면 true
false || true   // true

// ! (NOT) - 반전
!true   // false
!false  // true

// ?? (Nullish Coalescing) - null/undefined일 때만 대체값
const name = null ?? '기본값';     // '기본값'
const count = 0 ?? 10;            // 0 (0은 null이 아님)
const count2 = 0 || 10;           // 10 (||는 falsy 전체)
\`\`\`

### Optional Chaining (?.)

\`\`\`javascript
const user = { address: { city: '서울' } };

// 기존 방식 (번거로움)
const city = user && user.address && user.address.city;

// Optional Chaining (간결)
const city2 = user?.address?.city;  // '서울'
const zip = user?.address?.zip;     // undefined (에러 없음)
\`\`\`

---

## 조건문

\`\`\`javascript
// if-else
const score = 85;

if (score >= 90) {
  console.log('A');
} else if (score >= 80) {
  console.log('B');
} else {
  console.log('C');
}

// 삼항 연산자 (간단한 조건)
const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : 'C';
\`\`\`

---

## 핵심 정리

| 개념 | 요약 |
|------|------|
| \`const\` / \`let\` | 기본은 const, 변경 필요 시 let. var는 사용 금지 |
| 원시 vs 참조 | 원시: 값 복사 / 참조: 주소 복사 |
| \`===\` | 항상 엄격한 비교 사용 |
| \`??\` | null/undefined 기본값 설정 |
| \`?.\` | 안전한 속성 접근 |
`,

  'functions-scope': `# 함수와 스코프

## 학습 목표
- 함수 선언식과 표현식의 차이를 이해한다
- 화살표 함수를 사용할 수 있다
- 스코프와 클로저의 개념을 이해한다

---

## 함수 선언 방식

### 함수 선언식 (Function Declaration)

\`\`\`javascript
function greet(name) {
  return \\\`안녕하세요, \\\${name}님!\\\`;
}

console.log(greet('홍길동'));  // '안녕하세요, 홍길동님!'
\`\`\`

### 함수 표현식 (Function Expression)

\`\`\`javascript
const greet = function(name) {
  return \\\`안녕하세요, \\\${name}님!\\\`;
};
\`\`\`

### 화살표 함수 (Arrow Function) - ES6+

\`\`\`javascript
// 기본 형태
const greet = (name) => {
  return \\\`안녕하세요, \\\${name}님!\\\`;
};

// 매개변수 1개 → 괄호 생략 가능
const square = x => x * x;

// 본문이 한 줄 → return 생략 (암묵적 반환)
const add = (a, b) => a + b;

// 객체 반환 시 소괄호로 감싸기
const createUser = (name, age) => ({ name, age });
\`\`\`

### 기본 매개변수 (Default Parameters)

\`\`\`javascript
const greet = (name = '손님') => {
  return \\\`안녕하세요, \\\${name}님!\\\`;
};

greet();        // '안녕하세요, 손님님!'
greet('홍길동');  // '안녕하세요, 홍길동님!'
\`\`\`

### 나머지 매개변수 (Rest Parameters)

\`\`\`javascript
const sum = (...numbers) => {
  return numbers.reduce((total, n) => total + n, 0);
};

sum(1, 2, 3);      // 6
sum(1, 2, 3, 4, 5); // 15
\`\`\`

---

## 스코프 (Scope)

**스코프**는 변수에 접근할 수 있는 범위입니다.

### 3가지 스코프

\`\`\`javascript
// 1. 전역 스코프 (Global Scope)
const globalVar = '어디서든 접근 가능';

function example() {
  // 2. 함수 스코프 (Function Scope)
  const funcVar = '함수 내에서만 접근';

  if (true) {
    // 3. 블록 스코프 (Block Scope)
    const blockVar = '블록 내에서만 접근';
    console.log(globalVar);   // OK
    console.log(funcVar);     // OK
    console.log(blockVar);    // OK
  }

  console.log(blockVar);  // Error! (블록 밖)
}

console.log(funcVar);  // Error! (함수 밖)
\`\`\`

### let/const vs var

\`\`\`javascript
// let, const: 블록 스코프
if (true) {
  let x = 10;
  const y = 20;
}
// console.log(x);  // Error!

// var: 함수 스코프 (블록 무시!)
if (true) {
  var z = 30;
}
console.log(z);  // 30 (블록 밖에서 접근됨 → 위험!)
\`\`\`

---

## 클로저 (Closure)

**클로저**는 함수가 자신이 선언된 환경의 변수를 기억하는 현상입니다.

\`\`\`javascript
function createCounter() {
  let count = 0;  // 외부에서 접근 불가

  return {
    increment: () => { count += 1; return count; },
    decrement: () => { count -= 1; return count; },
    getCount: () => count,
  };
}

const counter = createCounter();
counter.increment();  // 1
counter.increment();  // 2
counter.decrement();  // 1
counter.getCount();   // 1

// count 변수에 직접 접근 불가 → 캡슐화!
\`\`\`

### 클로저의 활용

\`\`\`javascript
// 함수 팩토리
const createMultiplier = (factor) => {
  return (number) => number * factor;
};

const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5);  // 10
triple(5);  // 15
\`\`\`

---

## 콜백 함수 (Callback)

다른 함수에 인자로 전달되는 함수입니다.

\`\`\`javascript
// 배열 메서드에서의 콜백
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((n) => n * 2);
// [2, 4, 6, 8, 10]

const evens = numbers.filter((n) => n % 2 === 0);
// [2, 4]

// 이벤트 핸들러에서의 콜백
button.addEventListener('click', () => {
  console.log('버튼 클릭!');
});
\`\`\`

---

## 핵심 정리

| 개념 | 요약 |
|------|------|
| **화살표 함수** | 간결한 함수 작성, \`this\` 바인딩 없음 |
| **스코프** | 전역 > 함수 > 블록 (let/const는 블록 스코프) |
| **클로저** | 함수가 선언된 환경의 변수를 기억 |
| **콜백** | 다른 함수에 인자로 전달되는 함수 |
| **기본값** | \`(name = '기본값') => {}\` |
`,

  'arrays-objects': `# 배열과 객체 메서드

## 학습 목표
- 배열 고차 함수(map, filter, reduce 등)를 활용할 수 있다
- 구조 분해 할당을 사용할 수 있다
- 스프레드 연산자로 불변성을 유지하며 데이터를 다룰 수 있다

---

## 배열 고차 함수

### map - 변환

배열의 각 요소를 변환하여 **새 배열**을 반환합니다.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

const users = [
  { name: '홍길동', age: 25 },
  { name: '김영희', age: 30 },
];

const names = users.map(user => user.name);
// ['홍길동', '김영희']
\`\`\`

### filter - 필터링

조건에 맞는 요소만 **새 배열**로 반환합니다.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6]

const adults = users.filter(user => user.age >= 20);
\`\`\`

### reduce - 누적

배열을 하나의 값으로 줄입니다.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((acc, cur) => acc + cur, 0);
// 15

// 객체로 그룹핑
const fruits = ['사과', '바나나', '사과', '딸기', '바나나', '사과'];

const count = fruits.reduce((acc, fruit) => {
  return { ...acc, [fruit]: (acc[fruit] || 0) + 1 };
}, {});
// { '사과': 3, '바나나': 2, '딸기': 1 }
\`\`\`

### find / findIndex - 탐색

\`\`\`javascript
const users = [
  { id: 1, name: '홍길동' },
  { id: 2, name: '김영희' },
  { id: 3, name: '박철수' },
];

const user = users.find(u => u.id === 2);
// { id: 2, name: '김영희' }

const index = users.findIndex(u => u.id === 2);
// 1
\`\`\`

### some / every - 조건 검사

\`\`\`javascript
const scores = [85, 92, 78, 95, 88];

scores.some(s => s >= 90);   // true (하나라도 90 이상)
scores.every(s => s >= 70);  // true (모두 70 이상)
\`\`\`

### 메서드 체이닝

\`\`\`javascript
const result = users
  .filter(user => user.age >= 20)
  .map(user => user.name)
  .sort();
// 20세 이상 사용자의 이름을 정렬
\`\`\`

---

## 구조 분해 할당 (Destructuring)

### 객체 구조 분해

\`\`\`javascript
const user = { name: '홍길동', age: 25, email: 'gd@test.com' };

// 기본
const { name, age } = user;

// 이름 변경
const { name: userName } = user;

// 기본값
const { phone = '없음' } = user;

// 중첩 객체
const { address: { city } } = {
  address: { city: '서울', zip: '12345' }
};
\`\`\`

### 배열 구조 분해

\`\`\`javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first: 1, second: 2, rest: [3, 4, 5]

// 값 교환
let a = 1, b = 2;
[a, b] = [b, a];  // a: 2, b: 1

// 특정 위치만
const [, , third] = ['a', 'b', 'c'];  // third: 'c'
\`\`\`

### 함수 매개변수에서 사용

\`\`\`javascript
const printUser = ({ name, age }) => {
  console.log(\\\`\\\${name} (\\\${age}세)\\\`);
};

printUser({ name: '홍길동', age: 25 });
\`\`\`

---

## 스프레드 연산자 (Spread)

### 배열 스프레드

\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 배열 합치기
const combined = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]

// 배열 복사 (얕은 복사)
const copy = [...arr1];

// 요소 추가
const withNew = [...arr1, 4];  // [1, 2, 3, 4]
\`\`\`

### 객체 스프레드 (불변성 유지!)

\`\`\`javascript
const user = { name: '홍길동', age: 25 };

// 속성 업데이트 (새 객체 생성)
const updated = { ...user, age: 26 };
// { name: '홍길동', age: 26 }

// 속성 추가
const withEmail = { ...user, email: 'gd@test.com' };

// 여러 객체 병합
const merged = { ...defaults, ...userSettings };
\`\`\`

---

## 핵심 정리

| 메서드 | 역할 | 반환값 |
|--------|------|--------|
| \`map\` | 각 요소 변환 | 새 배열 |
| \`filter\` | 조건 필터링 | 새 배열 |
| \`reduce\` | 하나의 값으로 누적 | 누적값 |
| \`find\` | 조건에 맞는 첫 요소 | 요소 또는 undefined |
| \`some\` | 하나라도 조건 충족? | boolean |
| \`every\` | 모두 조건 충족? | boolean |

- **구조 분해**: 객체/배열에서 필요한 값만 추출
- **스프레드**: 배열/객체를 복사하며 불변성 유지
`,

  'async-programming': `# 비동기 프로그래밍

## 학습 목표
- 동기와 비동기의 차이를 이해한다
- Promise의 개념과 체이닝을 이해한다
- async/await 문법으로 비동기 코드를 작성할 수 있다

---

## 동기 vs 비동기

### 동기 (Synchronous)

코드가 **순서대로** 실행됩니다. 앞의 작업이 끝나야 다음 작업이 시작됩니다.

\`\`\`javascript
console.log('1. 주문 접수');
// 3분 동안 요리 (블로킹!)
console.log('2. 요리 완성');
console.log('3. 다음 주문 접수');
\`\`\`

### 비동기 (Asynchronous)

시간이 걸리는 작업을 **기다리지 않고** 다음 작업을 진행합니다.

\`\`\`javascript
console.log('1. 주문 접수');
setTimeout(() => {
  console.log('2. 요리 완성');  // 3초 후
}, 3000);
console.log('3. 다음 주문 접수');  // 기다리지 않고 바로 실행

// 출력 순서: 1 → 3 → 2
\`\`\`

---

## 콜백 (Callback)

비동기 처리의 가장 기본적인 방법입니다.

\`\`\`javascript
function fetchUser(id, callback) {
  setTimeout(() => {
    callback({ id, name: '홍길동' });
  }, 1000);
}

fetchUser(1, (user) => {
  console.log(user);  // { id: 1, name: '홍길동' }
});
\`\`\`

### 콜백 지옥 (Callback Hell)

콜백이 중첩되면 코드가 읽기 어려워집니다.

\`\`\`javascript
// 콜백 지옥 - 이렇게 쓰지 마세요!
getUser(1, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetail(orders[0].id, (detail) => {
      getProduct(detail.productId, (product) => {
        console.log(product);  // 4단계 중첩...
      });
    });
  });
});
\`\`\`

---

## Promise

**Promise**는 비동기 작업의 결과를 나타내는 객체입니다. "나중에 완료될 작업"을 약속합니다.

### 3가지 상태

- **pending**: 진행 중
- **fulfilled**: 성공 (resolve)
- **rejected**: 실패 (reject)

### Promise 생성

\`\`\`javascript
const fetchUser = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: '홍길동' });  // 성공
      } else {
        reject(new Error('유효하지 않은 ID'));  // 실패
      }
    }, 1000);
  });
};
\`\`\`

### then / catch 체이닝

\`\`\`javascript
fetchUser(1)
  .then(user => {
    console.log(user);  // { id: 1, name: '홍길동' }
    return fetchOrders(user.id);
  })
  .then(orders => {
    console.log(orders);
    return fetchDetail(orders[0].id);
  })
  .catch(error => {
    console.error('에러 발생:', error.message);
  })
  .finally(() => {
    console.log('항상 실행됩니다');
  });
\`\`\`

---

## async / await

Promise를 더 깔끔하게 사용하는 문법입니다. 비동기 코드를 마치 동기 코드처럼 작성할 수 있습니다.

\`\`\`javascript
const getUserData = async (userId) => {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    const detail = await fetchDetail(orders[0].id);
    return detail;
  } catch (error) {
    console.error('에러:', error.message);
    throw error;
  }
};
\`\`\`

### 병렬 실행 (Promise.all)

여러 비동기 작업을 **동시에** 실행합니다.

\`\`\`javascript
const [user, products, notifications] = await Promise.all([
  fetchUser(1),
  fetchProducts(),
  fetchNotifications(),
]);
// 3개 요청이 동시에 실행 → 가장 느린 것 기준으로 완료
\`\`\`

### fetch API

\`\`\`javascript
const getUsers = async () => {
  try {
    const response = await fetch('https://api.example.com/users');

    if (!response.ok) {
      throw new Error(\\\`HTTP error! status: \\\${response.status}\\\`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error('API 호출 실패:', error.message);
    throw error;
  }
};
\`\`\`

---

## 에러 처리 패턴

\`\`\`javascript
// 항상 try-catch로 감싸기
const safeApiCall = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\\\`HTTP \\\${response.status}\\\`);
    }
    return await response.json();
  } catch (error) {
    console.error(\\\`API 호출 실패 (\\\${url}):\\\`, error.message);
    return null;  // 또는 기본값 반환
  }
};
\`\`\`

---

## 핵심 정리

| 개념 | 요약 |
|------|------|
| **동기** | 순서대로 실행, 블로킹 |
| **비동기** | 기다리지 않고 다음 실행 |
| **Promise** | 비동기 작업의 결과를 나타내는 객체 |
| **async/await** | Promise를 동기 코드처럼 사용하는 문법 |
| **Promise.all** | 여러 비동기 작업 병렬 실행 |
| **try-catch** | 비동기 에러 처리의 필수 패턴 |
`,
}

// Will continue with more courses below...
// Remaining courses are added via the addMoreContent function

function addRemainingChapterContents(): void {

// ─────────────────────────────────────────────
// Course 4: React 프론트엔드 개발
// ─────────────────────────────────────────────

chapterContents['react-frontend-development'] = {
  'getting-started': `# 컴포넌트와 JSX

## 학습 목표
- React의 기본 개념과 동작 원리를 이해한다
- JSX 문법을 올바르게 사용할 수 있다
- 컴포넌트를 생성하고 조합할 수 있다

---

## React란?

**React**는 Facebook(현 Meta)이 만든 UI 라이브러리입니다. **컴포넌트** 단위로 UI를 구성하며, **Virtual DOM**을 사용하여 효율적으로 화면을 업데이트합니다.

### 프로젝트 생성

\`\`\`bash
# Vite + React + TypeScript
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

---

## JSX (JavaScript XML)

JSX는 JavaScript 안에서 HTML과 유사한 문법을 사용할 수 있게 합니다.

\`\`\`jsx
// JSX (React에서 사용)
const element = <h1>안녕하세요!</h1>;

// 실제로 변환된 코드
const element = React.createElement('h1', null, '안녕하세요!');
\`\`\`

### JSX 규칙

\`\`\`jsx
function App() {
  const name = '홍길동';
  const isLoggedIn = true;

  return (
    // 1. 반드시 하나의 루트 요소 (또는 Fragment)
    <>
      {/* 2. JavaScript 표현식은 중괄호 {} 사용 */}
      <h1>안녕하세요, {name}님!</h1>

      {/* 3. 조건부 렌더링 */}
      {isLoggedIn ? <p>로그인됨</p> : <p>로그인 필요</p>}
      {isLoggedIn && <p>환영합니다!</p>}

      {/* 4. class 대신 className */}
      <div className="container">

        {/* 5. 인라인 스타일은 객체로 */}
        <p style={{ color: 'red', fontSize: '16px' }}>
          스타일 적용
        </p>
      </div>

      {/* 6. 셀프 클로징 태그 */}
      <img src="logo.png" alt="로고" />
      <input type="text" />
    </>
  );
}
\`\`\`

---

## 컴포넌트

### 함수형 컴포넌트

\`\`\`jsx
// 컴포넌트는 대문자로 시작
function Greeting({ name }) {
  return <h1>안녕하세요, {name}님!</h1>;
}

// 화살표 함수 스타일
const Greeting = ({ name }) => {
  return <h1>안녕하세요, {name}님!</h1>;
};

// 사용
<Greeting name="홍길동" />
\`\`\`

### 컴포넌트 조합

\`\`\`jsx
const Header = () => (
  <header>
    <h1>My App</h1>
    <Navigation />
  </header>
);

const Navigation = () => (
  <nav>
    <a href="/">홈</a>
    <a href="/about">소개</a>
  </nav>
);

const App = () => (
  <>
    <Header />
    <main>콘텐츠 영역</main>
    <Footer />
  </>
);
\`\`\`

### 리스트 렌더링

\`\`\`jsx
const TodoList = ({ todos }) => {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

// key는 각 항목의 고유한 식별자 (필수!)
\`\`\`

---

## 핵심 정리

- **React**: 컴포넌트 기반 UI 라이브러리
- **JSX**: JavaScript에서 HTML을 작성하는 문법
- **컴포넌트**: 재사용 가능한 UI 단위, 대문자로 시작
- **Fragment(\`<>\`)**: 불필요한 div 없이 여러 요소 그룹핑
- **key**: 리스트 렌더링 시 각 항목의 고유 식별자 필수
`,

  'components-props': `# State와 Props

## 학습 목표
- Props를 통해 부모에서 자식으로 데이터를 전달할 수 있다
- State를 사용하여 컴포넌트의 동적 데이터를 관리할 수 있다
- Props와 State의 차이를 명확히 이해한다

---

## Props (Properties)

**Props**는 부모 컴포넌트에서 자식 컴포넌트로 전달하는 데이터입니다. **읽기 전용**이며, 자식에서 수정할 수 없습니다.

\`\`\`jsx
// 부모 컴포넌트
const App = () => {
  return (
    <UserCard
      name="홍길동"
      age={25}
      email="gd@example.com"
      isActive={true}
    />
  );
};

// 자식 컴포넌트 - 구조 분해로 props 받기
const UserCard = ({ name, age, email, isActive }) => {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>나이: {age}세</p>
      <p>이메일: {email}</p>
      {isActive && <span className="badge">활성</span>}
    </div>
  );
};
\`\`\`

### children Props

\`\`\`jsx
const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

// 사용 - 태그 사이의 내용이 children
<Card title="공지사항">
  <p>내일은 회의가 있습니다.</p>
  <button>확인</button>
</Card>
\`\`\`

---

## State (상태)

**State**는 컴포넌트 내부에서 관리하는 변경 가능한 데이터입니다. State가 변경되면 컴포넌트가 **리렌더링**됩니다.

### useState Hook

\`\`\`jsx
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);  // [현재값, 변경함수]

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>초기화</button>
    </div>
  );
};
\`\`\`

### State 업데이트 주의사항

\`\`\`jsx
// 이전 상태에 기반한 업데이트 → 함수형 업데이트 사용
setCount(prev => prev + 1);  // 안전

// 객체 State → 반드시 새 객체 생성 (불변성!)
const [user, setUser] = useState({ name: '홍길동', age: 25 });

// WRONG: 직접 수정 (리렌더링 안됨!)
// user.age = 26;

// CORRECT: 새 객체 생성
setUser(prev => ({ ...prev, age: 26 }));
\`\`\`

### 배열 State

\`\`\`jsx
const [todos, setTodos] = useState([]);

// 추가 (끝에)
setTodos(prev => [...prev, newTodo]);

// 삭제
setTodos(prev => prev.filter(t => t.id !== targetId));

// 수정
setTodos(prev => prev.map(t =>
  t.id === targetId ? { ...t, completed: true } : t
));
\`\`\`

---

## Props vs State

| | Props | State |
|---|---|---|
| **소유** | 부모 컴포넌트 | 현재 컴포넌트 |
| **변경** | 읽기 전용 | setState로 변경 |
| **흐름** | 부모 → 자식 (단방향) | 컴포넌트 내부 |
| **용도** | 데이터 전달 | 동적 데이터 관리 |

---

## 이벤트 처리

\`\`\`jsx
const Form = () => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();  // 폼 기본 제출 방지
    console.log('제출:', text);
    setText('');  // 입력 초기화
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="입력하세요"
      />
      <button type="submit">제출</button>
    </form>
  );
};
\`\`\`

---

## 핵심 정리

- **Props**: 부모 → 자식 데이터 전달. 읽기 전용
- **State**: 컴포넌트 내부의 변경 가능한 데이터
- **useState**: \`const [값, 세터] = useState(초기값)\`
- **불변성**: State 업데이트 시 항상 새 객체/배열 생성
- **리렌더링**: State가 변경되면 컴포넌트가 다시 그려짐
`,

  'state-events': `# Hooks (useState, useEffect, useContext)

## 학습 목표
- useEffect로 사이드 이펙트를 관리할 수 있다
- useContext로 전역 상태를 공유할 수 있다
- 커스텀 Hook을 작성할 수 있다

---

## useEffect

**useEffect**는 컴포넌트의 **사이드 이펙트**(부수 효과)를 처리합니다. API 호출, 구독, DOM 조작 등이 해당됩니다.

### 기본 사용법

\`\`\`jsx
import { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(\\\`/api/users/\\\${userId}\\\`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('사용자 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);  // userId가 변경될 때만 실행

  if (loading) return <p>로딩 중...</p>;
  if (!user) return <p>사용자를 찾을 수 없습니다</p>;

  return <h1>{user.name}</h1>;
};
\`\`\`

### 의존성 배열

\`\`\`jsx
// 1. 매 렌더링마다 실행 (의존성 없음)
useEffect(() => { /* ... */ });

// 2. 마운트 시 1번만 실행 (빈 배열)
useEffect(() => { /* ... */ }, []);

// 3. 특정 값 변경 시 실행
useEffect(() => { /* ... */ }, [userId, page]);
\`\`\`

### 클린업 (정리 함수)

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // 컴포넌트 언마운트 시 또는 다음 실행 전 정리
  return () => {
    clearInterval(timer);
  };
}, []);
\`\`\`

---

## useContext

**useContext**는 컴포넌트 트리 전체에서 데이터를 공유합니다. Props를 여러 단계로 내려보내는 "Prop Drilling"을 해결합니다.

\`\`\`jsx
import { createContext, useContext, useState } from 'react';

// 1. Context 생성
const ThemeContext = createContext(null);

// 2. Provider 작성
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Consumer (어디서든 사용)
const ThemeButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      현재 테마: {theme}
    </button>
  );
};

// 4. 앱에 Provider 적용
const App = () => (
  <ThemeProvider>
    <Header />
    <Main />
    <ThemeButton />
  </ThemeProvider>
);
\`\`\`

---

## 커스텀 Hook

반복되는 로직을 재사용 가능한 Hook으로 추출합니다. 이름은 반드시 \`use\`로 시작합니다.

\`\`\`jsx
// 커스텀 Hook: API 데이터 패칭
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// 사용
const UserList = () => {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
};
\`\`\`

---

## useMemo / useCallback

### useMemo - 값 메모이제이션

\`\`\`jsx
const ExpensiveComponent = ({ items, filter }) => {
  // filter가 변경될 때만 재계산
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  return <List items={filteredItems} />;
};
\`\`\`

### useCallback - 함수 메모이제이션

\`\`\`jsx
const Parent = () => {
  const [count, setCount] = useState(0);

  // count가 변경될 때만 새 함수 생성
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return <Child onClick={handleClick} />;
};
\`\`\`

---

## 핵심 정리

| Hook | 역할 |
|------|------|
| **useEffect** | 사이드 이펙트 (API 호출, 구독 등) |
| **useContext** | 전역 상태 공유 (Prop Drilling 해결) |
| **useMemo** | 계산 결과 캐싱 |
| **useCallback** | 함수 참조 캐싱 |
| **커스텀 Hook** | 로직 재사용 (\`use\`로 시작) |
`,

  'react-hooks-advanced': `# 이벤트 처리와 폼

## 학습 목표
- React에서 이벤트를 처리하는 방법을 이해한다
- 제어 컴포넌트로 폼을 구현할 수 있다
- 실전적인 폼 유효성 검사를 구현할 수 있다

---

## 이벤트 처리

### 기본 이벤트

\`\`\`jsx
const EventDemo = () => {
  // 클릭 이벤트
  const handleClick = () => {
    console.log('클릭!');
  };

  // 이벤트 객체 사용
  const handleMouseMove = (e) => {
    console.log(\\\`좌표: \\\${e.clientX}, \\\${e.clientY}\\\`);
  };

  // 매개변수 전달 (화살표 함수로 감싸기)
  const handleDelete = (id) => {
    console.log(\\\`삭제: \\\${id}\\\`);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <button onClick={handleClick}>클릭</button>
      <button onClick={() => handleDelete(123)}>삭제</button>
    </div>
  );
};
\`\`\`

### 이벤트 전파 제어

\`\`\`jsx
const handleClick = (e) => {
  e.stopPropagation();  // 부모로 이벤트 전파 중지
};

const handleSubmit = (e) => {
  e.preventDefault();  // 폼의 기본 제출 동작 방지
};
\`\`\`

---

## 제어 컴포넌트 (Controlled Component)

React에서 폼 요소의 값을 **State로 관리**하는 패턴입니다.

\`\`\`jsx
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">이메일</label>
      <input
        id="email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="이메일을 입력하세요"
      />

      <label htmlFor="password">비밀번호</label>
      <input
        id="password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="비밀번호를 입력하세요"
      />

      <button type="submit">로그인</button>
    </form>
  );
};
\`\`\`

---

## 폼 유효성 검사

\`\`\`jsx
const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력하세요';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = '올바른 이메일을 입력하세요';
    }

    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('회원가입 성공:', formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="이름"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호 확인"
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit">가입하기</button>
    </form>
  );
};
\`\`\`

---

## 핵심 정리

| 개념 | 요약 |
|------|------|
| **이벤트 핸들러** | \`onClick\`, \`onChange\`, \`onSubmit\` 등 |
| **제어 컴포넌트** | 폼 값을 State로 관리 |
| **e.preventDefault()** | 폼 기본 제출 동작 방지 |
| **유효성 검사** | submit 시 errors 객체로 관리 |
| **동적 name** | \`[name]: value\`로 여러 입력 한번에 처리 |
`,
}

// ─────────────────────────────────────────────
// Course 5: TypeScript 마스터
// ─────────────────────────────────────────────

chapterContents['typescript-mastery'] = {
  'ts-basics': `# 타입 시스템 기초

## 학습 목표
- TypeScript의 필요성과 장점을 이해한다
- 기본 타입 어노테이션을 사용할 수 있다
- 유니온 타입과 리터럴 타입을 활용할 수 있다

---

## TypeScript란?

**TypeScript**는 JavaScript에 **정적 타입 시스템**을 추가한 언어입니다. 코드를 실행하기 전에 오류를 발견할 수 있어 대규모 프로젝트에 필수적입니다.

\`\`\`typescript
// JavaScript - 런타임에 오류 발생
function add(a, b) {
  return a + b;
}
add('5', 3);  // '53' (문자열 결합, 버그!)

// TypeScript - 컴파일 시 오류 발견
function add(a: number, b: number): number {
  return a + b;
}
add('5', 3);  // Error: Argument of type 'string'
\`\`\`

---

## 기본 타입

\`\`\`typescript
// 원시 타입
const name: string = '홍길동';
const age: number = 25;
const isStudent: boolean = true;

// 배열
const numbers: number[] = [1, 2, 3];
const names: string[] = ['홍길동', '김영희'];
const mixed: Array<string | number> = [1, 'hello'];

// 튜플 (고정 길이, 타입 지정)
const pair: [string, number] = ['홍길동', 25];

// enum (열거형)
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
const dir: Direction = Direction.Up;

// any (타입 검사 비활성화 - 가급적 사용 금지!)
let anything: any = 'hello';
anything = 42;  // OK (하지만 위험!)

// unknown (안전한 any 대안)
let value: unknown = 'hello';
// value.toUpperCase();  // Error!
if (typeof value === 'string') {
  value.toUpperCase();  // OK (타입 가드 후)
}
\`\`\`

---

## 함수 타입

\`\`\`typescript
// 매개변수와 반환값 타입 지정
function greet(name: string): string {
  return \\\`안녕하세요, \\\${name}님!\\\`;
}

// 화살표 함수
const add = (a: number, b: number): number => a + b;

// 선택적 매개변수 (?)
const createUser = (name: string, age?: number): void => {
  console.log(name, age);  // age는 number | undefined
};
createUser('홍길동');      // OK
createUser('홍길동', 25);  // OK

// 기본값
const greetUser = (name: string = '손님'): string => {
  return \\\`안녕하세요, \\\${name}님!\\\`;
};

// void (반환값 없음)
const log = (message: string): void => {
  console.log(message);
};

// never (절대 반환하지 않음 - 에러, 무한루프)
const throwError = (msg: string): never => {
  throw new Error(msg);
};
\`\`\`

---

## 유니온 타입과 리터럴 타입

\`\`\`typescript
// 유니온 타입 (|) - 여러 타입 중 하나
type ID = string | number;

const userId: ID = 'abc123';
const orderId: ID = 42;

// 리터럴 타입 - 특정 값만 허용
type Status = 'pending' | 'active' | 'inactive';
const userStatus: Status = 'active';
// const invalid: Status = 'unknown';  // Error!

// 유니온 + 타입 가드
const formatId = (id: string | number): string => {
  if (typeof id === 'string') {
    return id.toUpperCase();  // string 메서드 사용 가능
  }
  return id.toString();  // number 메서드 사용 가능
};
\`\`\`

---

## 핵심 정리

| 타입 | 설명 | 예시 |
|------|------|------|
| \`string\` | 문자열 | \`'hello'\` |
| \`number\` | 숫자 | \`42\`, \`3.14\` |
| \`boolean\` | 참/거짓 | \`true\`, \`false\` |
| \`unknown\` | 안전한 any | 타입 가드 필수 |
| \`void\` | 반환값 없음 | 함수 반환 |
| \`never\` | 절대 반환 안됨 | 에러 함수 |
| 유니온 | 여러 타입 중 하나 | \`string \\| number\` |
| 리터럴 | 특정 값만 허용 | \`'a' \\| 'b'\` |
`,

  'interfaces-types': `# 인터페이스와 타입 별칭

## 학습 목표
- interface와 type의 차이와 사용법을 이해한다
- 객체 타입을 정의하고 활용할 수 있다
- 확장과 조합을 통해 복잡한 타입을 구성할 수 있다

---

## Interface

객체의 **형태(shape)**를 정의합니다.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;          // 선택적 속성
  readonly createdAt: Date;  // 읽기 전용
}

const user: User = {
  id: 1,
  name: '홍길동',
  email: 'gd@example.com',
  createdAt: new Date(),
};

// user.createdAt = new Date();  // Error! (readonly)
\`\`\`

### Interface 확장 (extends)

\`\`\`typescript
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

const myDog: Dog = {
  name: '바둑이',
  age: 3,
  breed: '진돗개',
  bark: () => console.log('멍멍!'),
};
\`\`\`

---

## Type Alias

\`\`\`typescript
type User = {
  id: number;
  name: string;
  email: string;
};

// 유니온 타입 (interface로는 불가능)
type ID = string | number;

// 교차 타입 (&)
type Admin = User & {
  role: 'admin';
  permissions: string[];
};

const admin: Admin = {
  id: 1,
  name: '관리자',
  email: 'admin@test.com',
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
};
\`\`\`

---

## Interface vs Type

| 기능 | Interface | Type |
|------|-----------|------|
| 객체 타입 정의 | O | O |
| 확장 | \`extends\` | \`&\` (교차) |
| 유니온 | X | O |
| 선언 병합 | O | X |
| 원시/튜플/유니온 타입 | X | O |

\`\`\`typescript
// 선언 병합 (interface만 가능)
interface Window {
  myCustomProp: string;
}
// 기존 Window 인터페이스에 속성이 추가됨

// 추천: 객체 형태 → interface, 그 외 → type
\`\`\`

---

## 함수 타입 정의

\`\`\`typescript
// type으로 함수 타입 정의
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

// interface로 함수 타입 정의
interface Formatter {
  (value: number): string;
}

const formatCurrency: Formatter = (value) => {
  return \\\`\\\${value.toLocaleString()}원\\\`;
};
\`\`\`

---

## 인덱스 시그니처

\`\`\`typescript
// 동적 키를 가진 객체
interface Dictionary {
  [key: string]: string;
}

const translations: Dictionary = {
  hello: '안녕하세요',
  goodbye: '안녕히 가세요',
};

// Record 유틸리티 타입 (더 간결)
type TranslationMap = Record<string, string>;
\`\`\`

---

## 핵심 정리

- **interface**: 객체 형태 정의, 확장(\`extends\`), 선언 병합 가능
- **type**: 유니온, 교차, 원시 타입 별칭, 더 유연한 타입 정의
- **\`?\`**: 선택적 속성 / **\`readonly\`**: 읽기 전용 속성
- **교차 타입(\`&\`)**: 여러 타입을 합침
- 팀 규칙을 정하되, 일반적으로 **객체 → interface, 나머지 → type**
`,

  'generics': `# 제네릭

## 학습 목표
- 제네릭의 개념과 필요성을 이해한다
- 제네릭 함수, 인터페이스, 클래스를 작성할 수 있다
- 제네릭 제약 조건(constraints)을 활용할 수 있다

---

## 제네릭이란?

**제네릭(Generic)**은 타입을 매개변수화하는 기능입니다. 함수나 클래스를 정의할 때 타입을 확정하지 않고, 사용할 때 지정합니다.

\`\`\`typescript
// 제네릭 없이 → any를 쓰면 타입 안전성 X
function getFirst(arr: any[]): any {
  return arr[0];
}

// 제네릭 사용 → 타입 안전성 O
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst<number>([1, 2, 3]);    // number
const str = getFirst<string>(['a', 'b']);    // string
const str2 = getFirst(['a', 'b']);           // 타입 추론으로 string
\`\`\`

---

## 제네릭 함수

\`\`\`typescript
// 두 값을 교환하는 함수
function swap<T>(a: T, b: T): [T, T] {
  return [b, a];
}

const [x, y] = swap<number>(1, 2);   // [2, 1]
const [a, b] = swap('hello', 'world'); // ['world', 'hello']

// 여러 타입 매개변수
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const p = pair('name', 42);  // [string, number]
\`\`\`

---

## 제네릭 인터페이스

\`\`\`typescript
// API 응답 타입
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

// 사용
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: '홍길동' },
  status: 200,
  message: 'OK',
};

const productResponse: ApiResponse<Product[]> = {
  data: [{ id: 1, title: '노트북', price: 1500000 }],
  status: 200,
  message: 'OK',
};
\`\`\`

---

## 제네릭 제약 조건 (Constraints)

\`\`\`typescript
// T는 { length: number } 속성을 가진 타입만 허용
function logLength<T extends { length: number }>(value: T): void {
  console.log(value.length);
}

logLength('hello');       // OK (string.length)
logLength([1, 2, 3]);     // OK (array.length)
// logLength(42);         // Error! (number에는 length 없음)

// keyof 제약 조건
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: '홍길동', age: 25 };
getProperty(user, 'name');   // OK → string
// getProperty(user, 'email');  // Error! 'email'은 user에 없음
\`\`\`

---

## 제네릭 유틸리티 활용

\`\`\`typescript
// 배열을 받아 중복을 제거
function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// 비동기 함수 래핑
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\\\`HTTP \\\${response.status}\\\`);
  }
  return response.json() as Promise<T>;
}

// 사용
const users = await fetchData<User[]>('/api/users');
const product = await fetchData<Product>('/api/products/1');
\`\`\`

---

## 핵심 정리

| 개념 | 문법 | 용도 |
|------|------|------|
| 기본 제네릭 | \`<T>\` | 타입을 매개변수화 |
| 다중 타입 | \`<T, U>\` | 여러 타입 매개변수 |
| 제약 조건 | \`<T extends Type>\` | 특정 조건의 타입만 허용 |
| keyof | \`<K extends keyof T>\` | 객체의 키 타입으로 제한 |
| 기본 타입 | \`<T = string>\` | 기본 타입 매개변수 |
`,
}

// ─────────────────────────────────────────────
// Course 6: Node.js 백엔드 개발
// ─────────────────────────────────────────────

chapterContents['nodejs-backend'] = {
  'nodejs-intro': `# Node.js 기초와 모듈 시스템

## 학습 목표
- Node.js의 특징과 동작 원리를 이해한다
- CommonJS와 ES Modules의 차이를 이해한다
- 내장 모듈을 활용할 수 있다

---

## Node.js란?

**Node.js**는 Chrome의 V8 엔진 위에서 동작하는 JavaScript 런타임입니다. 브라우저 밖에서 JavaScript를 실행할 수 있게 해주며, **서버 사이드 개발**에 사용됩니다.

### 특징

- **비동기 I/O**: 파일 읽기, DB 조회 등을 비동기로 처리
- **이벤트 기반**: 이벤트 루프를 통한 논블로킹 처리
- **단일 스레드**: 하나의 스레드로 많은 연결을 처리
- **npm**: 세계 최대의 패키지 생태계

---

## 모듈 시스템

### ES Modules (ESM) - 추천

\`\`\`javascript
// math.js - 내보내기
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

export default class Calculator {
  add(a, b) { return a + b; }
}

// app.js - 가져오기
import Calculator, { add, subtract } from './math.js';
\`\`\`

### CommonJS (CJS) - 레거시

\`\`\`javascript
// math.js
const add = (a, b) => a + b;
module.exports = { add };

// app.js
const { add } = require('./math');
\`\`\`

---

## 내장 모듈

\`\`\`javascript
// 파일 시스템 (fs)
import { readFile, writeFile } from 'fs/promises';

const data = await readFile('config.json', 'utf-8');
const config = JSON.parse(data);

await writeFile('output.txt', 'Hello, Node.js!');

// 경로 (path)
import path from 'path';

const fullPath = path.join(__dirname, 'data', 'users.json');
const ext = path.extname('photo.jpg');  // '.jpg'

// HTTP 서버 (기본)
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello!' }));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

---

## npm (패키지 매니저)

\`\`\`bash
# 프로젝트 초기화
npm init -y

# 패키지 설치
npm install express          # 프로덕션 의존성
npm install -D typescript    # 개발 의존성

# 스크립트 실행
npm run dev
npm test
\`\`\`

---

## 핵심 정리

- **Node.js**: 서버사이드 JavaScript 런타임
- **ES Modules**: \`import/export\` (추천)
- **내장 모듈**: fs, path, http 등
- **npm**: 패키지 관리, 스크립트 실행
- **비동기**: I/O 작업은 \`async/await\` 사용
`,

  'express-basics': `# Express 서버와 라우팅

## 학습 목표
- Express 서버를 생성하고 실행할 수 있다
- 라우팅을 설정하고 HTTP 메서드를 처리할 수 있다
- 요청(req)과 응답(res) 객체를 활용할 수 있다

---

## Express 시작하기

\`\`\`bash
npm install express
npm install -D @types/express typescript ts-node
\`\`\`

\`\`\`typescript
import express from 'express';

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Hello, Express!' });
});

app.listen(PORT, () => {
  console.log(\\\`Server running on http://localhost:\\\${PORT}\\\`);
});
\`\`\`

---

## 라우팅

### HTTP 메서드별 라우트

\`\`\`typescript
// GET - 데이터 조회
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET - 단일 조회 (URL 파라미터)
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST - 데이터 생성
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now().toString(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT - 전체 업데이트
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

// DELETE - 삭제
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id !== id);
  res.status(204).send();
});
\`\`\`

### 쿼리 파라미터

\`\`\`typescript
// GET /api/users?page=1&limit=10&sort=name
app.get('/api/users', (req, res) => {
  const { page = '1', limit = '10', sort } = req.query;
  // page, limit은 string 타입
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  // 페이지네이션 로직...
});
\`\`\`

---

## Router 분리

\`\`\`typescript
// routes/user-routes.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

router.get('/:id', (req, res) => {
  res.json({ user: { id: req.params.id } });
});

export default router;

// app.ts
import userRoutes from './routes/user-routes';
app.use('/api/users', userRoutes);
\`\`\`

---

## 핵심 정리

| HTTP 메서드 | 용도 | 상태 코드 |
|-------------|------|-----------|
| GET | 조회 | 200 |
| POST | 생성 | 201 |
| PUT | 전체 수정 | 200 |
| PATCH | 부분 수정 | 200 |
| DELETE | 삭제 | 204 |

- **\`req.params\`**: URL 파라미터 (\`/users/:id\`)
- **\`req.query\`**: 쿼리 스트링 (\`?page=1\`)
- **\`req.body\`**: 요청 본문 (JSON)
- **Router**: 라우트를 파일별로 분리
`,
}

// ─────────────────────────────────────────────
// Course 7: SQL과 데이터베이스
// ─────────────────────────────────────────────

chapterContents['sql-databases'] = {
  'sql-basics': `# 관계형 DB 개념과 SQL 기초

## 학습 목표
- 관계형 데이터베이스의 핵심 개념을 이해한다
- CRUD(Create, Read, Update, Delete) SQL 문을 작성할 수 있다
- 테이블 설계의 기본 원리를 이해한다

---

## 관계형 데이터베이스란?

데이터를 **테이블(표)** 형태로 저장하는 시스템입니다. 테이블 간 **관계(Relation)**를 통해 데이터를 연결합니다.

### 핵심 용어

| 용어 | 설명 | 비유 |
|------|------|------|
| **테이블** | 데이터를 저장하는 구조 | 엑셀 시트 |
| **행(Row)** | 하나의 데이터 레코드 | 시트의 한 줄 |
| **열(Column)** | 데이터의 속성 | 시트의 열 제목 |
| **기본키(PK)** | 행을 고유하게 식별하는 값 | 주민등록번호 |
| **외래키(FK)** | 다른 테이블의 PK를 참조 | 링크/참조 |

---

## 테이블 생성 (CREATE TABLE)

\`\`\`sql
CREATE TABLE users (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(255) UNIQUE NOT NULL,
  age       INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id        SERIAL PRIMARY KEY,
  title     VARCHAR(255) NOT NULL,
  content   TEXT,
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

## CRUD 기본 SQL

### CREATE (삽입)

\`\`\`sql
INSERT INTO users (name, email, age)
VALUES ('홍길동', 'gd@example.com', 25);

INSERT INTO users (name, email, age)
VALUES
  ('김영희', 'yh@example.com', 23),
  ('박철수', 'cs@example.com', 27);
\`\`\`

### READ (조회)

\`\`\`sql
-- 전체 조회
SELECT * FROM users;

-- 특정 열만 조회
SELECT name, email FROM users;

-- 조건 조회 (WHERE)
SELECT * FROM users WHERE age >= 25;
SELECT * FROM users WHERE name LIKE '홍%';
SELECT * FROM users WHERE email IS NOT NULL;

-- 정렬 (ORDER BY)
SELECT * FROM users ORDER BY age DESC;

-- 제한 (LIMIT, OFFSET) - 페이지네이션
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 0;  -- 1페이지
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 10; -- 2페이지

-- 집계 함수
SELECT COUNT(*) FROM users;
SELECT AVG(age) FROM users;
SELECT MAX(age), MIN(age) FROM users;
\`\`\`

### UPDATE (수정)

\`\`\`sql
UPDATE users
SET age = 26, name = '홍길동2'
WHERE id = 1;
\`\`\`

### DELETE (삭제)

\`\`\`sql
DELETE FROM users WHERE id = 1;

-- 주의: WHERE 없으면 전체 삭제!
-- DELETE FROM users;  -- 절대 실행하지 마세요!
\`\`\`

---

## 데이터 타입 (PostgreSQL)

| 타입 | 설명 | 예시 |
|------|------|------|
| INTEGER / INT | 정수 | 1, 42, -5 |
| SERIAL | 자동 증가 정수 | PK에 사용 |
| VARCHAR(n) | 가변 길이 문자열 | 이름, 이메일 |
| TEXT | 긴 문자열 | 게시글 본문 |
| BOOLEAN | 참/거짓 | true, false |
| TIMESTAMP | 날짜+시간 | 생성일, 수정일 |
| JSON / JSONB | JSON 데이터 | 설정값, 메타데이터 |

---

## 핵심 정리

- **관계형 DB**: 테이블 + 관계로 데이터 저장
- **PK**: 행을 고유하게 식별 / **FK**: 다른 테이블 참조
- **CRUD**: INSERT, SELECT, UPDATE, DELETE
- **WHERE 절**: UPDATE/DELETE에는 반드시 WHERE 사용!
- **SERIAL**: 자동 증가하는 정수 (PK에 적합)
`,
}

// ─────────────────────────────────────────────
// Courses 8-10 (shorter content for brevity)
// ─────────────────────────────────────────────

// Additional chapters for existing courses that have fewer chapters than specified
// These will be added as new chapters with the extra content

} // end of addRemainingChapterContents

addRemainingChapterContents()

// ============================================================
// QUIZ DATA
// ============================================================

interface QuizQuestionData {
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  order: number
  points: number
}

interface QuizData {
  title: string
  description: string
  passingScore: number
  timeLimit: number | null
  maxAttempts: number
  questions: QuizQuestionData[]
}

const quizData: Record<string, Record<string, QuizData>> = {}

// ─────────────────────────────────────────────
// Course 1 Quizzes: Git & GitHub
// ─────────────────────────────────────────────

quizData['git-github-mastery'] = {
  'intro-and-setup': {
    title: 'Git 기초 개념 퀴즈',
    description: 'Git의 기본 개념과 설치에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Git은 어떤 유형의 버전 관리 시스템인가요?',
        options: ['중앙집중식 버전 관리 시스템', '분산 버전 관리 시스템', '로컬 버전 관리 시스템', '클라우드 버전 관리 시스템'],
        correctAnswer: '분산 버전 관리 시스템',
        explanation: 'Git은 분산 버전 관리 시스템(DVCS)으로, 각 개발자가 전체 저장소의 완전한 복사본을 로컬에 가지고 있습니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Git에서 사용자 정보를 전역으로 설정하는 올바른 명령어는?',
        options: ['git config user.name "이름"', 'git config --global user.name "이름"', 'git set --global user.name "이름"', 'git setup user.name "이름"'],
        correctAnswer: 'git config --global user.name "이름"',
        explanation: '--global 플래그를 사용하면 시스템 전체에 적용되는 설정을 합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'git init 명령어를 실행하면 .git 폴더가 생성된다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'git init은 현재 디렉토리에 .git 숨김 폴더를 생성하며, 이 폴더에 모든 버전 관리 정보가 저장됩니다.',
        order: 3,
        points: 1,
      },
      {
        type: 'SHORT_ANSWER' as QuestionType,
        question: 'Git을 만든 사람은 누구인가요? (영어 이름으로 작성)',
        options: [],
        correctAnswer: 'Linus Torvalds',
        explanation: 'Linus Torvalds가 2005년에 리눅스 커널 개발을 위해 Git을 만들었습니다.',
        order: 4,
        points: 1,
      },
    ],
  },
  'basic-commands': {
    title: 'Git 기본 명령어 퀴즈',
    description: 'Git의 기본 명령어와 워크플로우에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Git의 세 가지 영역 중 "다음 커밋에 포함할 변경사항을 모아두는 공간"은?',
        options: ['Working Directory', 'Staging Area', 'Repository', 'Remote'],
        correctAnswer: 'Staging Area',
        explanation: 'Staging Area(Index)는 git add로 추가된 변경사항이 다음 커밋을 위해 대기하는 공간입니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Conventional Commits에서 새로운 기능을 추가했을 때 사용하는 타입은?',
        options: ['fix', 'feat', 'chore', 'update'],
        correctAnswer: 'feat',
        explanation: 'feat는 새로운 기능(feature)을 추가했을 때 사용하는 커밋 타입입니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'git commit -am "message"는 Untracked 파일도 자동으로 스테이징한다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: '-a 플래그는 이미 추적 중인(tracked) 파일의 변경사항만 자동으로 스테이징합니다. 새로 생성된 파일은 별도로 git add가 필요합니다.',
        order: 3,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '커밋 이력을 한 줄씩 그래프로 보려면 어떤 명령어를 사용하나요?',
        options: ['git log --short', 'git log --oneline --graph', 'git history --graph', 'git show --oneline'],
        correctAnswer: 'git log --oneline --graph',
        explanation: '--oneline은 각 커밋을 한 줄로, --graph는 브랜치 관계를 그래프로 보여줍니다.',
        order: 4,
        points: 1,
      },
    ],
  },
  'branching-and-merging': {
    title: '브랜치와 병합 퀴즈',
    description: 'Git 브랜치 관리와 병합 전략에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '새 브랜치를 생성하면서 동시에 전환하는 명령어는?',
        options: ['git branch -new feature', 'git checkout -b feature', 'git create feature', 'git branch --switch feature'],
        correctAnswer: 'git checkout -b feature',
        explanation: 'git checkout -b는 브랜치 생성과 전환을 동시에 수행합니다. Git 2.23+에서는 git switch -c도 사용 가능합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'Rebase는 이미 push한 브랜치에서도 안전하게 사용할 수 있다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'Rebase는 커밋 해시를 변경하므로, 이미 push한 브랜치에서 사용하면 다른 사람의 작업에 영향을 줄 수 있습니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '충돌(Conflict) 해결 후 올바른 다음 단계는?',
        options: ['git merge --continue', 'git add 충돌파일 && git commit', 'git resolve', 'git conflict --fix'],
        correctAnswer: 'git add 충돌파일 && git commit',
        explanation: '충돌을 수동으로 해결한 후, 해당 파일을 git add로 스테이징하고 git commit으로 머지 커밋을 완성합니다.',
        order: 3,
        points: 1,
      },
    ],
  },
  'github-workflow': {
    title: 'GitHub 협업 퀴즈',
    description: 'GitHub 워크플로우와 협업 도구에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Fork & PR 워크플로우에서 원본 저장소를 로컬에 연결할 때 사용하는 관례적 이름은?',
        options: ['origin', 'upstream', 'source', 'remote'],
        correctAnswer: 'upstream',
        explanation: '관례적으로 원본(fork한) 저장소는 upstream, 자신의 fork 저장소는 origin으로 명명합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '현재 작업 중인 변경사항을 임시 저장하는 명령어는?',
        options: ['git save', 'git stash', 'git temp', 'git cache'],
        correctAnswer: 'git stash',
        explanation: 'git stash는 작업 중인 변경사항을 임시 저장하고 작업 디렉토리를 깨끗하게 만듭니다. git stash pop으로 복원합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'Pull Request에서 코드 리뷰를 받는 것은 선택사항이며 생략해도 된다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: '코드 리뷰는 코드 품질 보장, 버그 예방, 지식 공유를 위해 팀 협업에서 필수적인 프로세스입니다.',
        order: 3,
        points: 1,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// Course 2 Quizzes: HTML/CSS
// ─────────────────────────────────────────────

quizData['html-css-fundamentals'] = {
  'html-basics': {
    title: 'HTML 기초 퀴즈',
    description: 'HTML 문서 구조와 시맨틱 태그에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'HTML 문서에서 페이지의 주요 콘텐츠를 감싸는 시맨틱 태그는?',
        options: ['<div>', '<section>', '<main>', '<content>'],
        correctAnswer: '<main>',
        explanation: '<main> 태그는 페이지의 핵심 콘텐츠를 감싸며, 문서당 하나만 사용해야 합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: '<article> 태그는 독립적으로 배포/재사용 가능한 콘텐츠에 사용한다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: '<article>은 블로그 글, 뉴스 기사 등 독립적인 콘텐츠를 감쌀 때 사용합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '이미지 태그에서 접근성을 위해 반드시 작성해야 하는 속성은?',
        options: ['title', 'src', 'alt', 'name'],
        correctAnswer: 'alt',
        explanation: 'alt 속성은 이미지를 표시할 수 없거나 스크린 리더를 사용하는 경우 대체 텍스트를 제공합니다.',
        order: 3,
        points: 1,
      },
    ],
  },
  'css-basics': {
    title: 'CSS 선택자와 박스 모델 퀴즈',
    description: 'CSS 선택자 우선순위와 박스 모델에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'CSS 선택자 우선순위가 가장 높은 것은?',
        options: ['요소 선택자 (p)', '클래스 선택자 (.btn)', 'ID 선택자 (#main)', '전체 선택자 (*)'],
        correctAnswer: 'ID 선택자 (#main)',
        explanation: '우선순위: !important > 인라인 > ID(100점) > 클래스(10점) > 요소(1점) > *(0점)',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'box-sizing: border-box를 적용하면 width에 포함되는 것은?',
        options: ['content만', 'content + padding', 'content + padding + border', 'content + padding + border + margin'],
        correctAnswer: 'content + padding + border',
        explanation: 'border-box에서 width는 content + padding + border를 포함합니다. margin은 포함되지 않습니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'rem 단위는 부모 요소의 font-size를 기준으로 계산된다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'rem은 루트 요소(html)의 font-size를 기준으로 합니다. 부모 기준은 em 단위입니다.',
        order: 3,
        points: 1,
      },
    ],
  },
  'flexbox-layout': {
    title: 'Flexbox와 Grid 퀴즈',
    description: 'Flexbox와 CSS Grid 레이아웃에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Flexbox에서 요소를 수직(세로) 가운데 정렬하는 속성은?',
        options: ['justify-content: center', 'align-items: center', 'text-align: center', 'vertical-align: middle'],
        correctAnswer: 'align-items: center',
        explanation: 'flex-direction: row(기본)일 때, justify-content는 주축(가로), align-items는 교차축(세로) 정렬을 담당합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'CSS Grid에서 반응형 카드 레이아웃을 만들 때 자주 사용하는 속성 조합은?',
        options: ['grid-template-columns: auto auto', 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))', 'grid-template-columns: 1fr 1fr 1fr', 'grid-auto-flow: dense'],
        correctAnswer: 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
        explanation: 'repeat(auto-fit, minmax(250px, 1fr))는 화면 크기에 따라 자동으로 열 수를 조정하는 반응형 패턴입니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'Flexbox는 2차원 레이아웃 시스템이다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'Flexbox는 1차원(행 또는 열) 레이아웃 시스템입니다. 2차원은 CSS Grid입니다.',
        order: 3,
        points: 1,
      },
    ],
  },
  'responsive-design': {
    title: '반응형 웹 디자인 퀴즈',
    description: '반응형 디자인과 미디어 쿼리에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '모바일 퍼스트 디자인에서 기본 스타일을 확장할 때 사용하는 미디어 쿼리는?',
        options: ['@media (max-width: 768px)', '@media (min-width: 768px)', '@media screen', '@media mobile'],
        correctAnswer: '@media (min-width: 768px)',
        explanation: '모바일 퍼스트는 작은 화면을 기본으로 하고, min-width로 큰 화면에서 스타일을 확장합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'viewport 메타 태그 없이도 모바일에서 반응형 디자인이 잘 동작한다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'viewport 메타 태그가 없으면 모바일 브라우저가 데스크톱 크기로 렌더링하여 반응형이 동작하지 않습니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '이미지를 컨테이너에 맞게 반응형으로 만드는 CSS 속성은?',
        options: ['width: 100%', 'max-width: 100%; height: auto', 'display: responsive', 'object-fit: cover'],
        correctAnswer: 'max-width: 100%; height: auto',
        explanation: 'max-width: 100%는 이미지가 컨테이너보다 커지지 않게 하고, height: auto는 비율을 유지합니다.',
        order: 3,
        points: 1,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// Course 3 Quizzes: JavaScript
// ─────────────────────────────────────────────

quizData['javascript-programming'] = {
  'js-intro': {
    title: '변수, 타입, 연산자 퀴즈',
    description: 'JavaScript의 변수, 타입, 연산자에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: "다음 중 '5' === 5 의 결과는?",
        options: ['true', 'false', 'undefined', 'Error'],
        correctAnswer: 'false',
        explanation: '===는 엄격한 비교로, 타입이 다르면 false입니다. 문자열 "5"와 숫자 5는 타입이 다릅니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'const로 선언된 객체의 속성을 변경할 수 있을까요?',
        options: ['변경 불가능 (에러 발생)', '변경 가능', '속성에 따라 다름', 'strict mode에서만 불가능'],
        correctAnswer: '변경 가능',
        explanation: 'const는 변수의 재할당을 막지만, 객체의 속성 변경은 허용합니다. 재할당(user = {})만 불가합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '0 ?? 10 의 결과는?',
        options: ['0', '10', 'null', 'undefined'],
        correctAnswer: '0',
        explanation: '?? (Nullish Coalescing)은 null/undefined일 때만 대체값을 사용합니다. 0은 null이 아니므로 0이 반환됩니다.',
        order: 3,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'typeof null의 결과는 "null"이다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'typeof null은 "object"를 반환합니다. 이것은 JavaScript의 유명한 역사적 버그입니다.',
        order: 4,
        points: 1,
      },
    ],
  },
  'functions-scope': {
    title: '함수와 스코프 퀴즈',
    description: '함수 선언, 스코프, 클로저에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '클로저(Closure)란 무엇인가요?',
        options: ['함수를 닫는(close) 것', '함수가 자신이 선언된 환경의 변수를 기억하는 것', '즉시 실행 함수(IIFE)', '함수를 재귀 호출하는 것'],
        correctAnswer: '함수가 자신이 선언된 환경의 변수를 기억하는 것',
        explanation: '클로저는 내부 함수가 외부 함수의 변수에 접근할 수 있는 현상입니다. 데이터 캡슐화에 활용됩니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'let으로 선언한 변수는 블록 스코프를 가진다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'let과 const는 블록 스코프({} 내부)를 가집니다. var는 함수 스코프를 가져 블록을 무시합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '화살표 함수에서 매개변수가 1개일 때 생략 가능한 것은?',
        options: ['중괄호 {}', '소괄호 ()', 'return 키워드', '화살표 =>'],
        correctAnswer: '소괄호 ()',
        explanation: '매개변수가 1개면 소괄호를 생략할 수 있습니다: x => x * 2. 0개 또는 2개 이상이면 필수입니다.',
        order: 3,
        points: 1,
      },
    ],
  },
  'arrays-objects': {
    title: '배열과 객체 메서드 퀴즈',
    description: '배열 고차 함수와 구조 분해에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '[1, 2, 3, 4, 5].filter(n => n > 3)의 결과는?',
        options: ['[4, 5]', '[1, 2, 3]', '[3, 4, 5]', '[true, true]'],
        correctAnswer: '[4, 5]',
        explanation: 'filter는 콜백 함수가 true를 반환하는 요소만 새 배열로 반환합니다. 3보다 큰 4와 5가 선택됩니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'reduce 메서드의 두 번째 인자는 무엇인가요?',
        options: ['콜백 함수', '초기값(accumulator의 초기 값)', '배열의 인덱스', '최종 반환값'],
        correctAnswer: '초기값(accumulator의 초기 값)',
        explanation: 'reduce(callback, initialValue)에서 두 번째 인자는 누적값의 초기값입니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: '스프레드 연산자(...)를 사용한 객체 복사는 깊은 복사(deep copy)이다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: '스프레드 연산자는 얕은 복사(shallow copy)입니다. 중첩된 객체는 참조가 복사됩니다.',
        order: 3,
        points: 1,
      },
    ],
  },
  'async-programming': {
    title: '비동기 프로그래밍 퀴즈',
    description: 'Promise, async/await에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Promise의 세 가지 상태가 아닌 것은?',
        options: ['pending', 'fulfilled', 'rejected', 'completed'],
        correctAnswer: 'completed',
        explanation: 'Promise의 세 가지 상태는 pending(대기), fulfilled(이행), rejected(거부)입니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '여러 비동기 작업을 동시에 실행하고 모두 완료되길 기다리는 메서드는?',
        options: ['Promise.race()', 'Promise.all()', 'Promise.any()', 'Promise.resolve()'],
        correctAnswer: 'Promise.all()',
        explanation: 'Promise.all()은 모든 Promise가 이행될 때까지 기다립니다. 하나라도 거부되면 전체가 거부됩니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'async 함수는 항상 Promise를 반환한다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'async 함수는 return 값을 Promise.resolve()로 감싸서 반환합니다. 명시적으로 Promise를 반환하지 않아도 됩니다.',
        order: 3,
        points: 1,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// Course 4 Quizzes: React
// ─────────────────────────────────────────────

quizData['react-frontend-development'] = {
  'getting-started': {
    title: 'React 기초 퀴즈',
    description: 'React 컴포넌트와 JSX에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'JSX에서 CSS 클래스를 적용할 때 사용하는 속성명은?',
        options: ['class', 'className', 'cssClass', 'style'],
        correctAnswer: 'className',
        explanation: 'JSX에서는 JavaScript의 예약어인 class 대신 className을 사용합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'React 컴포넌트 이름은 반드시 대문자로 시작해야 한다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'React는 소문자로 시작하는 태그를 HTML 요소로, 대문자로 시작하는 태그를 컴포넌트로 인식합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '리스트 렌더링 시 각 항목에 반드시 필요한 속성은?',
        options: ['id', 'key', 'index', 'name'],
        correctAnswer: 'key',
        explanation: 'key 속성은 React가 리스트 항목을 식별하고 효율적으로 업데이트하는 데 필요합니다. 고유한 값이어야 합니다.',
        order: 3,
        points: 1,
      },
    ],
  },
  'components-props': {
    title: 'State와 Props 퀴즈',
    description: 'React의 State와 Props에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Props에 대한 설명으로 올바른 것은?',
        options: ['자식에서 부모로 전달된다', '자식 컴포넌트에서 수정할 수 있다', '읽기 전용이며 부모에서 자식으로 전달된다', '컴포넌트 내부에서만 사용된다'],
        correctAnswer: '읽기 전용이며 부모에서 자식으로 전달된다',
        explanation: 'Props는 부모 → 자식으로 전달되며, 자식에서 수정할 수 없는 읽기 전용 데이터입니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'State를 직접 수정해도(예: state.count = 1) React가 리렌더링한다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'State를 직접 수정하면 React가 변경을 감지하지 못하여 리렌더링되지 않습니다. 반드시 setState 함수를 사용해야 합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '배열 State에서 특정 항목을 삭제하는 올바른 방법은?',
        options: ['todos.splice(index, 1)', 'setTodos(prev => prev.filter(t => t.id !== id))', 'delete todos[index]', 'todos.pop()'],
        correctAnswer: 'setTodos(prev => prev.filter(t => t.id !== id))',
        explanation: 'filter로 새 배열을 만들어 setState에 전달합니다. splice, delete, pop은 원본을 변경하므로 사용하면 안 됩니다.',
        order: 3,
        points: 1,
      },
    ],
  },
  'state-events': {
    title: 'React Hooks 퀴즈',
    description: 'useEffect, useContext 등 React Hooks에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'useEffect의 의존성 배열이 빈 배열([])일 때 이펙트는 언제 실행되나요?',
        options: ['매 렌더링마다', '컴포넌트 마운트 시 1번만', '컴포넌트 언마운트 시', '절대 실행되지 않음'],
        correctAnswer: '컴포넌트 마운트 시 1번만',
        explanation: '빈 의존성 배열은 "의존하는 값이 없다"는 의미이므로, 컴포넌트가 처음 마운트될 때 1번만 실행됩니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'useContext의 주요 목적은 무엇인가요?',
        options: ['성능 최적화', 'Prop Drilling 없이 데이터 공유', '비동기 상태 관리', 'DOM 직접 접근'],
        correctAnswer: 'Prop Drilling 없이 데이터 공유',
        explanation: 'useContext는 컴포넌트 트리 전체에서 Props를 거치지 않고 데이터를 공유할 수 있게 해줍니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: '커스텀 Hook의 이름은 반드시 "use"로 시작해야 한다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'React의 규칙(Rules of Hooks)에 따라 커스텀 Hook은 반드시 "use"로 시작해야 합니다. 그래야 React가 Hook 규칙을 적용할 수 있습니다.',
        order: 3,
        points: 1,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// Course 5 Quizzes: TypeScript
// ─────────────────────────────────────────────

quizData['typescript-mastery'] = {
  'ts-basics': {
    title: '타입 시스템 기초 퀴즈',
    description: 'TypeScript 기본 타입에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'unknown 타입과 any 타입의 차이는?',
        options: ['차이가 없다', 'unknown은 타입 가드 없이 사용 불가, any는 모든 연산 허용', 'any가 더 안전하다', 'unknown은 함수에서만 사용 가능'],
        correctAnswer: 'unknown은 타입 가드 없이 사용 불가, any는 모든 연산 허용',
        explanation: 'unknown은 any의 안전한 대안으로, 타입을 좁히기(type guard) 전에는 연산을 수행할 수 없습니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '함수가 절대 정상적으로 반환하지 않을 때 사용하는 반환 타입은?',
        options: ['void', 'undefined', 'never', 'null'],
        correctAnswer: 'never',
        explanation: 'never는 함수가 항상 예외를 던지거나 무한 루프에 빠져 절대 반환하지 않는 경우에 사용합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: "TypeScript에서 type Status = 'active' | 'inactive'로 정의하면, Status 변수에 'pending'을 할당할 수 있다.",
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: "리터럴 유니온 타입은 지정된 값만 허용합니다. 'pending'은 정의에 포함되지 않으므로 컴파일 에러가 발생합니다.",
        order: 3,
        points: 1,
      },
    ],
  },
  'interfaces-types': {
    title: '인터페이스와 타입 퀴즈',
    description: 'interface와 type의 차이에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'interface에서는 가능하지만 type에서는 불가능한 것은?',
        options: ['유니온 타입 정의', '선언 병합(Declaration Merging)', '교차 타입 사용', '함수 타입 정의'],
        correctAnswer: '선언 병합(Declaration Merging)',
        explanation: 'interface는 같은 이름으로 여러 번 선언하면 자동으로 병합됩니다. type은 중복 선언이 불가능합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '두 타입을 합쳐 하나의 타입으로 만드는 교차 타입의 연산자는?',
        options: ['|', '&', '+', '&&'],
        correctAnswer: '&',
        explanation: '& (교차 타입)은 두 타입의 모든 속성을 합칩니다. |는 유니온 타입으로, 둘 중 하나의 타입입니다.',
        order: 2,
        points: 1,
      },
    ],
  },
  'generics': {
    title: '제네릭 퀴즈',
    description: 'TypeScript 제네릭에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '제네릭의 주요 목적은?',
        options: ['코드 실행 속도 향상', '타입을 매개변수화하여 재사용성 향상', '메모리 사용량 감소', '런타임 에러 방지'],
        correctAnswer: '타입을 매개변수화하여 재사용성 향상',
        explanation: '제네릭은 타입을 매개변수로 받아, 다양한 타입에서 동작하는 재사용 가능한 코드를 작성할 수 있게 합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '<T extends { length: number }>는 무엇을 의미하나요?',
        options: ['T는 number 타입이어야 한다', 'T는 length 속성을 가진 타입이어야 한다', 'T의 길이가 number여야 한다', 'T를 number로 확장한다'],
        correctAnswer: 'T는 length 속성을 가진 타입이어야 한다',
        explanation: 'extends를 사용한 제약 조건은 T가 반드시 가져야 하는 최소한의 형태를 지정합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: '제네릭 함수 호출 시 타입 인자를 항상 명시적으로 전달해야 한다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'TypeScript는 인자로부터 타입을 추론할 수 있어, 대부분의 경우 타입 인자를 생략할 수 있습니다.',
        order: 3,
        points: 1,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// Course 6 Quizzes: Node.js
// ─────────────────────────────────────────────

quizData['nodejs-backend'] = {
  'nodejs-intro': {
    title: 'Node.js 기초 퀴즈',
    description: 'Node.js 기초와 모듈 시스템에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Node.js의 특징이 아닌 것은?',
        options: ['비동기 I/O', '이벤트 기반', '멀티 스레드', '단일 스레드'],
        correctAnswer: '멀티 스레드',
        explanation: 'Node.js는 단일 스레드에서 이벤트 루프를 통해 비동기 I/O를 처리합니다. 멀티 스레드가 아닙니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'ES Modules에서 모듈을 내보내는 키워드는?',
        options: ['module.exports', 'export', 'exports', 'require'],
        correctAnswer: 'export',
        explanation: 'ES Modules는 export/import를 사용합니다. module.exports와 require는 CommonJS 방식입니다.',
        order: 2,
        points: 1,
      },
    ],
  },
  'express-basics': {
    title: 'Express 기초 퀴즈',
    description: 'Express 서버와 라우팅에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'HTTP POST 요청으로 리소스를 생성한 후 적절한 상태 코드는?',
        options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
        correctAnswer: '201 Created',
        explanation: '201 Created는 요청이 성공적이며 새로운 리소스가 생성되었음을 나타냅니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Express에서 URL 파라미터(/users/:id)에 접근하는 방법은?',
        options: ['req.query.id', 'req.params.id', 'req.body.id', 'req.url.id'],
        correctAnswer: 'req.params.id',
        explanation: 'URL 경로에 정의된 파라미터(:id)는 req.params로 접근합니다. 쿼리 스트링은 req.query, 요청 본문은 req.body입니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'Express에서 JSON 요청 본문을 파싱하려면 express.json() 미들웨어가 필요하다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'express.json() 미들웨어 없이는 req.body가 undefined입니다. app.use(express.json())으로 추가해야 합니다.',
        order: 3,
        points: 1,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// Course 7 Quizzes: SQL
// ─────────────────────────────────────────────

quizData['sql-databases'] = {
  'sql-basics': {
    title: 'SQL 기초 퀴즈',
    description: 'SQL 기본 문법과 데이터베이스 개념에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '관계형 데이터베이스에서 행(Row)을 고유하게 식별하는 키는?',
        options: ['Foreign Key', 'Primary Key', 'Unique Key', 'Index Key'],
        correctAnswer: 'Primary Key',
        explanation: 'Primary Key(기본키)는 테이블에서 각 행을 고유하게 식별합니다. NULL이 될 수 없고 중복도 불가합니다.',
        order: 1,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'UPDATE 또는 DELETE 실행 시 반드시 포함해야 하는 절은?',
        options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
        correctAnswer: 'WHERE',
        explanation: 'WHERE 절 없이 UPDATE/DELETE를 실행하면 테이블의 모든 행이 수정/삭제됩니다. 반드시 대상을 지정해야 합니다.',
        order: 2,
        points: 1,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'PostgreSQL에서 SERIAL 타입은 자동으로 증가하는 정수이다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'SERIAL은 PostgreSQL에서 자동 증가 정수를 위한 데이터 타입으로, Primary Key에 자주 사용됩니다.',
        order: 3,
        points: 1,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '페이지네이션을 구현할 때 사용하는 SQL 키워드 조합은?',
        options: ['SELECT TOP', 'LIMIT과 OFFSET', 'FETCH FIRST', 'ROWNUM'],
        correctAnswer: 'LIMIT과 OFFSET',
        explanation: 'PostgreSQL에서는 LIMIT으로 개수를 제한하고, OFFSET으로 시작 위치를 지정하여 페이지네이션을 구현합니다.',
        order: 4,
        points: 1,
      },
    ],
  },
}


// ============================================================
// ASSIGNMENT DATA
// ============================================================

interface AssignmentData {
  title: string
  description: string
}

const assignmentData: Record<string, AssignmentData[]> = {
  'git-github-mastery': [
    {
      title: 'Git 저장소 생성 및 협업 실습',
      description: `## 과제: Git & GitHub 실습 프로젝트

### 목표
Git과 GitHub를 사용하여 실제 협업 워크플로우를 경험합니다.

### 요구사항

1. **개인 저장소 생성**
   - GitHub에 \`git-practice\` 저장소를 생성하세요
   - README.md, .gitignore 파일을 포함한 초기 커밋을 작성하세요
   - Conventional Commits 규칙을 따르세요

2. **브랜치 전략 실습**
   - \`develop\` 브랜치를 생성하세요
   - \`feature/about-page\` 브랜치를 만들고, about.html 파일을 추가하세요
   - develop으로 PR을 생성하고 머지하세요

3. **충돌 해결 경험**
   - 두 개의 feature 브랜치에서 같은 파일을 수정하세요
   - 머지 충돌을 발생시키고 해결하세요
   - 해결 과정을 README에 기록하세요

### 제출물
- GitHub 저장소 URL
- 최소 10개의 커밋 이력
- 2개 이상의 PR (머지 완료)
- 충돌 해결 기록

### 평가 기준
- Conventional Commits 준수 여부 (30%)
- 브랜치 전략 적용 (30%)
- 충돌 해결 능력 (20%)
- README 문서화 (20%)`,
    },
  ],
  'html-css-fundamentals': [
    {
      title: '개인 포트폴리오 웹페이지 제작',
      description: `## 과제: 반응형 포트폴리오 페이지

### 목표
HTML5 시맨틱 태그와 CSS Flexbox/Grid를 활용하여 반응형 포트폴리오 페이지를 제작합니다.

### 요구사항

1. **HTML 구조** (시맨틱 태그 필수)
   - header: 이름, 내비게이션
   - main: 자기소개, 기술 스택, 프로젝트, 연락처
   - footer: 저작권, 소셜 링크
   - 최소 4개의 섹션 사용

2. **CSS 스타일링**
   - 외부 CSS 파일 사용 (인라인 스타일 금지)
   - Flexbox 또는 Grid를 활용한 레이아웃
   - hover 효과 적용 (최소 3곳)
   - CSS 변수(custom properties) 사용

3. **반응형 디자인**
   - 모바일(~767px), 태블릿(768px~1023px), 데스크톱(1024px~) 대응
   - 최소 2개의 미디어 쿼리 사용
   - 이미지 반응형 처리

### 제출물
- GitHub 저장소 URL (GitHub Pages로 배포 권장)
- index.html, style.css 파일

### 평가 기준
- 시맨틱 마크업 (25%)
- CSS 레이아웃 (Flexbox/Grid) (25%)
- 반응형 디자인 (25%)
- 코드 품질 및 구조 (25%)`,
    },
  ],
  'javascript-programming': [
    {
      title: 'JavaScript 할 일 관리 앱 (Todo App)',
      description: `## 과제: Vanilla JavaScript Todo App

### 목표
순수 JavaScript(라이브러리 없이)로 할 일 관리 앱을 구현합니다.

### 요구사항

1. **기본 기능 (CRUD)**
   - 할 일 추가 (제목, 마감일)
   - 할 일 완료/미완료 토글
   - 할 일 삭제
   - 할 일 수정 (인라인 편집)

2. **필터링 & 검색**
   - 전체 / 완료 / 미완료 필터
   - 제목으로 검색
   - 마감일 기준 정렬

3. **데이터 저장**
   - localStorage를 활용한 데이터 영속성
   - 페이지 새로고침 후에도 데이터 유지

4. **코드 품질**
   - ES6+ 문법 사용 (const/let, 화살표 함수, 구조 분해 등)
   - 배열 고차 함수(map, filter, find) 활용
   - 함수 분리 (200줄 이하 권장)

### 제출물
- GitHub 저장소 URL
- 동작하는 데모 URL (GitHub Pages)

### 평가 기준
- CRUD 기능 완성도 (30%)
- ES6+ 문법 활용 (20%)
- 코드 구조 및 가독성 (25%)
- UI/UX 품질 (25%)`,
    },
  ],
  'react-frontend-development': [
    {
      title: 'React 날씨 대시보드 앱',
      description: `## 과제: React Weather Dashboard

### 목표
React Hooks와 외부 API를 활용하여 날씨 대시보드를 구현합니다.

### 요구사항

1. **기능**
   - 도시 이름으로 날씨 검색
   - 현재 날씨 정보 표시 (온도, 습도, 풍속, 날씨 아이콘)
   - 즐겨찾기 도시 목록 (추가/삭제)
   - 로딩/에러 상태 처리

2. **기술 요구사항**
   - 함수형 컴포넌트 + Hooks만 사용
   - useState, useEffect 활용
   - 커스텀 Hook 최소 1개 작성 (useFetch 또는 useLocalStorage)
   - 컴포넌트 3개 이상 분리

3. **API**
   - OpenWeatherMap API 또는 WeatherAPI 사용
   - 에러 처리 (네트워크 오류, 잘못된 도시명)

### 제출물
- GitHub 저장소 URL
- 실행 방법이 포함된 README

### 평가 기준
- React 패턴 올바른 적용 (30%)
- Hooks 활용도 (25%)
- 에러/로딩 처리 (20%)
- 컴포넌트 설계 (25%)`,
    },
  ],
  'typescript-mastery': [
    {
      title: 'TypeScript 타입 안전 유틸리티 라이브러리',
      description: `## 과제: Type-Safe Utility Library

### 목표
TypeScript의 타입 시스템을 활용하여 타입 안전한 유틸리티 함수 라이브러리를 작성합니다.

### 요구사항

1. **필수 유틸리티 함수 (제네릭 활용)**
   - \`groupBy<T>(arr: T[], key: keyof T): Record<string, T[]>\`
   - \`pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>\`
   - \`omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>\`
   - \`sortBy<T>(arr: T[], key: keyof T, order?: 'asc' | 'desc'): T[]\`

2. **타입 정의**
   - 모든 함수에 정확한 타입 시그니처 작성
   - 제네릭 제약 조건(constraints) 활용
   - 유틸리티 타입(Partial, Required, Pick, Omit 등) 활용

3. **테스트**
   - 각 함수에 대한 사용 예제 작성
   - 타입 에러가 올바르게 발생하는 경우 주석으로 표시

### 제출물
- GitHub 저장소 URL
- src/utils.ts (유틸리티 함수)
- src/types.ts (타입 정의)
- src/examples.ts (사용 예제)

### 평가 기준
- 타입 안전성 (35%)
- 제네릭 활용도 (30%)
- 코드 품질 (20%)
- 문서화 (15%)`,
    },
  ],
  'nodejs-backend': [
    {
      title: 'REST API 서버 구축 실습',
      description: `## 과제: Express REST API 서버

### 목표
Express와 TypeScript로 간단한 게시판 REST API를 구축합니다.

### 요구사항

1. **API 엔드포인트**
   - POST /api/posts - 게시글 생성
   - GET /api/posts - 게시글 목록 (페이지네이션)
   - GET /api/posts/:id - 게시글 상세
   - PUT /api/posts/:id - 게시글 수정
   - DELETE /api/posts/:id - 게시글 삭제

2. **기술 요구사항**
   - TypeScript 사용
   - Router 분리 (별도 파일)
   - 에러 처리 미들웨어 구현
   - 입력 유효성 검사

3. **데이터**
   - 메모리 저장소 사용 (배열)
   - 각 게시글: id, title, content, author, createdAt, updatedAt

### 제출물
- GitHub 저장소 URL
- 실행 방법이 포함된 README
- API 문서 (엔드포인트, 요청/응답 예시)

### 평가 기준
- REST 규칙 준수 (25%)
- 에러 처리 (25%)
- 코드 구조 (25%)
- API 문서 (25%)`,
    },
  ],
  'sql-databases': [
    {
      title: 'SQL 쿼리 작성 실습',
      description: `## 과제: SQL 쿼리 마스터

### 목표
주어진 스키마를 바탕으로 다양한 SQL 쿼리를 작성합니다.

### 스키마

\`\`\`sql
-- students (학생)
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  grade INTEGER,
  gpa DECIMAL(3,2)
);

-- courses (강좌)
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  professor VARCHAR(100),
  credits INTEGER
);

-- enrollments (수강)
CREATE TABLE enrollments (
  student_id INTEGER REFERENCES students(id),
  course_id INTEGER REFERENCES courses(id),
  semester VARCHAR(20),
  score INTEGER,
  PRIMARY KEY (student_id, course_id, semester)
);
\`\`\`

### 작성할 쿼리 (10문제)

1. 전체 학생 목록을 GPA 내림차순으로 조회
2. 컴퓨터공학과 학생 중 GPA 3.5 이상인 학생 조회
3. 각 학과별 학생 수와 평균 GPA 조회
4. 2024학년 1학기에 가장 많은 학생이 수강한 강좌 Top 3
5. 특정 학생의 전체 수강 이력 (강좌명, 학점, 점수 포함)
6. 점수 90점 이상을 받은 학생 목록 (중복 제거)
7. 한 번도 수강하지 않은 학생 조회
8. 각 학생의 총 이수 학점 계산
9. 교수별 강의 수와 평균 수강생 수 조회
10. GPA 상위 10%에 해당하는 학생 조회

### 제출물
- .sql 파일 (쿼리 10개)
- 각 쿼리에 주석으로 설명 포함

### 평가 기준
- 쿼리 정확성 (40%)
- JOIN/서브쿼리 활용 (30%)
- 효율성 (20%)
- 문서화 (10%)`,
    },
  ],
}


// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function seedLearningContent(): Promise<void> {
  console.log('=== Seeding Learning Content ===')
  console.log('')

  // 1. Update chapter content
  console.log('[1/3] Updating chapter content...')

  for (const [courseSlug, chapters] of Object.entries(chapterContents)) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { chapters: true },
    })

    if (!course) {
      console.log(`  SKIP: Course "${courseSlug}" not found`)
      continue
    }

    for (const [chapterSlug, content] of Object.entries(chapters)) {
      const chapter = course.chapters.find(c => c.slug === chapterSlug)
      if (!chapter) {
        console.log(`  SKIP: Chapter "${chapterSlug}" not found in "${courseSlug}"`)
        continue
      }

      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { content },
      })
    }

    console.log(`  OK: ${courseSlug} - ${Object.keys(chapters).length} chapters updated`)
  }

  // 2. Create quizzes
  console.log('')
  console.log('[2/3] Creating quizzes...')

  for (const [courseSlug, chapters] of Object.entries(quizData)) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { chapters: true },
    })

    if (!course) {
      console.log(`  SKIP: Course "${courseSlug}" not found`)
      continue
    }

    let quizCount = 0

    for (const [chapterSlug, quiz] of Object.entries(chapters)) {
      const chapter = course.chapters.find(c => c.slug === chapterSlug)
      if (!chapter) {
        console.log(`  SKIP: Chapter "${chapterSlug}" not found`)
        continue
      }

      // Check if quiz already exists for this chapter
      const existing = await prisma.quiz.findFirst({
        where: { chapterId: chapter.id },
      })

      if (existing) {
        // Update existing quiz and its questions
        await prisma.quiz.update({
          where: { id: existing.id },
          data: {
            title: quiz.title,
            description: quiz.description,
            passingScore: quiz.passingScore,
            timeLimit: quiz.timeLimit,
            maxAttempts: quiz.maxAttempts,
            isPublished: true,
          },
        })

        // Delete old questions and recreate
        await prisma.quizQuestion.deleteMany({
          where: { quizId: existing.id },
        })

        for (const q of quiz.questions) {
          await prisma.quizQuestion.create({
            data: {
              quizId: existing.id,
              type: q.type,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: q.order,
              points: q.points,
            },
          })
        }
      } else {
        // Create new quiz with questions
        await prisma.quiz.create({
          data: {
            title: quiz.title,
            description: quiz.description,
            chapterId: chapter.id,
            passingScore: quiz.passingScore,
            timeLimit: quiz.timeLimit,
            maxAttempts: quiz.maxAttempts,
            isPublished: true,
            questions: {
              create: quiz.questions.map(q => ({
                type: q.type,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                order: q.order,
                points: q.points,
              })),
            },
          },
        })
      }

      quizCount++
    }

    console.log(`  OK: ${courseSlug} - ${quizCount} quizzes created`)
  }

  // 3. Create assignments
  console.log('')
  console.log('[3/3] Creating assignments...')

  for (const [courseSlug, assignments] of Object.entries(assignmentData)) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { chapters: true },
    })

    if (!course) {
      console.log(`  SKIP: Course "${courseSlug}" not found`)
      continue
    }

    // Assign to the last chapter of the course (capstone-style)
    const lastChapter = course.chapters.reduce((prev, curr) =>
      curr.order > prev.order ? curr : prev
    )

    for (const assignment of assignments) {
      // Check if assignment already exists
      const existing = await prisma.assignment.findFirst({
        where: {
          chapterId: lastChapter.id,
          title: assignment.title,
        },
      })

      if (existing) {
        await prisma.assignment.update({
          where: { id: existing.id },
          data: {
            description: assignment.description,
          },
        })
      } else {
        await prisma.assignment.create({
          data: {
            title: assignment.title,
            description: assignment.description,
            chapterId: lastChapter.id,
          },
        })
      }
    }

    console.log(`  OK: ${courseSlug} - ${assignments.length} assignments created`)
  }

  console.log('')
  console.log('=== Learning Content Seed Complete ===')

  // Print summary
  const totalChapters = Object.values(chapterContents).reduce(
    (sum, chapters) => sum + Object.keys(chapters).length, 0
  )
  const totalQuizzes = Object.values(quizData).reduce(
    (sum, chapters) => sum + Object.keys(chapters).length, 0
  )
  const totalQuestions = Object.values(quizData).reduce(
    (sum, chapters) => sum + Object.values(chapters).reduce(
      (qSum, quiz) => qSum + quiz.questions.length, 0
    ), 0
  )
  const totalAssignments = Object.values(assignmentData).reduce(
    (sum, assignments) => sum + assignments.length, 0
  )

  console.log('')
  console.log('Summary:')
  console.log(`  Chapters updated: ${totalChapters}`)
  console.log(`  Quizzes created:  ${totalQuizzes}`)
  console.log(`  Questions:        ${totalQuestions}`)
  console.log(`  Assignments:      ${totalAssignments}`)
}

// Allow both direct execution and import
export { seedLearningContent }

// Direct execution
seedLearningContent()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
