import type { UserRow } from '../types/auth'
import { AppError } from '../utils/errors'

export async function loginUser(db: D1Database, email: string): Promise<UserRow | null> {
  try {
    const row = await db
      .prepare('SELECT id, email, password_hash, role, created_at, updated_at FROM users WHERE email = ? LIMIT 1')
      .bind(email)
      .first<UserRow>()
    return row ?? null
  } catch (error) {
    throw new AppError(`CRUD loginUser failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function getUserById(db: D1Database, id: string): Promise<UserRow | null> {
  try {
    const row = await db
      .prepare('SELECT id, email, password_hash, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1')
      .bind(id)
      .first<UserRow>()
    return row ?? null
  } catch (error) {
    throw new AppError(`CRUD getUserById failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function updateUserPassword(db: D1Database, id: string, passwordHash: string): Promise<void> {
  try {
    const result = await db
      .prepare("UPDATE users SET password_hash = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?")
      .bind(passwordHash, id)
      .run()
    if (result.meta.changes === 0) {
      throw new AppError('User not found for password update', 404)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`CRUD updateUserPassword failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
