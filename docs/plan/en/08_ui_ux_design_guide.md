# WKU Software Crew Project - UI/UX Design Guide

## 1. Design Philosophy

### 1.1 Core Principles

**Simplicity**: Clean, uncluttered interfaces that focus on core tasks
**Accessibility**: WCAG 2.1 AA compliant, usable by everyone
**Consistency**: Uniform patterns across the platform
**Efficiency**: Minimize clicks, optimize workflows
**Delight**: Micro-interactions and animations that enhance UX

### 1.2 Target Experience

**For Beginners (Junior)**: Friendly, encouraging, guided
**For Intermediate (Senior)**: Efficient, powerful, professional
**For Advanced (Master)**: Feature-rich, customizable, sophisticated

---

## 2. Design System

### 2.1 Color Palette

#### Primary Colors

```css
/* Brand Colors */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main Brand Color */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* Accent Colors */
--accent-500: #8b5cf6;  /* Purple for highlights */
--success-500: #10b981; /* Green for success states */
--warning-500: #f59e0b; /* Amber for warnings */
--error-500: #ef4444;   /* Red for errors */
```

#### Neutral Colors

```css
/* Light Mode */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Dark Mode */
--dark-50: #18181b;
--dark-100: #27272a;
--dark-200: #3f3f46;
--dark-300: #52525b;
--dark-400: #71717a;
--dark-500: #a1a1aa;
--dark-600: #d4d4d8;
--dark-700: #e4e4e7;
--dark-800: #f4f4f5;
--dark-900: #fafafa;
```

### 2.2 Typography

#### Font Families

```css
/* System Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;

/* Monospace for Code */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 
             'Courier New', monospace;

/* Korean Support */
--font-korean: 'Pretendard', 'Noto Sans KR', sans-serif;
```

#### Type Scale

| Level | Size | Line Height | Weight | Use Case |
|-------|------|-------------|--------|----------|
| **Display** | 60px | 1.1 | 700 | Hero sections |
| **H1** | 48px | 1.2 | 700 | Page titles |
| **H2** | 36px | 1.3 | 600 | Section headers |
| **H3** | 30px | 1.4 | 600 | Subsections |
| **H4** | 24px | 1.4 | 600 | Card titles |
| **H5** | 20px | 1.5 | 600 | Minor headings |
| **Body Large** | 18px | 1.6 | 400 | Intro text |
| **Body** | 16px | 1.6 | 400 | Default text |
| **Body Small** | 14px | 1.5 | 400 | Secondary text |
| **Caption** | 12px | 1.4 | 400 | Labels, captions |

### 2.3 Spacing System

**8px Grid System**: All spacing values are multiples of 8px

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.5rem;   /* 24px */
--space-6: 2rem;     /* 32px */
--space-8: 3rem;     /* 48px */
--space-10: 4rem;    /* 64px */
--space-12: 6rem;    /* 96px */
--space-16: 8rem;    /* 128px */
```

### 2.4 Border Radius

```css
--radius-sm: 0.25rem;  /* 4px - Buttons, inputs */
--radius-md: 0.5rem;   /* 8px - Cards */
--radius-lg: 1rem;     /* 16px - Modals */
--radius-xl: 1.5rem;   /* 24px - Hero sections */
--radius-full: 9999px; /* Pills, avatars */
```

### 2.5 Shadows

```css
/* Light Mode */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Dark Mode */
--shadow-dark-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-dark-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
--shadow-dark-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
```

---

## 3. Components

### 3.1 Buttons

#### Primary Button

```tsx
<Button variant="primary" size="md">
  Get Started
