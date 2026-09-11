import { AppError } from './errors'
import type { WardrobeRow } from '../types/wardrobe'

export function generateWardrobeId(): string {
  return crypto.randomUUID()
}

export function assertWardrobeOwnership(row: WardrobeRow | null, userId: string, id: string): WardrobeRow {
  if (!row) throw new AppError(`Wardrobe item ${id} not found`, 404)
  if (row.user_id !== userId) throw new AppError('Forbidden: not your wardrobe item', 403)
  return row
}

export function toWardrobeResponse(row: WardrobeRow) {
  return {
    id: row.id,
    image_url: row.image_url,
    title: row.title,
    type: row.type,
    description: row.description,
    status: row.status,
    store_location: row.store_location,
    borrowed_by: row.borrowed_by,
    in_use_since: row.in_use_since,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

/**
 * For updates: resolve borrowed_by invariant when status/borrowed_by partially supplied.
 * If final status is borrowed, borrowed_by must be non-null.
 * If final status is not borrowed, borrowed_by must be nulled.
 */
export function resolveBorrowedByForUpdate(existing: WardrobeRow, status?: string, borrowed_by?: string | null): string | null {
  const finalStatus = status ?? existing.status
  const finalBorrowedBy = borrowed_by !== undefined ? borrowed_by : existing.borrowed_by

  if (finalStatus === 'borrowed' && !finalBorrowedBy) {
    throw new AppError('borrowed_by is required when status is borrowed', 400)
  }
  if (finalStatus !== 'borrowed' && finalBorrowedBy) {
    throw new AppError('borrowed_by should only be set when status is borrowed', 400)
  }
  return finalStatus === 'borrowed' ? finalBorrowedBy : null
}

export const ALLOWED_SORT_BY = ['created_at', 'updated_at', 'title', 'type', 'status'] as const
export const ALLOWED_SORT_ORDER = ['asc', 'desc'] as const
