export const runtime = 'edge'

import { LearningPageContent } from './LearningPageContent'
import type { Metadata } from 'next'

interface LearnPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: LearnPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: 'Learning | CrewSpace',
    description: 'Continue learning your course',
  }
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { id } = await params
  return <LearningPageContent courseId={id} />
}
