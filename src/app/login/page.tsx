'use client';

// /login — Mock 로그인 (Sprint 6 U3)
// NextAuth 통합은 Sprint 7

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DEMO_USERS = [
  { email: 'purser@example.com', role: '사무장 (A)', name: '김사무장' },
  { email: 'crew1@example.com', role: '승무원 (U)', name: '이승무원' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  function quickLogin(demoEmail: string) {
    setEmail(demoEmail);
    setBusy(true);
    // Mock: 로컬 스토리지에만 저장 (Sprint 7 NextAuth로 교체)
    try {
      localStorage.setItem('saas-crew:user', demoEmail);
    } catch {}
    setTimeout(() => router.push('/flights'), 300);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <header className="mb-6 text-center">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900">saas-crew 로그인</h1>
          <p className="text-sm text-gray-500 mt-1">
            (Sprint 7에서 NextAuth Credentials 통합 예정)
          </p>
        </header>

        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Demo 계정 (시드 데이터)
          </div>
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              onClick={() => quickLogin(u.email)}
              disabled={busy}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
            >
              <div className="font-semibold text-gray-900">{u.name}</div>
              <div className="text-xs text-gray-500">
                {u.email} · {u.role}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:underline">
            ← 메인으로
          </Link>
        </div>
      </div>
    </main>
  );
}
