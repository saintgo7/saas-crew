'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

/**
 * Performance Optimized Query Client Configuration
 *
 * Caching Strategy:
 * - staleTime: 5 minutes - data is considered fresh, no refetch during this window
 * - gcTime (cacheTime): 30 minutes - keeps data in cache for instant display
 * - refetchOnWindowFocus: false - prevents unnecessary refetches
 * - retry: 2 - balanced retry count for failed requests
 * - refetchOnMount: false when fresh - prevents duplicate fetches
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
            gcTime: 30 * 60 * 1000, // 30 minutes - keep cache longer for navigation
            refetchOnWindowFocus: false,
            refetchOnMount: 'always', // Ensures fresh data on mount, but uses cache while fetching
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
