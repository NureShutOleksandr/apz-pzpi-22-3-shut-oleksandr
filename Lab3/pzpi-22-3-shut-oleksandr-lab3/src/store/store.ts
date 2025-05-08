import $api from '@api/api.config'
import { create } from 'zustand'
import type { User } from '~types/user.type'
import { logout as apiLogout } from '@api/auth/auth.api'
import { ToastSuccess } from '@utils/toast.config'
import { persist } from 'zustand/middleware'

type AuthStoreState = {
  isAuth: boolean
  user: User | null
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  setIsAuth: (auth: boolean) => void
  setUser: (auth: User | null) => void
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    set => ({
      isAuth: false,
      user: null,
      isLoading: false,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      login: async (credentials: { username: string; password: string }) => {
        const { data } = await $api.post('/auth/login', credentials)
        localStorage.setItem('accessToken', data.token.accessToken)
        const { data: user } = await $api.get<User>('/auth/auth-me')
        set({ isAuth: true, user: user })
      },
      register: async (credentials: { username: string; password: string }) => {
        const { data } = await $api.post('/auth/registration', credentials)
        localStorage.setItem('accessToken', data.token.accessToken)
        const { data: user } = await $api.get<User>('/auth/auth-me')
        set({ isAuth: true, user: user })
      },
      logout: async () => {
        await apiLogout()
        set({ isAuth: false, user: null })
        ToastSuccess('Logput success', { position: 'bottom-right' })
        localStorage.removeItem('accessToken')
      },
      setIsAuth: auth => set({ isAuth: auth }),
      setUser: user => set({ user }),
    }),
    { name: 'auth-storage' },
  ),
)
