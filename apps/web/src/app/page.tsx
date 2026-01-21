import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            원광대학교 소프트웨어 크루
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            함께 성장하는
            <br />
            <span className="text-primary">개발자 크루</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            개인 프로젝트를 통해 Junior에서 Master까지,
            <br className="hidden md:block" />
            동아리처럼 함께 배우고 성장하는 플랫폼
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              GitHub로 시작하기
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border border-input bg-background hover:bg-accent transition-colors"
            >
              프로젝트 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Level System */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              성장하는 레벨 시스템
            </h2>
            <p className="text-muted-foreground text-lg">
              프로젝트를 완성하며 Junior에서 Master까지 성장하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Junior */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-6">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  Lv. 1-10
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-2 text-green-600">Junior</h3>
                <p className="text-muted-foreground mb-4">
                  프로그래밍의 첫 걸음
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    기본 문법 학습
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    첫 개인 프로젝트 완성
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Git 기초 사용법
                  </li>
                </ul>
              </div>
            </div>

            {/* Senior */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-6">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  Lv. 11-30
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-2 text-blue-600">Senior</h3>
                <p className="text-muted-foreground mb-4">
                  실력을 키우는 단계
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    풀스택 프로젝트 경험
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    크루 내 멘토링 참여
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    팀 프로젝트 협업
                  </li>
                </ul>
              </div>
            </div>

            {/* Master */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-6">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                  Lv. 31-50
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-2 text-purple-600">Master</h3>
                <p className="text-muted-foreground mb-4">
                  전문가로의 도약
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    기업 연계 프로젝트
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    크루 리더 역할
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    신입 멘토링
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            어떻게 진행되나요?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold">가입하기</h3>
              <p className="text-sm text-muted-foreground">
                GitHub 계정으로 간단 가입
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold">프로젝트 시작</h3>
              <p className="text-sm text-muted-foreground">
                나만의 프로젝트 아이디어로 시작
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold">완성하고 공유</h3>
              <p className="text-sm text-muted-foreground">
                프로젝트 완성 후 쇼케이스 등록
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold">레벨업!</h3>
              <p className="text-sm text-muted-foreground">
                XP를 얻고 다음 레벨로 성장
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            지금 바로 시작하세요
          </h2>
          <p className="text-muted-foreground text-lg">
            원광대학교 학생이라면 누구나 참여할 수 있습니다
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            크루에 합류하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2026 WKU Software Crew. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              소개
            </Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">
              프로젝트
            </Link>
            <a
              href="https://github.com/saintgo7/saas-crew"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
