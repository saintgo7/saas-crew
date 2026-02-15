export const runtime = 'edge';

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProjectDetailContent } from './ProjectDetailContent'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Performance: Revalidate every 60 seconds (ISR)
export const revalidate = 60

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function getProject(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      next: { revalidate: 60 }, // ISR with 60 second revalidation
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch project')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    return {
      title: 'Project Not Found | CrewSpace',
    }
  }

  return {
    title: `${project.name} | CrewSpace`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailContent project={project} />
}
