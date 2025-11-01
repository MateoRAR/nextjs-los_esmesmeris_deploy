'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserStore = {
  role: string
  id: string
  name: string
  isAuthenticated: boolean

  setRole: (role: string) => void
  setId: (id: string) => void
  setIsAuthenticated: (v: boolean) => void
  setName: (name: string) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      role: '',
      id: '',
      name: '',
      isAuthenticated: false,

      setRole: (role) => set({ role }),
      setId: (id) => set({ id }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setName: (name) => set({ name }),

      logout: () =>
        set({
          role: '',
          id: '',
          name: '',
          isAuthenticated: false,
        }),
    }),
    {
      name: 'user-storage', // clave en localStorage
    }
  )
)
