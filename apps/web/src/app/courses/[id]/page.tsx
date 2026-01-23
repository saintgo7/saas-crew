export const runtime = 'edge';

import { CoursePageContent } from './CoursePageContent'
import type { Metadata } from 'next'

interface CoursePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: 'Course Detail | WKU Software Crew',
    description: 'View course details and curriculum to start learning',
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params
  return <CoursePageContent courseId={id} />
}
