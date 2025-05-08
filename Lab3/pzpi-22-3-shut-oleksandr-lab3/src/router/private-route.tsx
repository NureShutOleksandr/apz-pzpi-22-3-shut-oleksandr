import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/store'
import { ROUTES } from './router.enum'

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = useAuthStore(state => state.isAuth)

  return isAuth ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}
