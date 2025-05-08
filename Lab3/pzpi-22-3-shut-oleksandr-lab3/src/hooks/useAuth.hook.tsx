import { useEffect } from 'react'
import { useAuthStore } from '@store/store'
import $api from '@api/api.config'
import type { User } from '~types/user.type'

export const useAuth = () => {
  const setUser = useAuthStore(state => state.setUser)
  const setIsAuth = useAuthStore(state => state.setIsAuth)

  useEffect(() => {
    const request = async () => {
      try {
        const { data: user } = await $api.get<User>('/auth/auth-me')
        setUser(user)
        setIsAuth(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuth(false)
        setUser(null)
      }
    }
    request()
  }, [setUser, setIsAuth])
}
