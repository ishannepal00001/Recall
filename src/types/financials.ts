export type FinancialRow = {
  id: string
  user_id: string
  title: string
  amount: number
  type: string
  category: string
  description: string | null
  date: string
  created_at: string
  updated_at: string
}

export type FinancialListResult = {
  items: FinancialRow[]
  total: number
  page: number
  limit: number
}
