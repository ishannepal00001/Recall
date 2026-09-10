import { loginUser, getUserById, updateUserPassword } from '../crud/auth'
import { AppError } from '../utils/errors'
import { compare, hash } from 'bcryptjs'
import { createAccessToken, createRefreshToken, verifyRefreshToken, verifyAccessToken } from '../utils/jwt'
import { sendPasswordChangedMail } from '../utils/mail'
import type { ServiceResult } from '../types/auth'

export async function loginUserService(
  db: D1Database,
  env: { JWT_SECRET: string; JWT_REFRESH_SECRET: string },
  email: string,
  password: string
): Promise<ServiceResult & { accessToken: string; refreshToken: string }> {
  try {
    const user = await loginUser(db, email)
    if (!user) throw new AppError('Invalid email or password', 401)

    let isValid: boolean
    try {
      isValid = await compare(password, user.password_hash)
    } catch (error) {
      throw new AppError(`Password verification failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
    if (!isValid) throw new AppError('Invalid email or password', 401)

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = await createAccessToken(payload, env.JWT_SECRET)
    const refreshToken = await createRefreshToken(payload, env.JWT_REFRESH_SECRET)

    return {
      status: 200,
      message: 'Login successful',
      data: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service loginUserService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function refreshTokenService(
  env: { JWT_SECRET: string; JWT_REFRESH_SECRET: string },
  refreshToken: string
): Promise<ServiceResult & { accessToken: string }> {
  try {
    if (!refreshToken) throw new AppError('Refresh token missing', 401)
    const payload = await verifyRefreshToken(refreshToken, env.JWT_REFRESH_SECRET)
    const newAccessToken = await createAccessToken(
      { sub: payload.sub, email: payload.email, role: payload.role },
      env.JWT_SECRET
    )
    return { status: 200, message: 'Token refreshed', accessToken: newAccessToken, data: { email: payload.email } }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service refreshTokenService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function logoutService(): Promise<ServiceResult> {
  try {
    return { status: 200, message: 'Logged out successfully' }
  } catch (error) {
    throw new AppError(`Service logoutService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function changePasswordService(
  db: D1Database,
  env: { JWT_SECRET: string; RESEND_API_KEY: string; RESEND_FROM: string },
  accessToken: string,
  oldPassword: string,
  newPassword: string
): Promise<ServiceResult> {
  try {
    if (!accessToken) throw new AppError('Access token missing', 401)
    const payload = await verifyAccessToken(accessToken, env.JWT_SECRET)

    const user = await getUserById(db, payload.sub)
    if (!user) throw new AppError('User not found', 404)

    let isValid: boolean
    try {
      isValid = await compare(oldPassword, user.password_hash)
    } catch (error) {
      throw new AppError(`Password verification failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
    if (!isValid) throw new AppError('Old password is incorrect', 401)

    let newHash: string
    try {
      newHash = await hash(newPassword, 12)
    } catch (error) {
      throw new AppError(`Password hashing failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }

    await updateUserPassword(db, user.id, newHash)

    try {
      await sendPasswordChangedMail(env, user.email)
    } catch (error) {
      // don't fail the request if mail fails, but log
      console.error('[changePassword] mail failed:', error)
    }

    return { status: 200, message: 'Password changed successfully' }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service changePasswordService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
