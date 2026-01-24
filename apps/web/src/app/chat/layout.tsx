import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat - WKU Software Crew',
  description: 'Crew members chat and communicate with each other',
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {children}
    </div>
  )
}