</Button>
```

**Specs**:
- Height: 40px (md), 32px (sm), 48px (lg)
- Padding: 16px horizontal, 8px vertical
- Border radius: 8px
- Font: 16px, 600 weight
- Background: primary-500
- Hover: primary-600
- Active: primary-700
- Disabled: gray-300, cursor not-allowed

#### Button Variants

| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| **Primary** | primary-500 | white | none | Main CTAs |
| **Secondary** | transparent | primary-500 | primary-500 | Secondary actions |
| **Outline** | transparent | gray-700 | gray-300 | Neutral actions |
| **Ghost** | transparent | gray-700 | none | Tertiary actions |
| **Danger** | error-500 | white | none | Destructive actions |

### 3.2 Form Inputs

#### Text Input

```tsx
<Input 
  label="Email" 
  placeholder="you@example.com"
  error="Invalid email format"
  helperText="We'll never share your email"
/>
```

**Specs**:
- Height: 40px
- Padding: 12px horizontal
- Border: 1px solid gray-300
- Border radius: 8px
- Focus: 2px ring primary-500
- Error: Border error-500, text error-500
- Disabled: Background gray-100, cursor not-allowed

#### Input States

| State | Border | Background | Ring |
|-------|--------|------------|------|
| **Default** | gray-300 | white | none |
| **Focus** | primary-500 | white | 2px primary-500 |
| **Error** | error-500 | white | 2px error-500 |
| **Disabled** | gray-300 | gray-100 | none |
| **Success** | success-500 | white | none |

### 3.3 Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Course Title</CardTitle>
    <CardDescription>Short description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    <Button>Enroll</Button>
  </CardFooter>
</Card>
```

**Specs**:
- Background: white
- Border: 1px solid gray-200
- Border radius: 12px
- Shadow: shadow-md
- Padding: 24px
- Hover: shadow-lg, translate Y -2px

### 3.4 Navigation

#### Top Navigation Bar

```tsx
<Header>
  <Logo />
  <Nav>
    <NavLink href="/courses">Courses</NavLink>
    <NavLink href="/ide">IDE</NavLink>
    <NavLink href="/community">Community</NavLink>
  </Nav>
  <UserMenu />
</Header>
```

**Specs**:
- Height: 64px
- Background: white
- Border bottom: 1px solid gray-200
- Padding: 0 24px
- Sticky position
- Shadow on scroll: shadow-md

#### Sidebar Navigation

**Specs**:
- Width: 256px (open), 64px (collapsed)
- Background: white
- Border right: 1px solid gray-200
- Padding: 16px
- Icons: 24px
- Text: 14px, 500 weight

### 3.5 Modals

```tsx
<Modal open={isOpen} onClose={handleClose}>
  <ModalHeader>
    <ModalTitle>Confirm Action</ModalTitle>
  </ModalHeader>
  <ModalBody>
    Are you sure?
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

**Specs**:
- Max width: 500px (sm), 700px (md), 900px (lg)
- Border radius: 16px
- Padding: 32px
- Backdrop: rgba(0, 0, 0, 0.5)
- Animation: Fade in + scale (0.95 → 1)
- Close on backdrop click
- Close on Escape key

---

## 4. Layout & Grid

### 4.1 Container

```tsx
<Container maxWidth="xl">
  {/* Content */}
</Container>
```

| Size | Max Width | Use Case |
|------|-----------|----------|
| **sm** | 640px | Forms, narrow content |
| **md** | 768px | Blog posts |
| **lg** | 1024px | Standard pages |
| **xl** | 1280px | Dashboard |
| **2xl** | 1536px | Wide layouts |
| **full** | 100% | Full bleed |

### 4.2 Grid System

**12-Column Grid**:

```tsx
<Grid cols={12} gap={6}>
  <GridItem colSpan={8}>Main content</GridItem>
  <GridItem colSpan={4}>Sidebar</GridItem>
