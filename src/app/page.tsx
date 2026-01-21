import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight">
          WKU Software Crew
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          원광대학교 소프트웨어 크루 - 학생 주도 소프트웨어 교육 및 창업 플랫폼
        </p>

        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/courses">코스 둘러보기</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/register">시작하기</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">단계별 학습</h3>
            <p className="text-muted-foreground">
              Junior → Senior → Master 체계적인 성장 경로
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">실전 프로젝트</h3>
            <p className="text-muted-foreground">
              실제 배포 가능한 서비스 개발 경험
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">커뮤니티</h3>
            <p className="text-muted-foreground">
              동료 학습자 및 멘토와의 네트워킹
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
