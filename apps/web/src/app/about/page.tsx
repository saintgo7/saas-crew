import Link from 'next/link'
import { Target, Users, Rocket, Award } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '소개 | WKU Software Crew',
  description: 'WKU Software Crew는 원광대학교 학생들을 위한 소프트웨어 성장 플랫폼입니다',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            WKU Software Crew
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            원광대학교 학생들을 위한 소프트웨어 성장 플랫폼
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:border-gray-700 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">미션</h2>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            개인 프로젝트를 통해 Junior에서 Master까지 성장하는 학생 주도 소프트웨어 교육 플랫폼입니다.
            동아리처럼 함께 배우고, 멘토링을 주고받으며, 실전 경험을 쌓아갑니다.
          </p>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            핵심 기능
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Level System */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                레벨 시스템
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                프로젝트 완성으로 XP를 얻고 Junior, Senior, Master로 성장합니다.
              </p>
            </div>

            {/* Project Management */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                프로젝트 관리
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                개인 및 팀 프로젝트를 등록하고, GitHub 연동으로 포트폴리오를 관리합니다.
              </p>
            </div>

            {/* Community */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                커뮤니티
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Q&A 게시판에서 질문하고 답변하며, 멘토링을 주고받습니다.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            진행 방식
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                1
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  GitHub로 가입
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  GitHub 계정으로 간편하게 가입하고 시작하세요.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                2
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  프로젝트 시작
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  나만의 프로젝트 아이디어로 시작하거나 기존 프로젝트에 참여하세요.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                3
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  코스 수강
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  레벨별 코스를 통해 필요한 기술을 학습하세요.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                4
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  레벨업과 성장
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  프로젝트를 완성하고 XP를 얻어 다음 레벨로 성장하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            지금 바로 시작하세요
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            원광대학교 학생이라면 누구나 참여할 수 있습니다
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            크루에 합류하기
          </Link>
        </div>
      </div>
    </div>
  )
}
