import { useAuth } from '@hooks/useAuth.hook'
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.tsx'

export const App: React.FC = () => {
  useAuth()

  return <RouterProvider router={router} />
}
