import { createBrowserRouter } from 'react-router-dom'

import { Home } from '@pages/home/home.page'

import { ROUTES } from './router.enum'

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
])

export default router
