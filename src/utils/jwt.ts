import { sign, verify } from 'hono/jwt'
import { AppError } from './errors'

export type JwtPayload = {
  sub: string
  email: string
  role: string
  exp?: number
  iat?: number
}

export async function createAccessToken(payload: Omit<JwtPayload, 'exp' | 'iat'>, secret: string) {
  const now = Math.floor(Date.now() / 1000)
  return sign({ ...payload, iat: now, exp: now + 15 * 60 }, secret) // 15 min
}

export async function createRefreshToken(payload: Omit<JwtPayload, 'exp' | 'iat'>, secret: string) {
  const now = Math.floor(Date.now() / 1000)
  return sign({ ...payload, iat: now, exp: now + 7 * 24 * 60 * 60 }, secret) // 7 days
}

export async function verifyAccessToken(token: string, secret: string): Promise<JwtPayload> {
  try {
    const payload = (await verify(token, secret, 'HS256')) as JwtPayload
    return payload
  } catch (error) {
    throw new AppError(`Invalid or expired access token: ${error instanceof Error ? error.message : String(error)}`, 401)
  }
}

export async function verifyRefreshToken(token: string, secret: string): Promise<JwtPayload> {
  try {
    const payload = (await verify(token, secret, 'HS256')) as JwtPayload
    return payload
  } catch (error) {
    throw new AppError(`Invalid or expired refresh token: ${error instanceof Error ? error.message : String(error)}`, 401)
  }
}
