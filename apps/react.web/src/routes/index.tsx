import { createBrowserRouter } from 'react-router-dom'
import HomeRoute from './home'
import NotFoundRoute from './notfound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRoute />,
  },
  {
    path: '*',
    element: <NotFoundRoute />,
  },
])
