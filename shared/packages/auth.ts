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

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8).max(128),
    newPassword: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'New password and confirmation do not match',
    path: ['confirmPassword'],
  })
  .refine((d) => d.oldPassword !== d.newPassword, {
    message: 'New password must be different from old password',
    path: ['newPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
