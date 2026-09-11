import { useAuthStore } from '../stores/auth'
import { useLogin, useLogout, useRefreshToken, useChangePassword } from '../hooks/useAuth'
import type { LoginPayload } from '../hooks/useAuth'

export function useAuthFacade() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore()

  const login = useLogin()
  const logout = useLogout()
  const refresh = useRefreshToken()
  const changePassword = useChangePassword()

  const loginAsync = async (payload: LoginPayload) => {
    const data = await login.mutateAsync(payload)
    if (data.data) setUser(data.data)
    return data
  }

  const logoutAsync = async () => {
    const data = await logout.mutateAsync()
    clearAuth()
    return data
  }

  return {
    user,
    isAuthenticated,
    isAuthReady: true,
    setUser,
    clearAuth,
    login,
    logout,
    refresh,
    changePassword,
    loginAsync,
    logoutAsync,
    isLoggingIn: login.isPending,
    isLoggingOut: logout.isPending,
    isRefreshing: refresh.isPending,
    isChangingPassword: changePassword.isPending,
  }
}
