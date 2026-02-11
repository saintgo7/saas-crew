'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Search } from 'lucide-react'

const DEMO_GLOSSARY = `# CrewSpace - 개발 용어집 (Demo)

## 1. Programming Basics (프로그래밍 기초)

### Variable (변수)
**정의:** 데이터를 저장하는 이름이 붙은 메모리 공간
**예시:** \`let name = "Crew"\` - name이라는 변수에 "Crew" 문자열을 저장

### Function (함수)
**정의:** 특정 작업을 수행하는 재사용 가능한 코드 블록
**예시:** \`function greet(name) { return "Hello, " + name; }\`

### Array (배열)
**정의:** 여러 값을 순서대로 저장하는 자료구조
**예시:** \`const fruits = ["apple", "banana", "cherry"]\`

### Object (객체)
**정의:** key-value 쌍으로 데이터를 구조화하여 저장하는 자료구조
**예시:** \`const user = { name: "Kim", level: 5 }\`

### Loop (반복문)
**정의:** 조건이 충족될 때까지 코드 블록을 반복 실행하는 구조
**종류:** for, while, do-while, for...of, for...in

## 2. Web Development (웹 개발)

### HTML (HyperText Markup Language)
**정의:** 웹 페이지의 구조를 정의하는 마크업 언어
**역할:** 웹 콘텐츠의 의미와 구조를 정의

### CSS (Cascading Style Sheets)
**정의:** 웹 페이지의 스타일을 정의하는 스타일시트 언어
**역할:** 색상, 레이아웃, 폰트 등 시각적 표현을 담당

### JavaScript
**정의:** 웹 페이지에 동적 기능을 추가하는 프로그래밍 언어
**역할:** 사용자 인터랙션, API 호출, DOM 조작

### API (Application Programming Interface)
**정의:** 소프트웨어 간 데이터를 주고받기 위한 인터페이스
**종류:** REST API, GraphQL, WebSocket

### DOM (Document Object Model)
**정의:** HTML 문서를 트리 구조로 표현한 프로그래밍 인터페이스
**용도:** JavaScript로 HTML 요소를 조작할 때 사용

## 3. React & Next.js

### Component (컴포넌트)
**정의:** UI를 독립적이고 재사용 가능한 조각으로 나눈 것
**종류:** Function Component, Class Component (React 18+에서는 Function 권장)

### Hook (훅)
**정의:** React 함수 컴포넌트에서 상태 관리와 생명주기 기능을 사용하게 해주는 함수
**주요 Hook:** useState, useEffect, useContext, useReducer, useMemo, useCallback

### JSX (JavaScript XML)
**정의:** JavaScript 안에서 HTML과 유사한 문법을 사용할 수 있게 해주는 확장 문법
**예시:** \`const element = <h1>Hello, {name}</h1>\`

### Server Component
**정의:** Next.js에서 서버에서만 렌더링되는 컴포넌트 (기본값)
**장점:** 번들 크기 감소, 서버 자원 직접 접근 가능

### Client Component
**정의:** 브라우저에서 실행되는 컴포넌트, \`'use client'\` 지시어 필요
**용도:** 이벤트 핸들러, useState/useEffect 등 브라우저 API 사용 시

## 4. TypeScript

### Type (타입)
**정의:** 변수나 함수의 데이터 형태를 정의하는 것
**예시:** \`let age: number = 25\`

### Interface (인터페이스)
**정의:** 객체의 구조를 정의하는 타입 선언 방식
**예시:** \`interface User { name: string; level: number; }\`

### Generic (제네릭)
**정의:** 타입을 매개변수로 받아 다양한 타입에 대응하는 코드를 작성하는 방법
**예시:** \`function identity<T>(arg: T): T { return arg; }\`

## 5. Git & Version Control

### Repository (저장소)
**정의:** 프로젝트의 모든 파일과 변경 이력을 저장하는 공간
**종류:** Local Repository, Remote Repository

### Commit (커밋)
**정의:** 파일의 변경 사항을 저장소에 기록하는 행위
**구성:** 커밋 메시지 + 변경된 파일 목록 + 작성자 정보

### Branch (브랜치)
**정의:** 독립적으로 개발을 진행할 수 있는 코드의 분기점
**용도:** 기능 개발, 버그 수정 등을 메인 코드와 분리하여 작업

### Pull Request (PR)
**정의:** 변경 사항을 메인 브랜치에 병합해달라고 요청하는 것
**과정:** 코드 리뷰 -> 승인 -> 병합

### Merge (병합)
**정의:** 두 개의 브랜치를 하나로 합치는 것
**종류:** Fast-forward, 3-way merge, Squash merge

## 6. Database (데이터베이스)

### SQL (Structured Query Language)
**정의:** 관계형 데이터베이스를 관리하고 조작하기 위한 언어
**주요 명령:** SELECT, INSERT, UPDATE, DELETE

### ORM (Object-Relational Mapping)
**정의:** 객체와 관계형 데이터베이스 테이블을 자동으로 매핑해주는 기술
**예시:** Prisma, TypeORM, Sequelize

### Migration (마이그레이션)
**정의:** 데이터베이스 스키마의 변경 사항을 버전 관리하는 방법
**용도:** 테이블 생성/수정/삭제를 코드로 관리
`

export default function GlossaryPage() {
  const [content, setContent] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    fetch('/glossary.md')
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.text()
      })
      .then(text => {
        if (!text || text.trim().length < 50) throw new Error('Empty content')
        setContent(text)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Failed to load glossary:', err)
        setContent(DEMO_GLOSSARY)
        setIsDemo(true)
        setIsLoading(false)
      })
  }, [])

  const filteredContent = searchTerm
    ? content.split('\n').filter(line =>
        line.toLowerCase().includes(searchTerm.toLowerCase())
      ).join('\n')
    : content

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b pb-2">
            {line.replace('## ', '')}
          </h2>
        )
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {line.replace('# ', '')}
          </h1>
        )
      }

      // Bold text
      if (line.startsWith('**') && line.includes(':**')) {
        const parts = line.split(':**')
        return (
          <p key={index} className="mb-2">
            <strong className="text-blue-600 dark:text-blue-400">{parts[0].replace('**', '')}:</strong>
            <span className="text-gray-700 dark:text-gray-300">{parts[1]}</span>
          </p>
        )
      }

      // Tables
      if (line.startsWith('|')) {
        return (
          <div key={index} className="inline text-sm">
            {line}
          </div>
        )
      }

      // List items
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-gray-700 dark:text-gray-300">
            {line.replace('- ', '')}
          </li>
        )
      }

      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />
      }

      // Regular text
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 mb-2">
          {line}
        </p>
      )
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading glossary...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            개발 용어집
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          CrewSpace Development Glossary - 초급 개발자를 위한 필수 개발 용어 386개
        </p>
      </div>

      {/* Demo Banner */}
      {isDemo && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            현재 데모 용어집을 표시하고 있습니다. 전체 386개 용어는 서버 연결 후 확인할 수 있습니다.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="용어 검색... (예: API, React, Database)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            검색 결과: &ldquo;{searchTerm}&rdquo;
          </p>
        )}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 prose prose-blue max-w-none">
        {renderMarkdown(filteredContent)}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">386</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Terms</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">11</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">177KB</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">File Size</div>
        </div>
      </div>
    </div>
  )
}
