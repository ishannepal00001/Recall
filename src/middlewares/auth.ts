import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verifyAccessToken, verifyRefreshToken, type JwtPayload } from '../utils/jwt'
import type { CloudflareBindings } from '../types/env'

export type AuthVariables = {
  user: JwtPayload
}

export async function isLoggedIn(
  c: Context<{ Bindings: CloudflareBindings; Variables: AuthVariables }>,
  next: Next
) {
  const token =
    getCookie(c, 'access_token') ?? c.req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return c.json({ message: 'Unauthorized: access token missing', status: 401 }, 401 as any)
  }

  try {
    const payload = await verifyAccessToken(token, c.env.JWT_SECRET)
    c.set('user', payload)
    await next()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    const status = (error as any)?.status ?? 401
    return c.json({ message, status }, status as any)
  }
}

// For /refresh: verifies refresh_token (cookie or header) with JWT_REFRESH_SECRET
export async function isRefreshLoggedIn(
  c: Context<{ Bindings: CloudflareBindings; Variables: AuthVariables }>,
  next: Next
) {
  const token = getCookie(c, 'refresh_token') ?? c.req.header('X-Refresh-Token') ?? c.req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return c.json({ message: 'Unauthorized: refresh token missing', status: 401 }, 401 as any)
  }

  try {
    const payload = await verifyRefreshToken(token, c.env.JWT_REFRESH_SECRET)
    c.set('user', payload)
    await next()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    const status = (error as any)?.status ?? 401
    return c.json({ message, status }, status as any)
  }
}
