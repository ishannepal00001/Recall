import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './api'
import type { AuthUser } from '../stores/auth'

export type LoginPayload = {
  email: string
  password: string
}

export type ChangePasswordPayload = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

type LoginResponse = { message: string; status: number; data: AuthUser }
type GenericResponse = { message: string; status: number; data?: Record<string, unknown> }
type RefreshResponse = { message: string; status: number; data?: { email: string } }

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiFetch<LoginResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () =>
      apiFetch<GenericResponse>('/api/v1/auth/logout', {
        method: 'POST',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: () =>
      apiFetch<RefreshResponse>('/api/v1/auth/refresh', {
        method: 'POST',
      }),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      apiFetch<GenericResponse>('/api/v1/auth/changepassword', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  })
}
