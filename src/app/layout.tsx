// 항공사 객실 승무원 SaaS 루트 레이아웃 — Sprint 6 T3 + X3 (SessionProvider)
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';

export const metadata = {
  title: 'saas-crew - 항공사 객실 승무원 관리',
  description: '스케줄 + 자격 + 정산 통합 SaaS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