</Grid>
```

**Responsive Breakpoints**:

| Breakpoint | Min Width | Columns | Gutter |
|------------|-----------|---------|--------|
| **xs** | 0px | 4 | 16px |
| **sm** | 640px | 8 | 16px |
| **md** | 768px | 12 | 24px |
| **lg** | 1024px | 12 | 24px |
| **xl** | 1280px | 12 | 32px |
| **2xl** | 1536px | 12 | 32px |

---

## 5. Accessibility (WCAG 2.1 AA)

### 5.1 Color Contrast

**Minimum Ratios**:
- Normal text (< 18px): 4.5:1
- Large text (≥ 18px or ≥ 14px bold): 3:1
- UI components and graphics: 3:1

**Compliant Combinations**:
- primary-500 (#3b82f6) on white: 4.8:1 ✅
- gray-600 (#4b5563) on white: 9.1:1 ✅
- white on primary-500: 4.8:1 ✅

### 5.2 Keyboard Navigation

**Requirements**:
- All interactive elements focusable via Tab
- Focus indicator visible (2px ring)
- Skip to main content link
- Modal trap focus
- Escape to close overlays

**Focus States**:
```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### 5.3 Screen Reader Support

**ARIA Labels**:
```tsx
<button aria-label="Close modal">
  <XIcon />
</button>

<nav aria-label="Main navigation">
  {/* Nav items */}
</nav>

<img src="..." alt="Descriptive text" />
```

**Landmarks**:
- `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- `role="banner"`, `role="navigation"`, `role="main"`

### 5.4 Text Alternatives

- All images have `alt` text
- Icon buttons have `aria-label`
- Form inputs have `<label>` or `aria-label`
- Error messages associated with inputs (`aria-describedby`)

---

## 6. Responsive Design

### 6.1 Mobile-First Approach

**Design for mobile (375px), enhance for desktop**

```tsx
// Tailwind CSS responsive classes
<div className="
  grid 
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  gap-4 sm:gap-6 lg:gap-8
">
  {/* Cards */}
</div>
```

### 6.2 Breakpoint Strategy

| Device | Width | Layout |
|--------|-------|--------|
| **Mobile** | 375-639px | Single column, hamburger menu |
| **Tablet** | 640-1023px | 2 columns, sidebar drawer |
| **Desktop** | 1024px+ | 3 columns, persistent sidebar |
| **Large Desktop** | 1536px+ | Max-width container, more whitespace |

### 6.3 Touch Targets

**Minimum Size**: 44x44px (Apple HIG, WCAG 2.5.5)

```css
button, a, input {
  min-height: 44px;
  min-width: 44px;
}
```

---

## 7. Dark Mode

### 7.1 Color Mapping

| Light Mode | Dark Mode | Use Case |
|------------|-----------|----------|
| white | dark-50 | Background |
| gray-100 | dark-100 | Secondary background |
| gray-900 | dark-900 | Text |
| primary-500 | primary-400 | Primary color |

### 7.2 Implementation

```tsx
// Use Tailwind dark: prefix
<div className="bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900">
  {/* Content */}
</div>

// Or use CSS variables
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
}

[data-theme="dark"] {
  --bg-primary: #18181b;
  --text-primary: #fafafa;
}
```

### 7.3 Dark Mode Toggle

```tsx
<button onClick={toggleTheme} aria-label="Toggle theme">
  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
</button>
```

---

## 8. Animations & Transitions

### 8.1 Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
```

### 8.2 Duration

```css
--duration-fast: 150ms;    /* Hover states */
--duration-normal: 300ms;  /* Dropdowns, modals */
--duration-slow: 500ms;    /* Page transitions */
```

### 8.3 Common Animations

**Fade In**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide Up**:
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Scale In**:
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 9. Iconography

### 9.1 Icon Library

**Primary**: Lucide Icons (React)
**Size**: 16px (sm), 20px (md), 24px (lg), 32px (xl)
**Stroke Width**: 2px
**Style**: Outline (default), Filled (selected states)

```tsx
import { Home, Book, Code, Users } from 'lucide-react';

<Home size={24} strokeWidth={2} />
```

### 9.2 Icon Guidelines

