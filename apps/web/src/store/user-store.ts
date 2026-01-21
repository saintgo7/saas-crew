import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User } from '@/lib/api/types'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: 'user-storage',
      }
    )
  )
)
