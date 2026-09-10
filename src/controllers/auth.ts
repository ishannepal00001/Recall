import { loginSchema, changePasswordSchema } from '../../shared/schemas/auth'
import { loginUserService, refreshTokenService, logoutService, changePasswordService } from '../services/auth'
import { AppError } from '../utils/errors'
import type { ServiceResult } from '../types/auth'
import { ZodError } from 'zod'

export async function UserLoginController(
  db: D1Database,
  env: { JWT_SECRET: string; JWT_REFRESH_SECRET: string },
  body: unknown
): Promise<ServiceResult & { accessToken: string; refreshToken: string }> {
  try {
    let parsed: { email: string; password: string }
    try {
      parsed = loginSchema.parse(body)
    } catch (error) {
      if (error instanceof ZodError) {
        const msg = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
        throw new AppError(`Validation failed: ${msg}`, 400)
      }
      throw new AppError(`Schema error: ${error instanceof Error ? error.message : String(error)}`, 400)
    }

    try {
      const result = await loginUserService(db, env, parsed.email, parsed.password)
      return result
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller UserLoginController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function RefreshTokenController(
  env: { JWT_SECRET: string; JWT_REFRESH_SECRET: string },
  refreshToken: string | undefined
): Promise<ServiceResult & { accessToken: string }> {
  try {
    if (!refreshToken) throw new AppError('Refresh token missing', 401)
    try {
      const result = await refreshTokenService(env, refreshToken)
      return result
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller RefreshTokenController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function LogoutController(): Promise<ServiceResult> {
  try {
    try {
      const result = await logoutService()
      return result
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller LogoutController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function ChangePasswordController(
  db: D1Database,
  env: { JWT_SECRET: string; RESEND_API_KEY: string; RESEND_FROM: string },
  accessToken: string | undefined,
  body: unknown,
  _user?: { sub: string; email: string; role: string }
): Promise<ServiceResult> {
  try {
    if (!accessToken) throw new AppError('Unauthorized: access token missing', 401)

    let parsed: { oldPassword: string; newPassword: string; confirmPassword: string }
    try {
      parsed = changePasswordSchema.parse(body)
    } catch (error) {
      if (error instanceof ZodError) {
        const msg = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
        throw new AppError(`Validation failed: ${msg}`, 400)
      }
      throw new AppError(`Schema error: ${error instanceof Error ? error.message : String(error)}`, 400)
    }

    try {
      const result = await changePasswordService(db, env, accessToken, parsed.oldPassword, parsed.newPassword)
      return result
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller ChangePasswordController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
