# WKU 소프트웨어 Crew Project - UI/UX 디자인 가이드

## 1. 디자인 철학

### 1.1 핵심 원칙

#### Simple (간결함)
- 불필요한 요소 제거
- 핵심 기능에 집중
- 인터페이스 복잡도 최소화

#### Clear (명확함)
- 직관적인 네비게이션
- 명확한 시각적 계층
- 일관된 용어 사용

#### Accessible (접근성)
- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 고대비 모드 제공

#### Delightful (즐거움)
- 부드러운 애니메이션
- 피드백 제공
- 게이미피케이션 요소

### 1.2 브랜드 아이덴티티

#### 브랜드 가치
- **혁신**: 전통적 교육을 혁신
- **협업**: 함께 성장
- **성장**: 단계별 레벨업
- **도전**: 창업으로의 여정

#### 브랜드 톤 & 매너
- **친근함**: 딱딱하지 않은 대화체
- **열정**: 동기부여하는 메시지
- **전문성**: 신뢰할 수 있는 콘텐츠
- **포용성**: 모두를 환영

---

## 2. 디자인 시스템

### 2.1 컬러 팔레트

#### Primary Colors (메인 컬러)
```
Brand Blue (Primary)
- 50:  #EFF6FF  (background)
- 100: #DBEAFE
- 200: #BFDBFE
- 300: #93C5FD
- 400: #60A5FA
- 500: #3B82F6  (main)
- 600: #2563EB  (hover)
- 700: #1D4ED8  (active)
- 800: #1E40AF
- 900: #1E3A8A

사용:
- 주요 버튼 (CTA)
- 링크
- 강조 요소
```

#### Secondary Colors (보조 컬러)
```
Purple (Accent)
- 500: #8B5CF6  (main)
- 600: #7C3AED  (hover)
사용: 레벨업, 배지, 특별한 요소

Green (Success)
- 500: #10B981  (main)
사용: 성공 메시지, 완료 상태

Yellow (Warning)
- 500: #F59E0B  (main)
사용: 경고, 알림

Red (Error)
- 500: #EF4444  (main)
사용: 오류, 삭제 액션
```

#### Neutral Colors (중립 컬러)
```
Gray Scale
- 50:  #F9FAFB  (background)
- 100: #F3F4F6
- 200: #E5E7EB  (border)
- 300: #D1D5DB
- 400: #9CA3AF  (disabled)
- 500: #6B7280  (secondary text)
- 600: #4B5563
- 700: #374151  (primary text)
- 800: #1F2937
- 900: #111827  (dark bg)
```

#### Semantic Colors
```
Info: Blue-500 (#3B82F6)
Success: Green-500 (#10B981)
Warning: Yellow-500 (#F59E0B)
Error: Red-500 (#EF4444)
```

### 2.2 타이포그래피

#### Font Family
```css
/* Primary: 본문 텍스트 */
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Monospace: 코드 */
font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

#### Font Scale
```
Heading 1 (h1)
- Size: 36px (2.25rem)
- Weight: 700 (Bold)
- Line Height: 40px (1.11)
- Letter Spacing: -0.02em

Heading 2 (h2)
- Size: 30px (1.875rem)
- Weight: 700
- Line Height: 36px (1.2)
- Letter Spacing: -0.01em

Heading 3 (h3)
- Size: 24px (1.5rem)
- Weight: 600 (Semi-Bold)
- Line Height: 32px (1.33)

Heading 4 (h4)
- Size: 20px (1.25rem)
- Weight: 600
- Line Height: 28px (1.4)

Body Large
- Size: 18px (1.125rem)
- Weight: 400 (Regular)
- Line Height: 28px (1.56)

Body (기본)
- Size: 16px (1rem)
- Weight: 400
- Line Height: 24px (1.5)

Body Small
- Size: 14px (0.875rem)
- Weight: 400
- Line Height: 20px (1.43)

Caption
- Size: 12px (0.75rem)
- Weight: 400
- Line Height: 16px (1.33)

