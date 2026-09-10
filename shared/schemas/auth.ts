import { z } from 'zod'

/**
 * Login schema - no signup.
 * Only existing users (seeded) can log in.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Optional: role enum for validation elsewhere
 */
export const userRoleSchema = z.enum(['admin', 'user'])
export type UserRole = z.infer<typeof userRoleSchema>
