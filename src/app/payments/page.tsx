'use client';

// /payments — Sprint 4 UI: 월별 정산 대시보드
// 승무원 비행 수당 집계 / 야간+장거리 가산 시각화

import { useState, useEffect } from 'react';

interface MonthlySummary {
  crewId: string;
  yearMonth: string;
  flightCount: number;
  total: number;
  breakdown: {
    base: number;
    night: number;
    longHaul: number;
  };
  currency: string;
}

const DEMO_CREW = '00000000-0000-0000-0000-000000000001';

export default function PaymentsPage() {
  const [yearMonth, setYearMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [crewId, setCrewId] = useState(DEMO_CREW);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/payments/calculate?crewId=${crewId}&yearMonth=${yearMonth}`
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSummary(data.summary);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [yearMonth, crewId]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(n);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            💰 비행 수당 정산
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            월별 집계 / 야간 + 장거리 가산 분해
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                대상 월
              </label>
              <input
                type="month"
                value={yearMonth}
                onChange={(e) => setYearMonth(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                승무원 ID
              </label>
              <input
                type="text"
                value={crewId}
                onChange={(e) => setCrewId(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 py-8">로딩 중...</div>
        )}

        {summary && !loading && (
          <>
            <section className="bg-white rounded-2xl shadow-lg p-8 mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                {summary.yearMonth} 총 지급액
              </div>
              <div className="text-5xl font-bold text-emerald-600 mb-2">
                ₩{fmt(summary.total)}
              </div>
              <div className="text-sm text-gray-600">
                비행 {summary.flightCount}회 ·{' '}
                {summary.flightCount > 0
                  ? `평균 ₩${fmt(Math.round(summary.total / summary.flightCount))}/회`
                  : '데이터 없음'}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BreakdownCard
                label="기본급"
                amount={summary.breakdown.base}
                total={summary.total}
                color="emerald"
              />
              <BreakdownCard
                label="야간 가산"
                amount={summary.breakdown.night}
                total={summary.total}
                color="indigo"
              />
              <BreakdownCard
                label="장거리 가산"
                amount={summary.breakdown.longHaul}
                total={summary.total}
                color="amber"
              />
            </section>
          </>
        )}

        <div className="mt-8 text-sm text-gray-500">
          데이터 출처: GET /api/payments/calculate · Sprint 3-2 집계 API
        </div>
      </div>
    </main>
  );
}

function BreakdownCard({
  label,
  amount,
  total,
  color,
}: {
  label: string;
  amount: number;
  total: number;
  color: 'emerald' | 'indigo' | 'amber';
}) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  const colorMap = {
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500',
  };
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="text-xs text-gray-500 uppercase tracking-wider">
        {label}
      </div>
      <div className="text-2xl font-bold mt-1">
        ₩{new Intl.NumberFormat('ko-KR').format(amount)}
      </div>
      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={colorMap[color]}
          style={{ width: `${pct}%`, height: '100%' }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">{pct}%</div>
    </div>
  );
}
