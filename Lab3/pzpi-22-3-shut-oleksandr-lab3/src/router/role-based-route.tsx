import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/store'
import { ROUTES } from './router.enum'

interface RoleBasedRouteProps {
  children: React.ReactNode
  requiredRole: string
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, requiredRole }) => {
  const isAuth = useAuthStore(state => state.isAuth)
  const user = useAuthStore(state => state.user)

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (user?.roles && !user.roles.some(el => el.value === requiredRole)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}