- Use consistent size within UI section
- Align icons to text baseline
- Add aria-label for icon-only buttons
- Use semantic icons (Save = floppy disk, Delete = trash)
- Pair with text for important actions

---

## 10. Page Layouts

### 10.1 Course Catalog Page

```
┌───────────────────────────────────────────────────┐
│  Header (Logo, Nav, Search, User)                │
├───────────────────────────────────────────────────┤
│  Hero Section                                     │
│  "Explore 100+ Courses"                          │
│  [Search Bar]                                     │
├───────────────────────────────────────────────────┤
│  Filters Sidebar  │  Course Grid                 │
│  - Category       │  ┌────┐ ┌────┐ ┌────┐       │
│  - Level          │  │Card│ │Card│ │Card│       │
│  - Duration       │  └────┘ └────┘ └────┘       │
│  - Price          │  ┌────┐ ┌────┐ ┌────┐       │
│                   │  │Card│ │Card│ │Card│       │
│                   │  └────┘ └────┘ └────┘       │
└───────────────────┴───────────────────────────────┘
│  Footer                                           │
└───────────────────────────────────────────────────┘
```

### 10.2 IDE Layout

```
┌───────────────────────────────────────────────────┐
│  Top Bar (Project Name, Save, Deploy, Share)     │
├─────────────┬─────────────────────────────────────┤
│ File Tree   │  Editor                             │
│             │                                     │
│ + src/      │  1  import React from 'react';     │
│   - App.tsx │  2                                  │
│   - main.ts │  3  function App() {                │
│ + public/   │  4    return <div>Hello</div>      │
│             │  5  }                               │
│             │                                     │
│             ├─────────────────────────────────────┤
│             │  Terminal                           │
│             │  $ npm run dev                      │
└─────────────┴─────────────────────────────────────┘
```

### 10.3 Dashboard Layout

```
┌───────────────────────────────────────────────────┐
│  Header                                           │
├─────┬─────────────────────────────────────────────┤
│     │  Welcome back, Minji!                      │
│     │  ┌────────┐ ┌────────┐ ┌────────┐         │
│ Nav │  │DAU:500│ │Courses│ │Streak│            │
│     │  └────────┘ └────────┘ └────────┘         │
│     │                                            │
│     │  Continue Learning                         │
│     │  ┌─────────────────────────────────┐      │
│     │  │ Course Card (50% complete)      │      │
│     │  └─────────────────────────────────┘      │
│     │                                            │
│     │  Recommended Courses                       │
│     │  ┌────┐ ┌────┐ ┌────┐                    │
└─────┴─────────────────────────────────────────────┘
```

---

## 11. Micro-interactions

### 11.1 Button Hover

```css
button {
  transition: all 150ms ease-out;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

### 11.2 Loading States

**Skeleton Loaders**:
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
</div>
```

**Spinner**:
```tsx
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
```

### 11.3 Success Feedback

**Toast Notification**:
```tsx
<Toast variant="success">
  <CheckIcon /> Course enrolled successfully!
</Toast>
```

**Checkmark Animation**:
```css
@keyframes checkmark {
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
}
```

---

## 12. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-unit: 8px;
  --space-xs: calc(var(--space-unit) * 1);
  --space-sm: calc(var(--space-unit) * 2);
  --space-md: calc(var(--space-unit) * 3);
  --space-lg: calc(var(--space-unit) * 4);
  --space-xl: calc(var(--space-unit) * 6);
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-modal: 1050;
  --z-toast: 1070;
}
```

---

## 13. Component Library (Shadcn/ui)

### 13.1 Installation

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card
```

### 13.2 Customization

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
      },
    },
  },
};
```

---

**Document Version**: v1.0
**Date**: 2026-01-22
**Author**: WKU Software Crew Design Team
**Reviewed By**: CPO, Engineering Lead
**Next Review**: 2026-04-01