Code
- Font Family: Monospace
- Size: 14px
- Background: Gray-100
- Padding: 2px 4px
- Border Radius: 4px
```

### 2.3 Spacing (간격)

#### Spacing Scale
```
0:   0px
1:   4px   (0.25rem)
2:   8px   (0.5rem)
3:   12px  (0.75rem)
4:   16px  (1rem)     [기본 단위]
5:   20px  (1.25rem)
6:   24px  (1.5rem)
8:   32px  (2rem)
10:  40px  (2.5rem)
12:  48px  (3rem)
16:  64px  (4rem)
20:  80px  (5rem)
24:  96px  (6rem)

사용 예:
- Component 내부 padding: 16px (4)
- Component 간 margin: 24px (6)
- Section 간 margin: 48px (12)
```

### 2.4 Border Radius

```
sm:  4px   (작은 요소: 버튼, 입력 필드)
md:  8px   (중간 요소: 카드)
lg:  12px  (큰 요소: 모달)
xl:  16px  (특별 요소: 배너)
full: 9999px (원형: 아바타, 배지)
```

### 2.5 Shadows

```css
/* sm: 작은 요소 */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* md: 카드 */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* lg: 모달, 드롭다운 */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* xl: 강조 요소 */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## 3. 컴포넌트 디자인

### 3.1 Buttons (버튼)

#### Primary Button
```
용도: 주요 액션 (제출, 저장, 다음)
배경: Blue-500
텍스트: White
Hover: Blue-600
Active: Blue-700
높이: 40px
Padding: 12px 24px
Border Radius: 8px
Font Weight: 600
```

#### Secondary Button
```
용도: 보조 액션 (취소, 뒤로)
배경: White
텍스트: Gray-700
Border: 1px solid Gray-300
Hover: Gray-50
```

#### Danger Button
```
용도: 위험 액션 (삭제)
배경: Red-500
텍스트: White
Hover: Red-600
```

#### Ghost Button
```
용도: 3차 액션
배경: Transparent
텍스트: Blue-500
Hover: Blue-50
```

#### Icon Button
```
크기: 40x40px
Border Radius: 8px
Icon Size: 20px
Hover: Gray-100
```

#### 버튼 크기 변형
```
Small:  높이 32px, Padding 8px 16px, Font 14px
Medium: 높이 40px, Padding 12px 24px, Font 16px
Large:  높이 48px, Padding 16px 32px, Font 18px
```

### 3.2 Input Fields (입력 필드)

#### Text Input
```
높이: 40px
Padding: 10px 12px
Border: 1px solid Gray-300
Border Radius: 8px
Font Size: 16px

Focus:
- Border: Blue-500
- Ring: 0 0 0 3px rgba(59, 130, 246, 0.1)

Error:
- Border: Red-500
- 아래에 에러 메시지 (Red-500, 14px)

Disabled:
- Background: Gray-100
- Cursor: not-allowed
```

#### Textarea
```
최소 높이: 80px
Resize: vertical
나머지: Text Input과 동일
```

#### Select (드롭다운)
```
높이: 40px
오른쪽에 Chevron Down 아이콘
나머지: Text Input과 동일
```

#### Checkbox
```
크기: 20x20px
Border: 2px solid Gray-300
Border Radius: 4px

Checked:
- Background: Blue-500
- Checkmark: White
```

#### Radio
```
크기: 20x20px
Border: 2px solid Gray-300
Border Radius: 50%

Checked:
- Border: Blue-500
- 내부 원: Blue-500 (12x12px)
```

#### Toggle Switch
```
너비: 44px
높이: 24px
Border Radius: 9999px
Background: Gray-300

Active:
- Background: Blue-500
- Circle 이동
```

### 3.3 Cards (카드)

#### Basic Card
```
배경: White
Border: 1px solid Gray-200
Border Radius: 12px
Padding: 24px
Shadow: md

Hover:
- Border: Gray-300
- Shadow: lg
- Transform: translateY(-2px)
```

#### Course Card
```
구조:
┌─────────────────────┐
│   Thumbnail Image   │
│                     │
├─────────────────────┤
│  Title              │
│  Instructor         │
│  Level Badge        │
│  ────────────────── │
│  Progress Bar       │
│  Duration  Rating   │
└─────────────────────┘

크기: 320x400px
이미지 비율: 16:9
```

