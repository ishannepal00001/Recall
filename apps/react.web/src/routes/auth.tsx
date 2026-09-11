import { Navigate, useLocation } from 'react-router-dom'
import AuthPage from '../pages/Auth'
import { useAuthFacade } from '../facade/auth'

export default function AuthRoute() {
  const { isAuthenticated } = useAuthFacade()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

  // Use auth facade: if already authenticated, redirect away from login
  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  // Not authenticated -> stay on login page (AuthPage)
  // If this component was used as a guard for protected routes, unauthenticated
  // users would be redirected via <RequireAuth> to /auth (login)
  return <AuthPage />
}
