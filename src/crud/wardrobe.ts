import { AppError } from '../utils/errors'
import type { WardrobeRow } from '../types/wardrobe'

export async function insertWardrobeItem(db: D1Database, row: WardrobeRow): Promise<WardrobeRow> {
  try {
    await db
      .prepare(
        `INSERT INTO wardrobe_items (id, user_id, image_url, image_file_id, title, type, description, status, store_location, borrowed_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        row.id,
        row.user_id,
        row.image_url,
        row.image_file_id,
        row.title,
        row.type,
        row.description,
        row.status,
        row.store_location,
        row.borrowed_by,
      )
      .run()
    return row
  } catch (error) {
    throw new AppError(`CRUD insertWardrobeItem failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function getWardrobeById(db: D1Database, id: string): Promise<WardrobeRow | null> {
  try {
    const row = await db.prepare(`SELECT * FROM wardrobe_items WHERE id = ? LIMIT 1`).bind(id).first<WardrobeRow>()
    return row ?? null
  } catch (error) {
    throw new AppError(`CRUD getWardrobeById failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function countWardrobeItems(
  db: D1Database,
  userId: string,
  filters: { type?: string; status?: string; store_location?: string; search?: string }
): Promise<number> {
  try {
    const conditions: string[] = ['user_id = ?']
    const params: unknown[] = [userId]
    if (filters.type) {
      conditions.push('type = ?')
      params.push(filters.type)
    }
    if (filters.status) {
      conditions.push('status = ?')
      params.push(filters.status)
    }
    if (filters.store_location) {
      conditions.push('store_location = ?')
      params.push(filters.store_location)
    }
    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)')
      params.push(`%${filters.search}%`, `%${filters.search}%`)
    }
    const sql = `SELECT COUNT(*) as total FROM wardrobe_items WHERE ${conditions.join(' AND ')}`
    const row = await db.prepare(sql).bind(...(params as any[])).first<{ total: number }>()
    return row?.total ?? 0
  } catch (error) {
    throw new AppError(`CRUD countWardrobeItems failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function listWardrobeItems(
  db: D1Database,
  userId: string,
  filters: { type?: string; status?: string; store_location?: string; search?: string },
  pagination: { limit: number; offset: number; sortBy: string; sortOrder: string }
): Promise<WardrobeRow[]> {
  try {
    const conditions: string[] = ['user_id = ?']
    const params: unknown[] = [userId]
    if (filters.type) {
      conditions.push('type = ?')
      params.push(filters.type)
    }
    if (filters.status) {
      conditions.push('status = ?')
      params.push(filters.status)
    }
    if (filters.store_location) {
      conditions.push('store_location = ?')
      params.push(filters.store_location)
    }
    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)')
      params.push(`%${filters.search}%`, `%${filters.search}%`)
    }
    const sortBy = ['created_at', 'updated_at', 'title', 'type', 'status'].includes(pagination.sortBy) ? pagination.sortBy : 'created_at'
    const sortOrder = pagination.sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'
    const sql = `SELECT * FROM wardrobe_items WHERE ${conditions.join(' AND ')} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`
    params.push(pagination.limit, pagination.offset)
    const result = await db.prepare(sql).bind(...(params as any[])).all<WardrobeRow>()
    return result.results ?? []
  } catch (error) {
    throw new AppError(`CRUD listWardrobeItems failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function updateWardrobeItem(
  db: D1Database,
  id: string,
  fields: Partial<Pick<WardrobeRow, 'image_url' | 'image_file_id' | 'title' | 'type' | 'description' | 'status' | 'store_location' | 'borrowed_by'>>
): Promise<WardrobeRow | null> {
  try {
    const keys = Object.keys(fields) as (keyof typeof fields)[]
    if (keys.length === 0) return getWardrobeById(db, id)
    const setClause = keys.map((k) => `${k} = ?`).join(', ')
    const values = keys.map((k) => fields[k])
    await db
      .prepare(`UPDATE wardrobe_items SET ${setClause} WHERE id = ?`)
      .bind(...(values as any[]), id)
      .run()
    return getWardrobeById(db, id)
  } catch (error) {
    throw new AppError(`CRUD updateWardrobeItem failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function deleteWardrobeItem(db: D1Database, id: string): Promise<void> {
  try {
    const result = await db.prepare(`DELETE FROM wardrobe_items WHERE id = ?`).bind(id).run()
    if (result.meta.changes === 0) throw new AppError('Wardrobe item not found', 404)
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`CRUD deleteWardrobeItem failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