#### Project Card
```
구조:
┌─────────────────────┐
│  Icon   Title       │
│  Description...     │
│                     │
│  Tech Stack Tags    │
│  ────────────────── │
│  Members  Updated   │
└─────────────────────┘
```

### 3.4 Navigation (네비게이션)

#### Header
```
높이: 64px
배경: White
Border Bottom: 1px solid Gray-200
Shadow: sm (스크롤 시)

구조:
┌─────────────────────────────────────┐
│ Logo   Nav Items    Search   Avatar │
└─────────────────────────────────────┘
```

#### Sidebar
```
너비: 256px
배경: White
Border Right: 1px solid Gray-200

구조:
┌──────────────┐
│ User Profile │
│              │
│ ─────────────│
│ Dashboard    │
│ Courses      │
│ Projects     │
│ Community    │
│ ─────────────│
│ Settings     │
└──────────────┘

Item:
- 높이: 40px
- Padding: 10px 16px
- Border Radius: 8px
- Hover: Gray-100
- Active: Blue-50, Blue-600 text
```

#### Breadcrumb
```
Home > Courses > React > Chapter 1

구조:
- Items separated by ">"
- Current page: Bold, Gray-900
- Previous pages: Gray-500, Clickable
- Hover: Gray-700
```

#### Tabs
```
┌────────┬────────┬────────┐
│ Tab 1  │ Tab 2  │ Tab 3  │
└────────┴────────┴────────┘
  ▔▔▔▔▔▔ (Active indicator)

높이: 48px
Border Bottom: 2px solid Gray-200

Active:
- Border Bottom: 2px solid Blue-500
- Text: Blue-600, Font Weight 600
```

### 3.5 Modals & Dialogs

#### Modal
```
크기:
- sm: 400px
- md: 600px (기본)
- lg: 800px
- full: 90vw

구조:
┌──────────────────────────┐
│ X   Title                │
├──────────────────────────┤
│                          │
│  Content                 │
│                          │
├──────────────────────────┤
│       Cancel   Confirm   │
└──────────────────────────┘

배경: White
Border Radius: 12px
Shadow: xl
Backdrop: rgba(0, 0, 0, 0.5)

애니메이션: Fade in + Scale (0.95 → 1)
```

#### Alert Dialog
```
크기: 400px
아이콘: Info/Success/Warning/Error
버튼: 1-2개
```

#### Toast Notification
```
위치: Top Right
크기: 최대 400px
자동 사라짐: 5초

구조:
┌────────────────────────┐
│ ●  Message        ✕    │
└────────────────────────┘

배경:
- Success: Green-50, Border Green-200
- Error: Red-50, Border Red-200
- Info: Blue-50, Border Blue-200
```

### 3.6 Loading States

#### Spinner
```
크기: 20px, 24px, 32px
색상: Blue-500
애니메이션: Rotate 360deg (1s)
```

#### Skeleton
```
배경: Gray-200
애니메이션: Pulse (반복)

구조:
┌────────────────────┐
│ ▬▬▬▬▬▬▬▬▬▬        │ (Title)
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  │ (Description)
│ ▬▬▬▬▬▬▬▬          │
└────────────────────┘
```

#### Progress Bar
```
높이: 8px
배경: Gray-200
Border Radius: 9999px

Fill:
- 배경: Blue-500
- 애니메이션: Width transition (0.3s)

텍스트:
- 위 또는 오른쪽에 퍼센트 표시
- 14px, Gray-700
```

### 3.7 Badges & Tags

#### Badge
```
높이: 24px
Padding: 4px 12px
Border Radius: 9999px (pill)
Font Size: 12px
Font Weight: 600

색상 변형:
- Default: Gray-100, Gray-700 text
- Primary: Blue-100, Blue-700 text
- Success: Green-100, Green-700 text
- Warning: Yellow-100, Yellow-700 text
- Error: Red-100, Red-700 text
```

