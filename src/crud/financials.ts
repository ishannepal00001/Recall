import { AppError } from '../utils/errors'
import type { FinancialRow } from '../types/financials'

export async function insertFinancial(db: D1Database, row: FinancialRow): Promise<FinancialRow> {
  try {
    await db
      .prepare(
        `INSERT INTO financials (id, user_id, title, amount, type, category, description, date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(row.id, row.user_id, row.title, row.amount, row.type, row.category, row.description, row.date, row.created_at, row.updated_at)
      .run()
    return row
  } catch (error) {
    throw new AppError(`CRUD insertFinancial failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function getFinancialById(db: D1Database, id: string): Promise<FinancialRow | null> {
  try {
    const row = await db.prepare(`SELECT * FROM financials WHERE id = ? LIMIT 1`).bind(id).first<FinancialRow>()
    return row ?? null
  } catch (error) {
    throw new AppError(`CRUD getFinancialById failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function countFinancials(
  db: D1Database,
  userId: string,
  filters: { type?: string; category?: string; search?: string; date_from?: string; date_to?: string; min_amount?: number; max_amount?: number }
): Promise<number> {
  try {
    const conditions: string[] = ['user_id = ?']
    const params: unknown[] = [userId]
    if (filters.type) {
      conditions.push('type = ?')
      params.push(filters.type)
    }
    if (filters.category) {
      conditions.push('category = ?')
      params.push(filters.category)
    }
    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)')
      params.push(`%${filters.search}%`, `%${filters.search}%`)
    }
    if (filters.date_from) {
      conditions.push('date >= ?')
      params.push(filters.date_from)
    }
    if (filters.date_to) {
      conditions.push('date <= ?')
      params.push(filters.date_to)
    }
    if (filters.min_amount !== undefined) {
      conditions.push('amount >= ?')
      params.push(filters.min_amount)
    }
    if (filters.max_amount !== undefined) {
      conditions.push('amount <= ?')
      params.push(filters.max_amount)
    }
    const sql = `SELECT COUNT(*) as total FROM financials WHERE ${conditions.join(' AND ')}`
    const row = await db.prepare(sql).bind(...(params as any[])).first<{ total: number }>()
    return row?.total ?? 0
  } catch (error) {
    throw new AppError(`CRUD countFinancials failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function listFinancials(
  db: D1Database,
  userId: string,
  filters: { type?: string; category?: string; search?: string; date_from?: string; date_to?: string; min_amount?: number; max_amount?: number },
  pagination: { limit: number; offset: number; sortBy: string; sortOrder: string }
): Promise<FinancialRow[]> {
  try {
    const conditions: string[] = ['user_id = ?']
    const params: unknown[] = [userId]
    if (filters.type) {
      conditions.push('type = ?')
      params.push(filters.type)
    }
    if (filters.category) {
      conditions.push('category = ?')
      params.push(filters.category)
    }
    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)')
      params.push(`%${filters.search}%`, `%${filters.search}%`)
    }
    if (filters.date_from) {
      conditions.push('date >= ?')
      params.push(filters.date_from)
    }
    if (filters.date_to) {
      conditions.push('date <= ?')
      params.push(filters.date_to)
    }
    if (filters.min_amount !== undefined) {
      conditions.push('amount >= ?')
      params.push(filters.min_amount)
    }
    if (filters.max_amount !== undefined) {
      conditions.push('amount <= ?')
      params.push(filters.max_amount)
    }
    const sortBy = ['created_at', 'updated_at', 'date', 'amount', 'title'].includes(pagination.sortBy) ? pagination.sortBy : 'date'
    const sortOrder = pagination.sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'
    const sql = `SELECT * FROM financials WHERE ${conditions.join(' AND ')} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`
    params.push(pagination.limit, pagination.offset)
    const result = await db.prepare(sql).bind(...(params as any[])).all<FinancialRow>()
    return result.results ?? []
  } catch (error) {
    throw new AppError(`CRUD listFinancials failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function updateFinancial(
  db: D1Database,
  id: string,
  fields: Partial<Pick<FinancialRow, 'title' | 'amount' | 'type' | 'category' | 'description' | 'date'>>
): Promise<FinancialRow | null> {
  try {
    const keys = Object.keys(fields) as (keyof typeof fields)[]
    if (keys.length === 0) return getFinancialById(db, id)
    const setClause = keys.map((k) => `${k} = ?`).join(', ')
    const values = keys.map((k) => fields[k])
    await db
      .prepare(`UPDATE financials SET ${setClause} WHERE id = ?`)
      .bind(...(values as any[]), id)
      .run()
    return getFinancialById(db, id)
  } catch (error) {
    throw new AppError(`CRUD updateFinancial failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function deleteFinancial(db: D1Database, id: string): Promise<void> {
  try {
    const result = await db.prepare(`DELETE FROM financials WHERE id = ?`).bind(id).run()
    if (result.meta.changes === 0) throw new AppError('Financial record not found', 404)
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`CRUD deleteFinancial failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
