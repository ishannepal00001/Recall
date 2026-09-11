import { createBrowserRouter } from 'react-router-dom'
import HomeRoute from './home'
import PlansRoute from './plans'
import WardrobeRoute from './wardrobe'
import TasksRoute from './tasks'
import FinancialsRoute from './financials'
import EventsRoute from './events'
import AuthRoute from './auth'
import NotFoundRoute from './notfound'
import RequireAuth from './protected'

export const router = createBrowserRouter([
  { path: '/auth', element: <AuthRoute /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/', element: <HomeRoute /> },
      { path: '/plans', element: <PlansRoute /> },
      { path: '/wardrobe', element: <WardrobeRoute /> },
      { path: '/tasks', element: <TasksRoute /> },
      { path: '/financials', element: <FinancialsRoute /> },
      { path: '/events', element: <EventsRoute /> },
    ],
  },
  { path: '*', element: <NotFoundRoute /> },
])