#### Tag (Tech Stack)
```
높이: 28px
Padding: 6px 12px
Border Radius: 6px
Font Size: 14px

색상:
- React: Blue
- Vue: Green
- Python: Yellow
- 등...
```

#### Level Badge
```
Junior: Purple-500
Senior: Blue-500
Master: Gold-500

아이콘 + 텍스트
Border Radius: 6px
```

---

## 4. 레이아웃 패턴

### 4.1 Grid System

#### Container
```
최대 너비:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

가운데 정렬
좌우 Padding: 16px (모바일), 24px (데스크톱)
```

#### Grid
```
12 컬럼 시스템
Gutter: 24px

예: 3열 카드 그리드
┌────────┬────────┬────────┐
│ Card 1 │ Card 2 │ Card 3 │
├────────┼────────┼────────┤
│ Card 4 │ Card 5 │ Card 6 │
└────────┴────────┴────────┘

CSS Grid 사용:
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
gap: 24px;
```

### 4.2 페이지 레이아웃

#### Dashboard Layout
```
┌─────────────────────────────────┐
│          Header (64px)          │
├──────────┬──────────────────────┤
│          │                      │
│ Sidebar  │   Main Content       │
│ (256px)  │                      │
│          │                      │
└──────────┴──────────────────────┘
```

#### Full-width Layout (IDE)
```
┌─────────────────────────────────┐
│          Header (48px)          │
├──────────┬──────────┬───────────┤
│          │          │           │
│ File     │ Editor   │ Preview   │
│ Tree     │          │           │
│ (256px)  │          │ (40%)     │
│          │          │           │
├──────────┴──────────┴───────────┤
│       Terminal (30%)            │
└─────────────────────────────────┘
```

#### Content Layout (강의)
```
┌─────────────────────────────────┐
│          Header                 │
├──────────┬──────────────────────┤
│          │                      │
│ Chapter  │   Video Player       │
│ List     │                      │
│ (320px)  │   ──────────────     │
│          │   Content            │
│          │                      │
└──────────┴──────────────────────┘
```

---

## 5. 애니메이션 & 인터랙션

### 5.1 애니메이션 원칙

#### Duration (지속 시간)
```
Fast:   150ms (Hover, Focus)
Normal: 300ms (Modal, Dropdown)
Slow:   500ms (Page Transition)
```

#### Easing (가감속)
```
ease-in-out: 대부분의 경우
ease-out: 등장 (Fade in, Slide in)
ease-in: 퇴장 (Fade out, Slide out)
spring: 특별한 효과 (Bounce)
```

### 5.2 Micro-interactions

#### Button Click
```
1. Hover: Background 변경 (150ms)
2. Active: Scale(0.98) (100ms)
3. Click: Ripple effect (선택)
```

#### Card Hover
```
1. Shadow 증가 (md → lg)
2. Transform: translateY(-4px)
3. Border 색상 변경
Duration: 300ms
```

#### Loading Spinner
```
회전 애니메이션 (360deg, 1s, linear, infinite)
```

#### Skeleton Pulse
```
Opacity: 1 → 0.5 → 1
Duration: 2s
Repeat: infinite
```

### 5.3 Page Transitions

#### Fade In
```
Opacity: 0 → 1
Duration: 300ms
```

#### Slide In
```
Transform: translateY(20px) → translateY(0)
Opacity: 0 → 1
Duration: 400ms
```

#### Scale
```
Transform: scale(0.95) → scale(1)
Opacity: 0 → 1
Duration: 300ms
```

---

## 6. 반응형 디자인

### 6.1 Breakpoints

```
sm:  640px  (Mobile Large)
md:  768px  (Tablet)
lg:  1024px (Desktop)
xl:  1280px (Desktop Large)
2xl: 1536px (Desktop XL)
```

### 6.2 반응형 패턴

#### Stack → Grid
```
Mobile: 1열 스택
Tablet: 2열 그리드
Desktop: 3-4열 그리드

CSS:
.grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop */
  }
}
```

