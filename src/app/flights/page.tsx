'use client';

// /flights — Sprint 4 UI: 비행편 캘린더/리스트
// 항공사 객실 승무원 스케줄 운영자 화면

import { useState, useEffect, useMemo } from 'react';

interface Flight {
  id: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureAt: string;
  arrivalAt: string;
  aircraftType?: string;
  requiredCrewCount: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed';
}

const STATUS_BADGES: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-700',
  delayed: 'bg-red-100 text-red-800',
};

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const weekLater = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/flights?from=${today}T00:00:00Z&to=${weekLater}T23:59:59Z`
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'load failed');
      setFlights(data.flights || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            ✈️ 비행 스케줄
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {today} ~ {weekLater} (7일)
          </p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-12">로딩 중...</div>
        ) : flights.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-gray-400 text-4xl mb-3">✈️</div>
            <p className="text-gray-600">
              이번 주 비행 일정 없음 (또는 DB 미연결)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {flights.map((f) => (
              <FlightCard key={f.id} flight={f} />
            ))}
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          데이터 출처: GET /api/flights · Sprint 3-2 라우트
        </div>
      </div>
    </main>
  );
}

function FlightCard({ flight }: { flight: Flight }) {
  const dep = new Date(flight.departureAt);
  const arr = new Date(flight.arrivalAt);
  const durationH = ((arr.getTime() - dep.getTime()) / 3_600_000).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <div className="text-2xl font-bold text-blue-600">
            {flight.flightNumber}
          </div>
          <div className="text-xs text-gray-500">{flight.aircraftType}</div>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            STATUS_BADGES[flight.status]
          }`}
        >
          {flight.status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex-1 text-center">
          <div className="font-bold text-lg">{flight.departureAirport}</div>
          <div className="text-xs text-gray-500">
            {dep.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex flex-col items-center text-gray-400 text-xs">
          <div>→</div>
          <div>{durationH}h</div>
        </div>
        <div className="flex-1 text-center">
          <div className="font-bold text-lg">{flight.arrivalAirport}</div>
          <div className="text-xs text-gray-500">
            {arr.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-600">
          승무원 필요: <strong>{flight.requiredCrewCount}명</strong>
        </span>
        <span className="text-gray-500">
          {dep.toLocaleDateString('ko-KR')}
        </span>
      </div>
    </div>
  );
}
