import { Github } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인 | WKU Software Crew',
  description: 'GitHub 계정으로 로그인하세요',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <span className="text-3xl font-bold text-white">W</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              WKU Software Crew
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              크루에 합류하여 함께 성장하세요
            </p>
          </div>

          {/* Login Info */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>안내:</strong> 현재 인증 시스템이 구현되지 않았습니다.
              실제 로그인 기능은 NextAuth.js를 통해 구현될 예정입니다.
            </p>
          </div>

          {/* GitHub Login Button */}
          <button
            disabled
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-gray-800 px-4 py-3 font-medium text-white opacity-50 cursor-not-allowed dark:border-gray-600"
          >
            <Github className="h-5 w-5" />
            <span>GitHub로 로그인</span>
          </button>

          {/* Info */}
          <div className="mt-6 space-y-2 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>로그인하면 다음 기능을 사용할 수 있습니다:</p>
            <ul className="space-y-1 text-left">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                프로젝트 생성 및 관리
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                코스 수강 및 학습 진도 추적
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                커뮤니티 질문 및 답변
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                레벨업 시스템 및 XP 획득
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <p>
              원광대학교 학생만 가입할 수 있습니다.
              <br />
              문의사항이 있으시면 관리자에게 연락해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
