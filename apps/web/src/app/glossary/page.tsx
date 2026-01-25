'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Search } from 'lucide-react'

export default function GlossaryPage() {
  const [content, setContent] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/glossary.md')
      .then(res => res.text())
      .then(text => {
        setContent(text)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Failed to load glossary:', err)
        setIsLoading(false)
      })
  }, [])

  const filteredContent = searchTerm
    ? content.split('\n').filter(line =>
        line.toLowerCase().includes(searchTerm.toLowerCase())
      ).join('\n')
    : content

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b pb-2">
            {line.replace('## ', '')}
          </h2>
        )
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {line.replace('# ', '')}
          </h1>
        )
      }

      // Bold text
      if (line.startsWith('**') && line.includes(':**')) {
        const parts = line.split(':**')
        return (
          <p key={index} className="mb-2">
            <strong className="text-blue-600 dark:text-blue-400">{parts[0].replace('**', '')}:</strong>
            <span className="text-gray-700 dark:text-gray-300">{parts[1]}</span>
          </p>
        )
      }

      // Tables
      if (line.startsWith('|')) {
        return (
          <div key={index} className="inline text-sm">
            {line}
          </div>
        )
      }

      // List items
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-gray-700 dark:text-gray-300">
            {line.replace('- ', '')}
          </li>
        )
      }

      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />
      }

      // Regular text
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 mb-2">
          {line}
        </p>
      )
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading glossary...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            개발 용어집
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          WKU Software Crew Development Glossary - 초급 개발자를 위한 필수 개발 용어 386개
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="용어 검색... (예: API, React, Database)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            검색 결과: &ldquo;{searchTerm}&rdquo;
          </p>
        )}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 prose prose-blue max-w-none">
        {renderMarkdown(filteredContent)}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">386</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Terms</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">11</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">177KB</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">File Size</div>
        </div>
      </div>
    </div>
  )
}
