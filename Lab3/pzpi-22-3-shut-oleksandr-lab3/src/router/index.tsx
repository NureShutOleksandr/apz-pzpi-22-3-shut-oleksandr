import { createBrowserRouter } from 'react-router-dom'

import { Home } from '@pages/home/home.page'
import { LoginPage } from '@pages/auth/login.page'

import { ROUTES } from './router.enum'
import { RegisterPage } from '@pages/auth/register.page'
import { PrivateRoute } from './private-route'
import { RoomsDashboard } from '@pages/dashboards/rooms-dashboard.page'
import { RoleBasedRoute } from './role-based-route'
import { DbAdminDashboard } from '@pages/dashboards/db-admin-dashboard.page'

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.ROOMS_DASHBOARD,
    element: (
      <PrivateRoute>
        <RoomsDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: ROUTES.DB_ADMIN_DASHBOARD,
    element: (
      <RoleBasedRoute requiredRole="ADMIN">
        <DbAdminDashboard />
      </RoleBasedRoute>
    ),
  },
])

export default router
