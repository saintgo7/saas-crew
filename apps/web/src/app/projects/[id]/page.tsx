import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProjectDetailContent } from './ProjectDetailContent'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface PageProps {
  params: {
    id: string
  }
}

async function getProject(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      cache: 'no-store',
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
  const project = await getProject(params.id)

  if (!project) {
    return {
      title: 'Project Not Found | WKU Software Crew',
    }
  }

  return {
    title: `${project.name} | WKU Software Crew`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailContent project={project} />
}
