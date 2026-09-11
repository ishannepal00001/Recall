import { AppError } from './errors'
import type { FinancialRow } from '../types/financials'

export function generateFinancialId(): string {
  return crypto.randomUUID()
}

export function assertFinancialOwnership(row: FinancialRow | null, userId: string, id: string): FinancialRow {
  if (!row) throw new AppError(`Financial record ${id} not found`, 404)
  if (row.user_id !== userId) throw new AppError('Forbidden: not your financial record', 403)
  return row
}

export function toFinancialResponse(row: FinancialRow) {
  return {
    id: row.id,
    title: row.title,
    amount: row.amount,
    type: row.type,
    category: row.category,
    description: row.description,
    date: row.date,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export const ALLOWED_FINANCIAL_SORT_BY = ['created_at', 'updated_at', 'date', 'amount', 'title'] as const
export const ALLOWED_FINANCIAL_SORT_ORDER = ['asc', 'desc'] as const
