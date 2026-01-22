import { CoursePageContent } from './CoursePageContent'
import type { Metadata } from 'next'

interface CoursePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  return {
    title: 'Course Detail | WKU Software Crew',
    description: 'View course details and curriculum to start learning',
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  return <CoursePageContent courseId={params.id} />
}
