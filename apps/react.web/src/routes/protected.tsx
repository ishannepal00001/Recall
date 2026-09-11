import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthFacade } from '../facade/auth'

/**
 * Auth facade guard for protected routes.
 * If user is not authenticated, redirect to login (/auth).
 * Preserves attempted location in state for post-login redirect.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuthFacade()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default RequireAuth
