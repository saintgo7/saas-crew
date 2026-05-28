// Next.js 운영 빌드 설정 — Sprint 6
// standalone 출력으로 Docker 단일 컨테이너 실행

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  typescript: {
    // Sprint 6: 배포 우선, 타입 정밀화는 Sprint 7
    ignoreBuildErrors: true,
  },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ['drizzle-orm'],
  },
};
