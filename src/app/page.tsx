// 메인 페이지 — 항공사 객실 승무원 SaaS 랜딩
// Sprint 6 U3

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl text-center">
        <div className="text-6xl mb-4">✈️</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          saas-crew
        </h1>
        <p className="text-gray-700 text-lg mb-2">
          항공사 객실 승무원 관리 SaaS
        </p>
        <p className="text-gray-500 text-sm mb-8">
          스케줄 + 자격 + 정산 통합 운영
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link
            href="/flights"
            className="block p-5 bg-white rounded-2xl shadow hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">🛫</div>
            <div className="font-bold text-gray-900">비행 스케줄</div>
            <div className="text-xs text-gray-500 mt-1">
              주간/월간 운항 + 승무원 배정
            </div>
          </Link>

          <Link
            href="/payments"
            className="block p-5 bg-white rounded-2xl shadow hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold text-gray-900">비행 수당 정산</div>
            <div className="text-xs text-gray-500 mt-1">
              월별 집계 + 야간/장거리 가산
            </div>
          </Link>

          <Link
            href="/login"
            className="block p-5 bg-white rounded-2xl shadow hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">🔐</div>
            <div className="font-bold text-gray-900">로그인</div>
            <div className="text-xs text-gray-500 mt-1">
              사무장 / 승무원 / 운영자
            </div>
          </Link>
        </div>

        <div className="mt-8 text-xs text-gray-500">
          데이터 출처: PostgreSQL (abada-postgres / saas_crew) · Sprint 5 시드
        </div>
      </div>
    </main>
  );
}
