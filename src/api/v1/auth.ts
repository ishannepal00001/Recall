import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { UserLoginController, RefreshTokenController, LogoutController, ChangePasswordController } from '../../controllers/auth'
import { AppError } from '../../utils/errors'
import type { CloudflareBindings } from '../../types/env'
import { isLoggedIn, isRefreshLoggedIn, type AuthVariables } from '../../middlewares/auth'

const auth = new Hono<{ Bindings: CloudflareBindings; Variables: AuthVariables }>()

auth.post('/login', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch (error) {
    return c.json(
      { message: `Invalid JSON body: ${error instanceof Error ? error.message : String(error)}`, status: 400 },
      400 as any
    )
  }

  try {
    const result = await UserLoginController(c.env.recall_db, c.env, body)

    setCookie(c, 'access_token', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 15 * 60,
    })
    setCookie(c, 'refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return c.json({ message: result.message, status: result.status, data: result.data ?? null }, result.status as any)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, status: error.status }, error.status as any)
    }
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

auth.post('/refresh', isRefreshLoggedIn, async (c) => {
  const refreshToken = getCookie(c, 'refresh_token') ?? c.req.header('X-Refresh-Token') ?? c.req.header('Authorization')?.replace('Bearer ', '')
  // user is already verified by isRefreshLoggedIn, but keep controller validation for consistency
  try {
    const result = await RefreshTokenController(c.env, refreshToken)

    setCookie(c, 'access_token', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 15 * 60,
    })

    return c.json({ message: result.message, status: result.status, data: result.data ?? null }, result.status as any)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, status: error.status }, error.status as any)
    }
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

auth.post('/logout', async (c) => {
  try {
    const result = await LogoutController()

    deleteCookie(c, 'access_token', { path: '/' })
    deleteCookie(c, 'refresh_token', { path: '/' })

    return c.json({ message: result.message, status: result.status }, result.status as any)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, status: error.status }, error.status as any)
    }
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

auth.post('/changepassword', isLoggedIn, async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch (error) {
    return c.json(
      { message: `Invalid JSON body: ${error instanceof Error ? error.message : String(error)}`, status: 400 },
      400 as any
    )
  }

  const accessToken = getCookie(c, 'access_token') ?? c.req.header('Authorization')?.replace('Bearer ', '')
  const user = c.get('user') // payload set by isLoggedIn

  try {
    const result = await ChangePasswordController(c.env.recall_db, c.env, accessToken, body, user)
    return c.json({ message: result.message, status: result.status }, result.status as any)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ message: error.message, status: error.status }, error.status as any)
    }
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

export default auth
