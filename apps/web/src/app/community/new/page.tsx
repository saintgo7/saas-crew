import { NewPostPageContent } from './NewPostPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Write Question | CrewSpace',
  description: 'Write a question and get answers from the community',
}

export default function NewPostPage() {
  return <NewPostPageContent />
}
