# Development Glossary

**WKU Software Crew Platform - Development Terms Guide**

A comprehensive glossary of 250+ development terms for beginners and junior developers. This guide helps you understand common terms you'll encounter while learning software development on the WKU Software Crew platform.

**Coverage:** Frontend, Backend, Database, DevOps, Testing, Security, and Development Practices

**Target Audience:** Junior developers, non-technical users, and beginners learning software development

**Last Updated:** 2026-01-25

---

## Table of Contents

1. [General Development Concepts](#general-development-concepts)
2. [Frontend Development](#frontend-development)
3. [Backend Development](#backend-development)
4. [Database & Data](#database--data)
5. [Cloud & DevOps](#cloud--devops)
6. [Testing & Quality Assurance](#testing--quality-assurance)
7. [Project Management & Methodologies](#project-management--methodologies)
8. [Version Control & Collaboration](#version-control--collaboration)
9. [Web Technologies](#web-technologies)
10. [Security & Authentication](#security--authentication)

---

## General Development Concepts

### API (Application Programming Interface)
**Definition:** A set of rules and protocols that allows different software applications to communicate with each other. APIs define how requests should be made and what responses will be returned.

**Example:** The WKU Crew API at `crew-api.abada.kr` allows the frontend website to request user data, projects, and courses.

**한글:** 응용 프로그램 프로그래밍 인터페이스. 서로 다른 소프트웨어가 통신할 수 있도록 하는 규칙과 프로토콜의 집합입니다.

**See also:** [REST API](#rest-api-representational-state-transfer), [GraphQL](#graphql)

---

### Framework
**Definition:** A pre-built foundation of code that provides structure and common functionality for building applications. Frameworks save time by providing reusable components and enforcing best practices.

**Example:** Next.js (frontend framework) and NestJS (backend framework) are used in the WKU Crew platform.

**한글:** 프레임워크. 애플리케이션을 만들기 위한 구조와 공통 기능을 제공하는 미리 만들어진 코드 기반입니다.

---

### Library
**Definition:** A collection of pre-written code that you can use in your projects. Unlike frameworks, libraries give you more control - you call library functions when you need them.

**Example:** React is technically a library for building user interfaces, even though it's often called a framework.

**한글:** 라이브러리. 프로젝트에서 사용할 수 있는 미리 작성된 코드 모음입니다. 프레임워크와 달리 개발자가 필요할 때 호출합니다.

---

### Environment (Dev/Staging/Production)
**Definition:** Different versions of your application used for different purposes. Development for coding, Staging for testing, and Production for real users.

**Example:** WKU Crew has staging at `staging-crew.abada.kr` for testing and production at `crew.abada.kr` for users.

**한글:** 환경. 개발(Dev), 스테이징(Staging), 프로덕션(Production)은 각각 코딩, 테스트, 실사용자를 위한 애플리케이션 버전입니다.

**See also:** [Deployment](#deployment)

---

### Dependency
**Definition:** External code packages or libraries that your project needs to function. Dependencies are managed by package managers like npm or pnpm.

**Example:** The WKU Crew project depends on Next.js, React, and many other packages listed in `package.json`.

**한글:** 의존성. 프로젝트가 작동하기 위해 필요한 외부 코드 패키지나 라이브러리입니다.

**See also:** [npm](#npm-node-package-manager), [pnpm](#pnpm)

---

### Repository (Repo)
**Definition:** A storage location for your code, typically managed by version control systems like Git. It contains all project files, history, and documentation.

**Example:** The WKU Crew code is stored in a GitHub repository at `github.com/saintgo7/saas-crew`.

**한글:** 저장소. 코드를 저장하는 장소로, Git과 같은 버전 관리 시스템으로 관리됩니다.

**See also:** [Git](#git), [GitHub](#github)

---

## Frontend Development

### Frontend
**Definition:** The part of a web application that users see and interact with directly in their browser. It includes the visual design, buttons, forms, and user interface.

**Example:** The WKU Crew website you see at `crew.abada.kr` is the frontend, built with Next.js and React.

**한글:** 프론트엔드. 사용자가 브라우저에서 직접 보고 상호작용하는 웹 애플리케이션의 부분입니다.

**See also:** [Backend](#backend), [UI/UX](#uiux-user-interface--user-experience)

---

### React
**Definition:** A JavaScript library for building user interfaces, especially for single-page applications. React uses a component-based architecture where UIs are built from reusable pieces.

**Example:** WKU Crew uses React 19.x to build interactive components like course cards, project lists, and user profiles.

**한글:** 리액트. 사용자 인터페이스를 만들기 위한 자바스크립트 라이브러리로, 특히 단일 페이지 애플리케이션에 사용됩니다.

**See also:** [Component](#component), [SPA](#spa-single-page-application)

---

### Next.js
**Definition:** A React framework that adds powerful features like server-side rendering, routing, and optimization. It makes building production-ready React applications easier.

**Example:** WKU Crew uses Next.js 16.1.4 for the frontend, utilizing its App Router for page navigation.

**한글:** 넥스트JS. 서버 사이드 렌더링, 라우팅, 최적화 같은 강력한 기능을 추가한 리액트 프레임워크입니다.

**See also:** [SSR](#ssr-server-side-rendering), [React](#react)

---

### Component
**Definition:** A reusable, self-contained piece of UI in frameworks like React. Components can be simple (like a button) or complex (like an entire page section).

**Example:** In WKU Crew, the Header, CourseCard, and ProjectList are all components in `apps/web/src/components/`.

**한글:** 컴포넌트. React 같은 프레임워크에서 재사용 가능한 독립적인 UI 조각입니다.

**See also:** [React](#react)

---

### TypeScript (TS)
**Definition:** A programming language that extends JavaScript by adding static types. Types help catch errors early and make code more reliable and easier to understand.

**Example:** WKU Crew uses TypeScript 5.x for both frontend and backend code, defining types for users, projects, and courses.

**한글:** 타입스크립트. 정적 타입을 추가하여 자바스크립트를 확장한 프로그래밍 언어입니다.

**See also:** [JavaScript](#javascript)

---

### HTML (HyperText Markup Language)
**Definition:** The standard language for creating web pages. HTML uses tags to structure content like headings, paragraphs, links, and images.

**Example:** `<h1>Welcome to WKU Crew</h1>` creates a main heading on the page.

**한글:** HTML (하이퍼텍스트 마크업 언어). 웹 페이지를 만들기 위한 표준 언어입니다.

**See also:** [CSS](#css-cascading-style-sheets), [DOM](#dom-document-object-model)

---

### CSS (Cascading Style Sheets)
**Definition:** A language used to describe how HTML elements should be displayed. CSS controls colors, fonts, spacing, layout, and responsive design.

**Example:** CSS makes the WKU Crew website look professional with custom colors, typography, and responsive layouts.

**한글:** CSS (캐스케이딩 스타일 시트). HTML 요소가 어떻게 표시되어야 하는지 설명하는 언어입니다.

**See also:** [HTML](#html-hypertext-markup-language), [Tailwind CSS](#tailwind-css)

---

### Tailwind CSS
**Definition:** A utility-first CSS framework that provides pre-built classes for styling. Instead of writing custom CSS, you apply utility classes directly in HTML.

**Example:** `<button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">` styles a button.

**한글:** 테일윈드 CSS. 유틸리티 우선 CSS 프레임워크로, 미리 만들어진 클래스를 제공합니다.

**See also:** [CSS](#css-cascading-style-sheets), [Bootstrap](#bootstrap)

---

### Bootstrap
**Definition:** A popular CSS framework that provides pre-designed components and responsive grid system. Bootstrap helps build professional websites quickly.

**Example:** Bootstrap's grid system and components like navbars and cards are used in millions of websites.

**한글:** 부트스트랩. 미리 디자인된 컴포넌트와 반응형 그리드 시스템을 제공하는 인기 있는 CSS 프레임워크입니다.

**See also:** [Tailwind CSS](#tailwind-css), [CSS](#css-cascading-style-sheets)

---

### Sass/SCSS
**Definition:** A CSS preprocessor that adds features like variables, nesting, and functions to CSS. SCSS makes CSS more maintainable and powerful.

**Example:** `$primary-color: blue; .button { color: $primary-color; &:hover { color: darken($primary-color, 10%); } }`

**한글:** Sass/SCSS. 변수, 중첩, 함수 같은 기능을 CSS에 추가하는 CSS 전처리기입니다.

**See also:** [CSS](#css-cascading-style-sheets), [PostCSS](#postcss)

---

### PostCSS
**Definition:** A tool for transforming CSS with JavaScript plugins. PostCSS can add vendor prefixes, future CSS features, and optimize stylesheets.

**Example:** PostCSS autoprefixer automatically adds browser-specific prefixes like `-webkit-` and `-moz-`.

**한글:** PostCSS. 자바스크립트 플러그인으로 CSS를 변환하는 도구입니다.

**See also:** [CSS](#css-cascading-style-sheets), [Sass/SCSS](#sassscss)

---

### DOM (Document Object Model)
**Definition:** A programming interface for HTML and XML documents. The DOM represents the page structure as a tree of objects that can be manipulated with JavaScript.

**Example:** When React updates a component, it modifies the DOM to reflect changes on the screen.

**한글:** DOM (문서 객체 모델). HTML과 XML 문서를 위한 프로그래밍 인터페이스입니다.

**See also:** [HTML](#html-hypertext-markup-language), [JavaScript](#javascript)

---

### SPA (Single Page Application)
**Definition:** A web application that loads a single HTML page and dynamically updates content without full page reloads. This creates a faster, more app-like experience.

**Example:** WKU Crew works as a SPA - when you navigate between pages, only the content changes, not the entire page.

**한글:** SPA (단일 페이지 애플리케이션). 하나의 HTML 페이지를 로드하고 전체 페이지를 다시 로드하지 않고 콘텐츠를 동적으로 업데이트하는 웹 애플리케이션입니다.

**See also:** [React](#react), [SSR](#ssr-server-side-rendering)

---

### SSR (Server-Side Rendering)
**Definition:** A technique where HTML is generated on the server for each request, rather than in the browser. SSR improves initial load time and SEO.

**Example:** Next.js in WKU Crew uses SSR to generate pages on the server before sending them to users.

**한글:** SSR (서버 사이드 렌더링). HTML을 브라우저가 아닌 서버에서 생성하는 기술입니다.

**See also:** [Next.js](#nextjs), [SPA](#spa-single-page-application)

---

### Hooks
**Definition:** Special functions in React that let you use state and other React features in functional components. Common hooks include useState, useEffect, and useContext.

**Example:** WKU Crew uses custom hooks like `useAuth`, `useProjects`, and `useCourses` in `apps/web/src/hooks/`.

**한글:** 훅. React의 함수형 컴포넌트에서 상태와 다른 React 기능을 사용할 수 있게 하는 특수 함수입니다.

**See also:** [React](#react), [Component](#component)

---

### Responsive Design
**Definition:** A design approach where websites automatically adjust their layout and appearance based on the device screen size (mobile, tablet, desktop).

**Example:** WKU Crew's layout changes when viewed on a phone versus a desktop, ensuring good usability on all devices.

**한글:** 반응형 디자인. 기기 화면 크기에 따라 웹사이트의 레이아웃과 모양이 자동으로 조정되는 디자인 접근 방식입니다.

**See also:** [CSS](#css-cascading-style-sheets), [Mobile-First](#mobile-first)

---

### State Management
**Definition:** The practice of managing data that changes over time in an application. State determines what users see and how the app behaves.

**Example:** WKU Crew manages user authentication state, course progress, and project data across different components.

**한글:** 상태 관리. 애플리케이션에서 시간에 따라 변하는 데이터를 관리하는 방법입니다.

**See also:** [React](#react), [Hooks](#hooks), [Redux](#redux)

---

### Webpack
**Definition:** A module bundler that packages JavaScript files and assets for production. Webpack transforms, bundles, and optimizes code for browsers.

**Example:** Create React App uses Webpack internally to bundle your React application.

**한글:** 웹팩. 프로덕션용 자바스크립트 파일과 자산을 패키징하는 모듈 번들러입니다.

**See also:** [Vite](#vite), [Build Tool](#build-tool)

---

### Vite
**Definition:** A modern, fast build tool and development server for frontend projects. Vite uses native ES modules and is significantly faster than Webpack.

**Example:** Vite provides instant hot module replacement and builds projects 10-100x faster than traditional bundlers.

**한글:** 비트. 프론트엔드 프로젝트를 위한 현대적이고 빠른 빌드 도구 및 개발 서버입니다.

**See also:** [Webpack](#webpack), [Build Tool](#build-tool)

---

### Rollup
**Definition:** A JavaScript module bundler optimized for libraries. Rollup creates smaller bundles than Webpack by removing unused code.

**Example:** Many npm packages use Rollup to create optimized library bundles.

**한글:** 롤업. 라이브러리에 최적화된 자바스크립트 모듈 번들러입니다.

**See also:** [Webpack](#webpack), [Vite](#vite)

---

### Parcel
**Definition:** A zero-configuration web application bundler. Parcel automatically handles all build configuration without setup.

**Example:** Just run `parcel index.html` and Parcel handles everything - no config files needed.

**한글:** 파셀. 설정이 필요 없는 웹 애플리케이션 번들러입니다.

**See also:** [Webpack](#webpack), [Vite](#vite)

---

### esbuild
**Definition:** An extremely fast JavaScript bundler and minifier written in Go. esbuild is 10-100x faster than traditional JavaScript-based bundlers.

**Example:** Vite uses esbuild for dependency pre-bundling, making development incredibly fast.

**한글:** esbuild. Go로 작성된 매우 빠른 자바스크립트 번들러 및 압축기입니다.

**See also:** [Build Tool](#build-tool), [Vite](#vite)

---

### Build Tool
**Definition:** Software that automates converting source code into executable programs. Build tools compile, bundle, and optimize code for production.

**Example:** Webpack, Vite, and esbuild are all build tools used in modern web development.

**한글:** 빌드 도구. 소스 코드를 실행 가능한 프로그램으로 변환하는 것을 자동화하는 소프트웨어입니다.

**See also:** [Webpack](#webpack), [Vite](#vite)

---

### Redux
**Definition:** A predictable state management library for JavaScript apps. Redux centralizes application state in a single store with strict update patterns.

**Example:** Large React applications use Redux to manage complex state across many components.

**한글:** 리덕스. 자바스크립트 앱을 위한 예측 가능한 상태 관리 라이브러리입니다.

**See also:** [State Management](#state-management), [Zustand](#zustand)

---

### Zustand
**Definition:** A small, fast state management solution for React. Zustand is simpler than Redux with less boilerplate code.

**Example:** `const useStore = create((set) => ({ count: 0, increment: () => set((state) => ({ count: state.count + 1 })) }))`

**한글:** 주스탄드. React를 위한 작고 빠른 상태 관리 솔루션입니다.

**See also:** [Redux](#redux), [State Management](#state-management)

---

### MobX
**Definition:** A state management library that uses reactive programming. MobX automatically tracks state changes and updates components.

**Example:** MobX makes state management simple by automatically observing and reacting to state mutations.

**한글:** MobX. 반응형 프로그래밍을 사용하는 상태 관리 라이브러리입니다.

**See also:** [Redux](#redux), [State Management](#state-management)

---

### Recoil
**Definition:** A state management library for React developed by Facebook. Recoil provides fine-grained state updates and derived state.

**Example:** Recoil atoms and selectors enable efficient state management for complex React applications.

**한글:** 리코일. Facebook에서 개발한 React용 상태 관리 라이브러리입니다.

**See also:** [Redux](#redux), [Jotai](#jotai)

---

### Jotai
**Definition:** A primitive and flexible state management library for React. Jotai is atomic, bottom-up, and TypeScript-oriented.

**Example:** `const countAtom = atom(0)` creates a piece of state that components can read and update.

**한글:** 조타이. React를 위한 원시적이고 유연한 상태 관리 라이브러리입니다.

**See also:** [Recoil](#recoil), [State Management](#state-management)

---

### React Router
**Definition:** The standard routing library for React applications. React Router enables navigation between different views without page reloads.

**Example:** WKU Crew could use React Router for client-side routing between courses and projects pages.

**한글:** React Router. React 애플리케이션을 위한 표준 라우팅 라이브러리입니다.

**See also:** [SPA](#spa-single-page-application), [React](#react)

---

### React Query
**Definition:** A data fetching library for React (now called TanStack Query). React Query handles caching, synchronization, and updates of server state.

**Example:** React Query automatically caches API responses and refetches when data becomes stale.

**한글:** React Query. React를 위한 데이터 페칭 라이브러리입니다 (현재 TanStack Query).

**See also:** [React](#react), [API](#api-application-programming-interface)

---

### Material-UI (MUI)
**Definition:** A popular React component library implementing Google's Material Design. MUI provides pre-built, customizable UI components.

**Example:** `<Button variant="contained" color="primary">Click Me</Button>` creates a Material Design button.

**한글:** Material-UI. Google의 Material Design을 구현한 인기 있는 React 컴포넌트 라이브러리입니다.

**See also:** [React](#react), [Ant Design](#ant-design)

---

### Ant Design
**Definition:** An enterprise-level UI design system and React component library. Ant Design provides high-quality components for building admin interfaces.

**Example:** Many admin dashboards and enterprise applications use Ant Design components.

**한글:** Ant Design. 엔터프라이즈급 UI 디자인 시스템 및 React 컴포넌트 라이브러리입니다.

**See also:** [Material-UI](#material-ui-mui), [Chakra UI](#chakra-ui)

---

### Chakra UI
**Definition:** A simple, modular, and accessible component library for React. Chakra UI focuses on developer experience and accessibility.

**Example:** Chakra UI's components are fully accessible and support dark mode out of the box.

**한글:** Chakra UI. React를 위한 간단하고 모듈화되었으며 접근 가능한 컴포넌트 라이브러리입니다.

**See also:** [Material-UI](#material-ui-mui), [Ant Design](#ant-design)

---

### Storybook
**Definition:** A tool for developing UI components in isolation. Storybook provides a sandbox for building and testing components independently.

**Example:** Developers use Storybook to build and test buttons, forms, and cards outside the main application.

**한글:** 스토리북. UI 컴포넌트를 독립적으로 개발하기 위한 도구입니다.

**See also:** [Component](#component), [Chromatic](#chromatic)

---

### Chromatic
**Definition:** A visual testing tool for Storybook that captures screenshots and detects UI changes. Chromatic automates visual regression testing.

**Example:** Chromatic catches unintended UI changes by comparing component screenshots.

**한글:** 크로매틱. Storybook을 위한 시각적 테스팅 도구로 스크린샷을 캡처하고 UI 변경사항을 감지합니다.

**See also:** [Storybook](#storybook), [Testing](#testing)

---

### Progressive Web App (PWA)
**Definition:** Web applications that work like native apps with offline support, push notifications, and installability. PWAs bridge the gap between web and mobile apps.

**Example:** Twitter Lite is a PWA that works offline and can be installed on your phone's home screen.

**한글:** 프로그레시브 웹 앱 (PWA). 오프라인 지원, 푸시 알림, 설치 가능성을 갖춘 네이티브 앱처럼 작동하는 웹 애플리케이션입니다.

**See also:** [Service Worker](#service-worker), [Mobile-First](#mobile-first)

---

### Service Worker
**Definition:** A script that runs in the background separate from web pages, enabling features like offline functionality and push notifications.

**Example:** Service Workers cache files for offline use, making PWAs work without internet connection.

**한글:** 서비스 워커. 웹 페이지와 별도로 백그라운드에서 실행되는 스크립트로, 오프라인 기능과 푸시 알림을 가능하게 합니다.

**See also:** [PWA](#progressive-web-app-pwa), [Web Worker](#web-worker)

---

### Web Worker
**Definition:** JavaScript that runs in background threads, allowing expensive computations without blocking the main UI thread.

**Example:** Web Workers process large datasets or perform complex calculations without freezing the user interface.

**한글:** 웹 워커. 백그라운드 스레드에서 실행되는 자바스크립트로, 메인 UI 스레드를 차단하지 않고 비용이 많이 드는 계산을 허용합니다.

**See also:** [Service Worker](#service-worker), [JavaScript](#javascript-js)

---

### ARIA
**Definition:** Accessible Rich Internet Applications - a set of attributes that make web content accessible to people with disabilities.

**Example:** `<button aria-label="Close dialog">X</button>` helps screen readers describe the button's purpose.

**한글:** ARIA (접근 가능한 리치 인터넷 애플리케이션). 장애인이 웹 콘텐츠에 접근할 수 있게 하는 속성 세트입니다.

**See also:** [WCAG](#wcag), [Accessibility](#accessibility)

---

### WCAG
**Definition:** Web Content Accessibility Guidelines - international standards for making web content accessible. WCAG defines levels of compliance (A, AA, AAA).

**Example:** Following WCAG AA ensures your website is usable by people with visual, auditory, and motor impairments.

**한글:** WCAG (웹 콘텐츠 접근성 지침). 웹 콘텐츠를 접근 가능하게 만들기 위한 국제 표준입니다.

**See also:** [ARIA](#aria), [Accessibility](#accessibility)

---

### Accessibility
**Definition:** The practice of making websites usable by everyone, including people with disabilities. Accessibility includes keyboard navigation, screen reader support, and color contrast.

**Example:** WKU Crew ensures all buttons are keyboard-accessible and images have alt text for screen readers.

**한글:** 접근성. 장애인을 포함한 모든 사람이 웹사이트를 사용할 수 있게 만드는 관행입니다.

**See also:** [ARIA](#aria), [WCAG](#wcag)

---

### SEO (Search Engine Optimization)
**Definition:** The practice of optimizing websites to rank higher in search engine results. SEO improves visibility and organic traffic.

**Example:** Next.js's server-side rendering helps WKU Crew pages appear correctly in Google search results.

**한글:** SEO (검색 엔진 최적화). 검색 엔진 결과에서 더 높은 순위를 차지하도록 웹사이트를 최적화하는 관행입니다.

**See also:** [SSR](#ssr-server-side-rendering), [Metadata](#metadata)

---

### Metadata
**Definition:** Data about data - information describing web pages, files, or other data. HTML metadata includes page titles, descriptions, and keywords.

**Example:** `<meta name="description" content="WKU Software Crew - Learn coding">` describes the page for search engines.

**한글:** 메타데이터. 데이터에 대한 데이터 - 웹 페이지, 파일, 기타 데이터를 설명하는 정보입니다.

**See also:** [SEO](#seo-search-engine-optimization), [HTML](#html-hypertext-markup-language)

---

### Lighthouse
**Definition:** An automated tool for improving web page quality. Lighthouse audits performance, accessibility, SEO, and best practices.

**Example:** Run Lighthouse in Chrome DevTools to get a score and recommendations for improving WKU Crew.

**한글:** 라이트하우스. 웹 페이지 품질을 개선하기 위한 자동화 도구입니다.

**See also:** [Web Vitals](#web-vitals), [Performance](#performance)

---

### Web Vitals
**Definition:** Essential metrics for measuring user experience quality: loading performance, interactivity, and visual stability.

**Example:** Core Web Vitals include LCP (loading), FID (interactivity), and CLS (visual stability).

**한글:** 웹 바이탈. 사용자 경험 품질을 측정하기 위한 필수 지표입니다.

**See also:** [Lighthouse](#lighthouse), [Performance](#performance)

---

### Browser DevTools
**Definition:** Built-in developer tools in web browsers for debugging, inspecting elements, and monitoring performance.

**Example:** Press F12 in Chrome to open DevTools and inspect HTML, debug JavaScript, or monitor network requests.

**한글:** 브라우저 개발자 도구. 디버깅, 요소 검사, 성능 모니터링을 위한 웹 브라우저의 내장 개발자 도구입니다.

**See also:** [Debugging](#debugging), [Console](#console)

---

### Hot Module Replacement (HMR)
**Definition:** A feature that updates modules in a running application without full reload. HMR preserves application state during development.

**Example:** When you edit a React component, HMR updates just that component without refreshing the page.

**한글:** 핫 모듈 교체 (HMR). 전체 새로고침 없이 실행 중인 애플리케이션에서 모듈을 업데이트하는 기능입니다.

**See also:** [Vite](#vite), [Development](#environment-devstagingproduction)

---

### Tree Shaking
**Definition:** A build optimization that removes unused code from final bundles. Tree shaking reduces file sizes by eliminating dead code.

**Example:** If you import one function from a library, tree shaking ensures only that function is included in your bundle.

**한글:** 트리 쉐이킹. 최종 번들에서 사용하지 않는 코드를 제거하는 빌드 최적화입니다.

**See also:** [Code Splitting](#code-splitting), [Optimization](#optimization)

---

### Code Splitting
**Definition:** Breaking code into smaller chunks that load on demand. Code splitting improves initial load time by only loading necessary code.

**Example:** Next.js automatically splits code by route, loading each page's code only when needed.

**한글:** 코드 스플리팅. 필요할 때 로드되는 더 작은 청크로 코드를 나누는 것입니다.

**See also:** [Lazy Loading](#lazy-loading), [Performance](#performance)

---

### Lazy Loading
**Definition:** Deferring loading of non-critical resources until needed. Lazy loading improves initial page load time.

**Example:** Images below the fold are lazy loaded - only loading when users scroll to them.

**한글:** 레이지 로딩. 중요하지 않은 리소스의 로딩을 필요할 때까지 연기하는 것입니다.

**See also:** [Code Splitting](#code-splitting), [Performance](#performance)

---

## Backend Development

### Backend
**Definition:** The server-side part of an application that handles business logic, database operations, and API requests. Users don't see it directly, but it powers everything.

**Example:** The WKU Crew API at `crew-api.abada.kr` is the backend, built with NestJS.

**한글:** 백엔드. 비즈니스 로직, 데이터베이스 작업, API 요청을 처리하는 애플리케이션의 서버 측 부분입니다.

**See also:** [Frontend](#frontend), [API](#api-application-programming-interface)

---

### NestJS
**Definition:** A progressive Node.js framework for building efficient and scalable server-side applications. It uses TypeScript and follows architectural patterns similar to Angular.

**Example:** WKU Crew's API server uses NestJS 11.x to handle authentication, projects, courses, and user management.

**한글:** 네스트JS. 효율적이고 확장 가능한 서버 측 애플리케이션을 만들기 위한 진보적인 Node.js 프레임워크입니다.

**See also:** [Node.js](#nodejs), [Express](#express)

---

### Node.js
**Definition:** A JavaScript runtime that allows you to run JavaScript on the server (outside the browser). It's fast, scalable, and has a huge ecosystem of packages.

**Example:** Both the WKU Crew API (NestJS) and frontend build process use Node.js.

**한글:** 노드JS. 서버에서 자바스크립트를 실행할 수 있게 하는 자바스크립트 런타임입니다.

**See also:** [JavaScript](#javascript), [NestJS](#nestjs)

---

### Express
**Definition:** A minimal and flexible Node.js web application framework that provides features for building web and mobile applications. It's one of the most popular backend frameworks.

**Example:** While WKU Crew uses NestJS, NestJS is built on top of Express under the hood.

**한글:** 익스프레스. 웹과 모바일 애플리케이션을 만들기 위한 기능을 제공하는 미니멀하고 유연한 Node.js 웹 프레임워크입니다.

**See also:** [Node.js](#nodejs), [NestJS](#nestjs)

---

### Django
**Definition:** A high-level Python web framework that encourages rapid development and clean design. Django includes built-in features for authentication, admin panel, ORM, and more.

**Example:** Many web applications like Instagram and Pinterest use Django. It's popular for rapid MVP development.

**한글:** 장고. 빠른 개발과 깔끔한 설계를 장려하는 고수준 Python 웹 프레임워크입니다. 인증, 관리자 패널, ORM 등의 기능이 내장되어 있습니다.

**See also:** [Python](#python), [Backend](#backend), [Flask](#flask)

---

### Flask
**Definition:** A lightweight Python web framework that gives developers more flexibility and control. Flask is minimal and lets you choose your own tools and libraries.

**Example:** Flask is great for small projects and APIs. It's simpler than Django but requires more setup for large applications.

**한글:** 플라스크. 개발자에게 더 많은 유연성과 제어권을 주는 경량 Python 웹 프레임워크입니다.

**See also:** [Python](#python), [Django](#django), [Backend](#backend)

---

### REST API (Representational State Transfer)
**Definition:** An architectural style for APIs that uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources. REST APIs are stateless and use standard web protocols.

**Example:** WKU Crew's API endpoints like `GET /api/projects` and `POST /api/courses` follow REST principles.

**한글:** REST API. HTTP 메서드를 사용하여 리소스에 대한 작업을 수행하는 API 아키텍처 스타일입니다.

**See also:** [API](#api-application-programming-interface), [GraphQL](#graphql)

---

### GraphQL
**Definition:** A query language for APIs that allows clients to request exactly the data they need. Unlike REST, GraphQL uses a single endpoint and flexible queries.

**Example:** Instead of multiple REST endpoints, GraphQL lets you write: `{ user { name, projects { title } } }`.

**한글:** 그래프QL. 클라이언트가 필요한 데이터를 정확히 요청할 수 있는 API용 쿼리 언어입니다.

**See also:** [REST API](#rest-api-representational-state-transfer), [API](#api-application-programming-interface)

---

### ORM (Object-Relational Mapping)
**Definition:** A technique that lets you interact with databases using programming language objects instead of writing SQL queries. ORMs translate between code objects and database tables.

**Example:** WKU Crew uses Prisma ORM to work with PostgreSQL - you write `prisma.user.findMany()` instead of SQL.

**한글:** ORM (객체 관계 매핑). SQL 쿼리를 작성하는 대신 프로그래밍 언어 객체를 사용하여 데이터베이스와 상호작용할 수 있게 하는 기술입니다.

**See also:** [Prisma](#prisma), [SQL](#sql-structured-query-language)

---

### Prisma
**Definition:** A modern ORM for Node.js and TypeScript that provides a type-safe database client. Prisma makes database operations easier and prevents errors.

**Example:** WKU Crew uses Prisma 5.22 to define the database schema and interact with PostgreSQL.

**한글:** 프리즈마. Node.js와 TypeScript를 위한 현대적인 ORM으로, 타입 안전한 데이터베이스 클라이언트를 제공합니다.

**See also:** [ORM](#orm-object-relational-mapping), [PostgreSQL](#postgresql)

---

### Middleware
**Definition:** Functions that execute during the request-response cycle in web applications. Middleware can modify requests, check authentication, log data, or handle errors.

**Example:** WKU Crew uses middleware to verify JWT tokens and ensure users are authenticated before accessing protected routes.

**한글:** 미들웨어. 웹 애플리케이션의 요청-응답 주기 동안 실행되는 함수입니다.

**See also:** [API](#api-application-programming-interface), [Authentication](#authentication)

---

### Endpoint
**Definition:** A specific URL in an API where you can access a resource or perform an action. Each endpoint has a path and HTTP method.

**Example:** `GET /api/projects` and `POST /api/courses` are endpoints in the WKU Crew API.

**한글:** 엔드포인트. 리소스에 접근하거나 작업을 수행할 수 있는 API의 특정 URL입니다.

**See also:** [REST API](#rest-api-representational-state-transfer), [API](#api-application-programming-interface)

---

### CORS (Cross-Origin Resource Sharing)
**Definition:** A security feature that controls which websites can access your API. CORS prevents unauthorized domains from making requests to your server.

**Example:** WKU Crew's API is configured to allow requests only from `crew.abada.kr` and `staging-crew.abada.kr`.

**한글:** CORS (교차 출처 리소스 공유). 어떤 웹사이트가 API에 접근할 수 있는지 제어하는 보안 기능입니다.

**See also:** [API](#api-application-programming-interface), [Security](#security--authentication)

---

### Spring Boot
**Definition:** A Java framework that simplifies building production-ready Spring applications. Spring Boot includes auto-configuration and embedded servers.

**Example:** Many enterprise Java applications use Spring Boot for backend APIs and microservices.

**한글:** 스프링 부트. 프로덕션 준비가 된 Spring 애플리케이션 빌드를 단순화하는 Java 프레임워크입니다.

**See also:** [Java](#java), [Backend](#backend)

---

### Java
**Definition:** A popular object-oriented programming language used for enterprise applications, Android development, and large-scale systems.

**Example:** Banks, financial systems, and Android apps commonly use Java for their backend systems.

**한글:** 자바. 엔터프라이즈 애플리케이션, Android 개발, 대규모 시스템에 사용되는 인기 있는 객체 지향 프로그래밍 언어입니다.

**See also:** [Spring Boot](#spring-boot), [Backend](#backend)

---

### Ruby on Rails
**Definition:** A web application framework written in Ruby that emphasizes convention over configuration. Rails enables rapid development.

**Example:** GitHub, Shopify, and Airbnb were initially built with Ruby on Rails.

**한글:** Ruby on Rails. 설정보다 관례를 강조하는 Ruby로 작성된 웹 애플리케이션 프레임워크입니다.

**See also:** [Backend](#backend), [Framework](#framework)

---

### Laravel
**Definition:** A popular PHP web framework with elegant syntax. Laravel includes features for routing, authentication, caching, and database management.

**Example:** Laravel is the most popular PHP framework for building modern web applications and APIs.

**한글:** 라라벨. 우아한 문법을 가진 인기 있는 PHP 웹 프레임워크입니다.

**See also:** [PHP](#php), [Backend](#backend)

---

### PHP
**Definition:** A server-side scripting language designed for web development. PHP powers many websites including WordPress and Facebook.

**Example:** WordPress, the world's most popular CMS, is built entirely with PHP.

**한글:** PHP. 웹 개발을 위해 설계된 서버 측 스크립팅 언어입니다.

**See also:** [Laravel](#laravel), [Backend](#backend)

---

### ASP.NET Core
**Definition:** Microsoft's cross-platform framework for building modern web applications and APIs. ASP.NET Core is fast, modular, and cloud-ready.

**Example:** Enterprise applications on Microsoft Azure often use ASP.NET Core for backend services.

**한글:** ASP.NET Core. 현대적인 웹 애플리케이션과 API를 빌드하기 위한 Microsoft의 크로스 플랫폼 프레임워크입니다.

**See also:** [C#](#c-sharp), [Backend](#backend)

---

### C Sharp
**Definition:** A modern, object-oriented programming language developed by Microsoft. C# is used for Windows applications, games (Unity), and web services.

**Example:** ASP.NET Core applications and Unity games are written in C#.

**한글:** C# (C 샵). Microsoft에서 개발한 현대적인 객체 지향 프로그래밍 언어입니다.

**See also:** [ASP.NET Core](#aspnet-core), [.NET](#dotnet)

---

### .NET
**Definition:** Microsoft's free, open-source developer platform for building apps. .NET supports multiple languages including C#, F#, and Visual Basic.

**Example:** .NET is used for building web apps (ASP.NET), desktop apps (WPF), and mobile apps (Xamarin).

**한글:** .NET (닷넷). 앱을 빌드하기 위한 Microsoft의 무료 오픈소스 개발자 플랫폼입니다.

**See also:** [C#](#c-sharp), [ASP.NET Core](#aspnet-core)

---

### WebSocket
**Definition:** A protocol for full-duplex communication channels over TCP. WebSockets enable real-time, bidirectional communication between clients and servers.

**Example:** Chat applications and live notifications use WebSockets for instant message delivery.

**한글:** 웹소켓. TCP 상의 전이중 통신 채널을 위한 프로토콜입니다.

**See also:** [Real-Time](#real-time), [Server-Sent Events](#server-sent-events-sse)

---

### Real-Time
**Definition:** Systems that respond to input or events immediately with minimal delay. Real-time applications provide instant feedback.

**Example:** Live chat, stock tickers, and collaborative editing tools are real-time applications.

**한글:** 실시간. 최소한의 지연으로 입력이나 이벤트에 즉시 응답하는 시스템입니다.

**See also:** [WebSocket](#websocket), [Event-Driven](#event-driven)

---

### Server-Sent Events (SSE)
**Definition:** A server push technology where servers send automatic updates to clients over HTTP. SSE is simpler than WebSockets for one-way communication.

**Example:** Live news feeds and stock price updates often use SSE for server-to-client streaming.

**한글:** 서버 전송 이벤트 (SSE). 서버가 HTTP를 통해 클라이언트에 자동 업데이트를 보내는 서버 푸시 기술입니다.

**See also:** [WebSocket](#websocket), [Real-Time](#real-time)

---

### gRPC
**Definition:** A high-performance RPC framework developed by Google. gRPC uses Protocol Buffers and HTTP/2 for efficient communication between services.

**Example:** Microservices often use gRPC for fast, typed communication between internal services.

**한글:** gRPC. Google에서 개발한 고성능 RPC 프레임워크입니다.

**See also:** [Protocol Buffers](#protocol-buffers), [Microservices](#microservices)

---

### Protocol Buffers
**Definition:** Google's language-neutral data serialization format. Protocol Buffers are smaller, faster, and simpler than JSON or XML.

**Example:** gRPC uses Protocol Buffers to define service contracts and serialize data efficiently.

**한글:** 프로토콜 버퍼. Google의 언어 중립적 데이터 직렬화 형식입니다.

**See also:** [gRPC](#grpc), [JSON](#json-javascript-object-notation)

---

### Rate Limiting
**Definition:** Controlling how many requests a user or system can make in a time period. Rate limiting prevents abuse and ensures fair resource usage.

**Example:** WKU Crew's API might limit users to 100 requests per minute to prevent spam.

**한글:** 속도 제한. 사용자나 시스템이 시간당 얼마나 많은 요청을 할 수 있는지 제어하는 것입니다.

**See also:** [Throttling](#throttling), [API](#api-application-programming-interface)

---

### Throttling
**Definition:** Limiting the rate at which operations are performed. Throttling protects systems from overload by controlling request frequency.

**Example:** API throttling ensures no single user can overwhelm the server with too many requests.

**한글:** 쓰로틀링. 작업이 수행되는 속도를 제한하는 것입니다.

**See also:** [Rate Limiting](#rate-limiting), [Performance](#performance)

---

### Load Balancer
**Definition:** A device or software that distributes network traffic across multiple servers. Load balancers improve availability and reliability.

**Example:** Load balancers route requests to different API servers, preventing any single server from being overwhelmed.

**한글:** 로드 밸런서. 여러 서버에 네트워크 트래픽을 분산시키는 장치 또는 소프트웨어입니다.

**See also:** [Scalability](#scalability), [Server](#server)

---

### Reverse Proxy
**Definition:** A server that sits between clients and backend servers, forwarding requests. Reverse proxies add security, caching, and load balancing.

**Example:** Nginx acts as a reverse proxy, handling SSL and forwarding requests to application servers.

**한글:** 리버스 프록시. 클라이언트와 백엔드 서버 사이에 위치하여 요청을 전달하는 서버입니다.

**See also:** [Load Balancer](#load-balancer), [Nginx](#nginx)

---

### Nginx
**Definition:** A high-performance web server and reverse proxy. Nginx is known for handling many concurrent connections efficiently.

**Example:** Nginx serves static files and proxies dynamic requests to Node.js or other application servers.

**한글:** Nginx (엔진엑스). 고성능 웹 서버이자 리버스 프록시입니다.

**See also:** [Reverse Proxy](#reverse-proxy), [Apache](#apache)

---

### Apache
**Definition:** A widely-used open-source web server. Apache HTTP Server has been the most popular web server for decades.

**Example:** Apache serves web pages and can run PHP, Python, and other server-side scripts.

**한글:** 아파치. 널리 사용되는 오픈소스 웹 서버입니다.

**See also:** [Nginx](#nginx), [Web Server](#web-server)

---

### Web Server
**Definition:** Software that serves web pages to clients over HTTP. Web servers handle requests, serve files, and run server-side code.

**Example:** Nginx, Apache, and Microsoft IIS are popular web servers.

**한글:** 웹 서버. HTTP를 통해 클라이언트에 웹 페이지를 제공하는 소프트웨어입니다.

**See also:** [Server](#server), [Nginx](#nginx)

---

### API Gateway
**Definition:** A server that acts as an entry point to microservices, handling routing, authentication, and rate limiting.

**Example:** API gateways consolidate multiple microservice APIs behind a single endpoint.

**한글:** API 게이트웨이. 마이크로서비스의 진입점 역할을 하는 서버로, 라우팅, 인증, 속도 제한을 처리합니다.

**See also:** [Microservices](#microservices), [API](#api-application-programming-interface)

---

### Caching Strategy
**Definition:** A plan for what data to cache, when to cache it, and when to invalidate it. Good caching strategies improve performance.

**Example:** Cache frequently accessed data for 5 minutes, invalidate on updates - that's a caching strategy.

**한글:** 캐싱 전략. 어떤 데이터를 캐시할지, 언제 캐시할지, 언제 무효화할지에 대한 계획입니다.

**See also:** [Cache](#cache), [Cache Invalidation](#cache-invalidation)

---

### Cache Invalidation
**Definition:** The process of removing or updating cached data when the source data changes. Cache invalidation is notoriously difficult.

**Example:** When a user updates their profile, the cached profile data must be invalidated.

**한글:** 캐시 무효화. 소스 데이터가 변경될 때 캐시된 데이터를 제거하거나 업데이트하는 프로세스입니다.

**See also:** [Cache](#cache), [Caching Strategy](#caching-strategy)

---

### Session Management
**Definition:** Handling user sessions across multiple requests. Session management tracks user state and authentication.

**Example:** After login, WKU Crew maintains your session so you stay authenticated across page visits.

**한글:** 세션 관리. 여러 요청에 걸쳐 사용자 세션을 처리하는 것입니다.

**See also:** [Session](#session), [Stateless vs Stateful](#stateless-vs-stateful)

---

### Stateless vs Stateful
**Definition:** Stateless systems don't store client data between requests; stateful systems do. REST APIs are typically stateless.

**Example:** JWT tokens enable stateless authentication - the server doesn't need to store session data.

**한글:** 무상태 vs 상태 저장. 무상태 시스템은 요청 간에 클라이언트 데이터를 저장하지 않고, 상태 저장 시스템은 저장합니다.

**See also:** [REST API](#rest-api-representational-state-transfer), [Session](#session)

---

### Background Jobs
**Definition:** Tasks that run asynchronously outside the main request-response cycle. Background jobs handle time-consuming operations.

**Example:** Sending bulk emails or generating reports are run as background jobs to avoid blocking requests.

**한글:** 백그라운드 작업. 메인 요청-응답 주기 외부에서 비동기적으로 실행되는 작업입니다.

**See also:** [Task Queue](#task-queue), [Cron Jobs](#cron-jobs)

---

### Task Queue
**Definition:** A system for managing and executing background jobs. Task queues ensure jobs are processed reliably and in order.

**Example:** Redis-based queues like Bull or BullMQ handle background job processing in Node.js.

**한글:** 작업 큐. 백그라운드 작업을 관리하고 실행하기 위한 시스템입니다.

**See also:** [Background Jobs](#background-jobs), [Message Queue](#message-queue)

---

### Message Queue
**Definition:** A system for asynchronous communication between services. Message queues decouple producers and consumers of messages.

**Example:** RabbitMQ and Apache Kafka are popular message queue systems for distributed applications.

**한글:** 메시지 큐. 서비스 간 비동기 통신을 위한 시스템입니다.

**See also:** [RabbitMQ](#rabbitmq), [Apache Kafka](#apache-kafka)

---

### RabbitMQ
**Definition:** A message broker that implements AMQP protocol. RabbitMQ enables reliable message delivery between distributed systems.

**Example:** Microservices use RabbitMQ to communicate asynchronously without direct coupling.

**한글:** RabbitMQ. AMQP 프로토콜을 구현하는 메시지 브로커입니다.

**See also:** [Message Queue](#message-queue), [Apache Kafka](#apache-kafka)

---

### Apache Kafka
**Definition:** A distributed streaming platform for building real-time data pipelines. Kafka handles high-throughput, fault-tolerant messaging.

**Example:** LinkedIn uses Kafka to process trillions of messages daily for analytics and monitoring.

**한글:** Apache Kafka. 실시간 데이터 파이프라인을 빌드하기 위한 분산 스트리밍 플랫폼입니다.

**See also:** [Message Queue](#message-queue), [RabbitMQ](#rabbitmq)

---

### Cron Jobs
**Definition:** Scheduled tasks that run automatically at specific times or intervals. Cron jobs automate repetitive maintenance tasks.

**Example:** A cron job runs every night at midnight to back up the database.

**한글:** 크론 작업. 특정 시간이나 간격으로 자동으로 실행되는 예약된 작업입니다.

**See also:** [Background Jobs](#background-jobs), [Task Queue](#task-queue)

---

### API Versioning
**Definition:** Managing different versions of an API to maintain backward compatibility. Versioning allows API evolution without breaking existing clients.

**Example:** `/api/v1/users` and `/api/v2/users` let old and new clients coexist.

**한글:** API 버저닝. 이전 버전과의 호환성을 유지하기 위해 API의 여러 버전을 관리하는 것입니다.

**See also:** [API](#api-application-programming-interface), [Backward Compatibility](#backward-compatibility)

---

### Backward Compatibility
**Definition:** The ability of new software to work with data and interfaces from older versions. Backward compatibility prevents breaking existing functionality.

**Example:** API v2 maintains backward compatibility by still supporting v1 endpoints.

**한글:** 이전 버전과의 호환성. 새 소프트웨어가 이전 버전의 데이터와 인터페이스로 작동할 수 있는 능력입니다.

**See also:** [API Versioning](#api-versioning), [Versioning](#versioning)

---

### Versioning
**Definition:** The process of assigning unique version numbers to software releases. Versioning tracks changes and enables rollback.

**Example:** Semantic versioning uses MAJOR.MINOR.PATCH format like 2.1.4.

**한글:** 버저닝. 소프트웨어 릴리스에 고유한 버전 번호를 할당하는 프로세스입니다.

**See also:** [Semantic Versioning](#semantic-versioning), [Git](#git)

---

### Idempotency
**Definition:** The property where performing an operation multiple times has the same effect as performing it once. Idempotent operations are safe to retry.

**Example:** HTTP PUT is idempotent - updating a user's name to "John" multiple times has the same result.

**한글:** 멱등성. 작업을 여러 번 수행해도 한 번 수행한 것과 같은 효과를 내는 속성입니다.

**See also:** [REST API](#rest-api-representational-state-transfer), [HTTP Methods](#http-methods)

---

### HTTP Methods
**Definition:** Standard actions in HTTP: GET (retrieve), POST (create), PUT (update), DELETE (remove), PATCH (partial update).

**Example:** `GET /api/projects` retrieves projects, `POST /api/projects` creates a new project.

**한글:** HTTP 메서드. HTTP의 표준 액션입니다.

**See also:** [REST API](#rest-api-representational-state-transfer), [API](#api-application-programming-interface)

---

### Circuit Breaker Pattern
**Definition:** A design pattern that prevents cascading failures by stopping calls to failing services. Circuit breakers "open" after repeated failures.

**Example:** If a payment service is down, the circuit breaker prevents trying it repeatedly, allowing the system to recover.

**한글:** 서킷 브레이커 패턴. 실패하는 서비스에 대한 호출을 중지하여 연쇄 실패를 방지하는 디자인 패턴입니다.

**See also:** [Microservices](#microservices), [Design Pattern](#design-pattern)

---

### Connection Pool
**Definition:** A cache of database connections maintained for reuse. Connection pools improve performance by avoiding connection overhead.

**Example:** Instead of creating a new database connection for each request, applications reuse connections from the pool.

**한글:** 커넥션 풀. 재사용을 위해 유지되는 데이터베이스 연결의 캐시입니다.

**See also:** [Database](#database-db), [Performance](#performance)

---

### Horizontal vs Vertical Scaling
**Definition:** Horizontal scaling adds more machines; vertical scaling adds more power to existing machines. Horizontal scaling is generally preferred.

**Example:** Adding more API servers is horizontal scaling; upgrading to a faster CPU is vertical scaling.

**한글:** 수평 확장 vs 수직 확장. 수평 확장은 더 많은 머신을 추가하고, 수직 확장은 기존 머신에 더 많은 성능을 추가합니다.

**See also:** [Scalability](#scalability), [Load Balancer](#load-balancer)

---

### Containerization
**Definition:** Packaging applications with their dependencies into containers. Containerization ensures consistent environments across development and production.

**Example:** Docker containers package WKU Crew with all dependencies, running identically everywhere.

**한글:** 컨테이너화. 애플리케이션을 의존성과 함께 컨테이너로 패키징하는 것입니다.

**See also:** [Docker](#docker), [Container](#container)

---

### Service Mesh
**Definition:** An infrastructure layer for managing service-to-service communication in microservices. Service meshes handle routing, security, and monitoring.

**Example:** Istio is a popular service mesh that adds observability and security to Kubernetes deployments.

**한글:** 서비스 메시 (서비스 망). 마이크로서비스에서 서비스 간 통신을 관리하기 위한 인프라 계층입니다.

**See also:** [Microservices](#microservices), [Kubernetes](#kubernetes-k8s)

---

### Lambda Function
**Definition:** A serverless function that runs code in response to events without managing servers. Lambda functions are event-driven and auto-scale.

**Example:** AWS Lambda runs code when a file is uploaded to S3, without provisioning servers.

**한글:** 람다 함수. 서버 관리 없이 이벤트에 응답하여 코드를 실행하는 서버리스 함수입니다.

**See also:** [Serverless](#serverless), [Cloud Computing](#cloud-computing)

---

### Serverless
**Definition:** A cloud computing model where the provider manages infrastructure and auto-scales resources. Developers only write and deploy code.

**Example:** AWS Lambda, Vercel Functions, and Cloudflare Workers are serverless platforms.

**한글:** 서버리스. 제공자가 인프라를 관리하고 리소스를 자동 확장하는 클라우드 컴퓨팅 모델입니다.

**See also:** [Lambda Function](#lambda-function), [Cloud Computing](#cloud-computing)

---

### Cold Start
**Definition:** The delay when a serverless function starts for the first time or after being idle. Cold starts increase initial response time.

**Example:** The first request to a Lambda function after 15 minutes of inactivity experiences a cold start delay.

**한글:** 콜드 스타트. 서버리스 함수가 처음 시작되거나 유휴 상태 후 시작될 때의 지연입니다.

**See also:** [Serverless](#serverless), [Lambda Function](#lambda-function)

---

### Edge Function
**Definition:** Code that runs on CDN edge servers close to users. Edge functions reduce latency by executing logic near the user.

**Example:** Cloudflare Workers and Vercel Edge Functions run at the edge for fast, global execution.

**한글:** 엣지 함수. 사용자와 가까운 CDN 엣지 서버에서 실행되는 코드입니다.

**See also:** [CDN](#cdn-content-delivery-network), [Serverless](#serverless)

---

## Database & Data

### Database (DB)
**Definition:** An organized collection of data that can be easily accessed, managed, and updated. Databases store information like users, projects, courses, etc.

**Example:** WKU Crew uses PostgreSQL to store all platform data - user accounts, projects, courses, and submissions.

**한글:** 데이터베이스. 쉽게 접근하고 관리하고 업데이트할 수 있는 조직화된 데이터 모음입니다.

**See also:** [PostgreSQL](#postgresql), [SQL](#sql-structured-query-language)

---

### SQL (Structured Query Language)
**Definition:** A programming language designed for managing and querying relational databases. SQL lets you create, read, update, and delete data.

**Example:** `SELECT * FROM users WHERE role = 'student'` retrieves all student users from the database.

**한글:** SQL (구조화된 쿼리 언어). 관계형 데이터베이스를 관리하고 쿼리하기 위해 설계된 프로그래밍 언어입니다.

**See also:** [Database](#database-db), [PostgreSQL](#postgresql)

---

### PostgreSQL
**Definition:** A powerful, open-source relational database system known for reliability, features, and performance. It supports complex queries and data types.

**Example:** WKU Crew uses PostgreSQL 16 as the main database, running in a Docker container named `wm_postgres`.

**한글:** 포스트그레SQL. 신뢰성, 기능, 성능으로 알려진 강력한 오픈소스 관계형 데이터베이스 시스템입니다.

**See also:** [SQL](#sql-structured-query-language), [NoSQL](#nosql)

---

### Oracle Database
**Definition:** A commercial relational database management system known for enterprise-level features, scalability, and performance. Oracle is widely used in large corporations and government.

**Example:** Many banks, telecommunications, and enterprise applications use Oracle Database for mission-critical data.

**한글:** 오라클 데이터베이스. 엔터프라이즈급 기능, 확장성, 성능으로 알려진 상용 관계형 데이터베이스 관리 시스템입니다. 대기업과 정부 기관에서 널리 사용됩니다.

**See also:** [SQL](#sql-structured-query-language), [PostgreSQL](#postgresql), [MySQL](#mysql)

---

### MySQL
**Definition:** An open-source relational database system that's fast, reliable, and easy to use. MySQL is one of the most popular databases for web applications.

**Example:** WordPress, Facebook (initially), and many web applications use MySQL for data storage.

**한글:** MySQL. 빠르고 신뢰할 수 있으며 사용하기 쉬운 오픈소스 관계형 데이터베이스 시스템입니다.

**See also:** [SQL](#sql-structured-query-language), [PostgreSQL](#postgresql), [Oracle Database](#oracle-database)

---

### NoSQL
**Definition:** A category of databases that don't use traditional table-based relational structure. NoSQL databases are flexible and good for unstructured data.

**Example:** MongoDB (document database) and Redis (key-value store) are popular NoSQL databases.

**한글:** NoSQL. 전통적인 테이블 기반 관계형 구조를 사용하지 않는 데이터베이스 범주입니다.

**See also:** [MongoDB](#mongodb), [Redis](#redis)

---

### MongoDB
**Definition:** A popular NoSQL database that stores data in flexible, JSON-like documents. MongoDB is good for applications with changing data structures.

**Example:** While WKU Crew uses PostgreSQL, MongoDB would be suitable for storing flexible course content.

**한글:** 몽고DB. 유연한 JSON과 유사한 문서로 데이터를 저장하는 인기 있는 NoSQL 데이터베이스입니다.

**See also:** [NoSQL](#nosql), [PostgreSQL](#postgresql)

---

### Redis
**Definition:** An in-memory data store used for caching, session management, and real-time applications. Redis is extremely fast because data is stored in RAM.

**Example:** WKU Crew uses Redis 7 to cache frequently accessed data and manage user sessions.

**한글:** 레디스. 캐싱, 세션 관리, 실시간 애플리케이션에 사용되는 인메모리 데이터 저장소입니다.

**See also:** [Cache](#cache), [Database](#database-db)

---

### Migration
**Definition:** A file that describes changes to a database schema (like creating tables or adding columns). Migrations help track and version database changes over time.

**Example:** WKU Crew's Prisma migrations in `apps/api/prisma/migrations/` track all database schema changes.

**한글:** 마이그레이션. 데이터베이스 스키마 변경사항을 설명하는 파일입니다.

**See also:** [Schema](#schema), [Prisma](#prisma)

---

### Schema
**Definition:** The structure or blueprint of a database, defining what tables exist, what columns they have, and how they relate to each other.

**Example:** The WKU Crew schema in `schema.prisma` defines User, Project, Course, and other models with their relationships.

**한글:** 스키마. 데이터베이스의 구조나 청사진으로, 어떤 테이블이 존재하고, 어떤 열을 가지며, 서로 어떻게 관련되는지 정의합니다.

**See also:** [Database](#database-db), [Migration](#migration)

---

### Cache
**Definition:** A temporary storage layer that stores frequently accessed data in memory for faster retrieval. Caching reduces database load and improves performance.

**Example:** WKU Crew caches user session data and frequently accessed course information in Redis.

**한글:** 캐시. 자주 액세스하는 데이터를 메모리에 저장하여 더 빠르게 검색할 수 있게 하는 임시 저장소 계층입니다.

**See also:** [Redis](#redis), [Performance](#performance)

---

### Index
**Definition:** A database feature that speeds up data retrieval by creating a reference structure. Like a book index, it helps find data without scanning the entire table.

**Example:** Creating an index on the `email` column makes looking up users by email much faster.

**한글:** 인덱스. 참조 구조를 만들어 데이터 검색 속도를 높이는 데이터베이스 기능입니다.

**See also:** [Database](#database-db), [Performance](#performance)

---

### CRUD (Create, Read, Update, Delete)
**Definition:** The four basic operations for managing data in databases and APIs. Most applications are built around these fundamental actions.

**Example:** WKU Crew's project management allows Create (new project), Read (view projects), Update (edit), and Delete.

**한글:** CRUD (생성, 읽기, 업데이트, 삭제). 데이터베이스와 API에서 데이터를 관리하는 네 가지 기본 작업입니다.

**See also:** [API](#api-application-programming-interface), [Database](#database-db)

---

### Foreign Key
**Definition:** A field in one table that refers to the primary key in another table. Foreign keys establish relationships between tables.

**Example:** A `projectId` foreign key in the submissions table links each submission to its project.

**한글:** 외래 키. 한 테이블의 필드가 다른 테이블의 기본 키를 참조하는 것입니다.

**See also:** [Primary Key](#primary-key), [Database](#database-db)

---

### Primary Key
**Definition:** A unique identifier for each row in a database table. Primary keys ensure each record can be uniquely identified.

**Example:** The `id` field is typically the primary key, uniquely identifying each user or project.

**한글:** 기본 키. 데이터베이스 테이블의 각 행에 대한 고유 식별자입니다.

**See also:** [Foreign Key](#foreign-key), [Index](#index)

---

### Join
**Definition:** Combining rows from multiple tables based on related columns. Joins include INNER, LEFT, RIGHT, and FULL OUTER joins.

**Example:** `SELECT * FROM users JOIN projects ON users.id = projects.userId` combines user and project data.

**한글:** 조인. 관련된 열을 기반으로 여러 테이블의 행을 결합하는 것입니다.

**See also:** [SQL](#sql-structured-query-language), [Foreign Key](#foreign-key)

---

### Transaction
**Definition:** A sequence of database operations that execute as a single unit. Transactions ensure data consistency and follow ACID principles.

**Example:** Transferring money requires a transaction - debit one account and credit another, both or neither.

**한글:** 트랜잭션. 단일 단위로 실행되는 데이터베이스 작업 시퀀스입니다.

**See also:** [ACID](#acid), [Database](#database-db)

---

### ACID
**Definition:** Properties ensuring reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent), Durability (permanent).

**Example:** PostgreSQL is ACID-compliant, ensuring WKU Crew's data remains consistent even during failures.

**한글:** ACID. 신뢰할 수 있는 데이터베이스 트랜잭션을 보장하는 속성입니다.

**See also:** [Transaction](#transaction), [BASE](#base)

---

### BASE
**Definition:** Alternative to ACID for NoSQL databases: Basically Available, Soft state, Eventually consistent. BASE prioritizes availability over consistency.

**Example:** MongoDB follows BASE principles, accepting temporary inconsistency for better availability.

**한글:** BASE. NoSQL 데이터베이스를 위한 ACID의 대안입니다.

**See also:** [ACID](#acid), [NoSQL](#nosql)

---

### Normalization
**Definition:** Organizing database tables to reduce redundancy and improve data integrity. Normalization follows normal forms (1NF, 2NF, 3NF).

**Example:** Instead of storing user names with each project, normalize by referencing user IDs.

**한글:** 정규화. 중복을 줄이고 데이터 무결성을 개선하기 위해 데이터베이스 테이블을 조직하는 것입니다.

**See also:** [Denormalization](#denormalization), [Database](#database-db)

---

### Denormalization
**Definition:** Intentionally adding redundancy to databases for better read performance. Denormalization trades consistency for speed.

**Example:** Storing user names with projects (denormalized) is faster than joining tables every query.

**한글:** 비정규화. 더 나은 읽기 성능을 위해 의도적으로 데이터베이스에 중복을 추가하는 것입니다.

**See also:** [Normalization](#normalization), [Performance](#performance)

---

### Sharding
**Definition:** Splitting a database into smaller pieces (shards) distributed across servers. Sharding improves scalability for large datasets.

**Example:** Users A-M go to server 1, N-Z to server 2 - that's sharding by username.

**한글:** 샤딩. 데이터베이스를 서버에 분산된 더 작은 조각(샤드)으로 나누는 것입니다.

**See also:** [Partitioning](#partitioning), [Scalability](#scalability)

---

### Partitioning
**Definition:** Dividing a table into smaller pieces based on criteria like date or range. Partitioning improves query performance.

**Example:** Partitioning logs by month allows dropping old data easily and speeds up recent queries.

**한글:** 파티셔닝. 날짜나 범위 같은 기준에 따라 테이블을 더 작은 조각으로 나누는 것입니다.

**See also:** [Sharding](#sharding), [Database](#database-db)

---

### Replication
**Definition:** Copying database data to multiple servers. Replication improves availability, performance, and disaster recovery.

**Example:** Master-slave replication: writes go to master, reads come from slaves.

**한글:** 복제. 데이터베이스 데이터를 여러 서버에 복사하는 것입니다.

**See also:** [Master-Slave](#master-slave), [High Availability](#high-availability-ha)

---

### Master-Slave
**Definition:** A replication pattern where one master handles writes and multiple slaves handle reads. Master-slave improves read performance.

**Example:** PostgreSQL can use master-slave replication to distribute read load across multiple servers.

**한글:** 마스터-슬레이브. 하나의 마스터가 쓰기를 처리하고 여러 슬레이브가 읽기를 처리하는 복제 패턴입니다.

**See also:** [Replication](#replication), [Database](#database-db)

---

### Database Migration
**Definition:** The process of moving or transforming database schemas and data. Migrations track and version database changes.

**Example:** Prisma migrations in WKU Crew track all schema changes: adding tables, modifying columns, etc.

**한글:** 데이터베이스 마이그레이션. 데이터베이스 스키마와 데이터를 이동하거나 변환하는 프로세스입니다.

**See also:** [Migration](#migration), [Schema](#schema)

---

### Query Optimization
**Definition:** Improving database query performance through indexing, query rewriting, or schema changes. Optimization reduces execution time.

**Example:** Adding an index on the email column speeds up user lookups from 500ms to 5ms.

**한글:** 쿼리 최적화. 인덱싱, 쿼리 재작성, 스키마 변경을 통해 데이터베이스 쿼리 성능을 개선하는 것입니다.

**See also:** [Index](#index), [Performance](#performance)

---

### N+1 Query Problem
**Definition:** A performance issue where one query triggers N additional queries. N+1 problems drastically slow applications.

**Example:** Loading 10 projects, then querying for each project's user separately = 1 + 10 queries (bad).

**한글:** N+1 쿼리 문제. 하나의 쿼리가 N개의 추가 쿼리를 트리거하는 성능 문제입니다.

**See also:** [Query Optimization](#query-optimization), [ORM](#orm-object-relational-mapping)

---

### Connection Pooling
**Definition:** Reusing database connections instead of creating new ones for each request. Pooling dramatically improves performance.

**Example:** Prisma maintains a connection pool, reusing connections for better database performance.

**한글:** 커넥션 풀링. 각 요청마다 새 연결을 만드는 대신 데이터베이스 연결을 재사용하는 것입니다.

**See also:** [Connection Pool](#connection-pool), [Database](#database-db)

---

### Graph Database
**Definition:** A database optimized for storing and querying relationships. Graph databases use nodes and edges instead of tables.

**Example:** Neo4j is a graph database perfect for social networks where relationships are first-class citizens.

**한글:** 그래프 데이터베이스. 관계 저장 및 쿼리에 최적화된 데이터베이스입니다.

**See also:** [NoSQL](#nosql), [Neo4j](#neo4j)

---

### Neo4j
**Definition:** The most popular graph database, using Cypher query language. Neo4j excels at highly connected data.

**Example:** Social networks, recommendation engines, and fraud detection use Neo4j for relationship queries.

**한글:** Neo4j. Cypher 쿼리 언어를 사용하는 가장 인기 있는 그래프 데이터베이스입니다.

**See also:** [Graph Database](#graph-database), [NoSQL](#nosql)

---

### Time-Series Database
**Definition:** A database optimized for time-stamped data. Time-series databases excel at IoT, metrics, and monitoring data.

**Example:** InfluxDB stores sensor readings, server metrics, and stock prices efficiently.

**한글:** 시계열 데이터베이스. 타임스탬프가 있는 데이터에 최적화된 데이터베이스입니다.

**See also:** [InfluxDB](#influxdb), [Database](#database-db)

---

### InfluxDB
**Definition:** A popular open-source time-series database. InfluxDB is designed for high write and query loads.

**Example:** DevOps teams use InfluxDB with Grafana for monitoring infrastructure metrics.

**한글:** InfluxDB. 인기 있는 오픈소스 시계열 데이터베이스입니다.

**See also:** [Time-Series Database](#time-series-database), [Monitoring](#monitoring)

---

### Data Warehouse
**Definition:** A centralized repository for storing and analyzing large amounts of data from multiple sources. Data warehouses support business intelligence.

**Example:** Companies use data warehouses like Snowflake to analyze sales, customer behavior, and trends.

**한글:** 데이터 웨어하우스. 여러 소스의 대량 데이터를 저장하고 분석하기 위한 중앙 집중식 저장소입니다.

**See also:** [Data Lake](#data-lake), [ETL](#etl-extract-transform-load)

---

### Data Lake
**Definition:** A storage repository for raw, unstructured data at scale. Data lakes store data in its native format until needed.

**Example:** Amazon S3 data lakes store logs, images, videos, and raw data for future analysis.

**한글:** 데이터 레이크. 대규모의 원시, 비구조화 데이터를 위한 저장소입니다.

**See also:** [Data Warehouse](#data-warehouse), [Big Data](#big-data)

---

### Big Data
**Definition:** Extremely large datasets that traditional databases can't handle efficiently. Big data requires specialized tools and techniques.

**Example:** Processing billions of social media posts or sensor readings requires big data technologies.

**한글:** 빅 데이터. 전통적인 데이터베이스가 효율적으로 처리할 수 없는 매우 큰 데이터 세트입니다.

**See also:** [Data Lake](#data-lake), [Hadoop](#hadoop)

---

### Hadoop
**Definition:** An open-source framework for distributed storage and processing of big data. Hadoop uses MapReduce for parallel processing.

**Example:** Companies process petabytes of data using Hadoop clusters for analytics.

**한글:** 하둡. 빅 데이터의 분산 저장 및 처리를 위한 오픈소스 프레임워크입니다.

**See also:** [Big Data](#big-data), [MapReduce](#mapreduce)

---

### MapReduce
**Definition:** A programming model for processing large datasets in parallel across clusters. MapReduce divides work into map and reduce phases.

**Example:** Google's original MapReduce enabled processing web-scale data across thousands of servers.

**한글:** MapReduce. 클러스터 전체에서 병렬로 대규모 데이터 세트를 처리하기 위한 프로그래밍 모델입니다.

**See also:** [Hadoop](#hadoop), [Big Data](#big-data)

---

### ETL (Extract, Transform, Load)
**Definition:** The process of extracting data from sources, transforming it, and loading into a destination. ETL powers data warehouses and analytics.

**Example:** ETL pipelines extract sales data, transform currency/formats, and load into a data warehouse.

**한글:** ETL (추출, 변환, 로드). 소스에서 데이터를 추출하고, 변환하고, 목적지에 로드하는 프로세스입니다.

**See also:** [Data Warehouse](#data-warehouse), [Data Pipeline](#data-pipeline)

---

### Data Pipeline
**Definition:** A series of data processing steps that move data from source to destination. Data pipelines automate ETL workflows.

**Example:** A pipeline extracts logs, filters errors, aggregates metrics, and loads to a database.

**한글:** 데이터 파이프라인. 소스에서 목적지로 데이터를 이동하는 일련의 데이터 처리 단계입니다.

**See also:** [ETL](#etl-extract-transform-load), [Data Engineering](#data-engineering)

---

### Data Engineering
**Definition:** The discipline of building systems for collecting, storing, and analyzing data. Data engineers create data infrastructure.

**Example:** Data engineers build pipelines, maintain databases, and ensure data quality for analysts.

**한글:** 데이터 엔지니어링. 데이터 수집, 저장, 분석을 위한 시스템을 구축하는 분야입니다.

**See also:** [ETL](#etl-extract-transform-load), [Data Pipeline](#data-pipeline)

---

### Document Store
**Definition:** A NoSQL database that stores data as documents (usually JSON). Document stores are flexible and schema-less.

**Example:** MongoDB stores each record as a JSON document with flexible structure.

**한글:** 문서 저장소. 데이터를 문서(일반적으로 JSON)로 저장하는 NoSQL 데이터베이스입니다.

**See also:** [MongoDB](#mongodb), [NoSQL](#nosql)

---

### Key-Value Store
**Definition:** A simple NoSQL database storing data as key-value pairs. Key-value stores are fast and simple.

**Example:** Redis is a key-value store perfect for caching and session management.

**한글:** 키-값 저장소. 데이터를 키-값 쌍으로 저장하는 간단한 NoSQL 데이터베이스입니다.

**See also:** [Redis](#redis), [NoSQL](#nosql)

---

### Column Store
**Definition:** A database that stores data by columns instead of rows. Column stores excel at analytical queries.

**Example:** Apache Cassandra is a column-oriented database for handling massive amounts of data.

**한글:** 컬럼 저장소. 행 대신 열로 데이터를 저장하는 데이터베이스입니다.

**See also:** [NoSQL](#nosql), [Cassandra](#cassandra)

---

### Cassandra
**Definition:** A distributed NoSQL database designed for handling large amounts of data across servers. Cassandra offers high availability.

**Example:** Netflix uses Cassandra to handle billions of operations across global data centers.

**한글:** 카산드라. 서버 간 대량의 데이터 처리를 위해 설계된 분산 NoSQL 데이터베이스입니다.

**See also:** [Column Store](#column-store), [NoSQL](#nosql)

---

### Eventual Consistency
**Definition:** A consistency model where data eventually becomes consistent across all nodes. Eventual consistency trades immediate consistency for availability.

**Example:** When you post on social media, followers see it eventually, not instantly everywhere.

**한글:** 최종 일관성. 모든 노드에서 데이터가 최종적으로 일관되게 되는 일관성 모델입니다.

**See also:** [CAP Theorem](#cap-theorem), [Consistency](#consistency)

---

### Consistency
**Definition:** Ensuring all nodes in a distributed system see the same data at the same time. Strong consistency vs eventual consistency.

**Example:** Bank balances require strong consistency - all ATMs must show the same balance.

**한글:** 일관성. 분산 시스템의 모든 노드가 동시에 같은 데이터를 보도록 보장하는 것입니다.

**See also:** [ACID](#acid), [Eventual Consistency](#eventual-consistency)

---

### CAP Theorem
**Definition:** States distributed systems can provide only two of: Consistency, Availability, Partition tolerance. CAP guides database design.

**Example:** PostgreSQL chooses consistency and partition tolerance; Cassandra chooses availability and partition tolerance.

**한글:** CAP 정리. 분산 시스템이 일관성, 가용성, 분할 내성 중 두 가지만 제공할 수 있다고 설명합니다.

**See also:** [Consistency](#consistency), [Availability](#availability)

---

### Availability
**Definition:** The percentage of time a system is operational and accessible. High availability systems minimize downtime.

**Example:** WKU Crew aims for 99.9% availability - less than 9 hours of downtime per year.

**한글:** 가용성. 시스템이 작동하고 접근 가능한 시간의 비율입니다.

**See also:** [High Availability](#high-availability-ha), [Uptime](#uptime)

---

### Uptime
**Definition:** The time a system has been running without failure. Uptime is measured as a percentage or duration.

**Example:** 99.9% uptime means the system is down less than 8.76 hours per year.

**한글:** 가동 시간. 시스템이 실패 없이 실행된 시간입니다.

**See also:** [Availability](#availability), [Monitoring](#monitoring)

---

### Data Modeling
**Definition:** The process of creating a data model that defines structure, relationships, and constraints. Good modeling ensures data quality.

**Example:** Prisma schema models define Users, Projects, Courses and their relationships for WKU Crew.

**한글:** 데이터 모델링. 구조, 관계, 제약 조건을 정의하는 데이터 모델을 생성하는 프로세스입니다.

**See also:** [Schema](#schema), [Database](#database-db)

---

## Cloud & DevOps

### DevOps (Development + Operations)
**Definition:** A set of practices that combines software development and IT operations to shorten development cycles and deliver updates faster and more reliably.

**Example:** WKU Crew uses automated deployment, monitoring, and infrastructure as code practices.

**한글:** 데브옵스. 개발 주기를 단축하고 업데이트를 더 빠르고 안정적으로 제공하기 위해 소프트웨어 개발과 IT 운영을 결합하는 방법론입니다.

**See also:** [CI/CD](#cicd-continuous-integrationcontinuous-deployment), [Docker](#docker)

---

### Docker
**Definition:** A platform that packages applications and their dependencies into containers - isolated, lightweight, and portable units that run consistently anywhere.

**Example:** WKU Crew runs in Docker containers: `crew-web` for frontend, `crew-api` for backend, `wm_postgres` for database.

**한글:** 도커. 애플리케이션과 의존성을 컨테이너로 패키징하는 플랫폼입니다.

**See also:** [Container](#container), [Kubernetes](#kubernetes)

---

### Container
**Definition:** A standardized unit of software that packages code and all its dependencies so the application runs reliably across different computing environments.

**Example:** Each WKU Crew service (web, API, database) runs in its own Docker container.

**한글:** 컨테이너. 코드와 모든 의존성을 패키징하여 애플리케이션이 다양한 컴퓨팅 환경에서 안정적으로 실행되도록 하는 표준화된 소프트웨어 단위입니다.

**See also:** [Docker](#docker), [Microservices](#microservices)

---

### Kubernetes (K8s)
**Definition:** An orchestration system for automating deployment, scaling, and management of containerized applications. It handles container lifecycles in production.

**Example:** Large-scale applications use Kubernetes to manage hundreds of containers. WKU Crew currently uses Docker Compose.

**한글:** 쿠버네티스. 컨테이너화된 애플리케이션의 배포, 확장, 관리를 자동화하는 오케스트레이션 시스템입니다.

**See also:** [Docker](#docker), [Container](#container)

---

### CI/CD (Continuous Integration/Continuous Deployment)
**Definition:** Automated processes for testing and deploying code. CI automatically tests changes, CD automatically deploys passing code to production.

**Example:** When code is pushed to WKU Crew's `main` branch, GitHub Actions automatically builds and deploys to production.

**한글:** CI/CD (지속적 통합/지속적 배포). 코드를 테스트하고 배포하는 자동화된 프로세스입니다.

**See also:** [GitHub Actions](#github-actions), [Deployment](#deployment)

---

### Deployment
**Definition:** The process of making an application available for use, typically by uploading code to servers and starting the application.

**Example:** Running `./deploy.sh` on the WKU Crew server pulls the latest code, builds it, and restarts containers.

**한글:** 배포. 애플리케이션을 사용 가능하게 만드는 프로세스로, 일반적으로 서버에 코드를 업로드하고 애플리케이션을 시작합니다.

**See also:** [CI/CD](#cicd-continuous-integrationcontinuous-deployment), [Production](#environment-devstagingproduction)

---

### Cloud Computing
**Definition:** Delivering computing services (servers, storage, databases, networking) over the internet, allowing you to use resources without owning physical hardware.

**Example:** WKU Crew uses Cloudflare's cloud services for DNS, CDN, and SSL certificates.

**한글:** 클라우드 컴퓨팅. 인터넷을 통해 컴퓨팅 서비스를 제공하여 물리적 하드웨어 소유 없이 리소스를 사용할 수 있게 합니다.

**See also:** [AWS](#aws-amazon-web-services), [Cloudflare](#cloudflare)

---

### AWS (Amazon Web Services)
**Definition:** Amazon's cloud computing platform offering services like servers (EC2), storage (S3), databases (RDS), and hundreds of other tools.

**Example:** While WKU Crew uses its own server, many applications host on AWS for scalability and reliability.

**한글:** AWS (아마존 웹 서비스). 서버, 스토리지, 데이터베이스 등 수백 가지 도구를 제공하는 아마존의 클라우드 컴퓨팅 플랫폼입니다.

**See also:** [Cloud Computing](#cloud-computing), [Server](#server)

---

### Cloudflare
**Definition:** A company providing CDN, DNS, DDoS protection, and security services that make websites faster and more secure.

**Example:** WKU Crew uses Cloudflare Tunnel to securely connect the server to the internet with SSL encryption.

**한글:** 클라우드플레어. CDN, DNS, DDoS 보호, 보안 서비스를 제공하여 웹사이트를 더 빠르고 안전하게 만드는 회사입니다.

**See also:** [CDN](#cdn-content-delivery-network), [SSL](#ssl-secure-sockets-layer)

---

### CDN (Content Delivery Network)
**Definition:** A network of servers distributed globally that delivers web content to users from the server closest to them, improving speed and reliability.

**Example:** Cloudflare's CDN caches WKU Crew's static assets (images, CSS, JS) and serves them quickly worldwide.

**한글:** CDN (콘텐츠 전송 네트워크). 전 세계에 분산된 서버 네트워크로, 사용자에게 가장 가까운 서버에서 웹 콘텐츠를 제공합니다.

**See also:** [Cloudflare](#cloudflare), [Performance](#performance)

---

### Server
**Definition:** A computer or software that provides services, data, or resources to other computers (clients) over a network.

**Example:** WKU Crew runs on a server (ws-248-247) that hosts the web application, API, and database.

**한글:** 서버. 네트워크를 통해 다른 컴퓨터에 서비스, 데이터, 리소스를 제공하는 컴퓨터 또는 소프트웨어입니다.

**See also:** [Backend](#backend), [Cloud Computing](#cloud-computing)

---

### SSH (Secure Shell)
**Definition:** A network protocol for securely connecting to remote servers. SSH encrypts the connection, allowing safe remote administration.

**Example:** Developers use `ssh ws-248-247` to securely connect to the WKU Crew production server.

**한글:** SSH (보안 셸). 원격 서버에 안전하게 연결하기 위한 네트워크 프로토콜입니다.

**See also:** [Server](#server), [Security](#security--authentication)

---

### Environment Variables
**Definition:** Configuration values stored outside the code (like API keys, database passwords) that can change between environments without code changes.

**Example:** WKU Crew stores `DATABASE_PASSWORD` and `JWT_SECRET` in `.env` files, never in code.

**한글:** 환경 변수. 코드 외부에 저장되는 구성 값으로, 코드 변경 없이 환경 간에 변경할 수 있습니다.

**See also:** [Security](#security--authentication), [Deployment](#deployment)

---

### Microservices
**Definition:** An architectural style where an application is built as a collection of small, independent services that communicate via APIs.

**Example:** While WKU Crew is currently monolithic, it could be split into separate services for auth, projects, and courses.

**한글:** 마이크로서비스. 애플리케이션을 API를 통해 통신하는 작고 독립적인 서비스 모음으로 구축하는 아키텍처 스타일입니다.

**See also:** [API](#api-application-programming-interface), [Monolith](#monolith)

---

### Monolith
**Definition:** A traditional application architecture where all components (frontend, backend, database access) are tightly integrated in a single codebase.

**Example:** WKU Crew's API is a monolithic NestJS application with all features in one codebase.

**한글:** 모놀리스. 모든 구성 요소가 단일 코드베이스에 긴밀하게 통합된 전통적인 애플리케이션 아키텍처입니다.

**See also:** [Microservices](#microservices), [Architecture](#architecture)

---

### Azure
**Definition:** Microsoft's cloud computing platform offering services like virtual machines, databases, AI, and storage. Azure competes with AWS and GCP.

**Example:** Enterprise organizations often use Azure for Windows-based applications and .NET services.

**한글:** Azure (애저). 가상 머신, 데이터베이스, AI, 스토리지 같은 서비스를 제공하는 Microsoft의 클라우드 컴퓨팅 플랫폼입니다.

**See also:** [AWS](#aws-amazon-web-services), [GCP](#gcp-google-cloud-platform)

---

### GCP (Google Cloud Platform)
**Definition:** Google's suite of cloud computing services including compute, storage, machine learning, and data analytics.

**Example:** YouTube, Spotify, and Snapchat run on Google Cloud Platform infrastructure.

**한글:** GCP (Google Cloud Platform). 컴퓨팅, 스토리지, 머신러닝, 데이터 분석을 포함하는 Google의 클라우드 컴퓨팅 서비스입니다.

**See also:** [AWS](#aws-amazon-web-services), [Azure](#azure)

---

### Infrastructure as Code (IaC)
**Definition:** Managing infrastructure through code files instead of manual configuration. IaC enables version control and automation.

**Example:** Terraform scripts define servers, networks, and databases as code that can be versioned and reviewed.

**한글:** 코드형 인프라 (IaC). 수동 구성 대신 코드 파일을 통해 인프라를 관리하는 것입니다.

**See also:** [Terraform](#terraform), [DevOps](#devops-development--operations)

---

### Terraform
**Definition:** An infrastructure as code tool for building, changing, and versioning infrastructure. Terraform works with multiple cloud providers.

**Example:** `terraform apply` creates servers, databases, and networks from code definitions.

**한글:** 테라폼. 인프라를 빌드, 변경, 버전 관리하기 위한 코드형 인프라 도구입니다.

**See also:** [IaC](#infrastructure-as-code-iac), [Ansible](#ansible)

---

### Ansible
**Definition:** An automation tool for configuration management, application deployment, and task automation. Ansible uses simple YAML syntax.

**Example:** Ansible playbooks automate server setup, package installation, and configuration.

**한글:** 앤서블. 구성 관리, 애플리케이션 배포, 작업 자동화를 위한 자동화 도구입니다.

**See also:** [IaC](#infrastructure-as-code-iac), [Terraform](#terraform)

---

### Prometheus
**Definition:** An open-source monitoring and alerting toolkit. Prometheus collects and stores metrics as time-series data.

**Example:** Prometheus monitors CPU usage, memory, request rates, and custom application metrics.

**한글:** 프로메테우스. 오픈소스 모니터링 및 경고 툴킷입니다.

**See also:** [Monitoring](#monitoring), [Grafana](#grafana)

---

### Grafana
**Definition:** A visualization platform for metrics and logs. Grafana creates dashboards from data sources like Prometheus.

**Example:** DevOps teams use Grafana dashboards to visualize server health, request rates, and errors.

**한글:** 그라파나. 메트릭과 로그를 위한 시각화 플랫폼입니다.

**See also:** [Prometheus](#prometheus), [Monitoring](#monitoring)

---

### Datadog
**Definition:** A cloud monitoring and analytics platform. Datadog provides infrastructure monitoring, APM, and log management.

**Example:** Companies use Datadog to monitor servers, applications, databases, and track performance metrics.

**한글:** 데이터독. 클라우드 모니터링 및 분석 플랫폼입니다.

**See also:** [Monitoring](#monitoring), [APM](#apm-application-performance-monitoring)

---

### APM (Application Performance Monitoring)
**Definition:** Tools and practices for monitoring application performance and availability. APM tracks response times, errors, and bottlenecks.

**Example:** APM tools like New Relic show which API endpoints are slow and why.

**한글:** APM (애플리케이션 성능 모니터링). 애플리케이션 성능과 가용성을 모니터링하기 위한 도구와 관행입니다.

**See also:** [Monitoring](#monitoring), [Performance](#performance)

---

### ELK Stack
**Definition:** Elasticsearch, Logstash, Kibana - a popular log management solution. ELK collects, processes, and visualizes logs.

**Example:** The ELK stack aggregates logs from all servers, making them searchable and visualized.

**한글:** ELK 스택. Elasticsearch, Logstash, Kibana - 인기 있는 로그 관리 솔루션입니다.

**See also:** [Logging](#logging), [Elasticsearch](#elasticsearch)

---

### Elasticsearch
**Definition:** A distributed search and analytics engine. Elasticsearch powers full-text search and log analysis.

**Example:** Elasticsearch enables searching through millions of log entries in milliseconds.

**한글:** 엘라스틱서치. 분산 검색 및 분석 엔진입니다.

**See also:** [ELK Stack](#elk-stack), [Search Engine](#search-engine)

---

### Search Engine
**Definition:** Software that searches and retrieves data from large datasets. Search engines index data for fast queries.

**Example:** Elasticsearch and Meilisearch are search engines that power website search features.

**한글:** 검색 엔진. 대규모 데이터 세트에서 데이터를 검색하고 검색하는 소프트웨어입니다.

**See also:** [Elasticsearch](#elasticsearch), [Meilisearch](#meilisearch)

---

### Meilisearch
**Definition:** A fast, open-source search engine with great defaults. Meilisearch provides instant search as you type.

**Example:** E-commerce sites use Meilisearch for product search with typo tolerance and relevance ranking.

**한글:** Meilisearch. 훌륭한 기본값을 가진 빠른 오픈소스 검색 엔진입니다.

**See also:** [Search Engine](#search-engine), [Elasticsearch](#elasticsearch)

---

### Alerting
**Definition:** Automated notifications when systems exceed thresholds or fail. Alerting enables quick response to issues.

**Example:** PagerDuty alerts the on-call engineer when CPU usage exceeds 90% for 5 minutes.

**한글:** 경고. 시스템이 임계값을 초과하거나 실패할 때 자동 알림입니다.

**See also:** [Monitoring](#monitoring), [PagerDuty](#pagerduty)

---

### PagerDuty
**Definition:** An incident management platform for alerting and on-call scheduling. PagerDuty ensures critical issues get immediate attention.

**Example:** When production goes down, PagerDuty calls, texts, and emails the on-call engineer.

**한글:** PagerDuty. 경고 및 대기 일정을 위한 인시던트 관리 플랫폼입니다.

**See also:** [Alerting](#alerting), [Incident Management](#incident-management)

---

### Incident Management
**Definition:** The process of responding to, resolving, and learning from system outages or issues. Incident management minimizes downtime.

**Example:** After an outage, teams conduct postmortems to identify root causes and prevent recurrence.

**한글:** 인시던트 관리. 시스템 중단이나 문제에 대응하고, 해결하고, 배우는 프로세스입니다.

**See also:** [Postmortem](#postmortem), [Alerting](#alerting)

---

### Postmortem
**Definition:** A blameless analysis after an incident to understand what happened and how to prevent it. Postmortems improve reliability.

**Example:** After a database outage, the team writes a postmortem documenting timeline, impact, and action items.

**한글:** 사후 분석. 무엇이 일어났고 어떻게 방지할지 이해하기 위한 인시던트 후 비난 없는 분석입니다.

**See also:** [Incident Management](#incident-management), [Root Cause Analysis](#root-cause-analysis)

---

### Root Cause Analysis
**Definition:** A problem-solving method to identify the fundamental cause of issues. RCA goes beyond symptoms to fix underlying problems.

**Example:** Using the "5 Whys" technique to trace an API timeout back to a missing database index.

**한글:** 근본 원인 분석. 문제의 근본적인 원인을 식별하는 문제 해결 방법입니다.

**See also:** [Postmortem](#postmortem), [Debugging](#debugging)

---

### Blue-Green Deployment
**Definition:** Running two identical production environments. Blue serves traffic while green is updated, then switch.

**Example:** Deploy new code to green, test it, then switch traffic from blue to green instantly.

**한글:** 블루-그린 배포. 두 개의 동일한 프로덕션 환경을 실행하는 것입니다.

**See also:** [Canary Deployment](#canary-deployment), [Deployment](#deployment)

---

### Canary Deployment
**Definition:** Gradually rolling out changes to a small subset of users before full deployment. Canaries catch issues early.

**Example:** Deploy new code to 5% of users, monitor for errors, then gradually increase to 100%.

**한글:** 카나리 배포. 전체 배포 전에 작은 사용자 그룹에 점진적으로 변경 사항을 롤아웃하는 것입니다.

**See also:** [Blue-Green Deployment](#blue-green-deployment), [Rolling Update](#rolling-update)

---

### Rolling Update
**Definition:** Gradually updating servers one at a time while maintaining service availability. Rolling updates enable zero-downtime deployments.

**Example:** Kubernetes updates pods one by one, ensuring some pods always serve traffic.

**한글:** 롤링 업데이트. 서비스 가용성을 유지하면서 한 번에 하나씩 서버를 점진적으로 업데이트하는 것입니다.

**See also:** [Deployment](#deployment), [Kubernetes](#kubernetes-k8s)

---

### Health Check
**Definition:** Automated tests that verify if a service is running correctly. Health checks enable automatic recovery and load balancing.

**Example:** Docker health checks ping `/health` endpoint; if it fails, the container restarts.

**한글:** 헬스 체크. 서비스가 올바르게 실행되고 있는지 확인하는 자동화된 테스트입니다.

**See also:** [Readiness Probe](#readiness-probe), [Liveness Probe](#liveness-probe)

---

### Readiness Probe
**Definition:** A check determining if a container is ready to accept traffic. Kubernetes uses readiness probes before routing requests.

**Example:** Readiness probe waits for database connections before marking a pod as ready.

**한글:** 준비성 프로브. 컨테이너가 트래픽을 받을 준비가 되었는지 확인하는 검사입니다.

**See also:** [Health Check](#health-check), [Liveness Probe](#liveness-probe)

---

### Liveness Probe
**Definition:** A check determining if a container is still alive. Kubernetes restarts containers that fail liveness probes.

**Example:** Liveness probe detects deadlocked applications and automatically restarts them.

**한글:** 활성 프로브. 컨테이너가 아직 살아있는지 확인하는 검사입니다.

**See also:** [Health Check](#health-check), [Readiness Probe](#readiness-probe)

---

### Auto-scaling
**Definition:** Automatically adjusting computing resources based on demand. Auto-scaling optimizes costs and performance.

**Example:** When traffic increases, auto-scaling adds more servers; when it drops, it removes them.

**한글:** 자동 확장. 수요에 따라 컴퓨팅 리소스를 자동으로 조정하는 것입니다.

**See also:** [Scalability](#scalability), [Load Balancer](#load-balancer)

---

### Container Registry
**Definition:** A repository for storing and distributing container images. Registries version and manage Docker images.

**Example:** Docker Hub, GitHub Container Registry, and AWS ECR store container images.

**한글:** 컨테이너 레지스트리. 컨테이너 이미지를 저장하고 배포하기 위한 저장소입니다.

**See also:** [Docker](#docker), [Container](#container)

---

### Secrets Management
**Definition:** Secure storage and access control for sensitive data like passwords and API keys. Secrets management prevents credential leaks.

**Example:** HashiCorp Vault stores database passwords securely, granting access only to authorized services.

**한글:** 시크릿 관리. 비밀번호 및 API 키 같은 민감한 데이터를 위한 안전한 저장 및 액세스 제어입니다.

**See also:** [Environment Variables](#environment-variables), [HashiCorp Vault](#hashicorp-vault)

---

### HashiCorp Vault
**Definition:** A tool for managing secrets and protecting sensitive data. Vault provides encryption, access control, and audit logs.

**Example:** Applications retrieve database credentials from Vault instead of storing them in code.

**한글:** HashiCorp Vault. 시크릿 관리 및 민감한 데이터 보호를 위한 도구입니다.

**See also:** [Secrets Management](#secrets-management), [Security](#security--authentication)

---

### Configuration Management
**Definition:** Managing application settings across environments. Configuration management centralizes and versions configs.

**Example:** Storing feature flags, API URLs, and settings in a config service instead of hardcoding.

**한글:** 구성 관리. 환경 전반에 걸쳐 애플리케이션 설정을 관리하는 것입니다.

**See also:** [Environment Variables](#environment-variables), [Feature Flags](#feature-flags)

---

### Feature Flags
**Definition:** Toggles that enable or disable features without deploying code. Feature flags enable gradual rollouts and A/B testing.

**Example:** Launch a new feature to 10% of users by enabling a feature flag gradually.

**한글:** 피처 플래그. 코드 배포 없이 기능을 활성화하거나 비활성화하는 토글입니다.

**See also:** [Configuration Management](#configuration-management), [A/B Testing](#ab-testing)

---

### Disaster Recovery
**Definition:** Strategies and processes for recovering from major system failures. DR ensures business continuity.

**Example:** Daily backups and replication to another region enable recovery from datacenter failures.

**한글:** 재해 복구. 주요 시스템 장애로부터 복구하기 위한 전략과 프로세스입니다.

**See also:** [Backup](#backup), [High Availability](#high-availability-ha)

---

### Backup
**Definition:** Copies of data stored separately for recovery purposes. Regular backups protect against data loss.

**Example:** WKU Crew database is backed up daily, with backups retained for 30 days.

**한글:** 백업. 복구 목적으로 별도로 저장된 데이터 사본입니다.

**See also:** [Disaster Recovery](#disaster-recovery), [Database](#database-db)

---

### High Availability (HA)
**Definition:** Systems designed to remain operational despite component failures. HA minimizes downtime through redundancy.

**Example:** Running multiple API servers behind a load balancer provides high availability.

**한글:** 고가용성 (HA). 구성 요소 장애에도 불구하고 작동 상태를 유지하도록 설계된 시스템입니다.

**See also:** [Availability](#availability), [Redundancy](#redundancy)

---

### Redundancy
**Definition:** Duplicating critical components to prevent single points of failure. Redundancy improves reliability.

**Example:** Running two database servers (master-slave) provides redundancy if one fails.

**한글:** 중복성. 단일 장애 지점을 방지하기 위해 중요한 구성 요소를 복제하는 것입니다.

**See also:** [High Availability](#high-availability-ha), [Failover](#failover)

---

### Failover
**Definition:** Automatically switching to a backup system when the primary fails. Failover maintains service continuity.

**Example:** When the primary database fails, automatic failover promotes the replica to primary.

**한글:** 장애 조치. 기본 시스템이 실패할 때 백업 시스템으로 자동 전환하는 것입니다.

**See also:** [High Availability](#high-availability-ha), [Redundancy](#redundancy)

---

## Testing & Quality Assurance

### Testing
**Definition:** The process of verifying that software works correctly by running it with various inputs and checking the outputs match expectations.

**Example:** WKU Crew has unit tests for individual functions and E2E tests that simulate real user interactions.

**한글:** 테스팅. 다양한 입력으로 소프트웨어를 실행하고 출력이 예상과 일치하는지 확인하여 올바르게 작동하는지 검증하는 프로세스입니다.

**See also:** [Unit Test](#unit-test), [E2E Test](#e2e-test-end-to-end)

---

### Unit Test
**Definition:** Tests that verify individual functions or components work correctly in isolation. Unit tests are fast and help catch bugs early.

**Example:** Testing that a `calculateGrade()` function returns 'A' when given a score of 95.

**한글:** 유닛 테스트. 개별 함수나 컴포넌트가 격리된 상태에서 올바르게 작동하는지 검증하는 테스트입니다.

**See also:** [Integration Test](#integration-test), [TDD](#tdd-test-driven-development)

---

### Integration Test
**Definition:** Tests that verify multiple components work together correctly. Integration tests check that different parts of the system communicate properly.

**Example:** Testing that the authentication system correctly stores user data in the database.

**한글:** 통합 테스트. 여러 컴포넌트가 함께 올바르게 작동하는지 검증하는 테스트입니다.

**See also:** [Unit Test](#unit-test), [E2E Test](#e2e-test-end-to-end)

---

### E2E Test (End-to-End)
**Definition:** Tests that simulate real user scenarios from start to finish. E2E tests verify the entire application works correctly from the user's perspective.

**Example:** WKU Crew's E2E tests use Playwright to simulate logging in, creating a project, and submitting it.

**한글:** E2E 테스트 (엔드투엔드). 처음부터 끝까지 실제 사용자 시나리오를 시뮬레이션하는 테스트입니다.

**See also:** [Integration Test](#integration-test), [Playwright](#playwright)

---

### TDD (Test-Driven Development)
**Definition:** A development approach where you write tests before writing the actual code. This ensures code is testable and meets requirements.

**Example:** Write a test for user registration first, then implement the registration logic to make the test pass.

**한글:** TDD (테스트 주도 개발). 실제 코드를 작성하기 전에 테스트를 먼저 작성하는 개발 접근 방식입니다.

**See also:** [BDD](#bdd-behavior-driven-development), [Unit Test](#unit-test)

---

### BDD (Behavior-Driven Development)
**Definition:** An extension of TDD that focuses on testing business behaviors using human-readable descriptions. Tests are written in plain language.

**Example:** "Given a logged-in user, When they create a project, Then it should appear in their project list."

**한글:** BDD (행동 주도 개발). 사람이 읽을 수 있는 설명을 사용하여 비즈니스 동작을 테스트하는 데 중점을 둔 TDD의 확장입니다.

**See also:** [TDD](#tdd-test-driven-development), [Testing](#testing)

---

### Playwright
**Definition:** A framework for automated browser testing. Playwright can control browsers to test web applications like a real user would.

**Example:** WKU Crew uses Playwright for E2E tests that click buttons, fill forms, and verify page content.

**한글:** 플레이라이트. 자동화된 브라우저 테스팅을 위한 프레임워크입니다.

**See also:** [E2E Test](#e2e-test-end-to-end), [Testing](#testing)

---

### Test Coverage
**Definition:** A metric showing what percentage of your code is executed during tests. Higher coverage generally means fewer untested bugs.

**Example:** WKU Crew aims for 80%+ test coverage, meaning at least 80% of the code is tested.

**한글:** 테스트 커버리지. 테스트 중에 실행되는 코드의 비율을 보여주는 지표입니다.

**See also:** [Testing](#testing), [Unit Test](#unit-test)

---

### Linting
**Definition:** Automated code analysis to find programming errors, bugs, stylistic errors, and suspicious patterns. Linters enforce code quality standards.

**Example:** ESLint checks WKU Crew's code for common mistakes and ensures consistent formatting.

**한글:** 린팅. 프로그래밍 오류, 버그, 스타일 오류, 의심스러운 패턴을 찾기 위한 자동화된 코드 분석입니다.

**See also:** [ESLint](#eslint), [Code Quality](#code-quality)

---

### ESLint
**Definition:** A popular JavaScript/TypeScript linting tool that identifies and fixes problems in code. ESLint is highly configurable.

**Example:** ESLint prevents WKU Crew developers from using deprecated functions or inconsistent code styles.

**한글:** ESLint. 코드의 문제를 식별하고 수정하는 인기 있는 자바스크립트/타입스크립트 린팅 도구입니다.

**See also:** [Linting](#linting), [TypeScript](#typescript-ts)

---

### Code Quality
**Definition:** The degree to which code is readable, maintainable, efficient, and free of defects. High-quality code is easier to understand and modify.

**Example:** WKU Crew maintains code quality through TypeScript, ESLint, testing, and code reviews.

**한글:** 코드 품질. 코드가 얼마나 읽기 쉽고, 유지보수 가능하며, 효율적이고, 결함이 없는지를 나타내는 정도입니다.

**See also:** [Linting](#linting), [Code Review](#code-review)

---

### Smoke Test
**Definition:** Quick tests verifying critical functionality works. Smoke tests catch major issues before detailed testing.

**Example:** After deployment, smoke tests verify login, database connection, and key API endpoints work.

**한글:** 스모크 테스트. 중요한 기능이 작동하는지 확인하는 빠른 테스트입니다.

**See also:** [Sanity Test](#sanity-test), [Testing](#testing)

---

### Sanity Test
**Definition:** Quick tests verifying specific functionality after changes. Sanity tests confirm fixes work as expected.

**Example:** After fixing a bug, sanity tests verify the bug is fixed and related features still work.

**한글:** 정상 테스트. 변경 후 특정 기능을 확인하는 빠른 테스트입니다.

**See also:** [Smoke Test](#smoke-test), [Regression Testing](#regression-testing)

---

### Regression Testing
**Definition:** Re-running tests to ensure new changes didn't break existing functionality. Regression tests catch unintended side effects.

**Example:** After adding a new feature, regression tests ensure old features still work correctly.

**한글:** 회귀 테스팅. 새로운 변경 사항이 기존 기능을 망가뜨리지 않았는지 확인하기 위해 테스트를 다시 실행하는 것입니다.

**See also:** [Testing](#testing), [Continuous Testing](#continuous-testing)

---

### Performance Testing
**Definition:** Testing how fast, responsive, and stable an application is under workload. Performance tests identify bottlenecks.

**Example:** Performance tests measure API response times and database query speeds.

**한글:** 성능 테스팅. 워크로드 하에서 애플리케이션이 얼마나 빠르고 반응적이며 안정적인지 테스트하는 것입니다.

**See also:** [Load Testing](#load-testing), [Stress Testing](#stress-testing)

---

### Load Testing
**Definition:** Testing system behavior under expected load. Load tests verify the system handles normal traffic.

**Example:** Simulate 1000 concurrent users to verify WKU Crew handles typical usage.

**한글:** 부하 테스팅. 예상 부하 하에서 시스템 동작을 테스트하는 것입니다.

**See also:** [Stress Testing](#stress-testing), [Performance Testing](#performance-testing)

---

### Stress Testing
**Definition:** Testing system behavior under extreme load beyond normal capacity. Stress tests find breaking points.

**Example:** Simulate 10,000 concurrent users to find when the system starts failing.

**한글:** 스트레스 테스팅. 정상 용량을 초과하는 극한 부하 하에서 시스템 동작을 테스트하는 것입니다.

**See also:** [Load Testing](#load-testing), [Performance Testing](#performance-testing)

---

### Code Coverage
**Definition:** The percentage of code executed during tests. Higher coverage generally means better testing.

**Example:** 80% code coverage means tests execute 80% of the codebase.

**한글:** 코드 커버리지. 테스트 중에 실행된 코드의 비율입니다.

**See also:** [Test Coverage](#test-coverage), [Testing](#testing)

---

### Mock
**Definition:** A fake object that simulates real behavior for testing. Mocks replace external dependencies.

**Example:** Mock the database to test API logic without needing a real database connection.

**한글:** 모의 객체. 테스트를 위해 실제 동작을 시뮬레이션하는 가짜 객체입니다.

**See also:** [Stub](#stub), [Spy](#spy)

---

### Stub
**Definition:** A minimal implementation providing fixed responses for testing. Stubs are simpler than mocks.

**Example:** A stub returns hardcoded user data instead of querying a real database.

**한글:** 스텁. 테스트를 위해 고정된 응답을 제공하는 최소 구현입니다.

**See also:** [Mock](#mock), [Test Double](#test-double)

---

### Test Double
**Definition:** Generic term for any fake object used in testing. Includes mocks, stubs, spies, fakes, and dummies.

**Example:** Using test doubles isolates the code under test from external dependencies.

**한글:** 테스트 더블. 테스팅에 사용되는 모든 가짜 객체의 총칭입니다.

**See also:** [Mock](#mock), [Stub](#stub)

---

### Spy
**Definition:** A test double that records how it was used. Spies verify function calls and arguments.

**Example:** A spy on `sendEmail()` verifies it was called with correct recipient and subject.

**한글:** 스파이. 사용된 방법을 기록하는 테스트 더블입니다.

**See also:** [Mock](#mock), [Test Double](#test-double)

---

### Test Fixture
**Definition:** The fixed state used as baseline for running tests. Fixtures provide consistent test environments.

**Example:** A test fixture creates three sample projects before each test runs.

**한글:** 테스트 픽스처. 테스트를 실행하기 위한 기준으로 사용되는 고정된 상태입니다.

**See also:** [Test Data](#test-data), [Testing](#testing)

---

### Test Data
**Definition:** Data specifically created for testing purposes. Good test data covers edge cases and typical scenarios.

**Example:** Test data includes valid users, expired tokens, and boundary cases like empty strings.

**한글:** 테스트 데이터. 테스트 목적으로 특별히 생성된 데이터입니다.

**See also:** [Test Fixture](#test-fixture), [Testing](#testing)

---

### Continuous Testing
**Definition:** Running automated tests continuously throughout development. Continuous testing catches bugs early.

**Example:** GitHub Actions runs tests automatically on every commit to WKU Crew.

**한글:** 지속적 테스팅. 개발 전반에 걸쳐 자동화된 테스트를 지속적으로 실행하는 것입니다.

**See also:** [CI/CD](#cicd-continuous-integrationcontinuous-deployment), [Testing](#testing)

---

### Snapshot Testing
**Definition:** Capturing component output and comparing it to stored snapshots. Snapshot tests catch unexpected UI changes.

**Example:** React snapshot tests save HTML output; tests fail if components render differently.

**한글:** 스냅샷 테스팅. 컴포넌트 출력을 캡처하고 저장된 스냅샷과 비교하는 것입니다.

**See also:** [Testing](#testing), [React](#react)

---

### Contract Testing
**Definition:** Verifying that services communicate according to agreed contracts. Contract tests catch API breaking changes.

**Example:** Contract tests ensure the frontend and backend agree on API request/response formats.

**한글:** 계약 테스팅. 서비스가 합의된 계약에 따라 통신하는지 확인하는 것입니다.

**See also:** [API](#api-application-programming-interface), [Testing](#testing)

---

### Mutation Testing
**Definition:** Testing the quality of tests by introducing bugs. Mutation testing verifies tests catch defects.

**Example:** Change `>` to `>=` in code; if tests still pass, they're not comprehensive enough.

**한글:** 변이 테스팅. 버그를 도입하여 테스트의 품질을 테스트하는 것입니다.

**See also:** [Test Coverage](#test-coverage), [Testing](#testing)

---

### A/B Testing
**Definition:** Comparing two versions to see which performs better. A/B testing guides product decisions with data.

**Example:** Show 50% of users the new button color, 50% the old, then measure which converts better.

**한글:** A/B 테스팅. 어느 것이 더 잘 수행되는지 보기 위해 두 버전을 비교하는 것입니다.

**See also:** [Feature Flags](#feature-flags), [Analytics](#analytics)

---

### Analytics
**Definition:** Collecting and analyzing user behavior data. Analytics inform product and business decisions.

**Example:** Google Analytics tracks page views, user flows, and conversion rates on WKU Crew.

**한글:** 분석. 사용자 행동 데이터를 수집하고 분석하는 것입니다.

**See also:** [A/B Testing](#ab-testing), [Metrics](#metrics)

---

### Metrics
**Definition:** Quantifiable measurements tracking system or business performance. Metrics enable data-driven decisions.

**Example:** Key metrics for WKU Crew include active users, course completion rate, and API response time.

**한글:** 메트릭. 시스템이나 비즈니스 성능을 추적하는 정량화 가능한 측정값입니다.

**See also:** [Analytics](#analytics), [KPI](#kpi-key-performance-indicator)

---

### KPI (Key Performance Indicator)
**Definition:** Critical metrics measuring success toward objectives. KPIs focus on what matters most.

**Example:** WKU Crew KPIs might be monthly active users, course completion rate, and student satisfaction.

**한글:** KPI (핵심 성과 지표). 목표를 향한 성공을 측정하는 중요한 메트릭입니다.

**See also:** [Metrics](#metrics), [OKR](#okr-objectives--key-results)

---

### OKR (Objectives & Key Results)
**Definition:** A goal-setting framework with objectives (what) and key results (how to measure). OKRs align teams.

**Example:** Objective: Improve student engagement. Key Results: 80% course completion, 4.5/5 satisfaction rating.

**한글:** OKR (목표 및 핵심 결과). 목표(무엇)와 핵심 결과(측정 방법)를 포함하는 목표 설정 프레임워크입니다.

**See also:** [KPI](#kpi-key-performance-indicator), [Agile](#agile)

---

### Flaky Test
**Definition:** A test that sometimes passes and sometimes fails without code changes. Flaky tests reduce confidence.

**Example:** A test that fails randomly due to timing issues or external dependencies is flaky.

**한글:** 불안정한 테스트. 코드 변경 없이 때때로 통과하고 때때로 실패하는 테스트입니다.

**See also:** [Testing](#testing), [Test Coverage](#test-coverage)

---

### Debugging
**Definition:** The process of finding and fixing bugs (errors) in code. Debugging involves examining code, logs, and using debugger tools.

**Example:** Using Chrome DevTools to step through JavaScript code and find why a button isn't working.

**한글:** 디버깅. 코드에서 버그를 찾고 수정하는 프로세스입니다.

**See also:** [Bug](#bug), [Console](#console)

---

### Bug
**Definition:** An error, flaw, or unintended behavior in software that causes it to produce incorrect or unexpected results.

**Example:** If clicking "Submit" on WKU Crew doesn't save your project, that's a bug.

**한글:** 버그. 소프트웨어에서 잘못되거나 의도하지 않은 동작을 일으키는 오류나 결함입니다.

**See also:** [Debugging](#debugging), [Testing](#testing)

---

## Project Management & Methodologies

### Agile
**Definition:** A project management methodology that emphasizes iterative development, collaboration, flexibility, and continuous improvement. Work is done in short cycles called sprints.

**Example:** WKU Crew development follows Agile principles with regular feature releases and feedback incorporation.

**한글:** 애자일. 반복적 개발, 협업, 유연성, 지속적 개선을 강조하는 프로젝트 관리 방법론입니다.

**See also:** [Sprint](#sprint), [Scrum](#scrum)

---

### Scrum
**Definition:** A specific Agile framework that organizes work into sprints with defined roles (Scrum Master, Product Owner) and ceremonies (daily standups, retrospectives).

**Example:** Many software teams use Scrum with 2-week sprints and daily standup meetings.

**한글:** 스크럼. 스프린트로 작업을 조직하고 정의된 역할과 의식이 있는 특정 애자일 프레임워크입니다.

**See also:** [Agile](#agile), [Sprint](#sprint)

---

### Sprint
**Definition:** A fixed time period (usually 1-4 weeks) in Agile development where a team works to complete a set of tasks or features.

**Example:** "In this 2-week sprint, we'll implement user authentication and project creation for WKU Crew."

**한글:** 스프린트. 팀이 작업이나 기능 세트를 완료하기 위해 작업하는 애자일 개발의 고정된 시간 기간입니다.

**See also:** [Agile](#agile), [Scrum](#scrum)

---

### MVP (Minimum Viable Product)
**Definition:** The simplest version of a product with just enough features to satisfy early users and validate the concept. MVPs help test ideas quickly.

**Example:** WKU Crew's MVP included basic user authentication, project creation, and course browsing.

**한글:** MVP (최소 기능 제품). 초기 사용자를 만족시키고 개념을 검증하기에 충분한 기능만 있는 제품의 가장 간단한 버전입니다.

**See also:** [PRD](#prd-product-requirements-document), [Agile](#agile)

---

### PRD (Product Requirements Document)
**Definition:** A document that describes what a product should do, including features, user needs, and success criteria. PRDs guide development teams.

**Example:** The WKU Crew PRD specified features like GitHub OAuth, project submissions, and course modules.

**한글:** PRD (제품 요구사항 문서). 제품이 무엇을 해야 하는지 설명하는 문서로, 기능, 사용자 요구사항, 성공 기준을 포함합니다.

**See also:** [TRD](#trd-technical-requirements-document), [MVP](#mvp-minimum-viable-product)

---

### TRD (Technical Requirements Document)
**Definition:** A document detailing technical specifications, architecture, technologies, and implementation approach for a project.

**Example:** WKU Crew's TRD specified using Next.js for frontend, NestJS for backend, and PostgreSQL for database.

**한글:** TRD (기술 요구사항 문서). 프로젝트의 기술 사양, 아키텍처, 기술, 구현 방법을 자세히 설명하는 문서입니다.

**See also:** [PRD](#prd-product-requirements-document), [Architecture](#architecture)

---

### User Story
**Definition:** A simple description of a feature from the user's perspective, typically in the format: "As a [user type], I want [goal] so that [benefit]."

**Example:** "As a student, I want to submit my project online so that instructors can grade it digitally."

**한글:** 사용자 스토리. 사용자 관점에서 기능을 간단하게 설명한 것입니다.

**See also:** [Agile](#agile), [PRD](#prd-product-requirements-document)

---

### Kanban
**Definition:** A visual project management method using boards and cards to represent work items and their status (To Do, In Progress, Done).

**Example:** GitHub Projects uses a Kanban-style board to track WKU Crew feature development.

**한글:** 칸반. 보드와 카드를 사용하여 작업 항목과 상태를 시각적으로 나타내는 프로젝트 관리 방법입니다.

**See also:** [Agile](#agile), [Project Management](#project-management--methodologies)

---

### Code Review
**Definition:** The practice of having other developers examine your code before it's merged. Code reviews improve quality and share knowledge.

**Example:** WKU Crew requires Pull Request reviews before merging code to the main or develop branches.

**한글:** 코드 리뷰. 코드가 병합되기 전에 다른 개발자가 검토하는 관행입니다.

**See also:** [Pull Request](#pull-request-pr), [Code Quality](#code-quality)

---

### Technical Debt
**Definition:** The implied cost of future rework caused by choosing quick or easy solutions now instead of better approaches that take longer.

**Example:** Skipping tests to ship faster creates technical debt - you'll need to add them later.

**한글:** 기술 부채. 더 오래 걸리는 더 나은 접근 방식 대신 빠르거나 쉬운 솔루션을 선택하여 발생하는 향후 재작업의 암묵적 비용입니다.

**See also:** [Code Quality](#code-quality), [Refactoring](#refactoring)

---

### Refactoring
**Definition:** Restructuring existing code to improve its design, readability, or performance without changing its external behavior.

**Example:** Simplifying a complex function into smaller, reusable functions is refactoring.

**한글:** 리팩토링. 외부 동작을 변경하지 않고 설계, 가독성, 성능을 개선하기 위해 기존 코드를 재구성하는 것입니다.

**See also:** [Code Quality](#code-quality), [Technical Debt](#technical-debt)

---

### Pair Programming
**Definition:** Two developers working together at one workstation. One writes code (driver), the other reviews (navigator).

**Example:** Pair programming improves code quality, shares knowledge, and reduces bugs.

**한글:** 페어 프로그래밍. 두 개발자가 하나의 워크스테이션에서 함께 작업하는 것입니다.

**See also:** [Code Review](#code-review), [Agile](#agile)

---

### Code Smell
**Definition:** Indicators of potential problems in code. Code smells suggest refactoring may be needed.

**Example:** Duplicate code, long functions, and large classes are common code smells.

**한글:** 코드 스멜. 코드의 잠재적 문제를 나타내는 지표입니다.

**See also:** [Refactoring](#refactoring), [Clean Code](#clean-code)

---

### Clean Code
**Definition:** Code that is easy to understand, modify, and maintain. Clean code follows best practices and conventions.

**Example:** Meaningful variable names, small functions, and clear comments create clean code.

**한글:** 클린 코드. 이해하고 수정하고 유지보수하기 쉬운 코드입니다.

**See also:** [Code Quality](#code-quality), [SOLID Principles](#solid-principles)

---

### SOLID Principles
**Definition:** Five design principles for maintainable object-oriented code: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.

**Example:** Single Responsibility: Each class should have one reason to change.

**한글:** SOLID 원칙. 유지보수 가능한 객체 지향 코드를 위한 다섯 가지 디자인 원칙입니다.

**See also:** [Design Pattern](#design-pattern), [Clean Code](#clean-code)

---

### DRY (Don't Repeat Yourself)
**Definition:** A principle avoiding code duplication. DRY promotes reusing code instead of copying it.

**Example:** Extract repeated logic into a shared function instead of copying code.

**한글:** DRY (Don't Repeat Yourself - 반복하지 마세요). 코드 중복을 피하는 원칙입니다.

**See also:** [Clean Code](#clean-code), [Refactoring](#refactoring)

---

### KISS (Keep It Simple, Stupid)
**Definition:** A design principle favoring simplicity over complexity. KISS encourages straightforward solutions.

**Example:** Use a simple if statement instead of complex conditional logic when possible.

**한글:** KISS (Keep It Simple, Stupid - 단순하게 유지하세요). 복잡성보다 단순함을 선호하는 디자인 원칙입니다.

**See also:** [YAGNI](#yagni-you-arent-gonna-need-it), [Clean Code](#clean-code)

---

### YAGNI (You Aren't Gonna Need It)
**Definition:** A principle against adding functionality until needed. YAGNI prevents over-engineering.

**Example:** Don't build a complex caching system if you don't have performance problems yet.

**한글:** YAGNI (You Aren't Gonna Need It - 필요하지 않을 것입니다). 필요할 때까지 기능을 추가하지 않는 원칙입니다.

**See also:** [KISS](#kiss-keep-it-simple-stupid), [Agile](#agile)

---

### Design Pattern
**Definition:** Reusable solutions to common programming problems. Design patterns provide proven approaches.

**Example:** Factory, Singleton, Observer, Strategy, and Decorator are classic design patterns.

**한글:** 디자인 패턴. 일반적인 프로그래밍 문제에 대한 재사용 가능한 솔루션입니다.

**See also:** [Factory Pattern](#factory-pattern), [Singleton Pattern](#singleton-pattern)

---

### Factory Pattern
**Definition:** A creational pattern creating objects without specifying exact classes. Factories encapsulate object creation.

**Example:** `UserFactory.create(type)` returns Student, Instructor, or Admin based on type.

**한글:** 팩토리 패턴. 정확한 클래스를 지정하지 않고 객체를 생성하는 생성 패턴입니다.

**See also:** [Design Pattern](#design-pattern), [Singleton Pattern](#singleton-pattern)

---

### Singleton Pattern
**Definition:** A pattern ensuring a class has only one instance. Singletons provide global access to that instance.

**Example:** Database connection pools often use singletons to share one connection pool.

**한글:** 싱글톤 패턴. 클래스가 하나의 인스턴스만 가지도록 보장하는 패턴입니다.

**See also:** [Design Pattern](#design-pattern), [Factory Pattern](#factory-pattern)

---

### Observer Pattern
**Definition:** A pattern where objects (observers) subscribe to events from a subject. Observers get notified of changes.

**Example:** Event listeners in JavaScript use the observer pattern - multiple listeners react to one event.

**한글:** 옵저버 패턴. 객체(옵저버)가 주제의 이벤트를 구독하는 패턴입니다.

**See also:** [Design Pattern](#design-pattern), [Event-Driven](#event-driven)

---

### Strategy Pattern
**Definition:** A pattern defining a family of algorithms as interchangeable strategies. Strategy pattern enables runtime algorithm selection.

**Example:** Different sorting algorithms (quick sort, merge sort) implemented as interchangeable strategies.

**한글:** 전략 패턴. 알고리즘 패밀리를 교환 가능한 전략으로 정의하는 패턴입니다.

**See also:** [Design Pattern](#design-pattern), [Polymorphism](#polymorphism)

---

### Polymorphism
**Definition:** The ability to present the same interface for different data types. Polymorphism enables flexible, reusable code.

**Example:** Different animal classes implement the same `makeSound()` method differently.

**한글:** 다형성. 다른 데이터 타입에 대해 동일한 인터페이스를 제공할 수 있는 능력입니다.

**See also:** [Object-Oriented Programming](#object-oriented-programming-oop), [Interface](#interface)

---

### Interface
**Definition:** A contract defining methods a class must implement. Interfaces enable abstraction and polymorphism.

**Example:** `interface Repository { save(), find(), delete() }` defines required methods for any repository.

**한글:** 인터페이스. 클래스가 구현해야 하는 메서드를 정의하는 계약입니다.

**See also:** [TypeScript](#typescript-ts), [Polymorphism](#polymorphism)

---

### Object-Oriented Programming (OOP)
**Definition:** A programming paradigm based on objects containing data and methods. OOP uses encapsulation, inheritance, and polymorphism.

**Example:** User class encapsulates user data and methods like `login()` and `logout()`.

**한글:** 객체 지향 프로그래밍 (OOP). 데이터와 메서드를 포함하는 객체를 기반으로 하는 프로그래밍 패러다임입니다.

**See also:** [Functional Programming](#functional-programming), [Class](#class)

---

### Functional Programming
**Definition:** A programming paradigm treating computation as evaluation of mathematical functions. Functional programming avoids mutable state.

**Example:** JavaScript's `map()`, `filter()`, and `reduce()` are functional programming concepts.

**한글:** 함수형 프로그래밍. 계산을 수학적 함수의 평가로 취급하는 프로그래밍 패러다임입니다.

**See also:** [Object-Oriented Programming](#object-oriented-programming-oop), [Pure Function](#pure-function)

---

### Pure Function
**Definition:** A function with no side effects that always returns the same output for same input. Pure functions are predictable and testable.

**Example:** `add(2, 3)` always returns 5 and doesn't modify anything - it's pure.

**한글:** 순수 함수. 부작용이 없고 동일한 입력에 대해 항상 동일한 출력을 반환하는 함수입니다.

**See also:** [Functional Programming](#functional-programming), [Side Effect](#side-effect)

---

### Side Effect
**Definition:** Any operation affecting state outside a function's scope. Side effects include modifying variables, I/O, or API calls.

**Example:** Modifying a global variable or saving to a database are side effects.

**한글:** 부작용. 함수 범위 외부의 상태에 영향을 미치는 모든 작업입니다.

**See also:** [Pure Function](#pure-function), [Functional Programming](#functional-programming)

---

### Class
**Definition:** A blueprint for creating objects with shared properties and methods. Classes are fundamental to OOP.

**Example:** `class User { name; email; login() {...} }` defines a User class with properties and methods.

**한글:** 클래스. 공유 속성과 메서드를 가진 객체를 생성하기 위한 청사진입니다.

**See also:** [Object-Oriented Programming](#object-oriented-programming-oop), [Instance](#instance)

---

### Instance
**Definition:** A specific object created from a class. Each instance has its own data.

**Example:** `const user = new User()` creates an instance of the User class.

**한글:** 인스턴스. 클래스에서 생성된 특정 객체입니다.

**See also:** [Class](#class), [Object-Oriented Programming](#object-oriented-programming-oop)

---

### Dependency Injection
**Definition:** Providing dependencies from outside instead of creating them internally. DI improves testability and flexibility.

**Example:** Instead of `class A { b = new B() }`, use `class A { constructor(b: B) {...} }`.

**한글:** 의존성 주입. 내부에서 생성하는 대신 외부에서 의존성을 제공하는 것입니다.

**See also:** [Inversion of Control](#inversion-of-control), [SOLID Principles](#solid-principles)

---

### Inversion of Control
**Definition:** A principle where control flow is inverted - frameworks call your code instead of your code calling libraries.

**Example:** React calls your component functions; you don't call React directly - that's inversion of control.

**한글:** 제어의 역전. 제어 흐름이 역전되는 원칙입니다.

**See also:** [Dependency Injection](#dependency-injection), [Framework](#framework)

---

### Separation of Concerns
**Definition:** Dividing a program into distinct sections each addressing a separate concern. SoC improves maintainability.

**Example:** Separate business logic, data access, and presentation into different layers.

**한글:** 관심사의 분리. 프로그램을 각각 별도의 관심사를 다루는 구별되는 섹션으로 나누는 것입니다.

**See also:** [Architecture](#architecture), [Clean Code](#clean-code)

---

### Convention over Configuration
**Definition:** Providing sensible defaults reducing configuration needs. Convention over configuration speeds development.

**Example:** Ruby on Rails assumes database table names match model names - no configuration needed.

**한글:** 설정보다 관례. 구성 필요를 줄이는 합리적인 기본값을 제공하는 것입니다.

**See also:** [Framework](#framework), [Ruby on Rails](#ruby-on-rails)

---

### Documentation
**Definition:** Written descriptions of code, APIs, and systems. Good documentation helps developers understand and use software.

**Example:** API documentation explains endpoints, parameters, and responses.

**한글:** 문서화. 코드, API, 시스템에 대한 서면 설명입니다.

**See also:** [README](#readme), [API Documentation](#api-documentation)

---

### README
**Definition:** A text file introducing and explaining a project. READMEs are the first thing people see in repositories.

**Example:** WKU Crew's README explains setup, features, and development workflow.

**한글:** README. 프로젝트를 소개하고 설명하는 텍스트 파일입니다.

**See also:** [Documentation](#documentation), [Repository](#repository-repo)

---

### Changelog
**Definition:** A file documenting all notable changes to a project. Changelogs help users understand what's new.

**Example:** `CHANGELOG.md` lists version 2.0.0 added authentication, fixed bugs, and broke API compatibility.

**한글:** 변경 로그. 프로젝트의 모든 주목할 만한 변경 사항을 문서화하는 파일입니다.

**See also:** [Versioning](#versioning), [Semantic Versioning](#semantic-versioning)

---

### Semantic Versioning
**Definition:** A versioning scheme using MAJOR.MINOR.PATCH format. Semantic versioning communicates change impact.

**Example:** 2.1.4 means major version 2, minor version 1, patch 4. Increment major for breaking changes.

**한글:** 시맨틱 버저닝. MAJOR.MINOR.PATCH 형식을 사용하는 버저닝 체계입니다.

**See also:** [Versioning](#versioning), [Changelog](#changelog)

---

### Code Linting
**Definition:** Automatically analyzing code for potential errors and style violations. Linting enforces code quality standards.

**Example:** ESLint catches unused variables, missing semicolons, and style inconsistencies.

**한글:** 코드 린팅. 잠재적 오류와 스타일 위반을 위해 코드를 자동으로 분석하는 것입니다.

**See also:** [ESLint](#eslint), [Code Formatting](#code-formatting)

---

### Code Formatting
**Definition:** Automatically arranging code according to style rules. Formatters ensure consistent code appearance.

**Example:** Prettier automatically formats JavaScript - indentation, spacing, line length, etc.

**한글:** 코드 포매팅. 스타일 규칙에 따라 코드를 자동으로 정리하는 것입니다.

**See also:** [Prettier](#prettier), [Code Linting](#code-linting)

---

### Prettier
**Definition:** An opinionated code formatter supporting many languages. Prettier eliminates style debates.

**Example:** Run Prettier, and all code follows the same formatting rules automatically.

**한글:** Prettier. 많은 언어를 지원하는 독단적인 코드 포매터입니다.

**See also:** [Code Formatting](#code-formatting), [ESLint](#eslint)

---

## Version Control & Collaboration

### Git
**Definition:** A distributed version control system that tracks changes in code over time. Git allows multiple developers to work together and maintains complete history.

**Example:** WKU Crew developers use Git to track changes, create branches, and collaborate on features.

**한글:** Git. 시간에 따른 코드 변경사항을 추적하는 분산 버전 관리 시스템입니다.

**See also:** [GitHub](#github), [Version Control](#version-control)

---

### GitHub
**Definition:** A web platform built around Git that provides hosting for code repositories plus collaboration tools like pull requests, issues, and actions.

**Example:** WKU Crew's code is hosted at `github.com/saintgo7/saas-crew` with CI/CD via GitHub Actions.

**한글:** GitHub. Git 기반으로 구축된 웹 플랫폼으로, 코드 저장소 호스팅과 협업 도구를 제공합니다.

**See also:** [Git](#git), [Repository](#repository-repo)

---

### Commit
**Definition:** A snapshot of your code at a specific point in time. Commits record changes with a message describing what was changed and why.

**Example:** `git commit -m "feat: add user authentication"` creates a commit with that message.

**한글:** 커밋. 특정 시점의 코드 스냅샷입니다.

**See also:** [Git](#git), [Commit Message](#commit-message)

---

### Commit Message
**Definition:** A description accompanying a commit that explains what changes were made. Good commit messages help others understand the project history.

**Example:** WKU Crew uses Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:` prefixes.

**한글:** 커밋 메시지. 커밋과 함께 제공되는 설명으로, 어떤 변경사항이 있었는지 설명합니다.

**See also:** [Commit](#commit), [Conventional Commits](#conventional-commits)

---

### Conventional Commits
**Definition:** A standard format for commit messages that makes them more readable and enables automatic changelog generation. Format: `type(scope): description`.

**Example:** `feat(auth): implement GitHub OAuth login` or `fix(api): resolve CORS error`.

**한글:** 컨벤셔널 커밋. 커밋 메시지를 더 읽기 쉽게 만들고 자동 변경 로그 생성을 가능하게 하는 표준 형식입니다.

**See also:** [Commit Message](#commit-message), [Git](#git)

---

### Branch
**Definition:** A parallel version of a repository where you can work on features independently without affecting the main code.

**Example:** WKU Crew uses `main` for production, `develop` for staging, and `feature/*` branches for new features.

**한글:** 브랜치. 메인 코드에 영향을 주지 않고 독립적으로 기능을 작업할 수 있는 저장소의 병렬 버전입니다.

**See also:** [Git](#git), [Git Flow](#git-flow)

---

### Git Flow
**Definition:** A branching strategy that defines how branches are used for features, releases, and hotfixes. It provides a robust workflow for team collaboration.

**Example:** WKU Crew follows Git Flow: `feature/*` → `develop` → `main` with automated deployments.

**한글:** Git Flow. 기능, 릴리스, 핫픽스에 브랜치를 어떻게 사용할지 정의하는 브랜칭 전략입니다.

**See also:** [Branch](#branch), [Git](#git)

---

### Merge
**Definition:** Combining changes from one branch into another. Merging integrates work from feature branches back into the main codebase.

**Example:** After code review, a Pull Request merges the `feature/auth` branch into `develop`.

**한글:** 병합. 한 브랜치의 변경사항을 다른 브랜치로 결합하는 것입니다.

**See also:** [Branch](#branch), [Pull Request](#pull-request-pr)

---

### Pull Request (PR)
**Definition:** A request to merge your code changes into another branch. PRs facilitate code review and discussion before integration.

**Example:** Create a PR from `feature/new-course` to `develop` for team review before merging.

**한글:** 풀 리퀘스트. 코드 변경사항을 다른 브랜치로 병합하기 위한 요청입니다.

**See also:** [Code Review](#code-review), [Merge](#merge)

---

### Conflict
**Definition:** When Git can't automatically merge changes because two people modified the same lines of code differently. Conflicts must be resolved manually.

**Example:** If two developers both edit the same function, Git will create a merge conflict that needs resolution.

**한글:** 충돌. 두 사람이 같은 코드 줄을 다르게 수정하여 Git이 자동으로 병합할 수 없을 때 발생합니다.

**See also:** [Merge](#merge), [Git](#git)

---

### Version Control
**Definition:** The practice of tracking and managing changes to code over time. Version control systems record who changed what and when.

**Example:** Git provides version control, allowing WKU Crew to revert to previous code versions if needed.

**한글:** 버전 관리. 시간에 따른 코드 변경사항을 추적하고 관리하는 방법입니다.

**See also:** [Git](#git), [Repository](#repository-repo)

---

### Fork
**Definition:** A personal copy of someone else's repository. Forking allows you to experiment with changes without affecting the original project.

**Example:** Students might fork the WKU Crew repository to practice making changes.

**한글:** 포크. 다른 사람의 저장소를 개인적으로 복사한 것입니다.

**See also:** [Clone](#clone), [Repository](#repository-repo)

---

### Clone
**Definition:** Creating a local copy of a remote repository on your computer. Cloning downloads all files and history.

**Example:** `git clone https://github.com/saintgo7/saas-crew.git` downloads the WKU Crew code.

**한글:** 클론. 원격 저장소를 컴퓨터에 로컬 복사본으로 만드는 것입니다.

**See also:** [Git](#git), [Repository](#repository-repo)

---

### Push
**Definition:** Uploading your local commits to a remote repository. Pushing shares your work with the team.

**Example:** `git push origin feature/my-feature` uploads your feature branch to GitHub.

**한글:** 푸시. 로컬 커밋을 원격 저장소에 업로드하는 것입니다.

**See also:** [Commit](#commit), [Pull](#pull)

---

### Pull
**Definition:** Downloading changes from a remote repository to your local copy. Pulling gets the latest updates from the team.

**Example:** `git pull origin develop` downloads the latest changes from the develop branch.

**한글:** 풀. 원격 저장소에서 변경사항을 로컬 복사본으로 다운로드하는 것입니다.

**See also:** [Push](#push), [Git](#git)

---

### GitHub Actions
**Definition:** GitHub's automation platform for CI/CD workflows. Actions can automatically test, build, and deploy code when events occur.

**Example:** WKU Crew uses GitHub Actions to automatically deploy to staging when code is pushed to `develop`.

**한글:** GitHub Actions. CI/CD 워크플로우를 위한 GitHub의 자동화 플랫폼입니다.

**See also:** [CI/CD](#cicd-continuous-integrationcontinuous-deployment), [GitHub](#github)

---

## Web Technologies

### JavaScript (JS)
**Definition:** The programming language of the web that adds interactivity to websites. JavaScript runs in browsers and (via Node.js) on servers.

**Example:** JavaScript powers all interactive features on WKU Crew - button clicks, form submissions, dynamic content.

**한글:** 자바스크립트. 웹사이트에 상호작용을 추가하는 웹의 프로그래밍 언어입니다.

**See also:** [TypeScript](#typescript-ts), [Node.js](#nodejs)

---

### Python
**Definition:** A high-level, versatile programming language known for readability and simplicity. Python is widely used for web development, data science, AI, and automation.

**Example:** Django and Flask web frameworks, data analysis with pandas, machine learning with TensorFlow - all use Python.

**한글:** 파이썬. 가독성과 단순함으로 알려진 고수준의 다목적 프로그래밍 언어입니다. 웹 개발, 데이터 과학, AI, 자동화에 널리 사용됩니다.

**See also:** [Django](#django), [Flask](#flask), [Backend](#backend)

---

### JSON (JavaScript Object Notation)
**Definition:** A lightweight data format that's easy for humans to read and write, and easy for machines to parse. JSON is the standard for API data exchange.

**Example:** `{"name": "John", "role": "student", "projects": 5}` represents user data in JSON.

**한글:** JSON (자바스크립트 객체 표기법). 사람이 읽고 쓰기 쉽고 기계가 구문 분석하기 쉬운 경량 데이터 형식입니다.

**See also:** [API](#api-application-programming-interface), [JavaScript](#javascript-js)

---

### HTTP/HTTPS
**Definition:** Protocols for transferring data over the web. HTTPS is the secure version that encrypts communication using SSL/TLS.

**Example:** WKU Crew uses HTTPS (`https://crew.abada.kr`) to encrypt all data between users and servers.

**한글:** HTTP/HTTPS. 웹을 통해 데이터를 전송하는 프로토콜입니다. HTTPS는 SSL/TLS를 사용하여 통신을 암호화하는 보안 버전입니다.

**See also:** [SSL](#ssl-secure-sockets-layer), [API](#api-application-programming-interface)

---

### SSL (Secure Sockets Layer)
**Definition:** A security protocol that creates an encrypted link between a web server and browser. SSL certificates enable HTTPS.

**Example:** Cloudflare provides SSL certificates for WKU Crew, showing the padlock icon in browsers.

**한글:** SSL (보안 소켓 계층). 웹 서버와 브라우저 간에 암호화된 링크를 만드는 보안 프로토콜입니다.

**See also:** [HTTPS](#httphttps), [Security](#security--authentication)

---

### DNS (Domain Name System)
**Definition:** The system that translates human-readable domain names (like crew.abada.kr) into IP addresses that computers use.

**Example:** DNS converts `crew.abada.kr` to the server's IP address so browsers can find it.

**한글:** DNS (도메인 네임 시스템). 사람이 읽을 수 있는 도메인 이름을 컴퓨터가 사용하는 IP 주소로 변환하는 시스템입니다.

**See also:** [Domain](#domain), [Cloudflare](#cloudflare)

---

### Domain
**Definition:** The address of a website, like `crew.abada.kr`. Domains are easier to remember than numeric IP addresses.

**Example:** WKU Crew uses the domain `crew.abada.kr` for production and `staging-crew.abada.kr` for testing.

**한글:** 도메인. 웹사이트의 주소입니다. 숫자 IP 주소보다 기억하기 쉽습니다.

**See also:** [DNS](#dns-domain-name-system), [URL](#url-uniform-resource-locator)

---

### URL (Uniform Resource Locator)
**Definition:** The complete web address of a resource, including protocol, domain, and path. URLs uniquely identify pages and resources.

**Example:** `https://crew.abada.kr/projects/123` is a URL pointing to a specific project page.

**한글:** URL (통합 자원 위치 지정자). 프로토콜, 도메인, 경로를 포함한 리소스의 완전한 웹 주소입니다.

**See also:** [Domain](#domain), [HTTP/HTTPS](#httphttps)

---

### Cookie
**Definition:** Small pieces of data stored in the browser that remember information about users. Cookies enable features like staying logged in.

**Example:** WKU Crew stores an authentication cookie so you don't need to log in on every page visit.

**한글:** 쿠키. 사용자에 대한 정보를 기억하는 브라우저에 저장된 작은 데이터 조각입니다.

**See also:** [Session](#session), [Authentication](#authentication)

---

### Session
**Definition:** A temporary interaction period between a user and application. Sessions store user state during their visit.

**Example:** Your WKU Crew session starts when you log in and ends when you log out or close the browser.

**한글:** 세션. 사용자와 애플리케이션 간의 임시 상호작용 기간입니다.

**See also:** [Cookie](#cookie), [Authentication](#authentication)

---

### Webhook
**Definition:** A way for applications to send real-time data to other applications when events occur. Webhooks are automated HTTP callbacks.

**Example:** GitHub can send a webhook to trigger WKU Crew's deployment when code is pushed.

**한글:** 웹훅. 이벤트가 발생할 때 애플리케이션이 다른 애플리케이션으로 실시간 데이터를 보내는 방법입니다.

**See also:** [API](#api-application-programming-interface), [Event](#event)

---

### npm (Node Package Manager)
**Definition:** The default package manager for Node.js that lets you install, share, and manage JavaScript libraries and tools.

**Example:** `npm install react` downloads and installs the React library into your project.

**한글:** npm (노드 패키지 매니저). 자바스크립트 라이브러리와 도구를 설치, 공유, 관리할 수 있게 하는 Node.js의 기본 패키지 매니저입니다.

**See also:** [pnpm](#pnpm), [Dependency](#dependency)

---

### pnpm
**Definition:** A fast, disk-efficient package manager alternative to npm. pnpm saves disk space by using hard links and is faster at installing packages.

**Example:** WKU Crew uses pnpm for package management: `pnpm install` instead of `npm install`.

**한글:** pnpm. npm의 빠르고 디스크 효율적인 패키지 매니저 대안입니다.

**See also:** [npm](#npm-node-package-manager), [Dependency](#dependency)

---

### Localhost
**Definition:** A hostname that refers to your own computer. Used for testing applications locally before deploying to production.

**Example:** WKU Crew developers run the app at `http://localhost:3000` for local testing.

**한글:** 로컬호스트. 자신의 컴퓨터를 가리키는 호스트 이름입니다. 프로덕션에 배포하기 전에 애플리케이션을 로컬에서 테스트하는 데 사용됩니다.

**See also:** [Development Environment](#environment-devstagingproduction), [Port](#port)

---

### Port
**Definition:** A number that identifies a specific process or service on a computer. Ports allow multiple services to run on the same machine.

**Example:** WKU Crew frontend runs on port 3000, the API on port 4000, and PostgreSQL on port 5432.

**한글:** 포트. 컴퓨터의 특정 프로세스나 서비스를 식별하는 번호입니다.

**See also:** [Server](#server), [Localhost](#localhost)

---

## Security & Authentication

### Authentication
**Definition:** The process of verifying who a user is. Authentication confirms identity, typically through credentials like passwords or OAuth tokens.

**Example:** WKU Crew uses GitHub OAuth for authentication - users log in with their GitHub accounts.

**한글:** 인증. 사용자가 누구인지 확인하는 프로세스입니다.

**See also:** [Authorization](#authorization), [OAuth](#oauth)

---

### Authorization
**Definition:** The process of determining what an authenticated user is allowed to do. Authorization controls access to resources.

**Example:** After authentication, WKU Crew checks if a user has permission to edit a specific project.

**한글:** 권한 부여. 인증된 사용자가 무엇을 할 수 있는지 결정하는 프로세스입니다.

**See also:** [Authentication](#authentication), [Permissions](#permissions)

---

### OAuth
**Definition:** An open standard for access delegation that allows users to grant applications access to their information without sharing passwords.

**Example:** WKU Crew uses GitHub OAuth - users click "Login with GitHub" instead of creating new credentials.

**한글:** OAuth. 사용자가 비밀번호를 공유하지 않고도 애플리케이션이 정보에 접근할 수 있도록 허용하는 오픈 표준입니다.

**See also:** [Authentication](#authentication), [JWT](#jwt-json-web-token)

---

### JWT (JSON Web Token)
**Definition:** A compact, URL-safe token format for securely transmitting information between parties. JWTs are commonly used for authentication.

**Example:** After login, WKU Crew issues a JWT that contains user information and proves authentication.

**한글:** JWT (JSON 웹 토큰). 당사자 간에 정보를 안전하게 전송하기 위한 컴팩트하고 URL 안전한 토큰 형식입니다.

**See also:** [Authentication](#authentication), [Token](#token)

---

### Token
**Definition:** A piece of data that proves authentication or authorization. Tokens are exchanged between client and server instead of passwords.

**Example:** WKU Crew includes a JWT token in API requests to prove the user is logged in.

**한글:** 토큰. 인증이나 권한 부여를 증명하는 데이터 조각입니다.

**See also:** [JWT](#jwt-json-web-token), [Authentication](#authentication)

---

### Encryption
**Definition:** The process of converting readable data into encoded format that can only be decoded with the correct key. Encryption protects sensitive information.

**Example:** WKU Crew encrypts passwords before storing them, and uses HTTPS to encrypt all web traffic.

**한글:** 암호화. 읽을 수 있는 데이터를 올바른 키로만 디코딩할 수 있는 인코딩된 형식으로 변환하는 프로세스입니다.

**See also:** [SSL](#ssl-secure-sockets-layer), [Security](#security--authentication)

---

### Hashing
**Definition:** Converting data into a fixed-size string of characters that can't be reversed. Hashing is used to securely store passwords.

**Example:** WKU Crew hashes user passwords with bcrypt before saving them - even admins can't see original passwords.

**한글:** 해싱. 데이터를 되돌릴 수 없는 고정 크기 문자열로 변환하는 것입니다.

**See also:** [Encryption](#encryption), [Security](#security--authentication)

---

### Permissions
**Definition:** Rules that determine what actions users can perform. Permissions implement the principle of least privilege.

**Example:** In WKU Crew, students can submit projects, but only instructors can grade them.

**한글:** 권한. 사용자가 수행할 수 있는 작업을 결정하는 규칙입니다.

**See also:** [Authorization](#authorization), [Role](#role)

---

### Role
**Definition:** A set of permissions assigned to users. Roles like "admin", "instructor", "student" group permissions logically.

**Example:** WKU Crew has roles: Admin (full access), Instructor (manage courses), Student (view and submit).

**한글:** 역할. 사용자에게 할당된 권한 세트입니다.

**See also:** [Permissions](#permissions), [Authorization](#authorization)

---

### XSS (Cross-Site Scripting)
**Definition:** A security vulnerability where attackers inject malicious scripts into web pages. XSS can steal user data or perform unauthorized actions.

**Example:** React in WKU Crew automatically escapes user input to prevent XSS attacks.

**한글:** XSS (크로스 사이트 스크립팅). 공격자가 웹 페이지에 악성 스크립트를 주입하는 보안 취약점입니다.

**See also:** [Security](#security--authentication), [CSRF](#csrf-cross-site-request-forgery)

---

### CSRF (Cross-Site Request Forgery)
**Definition:** An attack that tricks authenticated users into performing unwanted actions. CSRF exploits the trust a site has in the user's browser.

**Example:** CSRF tokens in forms ensure requests actually came from WKU Crew pages, not malicious sites.

**한글:** CSRF (크로스 사이트 요청 위조). 인증된 사용자를 속여 원하지 않는 작업을 수행하게 하는 공격입니다.

**See also:** [Security](#security--authentication), [XSS](#xss-cross-site-scripting)

---

### SQL Injection
**Definition:** A security vulnerability where attackers insert malicious SQL code into queries. SQL injection can expose or damage database data.

**Example:** Using Prisma ORM in WKU Crew prevents SQL injection by parameterizing queries automatically.

**한글:** SQL 인젝션. 공격자가 쿼리에 악성 SQL 코드를 삽입하는 보안 취약점입니다.

**See also:** [Security](#security--authentication), [SQL](#sql-structured-query-language)

---

### OWASP Top 10
**Definition:** The ten most critical web application security risks identified by OWASP. Following OWASP guidelines improves security.

**Example:** OWASP Top 10 includes injection, broken authentication, XSS, and insecure configuration.

**한글:** OWASP Top 10. OWASP가 식별한 가장 중요한 10가지 웹 애플리케이션 보안 위험입니다.

**See also:** [Security](#security--authentication), [XSS](#xss-cross-site-scripting)

---

### Content Security Policy (CSP)
**Definition:** An HTTP header that controls which resources browsers can load. CSP prevents XSS and data injection attacks.

**Example:** CSP header prevents loading scripts from untrusted domains, protecting against malicious code.

**한글:** 콘텐츠 보안 정책 (CSP). 브라우저가 로드할 수 있는 리소스를 제어하는 HTTP 헤더입니다.

**See also:** [Security](#security--authentication), [XSS](#xss-cross-site-scripting)

---

### Two-Factor Authentication (2FA)
**Definition:** Security requiring two different authentication methods. 2FA significantly improves account security.

**Example:** Login requires password (something you know) + code from phone (something you have).

**한글:** 2단계 인증 (2FA). 두 가지 다른 인증 방법을 요구하는 보안입니다.

**See also:** [MFA](#mfa-multi-factor-authentication), [Authentication](#authentication)

---

### MFA (Multi-Factor Authentication)
**Definition:** Authentication using multiple independent credentials. MFA is more secure than passwords alone.

**Example:** MFA combines password, fingerprint, and security key for maximum security.

**한글:** MFA (다단계 인증). 여러 독립적인 자격 증명을 사용하는 인증입니다.

**See also:** [2FA](#two-factor-authentication-2fa), [Authentication](#authentication)

---

### Single Sign-On (SSO)
**Definition:** Authentication allowing one login to access multiple applications. SSO improves user experience and security.

**Example:** Google SSO lets you log into Gmail, Drive, and Calendar with one account.

**한글:** 단일 로그인 (SSO). 하나의 로그인으로 여러 애플리케이션에 액세스할 수 있는 인증입니다.

**See also:** [OAuth](#oauth), [Authentication](#authentication)

---

### API Key
**Definition:** A unique identifier for authenticating API requests. API keys are simpler than OAuth but less secure.

**Example:** Include `X-API-Key: abc123` header to authenticate requests to third-party APIs.

**한글:** API 키. API 요청을 인증하기 위한 고유 식별자입니다.

**See also:** [Bearer Token](#bearer-token), [Authentication](#authentication)

---

### Bearer Token
**Definition:** An access token sent in HTTP Authorization header. Bearer tokens prove authentication without credentials.

**Example:** `Authorization: Bearer eyJhbGciOiJ...` authenticates API requests with a JWT.

**한글:** 베어러 토큰. HTTP Authorization 헤더에 전송되는 액세스 토큰입니다.

**See also:** [JWT](#jwt-json-web-token), [Token](#token)

---

### Certificate
**Definition:** A digital document proving identity and enabling encrypted communication. Certificates enable HTTPS.

**Example:** SSL certificates verify website identity and encrypt traffic between browser and server.

**한글:** 인증서. 신원을 증명하고 암호화된 통신을 가능하게 하는 디지털 문서입니다.

**See also:** [SSL](#ssl-secure-sockets-layer), [Certificate Authority](#certificate-authority-ca)

---

### Certificate Authority (CA)
**Definition:** An organization that issues digital certificates. CAs verify identity before issuing certificates.

**Example:** Let's Encrypt is a free CA that issues SSL certificates for millions of websites.

**한글:** 인증 기관 (CA). 디지털 인증서를 발급하는 조직입니다.

**See also:** [Certificate](#certificate), [SSL](#ssl-secure-sockets-layer)

---

### TLS Handshake
**Definition:** The process establishing an encrypted connection. TLS handshake negotiates encryption before data transfer.

**Example:** When you visit HTTPS sites, browsers and servers perform a TLS handshake to establish encryption.

**한글:** TLS 핸드셰이크. 암호화된 연결을 설정하는 프로세스입니다.

**See also:** [SSL](#ssl-secure-sockets-layer), [HTTPS](#httphttps)

---

### Security Headers
**Definition:** HTTP response headers that improve website security. Security headers prevent various attacks.

**Example:** `X-Frame-Options`, `X-Content-Type-Options`, and `Strict-Transport-Security` are important security headers.

**한글:** 보안 헤더. 웹사이트 보안을 개선하는 HTTP 응답 헤더입니다.

**See also:** [CSP](#content-security-policy-csp), [Security](#security--authentication)

---

### Input Validation
**Definition:** Checking user input meets expected format before processing. Validation prevents injection attacks and errors.

**Example:** Validate email format, password length, and age range before accepting user registration.

**한글:** 입력 검증. 처리 전에 사용자 입력이 예상 형식을 충족하는지 확인하는 것입니다.

**See also:** [Sanitization](#sanitization), [Security](#security--authentication)

---

### Sanitization
**Definition:** Removing or escaping dangerous characters from input. Sanitization prevents injection attacks.

**Example:** Sanitize HTML by escaping `<script>` tags to prevent XSS attacks.

**한글:** 새니타이제이션. 입력에서 위험한 문자를 제거하거나 이스케이프하는 것입니다.

**See also:** [Input Validation](#input-validation), [XSS](#xss-cross-site-scripting)

---

### CSRF Token
**Definition:** A random value proving requests originated from your site. CSRF tokens prevent cross-site request forgery.

**Example:** Forms include hidden CSRF tokens; server rejects requests without valid tokens.

**한글:** CSRF 토큰. 요청이 사이트에서 발생했음을 증명하는 임의의 값입니다.

**See also:** [CSRF](#csrf-cross-site-request-forgery), [Security](#security--authentication)

---

### DDoS Attack
**Definition:** Distributed Denial of Service - overwhelming a system with traffic to make it unavailable. DDoS attacks disrupt services.

**Example:** Attackers use botnets to flood servers with millions of requests, causing downtime.

**한글:** DDoS 공격. 분산 서비스 거부 - 트래픽으로 시스템을 압도하여 사용할 수 없게 만드는 것입니다.

**See also:** [DDoS Protection](#ddos-protection), [Security](#security--authentication)

---

### DDoS Protection
**Definition:** Strategies and tools to mitigate DDoS attacks. Protection includes rate limiting, traffic filtering, and CDNs.

**Example:** Cloudflare provides DDoS protection by filtering malicious traffic before it reaches servers.

**한글:** DDoS 보호. DDoS 공격을 완화하기 위한 전략과 도구입니다.

**See also:** [DDoS Attack](#ddos-attack), [Cloudflare](#cloudflare)

---

### Penetration Testing
**Definition:** Simulated attacks to find security vulnerabilities. Pen testing identifies weaknesses before attackers do.

**Example:** Security professionals attempt to hack the system to discover and fix vulnerabilities.

**한글:** 침투 테스팅. 보안 취약점을 찾기 위한 시뮬레이션 공격입니다.

**See also:** [Security](#security--authentication), [Vulnerability](#vulnerability)

---

### Vulnerability
**Definition:** A weakness in software that could be exploited. Vulnerabilities compromise security if not fixed.

**Example:** Outdated dependencies often contain known vulnerabilities that hackers can exploit.

**한글:** 취약점. 악용될 수 있는 소프트웨어의 약점입니다.

**See also:** [Security](#security--authentication), [Penetration Testing](#penetration-testing)

---

### Zero Trust
**Definition:** A security model assuming no user or system is trusted by default. Zero trust requires continuous verification.

**Example:** Even internal users must authenticate and verify permissions for every resource access.

**한글:** 제로 트러스트. 기본적으로 사용자나 시스템을 신뢰하지 않는다고 가정하는 보안 모델입니다.

**See also:** [Security](#security--authentication), [Authentication](#authentication)

---

## Additional Concepts

### UI/UX (User Interface / User Experience)
**Definition:** UI is how a product looks (visual design), UX is how it works (user flow, ease of use). Both are crucial for successful applications.

**Example:** WKU Crew's UI includes buttons and colors, while UX ensures students can easily find and submit projects.

**한글:** UI/UX (사용자 인터페이스 / 사용자 경험). UI는 제품의 시각적 디자인이고, UX는 작동 방식입니다.

**See also:** [Frontend](#frontend), [Responsive Design](#responsive-design)

---

### Performance
**Definition:** How fast and efficiently an application runs. Performance affects user satisfaction and is measured by metrics like load time and response time.

**Example:** WKU Crew aims for <200ms API response times and uses caching to improve performance.

**한글:** 성능. 애플리케이션이 얼마나 빠르고 효율적으로 실행되는지를 나타냅니다.

**See also:** [Cache](#cache), [Optimization](#optimization)

---

### Optimization
**Definition:** The process of improving code, queries, or infrastructure to run faster, use less memory, or reduce costs.

**Example:** Optimizing WKU Crew includes code splitting, image compression, and database query optimization.

**한글:** 최적화. 코드, 쿼리, 인프라를 개선하여 더 빠르게 실행하거나 메모리를 적게 사용하거나 비용을 줄이는 프로세스입니다.

**See also:** [Performance](#performance), [Refactoring](#refactoring)

---

### Scalability
**Definition:** The ability of an application to handle growth - more users, data, or traffic - without performance degradation.

**Example:** WKU Crew is designed to scale from 100 students to thousands as the platform grows.

**한글:** 확장성. 성능 저하 없이 더 많은 사용자, 데이터, 트래픽 증가를 처리할 수 있는 애플리케이션의 능력입니다.

**See also:** [Performance](#performance), [Cloud Computing](#cloud-computing)

---

### API Documentation
**Definition:** Documentation that describes how to use an API, including available endpoints, parameters, responses, and examples.

**Example:** WKU Crew's API docs at `crew-api.abada.kr/api/docs` use Swagger to document all endpoints.

**한글:** API 문서. API 사용 방법을 설명하는 문서로, 사용 가능한 엔드포인트, 매개변수, 응답, 예제를 포함합니다.

**See also:** [API](#api-application-programming-interface), [Swagger](#swagger)

---

### Swagger
**Definition:** A framework for API documentation that provides interactive documentation where you can test API endpoints directly in the browser.

**Example:** WKU Crew uses Swagger/OpenAPI for automatic API documentation generation.

**한글:** 스웨거. 브라우저에서 직접 API 엔드포인트를 테스트할 수 있는 대화형 문서를 제공하는 API 문서화 프레임워크입니다.

**See also:** [API Documentation](#api-documentation), [API](#api-application-programming-interface)

---

### Mobile-First
**Definition:** A design approach where websites are designed for mobile devices first, then enhanced for larger screens. Mobile-first recognizes that most users are on phones.

**Example:** WKU Crew's responsive design starts with mobile layouts and adds features for desktop.

**한글:** 모바일 우선. 웹사이트를 먼저 모바일 기기용으로 디자인한 다음 더 큰 화면용으로 개선하는 디자인 접근 방식입니다.

**See also:** [Responsive Design](#responsive-design), [UI/UX](#uiux-user-interface--user-experience)

---

### Architecture
**Definition:** The high-level structure of a software system, including how components are organized and interact. Architecture decisions impact maintainability and scalability.

**Example:** WKU Crew uses a client-server architecture with Next.js frontend and NestJS backend.

**한글:** 아키텍처. 소프트웨어 시스템의 고수준 구조로, 구성 요소가 어떻게 조직되고 상호작용하는지를 포함합니다.

**See also:** [Microservices](#microservices), [Monolith](#monolith)

---

### Event
**Definition:** An action or occurrence in software that the system responds to. Events can be user actions (clicks) or system occurrences (data loaded).

**Example:** In WKU Crew, clicking the "Submit Project" button triggers an event that sends data to the API.

**한글:** 이벤트. 시스템이 응답하는 소프트웨어의 동작이나 발생입니다.

**See also:** [Event-Driven](#event-driven), [Webhook](#webhook)

---

### Event-Driven
**Definition:** An architectural pattern where components communicate by producing and consuming events. Event-driven systems are loosely coupled and scalable.

**Example:** Real-time notifications in applications often use event-driven architecture.

**한글:** 이벤트 주도. 구성 요소가 이벤트를 생성하고 소비하여 통신하는 아키텍처 패턴입니다.

**See also:** [Event](#event), [Architecture](#architecture)

---

### Console
**Definition:** A text interface for interacting with a computer or viewing program output. In browsers, the console shows JavaScript logs and errors.

**Example:** Press F12 in Chrome to open Developer Tools and see the console for debugging WKU Crew.

**한글:** 콘솔. 컴퓨터와 상호작용하거나 프로그램 출력을 보기 위한 텍스트 인터페이스입니다.

**See also:** [Debugging](#debugging), [Logging](#logging)

---

### Logging
**Definition:** Recording application events, errors, and information to files or services. Logs help diagnose problems and monitor application health.

**Example:** WKU Crew logs API requests, errors, and user actions to help troubleshoot issues.

**한글:** 로깅. 애플리케이션 이벤트, 오류, 정보를 파일이나 서비스에 기록하는 것입니다.

**See also:** [Debugging](#debugging), [Console](#console)

---

### Monitoring
**Definition:** Continuously observing application performance, health, and behavior. Monitoring helps detect and resolve issues quickly.

**Example:** Monitoring WKU Crew's uptime, response times, and error rates ensures the platform runs smoothly.

**한글:** 모니터링. 애플리케이션 성능, 상태, 동작을 지속적으로 관찰하는 것입니다.

**See also:** [Logging](#logging), [Performance](#performance)

---

### Async/Await
**Definition:** A JavaScript syntax for handling asynchronous operations that makes code look synchronous. Async/await simplifies working with Promises.

**Example:** `const user = await fetchUser(id)` waits for the user data before continuing.

**한글:** Async/Await. 비동기 작업을 처리하는 자바스크립트 구문으로, 코드를 동기적으로 보이게 만듭니다.

**See also:** [JavaScript](#javascript-js), [Promise](#promise)

---

### Promise
**Definition:** A JavaScript object representing the eventual completion or failure of an asynchronous operation. Promises help manage async code.

**Example:** `fetchProjects().then(data => console.log(data)).catch(error => console.error(error))`

**한글:** 프라미스. 비동기 작업의 최종 완료 또는 실패를 나타내는 자바스크립트 객체입니다.

**See also:** [Async/Await](#asyncawait), [JavaScript](#javascript-js)

---

## Quick Reference

### Common Abbreviations

| Abbreviation | Full Term | Category |
|--------------|-----------|----------|
| 2FA | Two-Factor Authentication | Security |
| API | Application Programming Interface | General |
| APM | Application Performance Monitoring | DevOps |
| ARIA | Accessible Rich Internet Applications | Frontend |
| AWS | Amazon Web Services | Cloud |
| BDD | Behavior-Driven Development | Testing |
| CA | Certificate Authority | Security |
| CDN | Content Delivery Network | Cloud |
| CI/CD | Continuous Integration/Continuous Deployment | DevOps |
| CORS | Cross-Origin Resource Sharing | Backend |
| CRUD | Create, Read, Update, Delete | Database |
| CSP | Content Security Policy | Security |
| CSRF | Cross-Site Request Forgery | Security |
| CSS | Cascading Style Sheets | Frontend |
| DB | Database | Database |
| DNS | Domain Name System | Web |
| DOM | Document Object Model | Frontend |
| DRY | Don't Repeat Yourself | Development |
| E2E | End-to-End | Testing |
| ETL | Extract, Transform, Load | Data |
| GCP | Google Cloud Platform | Cloud |
| HA | High Availability | DevOps |
| HMR | Hot Module Replacement | Frontend |
| HTML | HyperText Markup Language | Frontend |
| HTTP/HTTPS | HyperText Transfer Protocol (Secure) | Web |
| IaC | Infrastructure as Code | DevOps |
| JS | JavaScript | Frontend |
| JSON | JavaScript Object Notation | Web |
| JWT | JSON Web Token | Security |
| K8s | Kubernetes | DevOps |
| KISS | Keep It Simple, Stupid | Development |
| KPI | Key Performance Indicator | Project Management |
| MFA | Multi-Factor Authentication | Security |
| MUI | Material-UI | Frontend |
| MVP | Minimum Viable Product | Project Management |
| NoSQL | Not Only SQL | Database |
| OKR | Objectives & Key Results | Project Management |
| OOP | Object-Oriented Programming | Development |
| ORM | Object-Relational Mapping | Backend |
| PR | Pull Request | Version Control |
| PRD | Product Requirements Document | Project Management |
| PWA | Progressive Web App | Frontend |
| REST | Representational State Transfer | Backend |
| SCSS | Sassy CSS | Frontend |
| SEO | Search Engine Optimization | Frontend |
| SOA | Service-Oriented Architecture | Backend |
| SOLID | Design Principles | Development |
| SPA | Single Page Application | Frontend |
| SQL | Structured Query Language | Database |
| SSH | Secure Shell | Cloud |
| SSE | Server-Sent Events | Backend |
| SSL | Secure Sockets Layer | Security |
| SSO | Single Sign-On | Security |
| SSR | Server-Side Rendering | Frontend |
| TDD | Test-Driven Development | Testing |
| TLS | Transport Layer Security | Security |
| TRD | Technical Requirements Document | Project Management |
| TS | TypeScript | Frontend |
| UI/UX | User Interface / User Experience | Design |
| URL | Uniform Resource Locator | Web |
| WCAG | Web Content Accessibility Guidelines | Frontend |
| XSS | Cross-Site Scripting | Security |
| YAGNI | You Aren't Gonna Need It | Development |

---

## Learning Path

For beginners learning software development on WKU Software Crew, we recommend studying terms in this order:

### Week 1-2: Web Basics
- [HTML](#html-hypertext-markup-language)
- [CSS](#css-cascading-style-sheets)
- [JavaScript](#javascript-js)
- [DOM](#dom-document-object-model)
- [Frontend](#frontend) / [Backend](#backend)

### Week 3-4: Version Control
- [Git](#git)
- [GitHub](#github)
- [Repository](#repository-repo)
- [Commit](#commit)
- [Branch](#branch)
- [Pull Request](#pull-request-pr)

### Week 5-6: Modern Frontend
- [React](#react)
- [Component](#component)
- [TypeScript](#typescript-ts)
- [Next.js](#nextjs)
- [Hooks](#hooks)

### Week 7-8: Backend & APIs
- [API](#api-application-programming-interface)
- [REST API](#rest-api-representational-state-transfer)
- [Node.js](#nodejs)
- [Database](#database-db)
- [SQL](#sql-structured-query-language)

### Week 9-10: Deployment & Tools
- [Docker](#docker)
- [CI/CD](#cicd-continuous-integrationcontinuous-deployment)
- [Environment](#environment-devstagingproduction)
- [Testing](#testing)
- [Debugging](#debugging)

---

## Contributing

This glossary is a living document. If you encounter terms not listed here or have suggestions for improvements:

1. Create an issue on GitHub
2. Submit a Pull Request with additions
3. Contact the WKU Crew team

When adding new terms, please follow the established format:
- Clear, beginner-friendly definition
- Practical example from WKU Crew or general usage
- Korean translation
- Cross-references to related terms

---

## Additional Resources

### Official Documentation
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **NestJS**: https://docs.nestjs.com/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Prisma**: https://www.prisma.io/docs

### Learning Platforms
- **MDN Web Docs**: https://developer.mozilla.org/ (Web technologies)
- **freeCodeCamp**: https://www.freecodecamp.org/ (Interactive tutorials)
- **The Odin Project**: https://www.theodinproject.com/ (Full curriculum)

### WKU Crew Documentation
- [Quick Start Guide](/docs/QUICK_START.md)
- [User Guide - Courses](/docs/USER_GUIDE_COURSES.md)
- [User Guide - Projects](/docs/USER_GUIDE_PROJECTS.md)
- [Development Plan](/docs/DEVELOPMENT_PLAN.md)

---

## Summary of Coverage

This glossary now contains 250+ essential development terms across all major areas:

### Frontend Development (40+ terms)
React, Next.js, TypeScript, Webpack, Vite, Redux, Tailwind CSS, Material-UI, Storybook, PWA, SEO, Accessibility, and more.

### Backend Development (45+ terms)
NestJS, Express, Django, Flask, Spring Boot, REST API, GraphQL, WebSocket, gRPC, Microservices, API Gateway, and more.

### Database & Data (35+ terms)
PostgreSQL, MongoDB, Redis, SQL, NoSQL, Prisma, Sharding, Replication, ETL, Data Warehouse, Graph Database, and more.

### Cloud & DevOps (50+ terms)
Docker, Kubernetes, AWS, Azure, GCP, Terraform, Ansible, Prometheus, Grafana, CI/CD, Blue-Green Deployment, and more.

### Testing & Quality (25+ terms)
Unit Testing, E2E Testing, TDD, BDD, Load Testing, Code Coverage, Mocking, A/B Testing, Performance Testing, and more.

### Security & Authentication (30+ terms)
OAuth, JWT, SSL/TLS, 2FA, MFA, SSO, CSRF, XSS, SQL Injection, OWASP Top 10, Penetration Testing, and more.

### Development Practices (25+ terms)
SOLID Principles, DRY, KISS, YAGNI, Design Patterns, Clean Code, Refactoring, Pair Programming, Code Review, and more.

---

**Last Updated:** 2026-01-25

**Version:** 2.0.0

**Total Terms:** 250+

**Maintained by:** WKU Software Crew Team
