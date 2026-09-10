import { createBrowserRouter } from 'react-router-dom'
import HomeRoute from './home'
import PlansRoute from './plans'
import WardrobeRoute from './wardrobe'
import TasksRoute from './tasks'
import FinancialsRoute from './financials'
import EventsRoute from './events'
import NotFoundRoute from './notfound'

export const router = createBrowserRouter([
  { path: '/', element: <HomeRoute /> },
  { path: '/plans', element: <PlansRoute /> },
  { path: '/wardrobe', element: <WardrobeRoute /> },
  { path: '/tasks', element: <TasksRoute /> },
  { path: '/financials', element: <FinancialsRoute /> },
  { path: '/events', element: <EventsRoute /> },
  { path: '*', element: <NotFoundRoute /> },
])
