'use client';

// /login — NextAuth Credentials (Sprint 7 X3)
// Mock 제거, 실제 가입/로그인

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">로딩 중...</div>}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') || '/flights';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!res?.ok) throw new Error('이메일 또는 비밀번호 불일치');
      router.push(next);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const login = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!login?.ok) {
        setMode('login');
        return;
      }
      router.push(next);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <header className="mb-6 text-center">
          <div className="text-5xl mb-3">✈️</div>
          <h1 className="text-2xl font-bold text-gray-900">
            saas-crew {mode === 'login' ? '로그인' : '회원가입'}
          </h1>
        </header>

        <div className="flex border border-gray-200 rounded-lg mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-semibold ${
              mode === 'login' ? 'bg-blue-600 text-white rounded-lg' : 'text-gray-600'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-semibold ${
              mode === 'signup' ? 'bg-blue-600 text-white rounded-lg' : 'text-gray-600'
            }`}
          >
            회원가입
          </button>
        </div>

        <form
          onSubmit={mode === 'login' ? handleLogin : handleSignup}
          className="space-y-4"
        >
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold mb-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="김사무장"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              비밀번호 {mode === 'signup' && '(8자 이상)'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              minLength={mode === 'signup' ? 8 : 1}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !email || !password || (mode === 'signup' && !name)}
            className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
          >
            {busy
              ? '처리 중...'
              : mode === 'login'
              ? '로그인'
              : '가입하고 시작하기'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:underline">
            ← 메인으로
          </Link>
        </div>
      </div>
    </main>
  );
}
