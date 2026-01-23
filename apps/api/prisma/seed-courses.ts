import { PrismaClient, CourseLevel } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface Chapter {
  title: string
  slug: string
  order: number
  duration: number
  videoUrl: string
  content: string
}

interface Course {
  title: string
  slug: string
  description: string
  level: CourseLevel
  duration: number
  published: boolean
  featured: boolean
  category: string
  tags: string[]
  topics: string[]
  chapters: Chapter[]
}

const courses: Course[] = [
  {
    title: "Git & GitHub 완전 정복",
    slug: "git-github-mastery",
    description: "Git과 GitHub를 활용한 버전 관리와 협업 워크플로우를 마스터합니다. 실무에서 사용하는 브랜치 전략, Pull Request 워크플로우, 코드 리뷰 프로세스를 경험합니다.",
    level: CourseLevel.JUNIOR,
    duration: 8,
    published: true,
    featured: true,
    category: "DevOps",
    tags: ["Git", "GitHub", "Version Control", "Collaboration"],
    topics: ["Git 기초 명령어", "브랜치 전략", "Pull Request", "코드 리뷰"],
    chapters: [
      {
        title: "Git 소개와 설치",
        slug: "intro-and-setup",
        order: 1,
        duration: 15,
        videoUrl: "https://www.youtube.com/watch?v=HkdAHXoRtos",
        content: "# Git 소개와 설치\n\nGit은 분산 버전 관리 시스템(DVCS)입니다.\n\n## 설치\n- macOS: brew install git\n- Windows: git-scm.com에서 다운로드\n- Linux: sudo apt install git\n\n## 초기 설정\ngit config --global user.name \"Your Name\"\ngit config --global user.email \"your@email.com\""
      },
      {
        title: "Git 기본 명령어",
        slug: "basic-commands",
        order: 2,
        duration: 25,
        videoUrl: "https://www.youtube.com/watch?v=HVsySz-h9r4",
        content: "# Git 기본 명령어\n\n## 저장소 생성\ngit init\ngit clone <url>\n\n## 변경사항 추적\ngit status\ngit add .\ngit commit -m \"message\"\n\n## 커밋 규칙 (Conventional Commits)\n- feat: 새 기능\n- fix: 버그 수정\n- docs: 문서\n- refactor: 리팩토링"
      },
      {
        title: "브랜치와 병합",
        slug: "branching-and-merging",
        order: 3,
        duration: 30,
        videoUrl: "https://www.youtube.com/watch?v=e2IbNHi4uCI",
        content: "# 브랜치와 병합\n\n## 브랜치 명령어\ngit branch\ngit checkout -b feature/name\ngit merge feature/name\n\n## Git Flow 전략\n- main: 프로덕션\n- develop: 개발\n- feature/*: 기능 개발\n- hotfix/*: 긴급 수정"
      },
      {
        title: "GitHub 협업",
        slug: "github-workflow",
        order: 4,
        duration: 35,
        videoUrl: "https://www.youtube.com/watch?v=8lGpZkjnkt4",
        content: "# GitHub 협업\n\n## Fork & PR 워크플로우\n1. Fork 저장소\n2. Clone 후 작업\n3. Push 후 PR 생성\n\n## 좋은 PR 작성\n- 명확한 제목\n- 변경 이유 설명\n- 스크린샷 첨부"
      }
    ]
  },
  {
    title: "HTML/CSS 웹 기초",
    slug: "html-css-fundamentals",
    description: "웹 개발의 기초인 HTML과 CSS를 배웁니다. 시맨틱 마크업, Flexbox, Grid, 반응형 디자인을 학습합니다.",
    level: CourseLevel.JUNIOR,
    duration: 12,
    published: true,
    featured: true,
    category: "Frontend",
    tags: ["HTML", "CSS", "Web", "Frontend"],
    topics: ["HTML5 시맨틱", "CSS 선택자", "Flexbox", "반응형 웹"],
    chapters: [
      {
        title: "HTML 기초",
        slug: "html-basics",
        order: 1,
        duration: 30,
        videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        content: "# HTML 기초\n\n## 문서 구조\n<!DOCTYPE html>\n<html><head><title>제목</title></head><body></body></html>\n\n## 시맨틱 태그\nheader, nav, main, article, section, aside, footer"
      },
      {
        title: "CSS 기초",
        slug: "css-basics",
        order: 2,
        duration: 35,
        videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI",
        content: "# CSS 기초\n\n## 선택자\np { } / .class { } / #id { }\n\n## 박스 모델\nwidth, height, padding, border, margin"
      },
      {
        title: "Flexbox 레이아웃",
        slug: "flexbox-layout",
        order: 3,
        duration: 40,
        videoUrl: "https://www.youtube.com/watch?v=fYq5PXgSsbE",
        content: "# Flexbox\n\ndisplay: flex;\njustify-content: center;\nalign-items: center;\nflex-direction: row | column;\ngap: 1rem;"
      },
      {
        title: "반응형 디자인",
        slug: "responsive-design",
        order: 4,
        duration: 45,
        videoUrl: "https://www.youtube.com/watch?v=srvUrASNj0s",
        content: "# 반응형 웹\n\n## 미디어 쿼리\n@media (min-width: 768px) { }\n@media (min-width: 1024px) { }\n\n## 뷰포트\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
      }
    ]
  },
  {
    title: "JavaScript 프로그래밍",
    slug: "javascript-programming",
    description: "JavaScript의 핵심 개념과 ES6+ 문법을 배웁니다. 변수, 함수, 객체, 비동기 프로그래밍을 학습합니다.",
    level: CourseLevel.JUNIOR,
    duration: 20,
    published: true,
    featured: true,
    category: "Frontend",
    tags: ["JavaScript", "ES6", "Programming"],
    topics: ["변수와 타입", "함수", "배열/객체", "비동기"],
    chapters: [
      {
        title: "JavaScript 기초",
        slug: "js-intro",
        order: 1,
        duration: 25,
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        content: "# JavaScript 기초\n\n## 변수\nlet name = \"홍길동\";\nconst PI = 3.14;\n\n## 타입\nstring, number, boolean, null, undefined, object, array"
      },
      {
        title: "함수와 스코프",
        slug: "functions-scope",
        order: 2,
        duration: 35,
        videoUrl: "https://www.youtube.com/watch?v=iLWTnMzWtj4",
        content: "# 함수\n\n## 선언 방식\nfunction fn() { }\nconst fn = () => { }\n\n## 스코프\n전역, 함수, 블록 스코프"
      },
      {
        title: "배열과 객체",
        slug: "arrays-objects",
        order: 3,
        duration: 40,
        videoUrl: "https://www.youtube.com/watch?v=R8rmfD9Y5-c",
        content: "# 배열과 객체\n\n## 배열 메서드\nmap, filter, reduce, find, some, every\n\n## 구조 분해\nconst { name } = user;\nconst [first] = array;"
      },
      {
        title: "비동기 프로그래밍",
        slug: "async-programming",
        order: 4,
        duration: 45,
        videoUrl: "https://www.youtube.com/watch?v=vn3tm0quoqE",
        content: "# 비동기\n\n## Promise\nfetch(url).then(res => res.json())\n\n## async/await\nasync function getData() {\n  const data = await fetch(url);\n  return data.json();\n}"
      }
    ]
  },
  {
    title: "React 프론트엔드 개발",
    slug: "react-frontend-development",
    description: "React를 활용한 현대적인 프론트엔드 개발을 배웁니다. 컴포넌트, Hooks, 상태 관리를 학습합니다.",
    level: CourseLevel.SENIOR,
    duration: 25,
    published: true,
    featured: true,
    category: "Frontend",
    tags: ["React", "JavaScript", "Frontend", "SPA"],
    topics: ["JSX", "컴포넌트", "Hooks", "상태 관리"],
    chapters: [
      {
        title: "React 시작하기",
        slug: "getting-started",
        order: 1,
        duration: 30,
        videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        content: "# React 시작\n\n## 프로젝트 생성\nnpm create vite@latest my-app -- --template react-ts\n\n## JSX\nfunction App() {\n  return <h1>Hello React</h1>;\n}"
      },
      {
        title: "컴포넌트와 Props",
        slug: "components-props",
        order: 2,
        duration: 35,
        videoUrl: "https://www.youtube.com/watch?v=4UZrsTqkcW4",
        content: "# 컴포넌트\n\nfunction Button({ children, onClick }) {\n  return <button onClick={onClick}>{children}</button>;\n}\n\n<Button onClick={fn}>Click</Button>"
      },
      {
        title: "State와 이벤트",
        slug: "state-events",
        order: 3,
        duration: 40,
        videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0",
        content: "# State\n\nconst [count, setCount] = useState(0);\n\n<button onClick={() => setCount(count + 1)}>\n  Count: {count}\n</button>"
      },
      {
        title: "React Hooks",
        slug: "react-hooks-advanced",
        order: 4,
        duration: 50,
        videoUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
        content: "# Hooks\n\n## useEffect\nuseEffect(() => {\n  fetchData();\n  return () => cleanup();\n}, [deps]);\n\n## useMemo / useCallback\nconst value = useMemo(() => compute(), [deps]);"
      }
    ]
  },
  {
    title: "TypeScript 마스터",
    slug: "typescript-mastery",
    description: "TypeScript로 타입 안전한 JavaScript 코드를 작성합니다.",
    level: CourseLevel.SENIOR,
    duration: 18,
    published: true,
    featured: false,
    category: "Frontend",
    tags: ["TypeScript", "JavaScript", "Static Typing"],
    topics: ["기본 타입", "인터페이스", "제네릭"],
    chapters: [
      {
        title: "TypeScript 기초",
        slug: "ts-basics",
        order: 1,
        duration: 30,
        videoUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
        content: "# TypeScript 기초\n\nconst name: string = \"홍길동\";\nconst age: number = 25;\nconst numbers: number[] = [1, 2, 3];"
      },
      {
        title: "인터페이스와 타입",
        slug: "interfaces-types",
        order: 2,
        duration: 35,
        videoUrl: "https://www.youtube.com/watch?v=zQnBQ4tB3ZA",
        content: "# Interface\n\ninterface User {\n  id: number;\n  name: string;\n  email?: string;\n}\n\ntype ID = string | number;"
      },
      {
        title: "제네릭",
        slug: "generics",
        order: 3,
        duration: 40,
        videoUrl: "https://www.youtube.com/watch?v=nViEqpgwxHE",
        content: "# 제네릭\n\nfunction identity<T>(value: T): T {\n  return value;\n}\n\ninterface Response<T> {\n  data: T;\n  status: number;\n}"
      }
    ]
  },
  {
    title: "Node.js 백엔드 개발",
    slug: "nodejs-backend",
    description: "Node.js와 Express로 백엔드 서버를 개발합니다.",
    level: CourseLevel.SENIOR,
    duration: 30,
    published: true,
    featured: false,
    category: "Backend",
    tags: ["Node.js", "Express", "REST API"],
    topics: ["Node.js 기초", "Express", "REST API"],
    chapters: [
      {
        title: "Node.js 시작하기",
        slug: "nodejs-intro",
        order: 1,
        duration: 25,
        videoUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
        content: "# Node.js\n\n## 모듈\nexport const add = (a, b) => a + b;\nimport { add } from './math.js';"
      },
      {
        title: "Express 기초",
        slug: "express-basics",
        order: 2,
        duration: 35,
        videoUrl: "https://www.youtube.com/watch?v=L72fhGm1tfE",
        content: "# Express\n\nconst app = express();\napp.use(express.json());\napp.get('/users', (req, res) => res.json(users));\napp.listen(3000);"
      }
    ]
  },
  {
    title: "SQL과 데이터베이스",
    slug: "sql-databases",
    description: "관계형 데이터베이스와 SQL을 마스터합니다.",
    level: CourseLevel.SENIOR,
    duration: 15,
    published: true,
    featured: false,
    category: "Backend",
    tags: ["SQL", "Database", "PostgreSQL"],
    topics: ["SQL 기초", "테이블 설계", "JOIN"],
    chapters: [
      {
        title: "SQL 기초",
        slug: "sql-basics",
        order: 1,
        duration: 30,
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        content: "# SQL 기초\n\nSELECT * FROM users;\nSELECT name FROM users WHERE age > 20;\nINSERT INTO users (name) VALUES ('홍길동');\nUPDATE users SET age = 26 WHERE id = 1;\nDELETE FROM users WHERE id = 1;"
      }
    ]
  }
]

async function main() {
  console.log('Seeding courses...')

  for (const courseData of courses) {
    const { chapters, ...course } = courseData

    const createdCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    })

    console.log(`Created: ${createdCourse.title}`)

    for (const chapter of chapters) {
      await prisma.chapter.upsert({
        where: {
          courseId_slug: {
            courseId: createdCourse.id,
            slug: chapter.slug,
          },
        },
        update: { ...chapter, courseId: createdCourse.id },
        create: { ...chapter, courseId: createdCourse.id },
      })
    }

    console.log(`  - ${chapters.length} chapters added`)
  }

  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