#### Sidebar Toggle
```
Mobile: Sidebar 숨김 (햄버거 메뉴)
Desktop: Sidebar 항상 표시
```

#### Font Size
```
Heading 1:
- Mobile: 28px
- Desktop: 36px

Body:
- Mobile: 14px
- Desktop: 16px
```

---

## 7. 다크 모드

### 7.1 컬러 매핑

```
Light Mode          Dark Mode
─────────────────────────────────
White (#FFFFFF)  →  Gray-900 (#111827)
Gray-50          →  Gray-800
Gray-100         →  Gray-700
Gray-900         →  White

Blue-500         →  Blue-400 (Primary)
Green-500        →  Green-400 (Success)
Red-500          →  Red-400 (Error)
```

### 7.2 다크 모드 컴포넌트 스타일

#### Card
```
배경: Gray-800
Border: Gray-700
Shadow: 더 진한 Shadow
```

#### Input
```
배경: Gray-900
Border: Gray-700
텍스트: White
Placeholder: Gray-400
```

### 7.3 토글 구현

```typescript
// useTheme hook
const [theme, setTheme] = useState<'light' | 'dark'>('light');

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', newTheme);
};
```

---

## 8. 아이콘 시스템

### 8.1 아이콘 라이브러리
- **Lucide Icons** (권장)
- Heroicons (대안)

### 8.2 아이콘 크기
```
sm: 16px
md: 20px (기본)
lg: 24px
xl: 32px
```

### 8.3 아이콘 사용 예
```typescript
import { Home, Book, Code, Users } from 'lucide-react';

<Home size={20} color="#3B82F6" />
```

---

## 9. 일러스트레이션

### 9.1 일러스트 스타일
- **Flat Design**: 평면적, 심플
- **Color Scheme**: 브랜드 컬러 사용
- **Diverse**: 다양한 인종, 성별 표현

### 9.2 사용 위치
- 빈 상태 (Empty State)
- 온보딩
- 404 페이지
- 성공/오류 페이지

### 9.3 추천 리소스
- unDraw (무료)
- Storyset (무료)
- Illustrations (Figma 플러그인)

---

## 10. 접근성 (Accessibility)

### 10.1 WCAG 2.1 AA 준수

#### 색상 대비
- 일반 텍스트: 최소 4.5:1
- 큰 텍스트 (18px+): 최소 3:1
- UI 요소: 최소 3:1

#### 키보드 네비게이션
- Tab: 다음 요소
- Shift+Tab: 이전 요소
- Enter/Space: 활성화
- Esc: 모달 닫기
- 화살표: 메뉴 네비게이션

#### Focus Indicator
```
outline: 2px solid Blue-500;
outline-offset: 2px;
```

#### ARIA Labels
```html
<button aria-label="프로필 설정">
  <SettingsIcon />
</button>

<img src="avatar.jpg" alt="김철수 프로필 사진" />

<nav aria-label="메인 네비게이션">
  ...
</nav>
```

### 10.2 스크린 리더 지원
- 시맨틱 HTML 사용 (`<header>`, `<nav>`, `<main>`, `<footer>`)
- 대체 텍스트 제공
- ARIA 속성 적절히 사용

---

## 11. 디자인 도구

### 11.1 디자인 도구
- **Figma**: 메인 디자인 도구
- **FigJam**: 브레인스토밍
- **Adobe XD**: 대안

### 11.2 프로토타이핑
- Figma Prototype
- Framer
- ProtoPie

### 11.3 협업
- Figma Comments
- Zeplin (개발자 핸드오프)
- Storybook (컴포넌트 문서화)

---

## 12. 구현 가이드

### 12.1 Tailwind CSS 설정

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          // ...
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        // 커스텀 spacing
      },
    },
  },
};
```

### 12.2 Shadcn/ui 사용

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

### 12.3 컴포넌트 예제

```typescript
// Button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': variant === 'secondary',
          'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
        },
        {
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

---

**문서 버전**: v1.0
**작성일**: 2026-01-22
**작성자**: WKU Software Crew 디자인팀
**검토자**: Lead Designer
**다음 리뷰 예정일**: 2026-02-22
