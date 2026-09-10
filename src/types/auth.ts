export type UserRole = 'admin' | 'user'

export type UserRow = {
  id: string
  email: string
  password_hash: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type LoginInput = {
  email: string
  password: string
}

export type ServiceResult = {
  status: number
  message: string
  data?: Record<string, unknown>
}
