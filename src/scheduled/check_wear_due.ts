import type { CloudflareBindings } from '../types/env'

/**
 * Cron: check_wear_due
 * Runs daily at midnight (0 0 * * *).
 * Finds wardrobe items where status is `in_use` and they have been in that
 * state for >= 3 days, then transitions them to `needs_wash`.
 *
 * - Today = UTC now (SQLite `datetime('now')`)
 * - Date put to in_use = `in_use_since` column (set when status -> in_use).
 *   For legacy rows where in_use_since IS NULL, falls back to updated_at.
 */
export async function check_wear_due(env: CloudflareBindings): Promise<{ checked: number; updated: number }> {
  const db = env.recall_db

  // Count matching before update for logging
  const countRow = await db
    .prepare(
      `SELECT COUNT(*) as cnt FROM wardrobe_items
       WHERE status = 'in_use'
         AND COALESCE(in_use_since, updated_at) <= datetime('now', '-3 days')`
    )
    .first<{ cnt: number }>()
  const checked = countRow?.cnt ?? 0

  if (checked === 0) {
    console.log('[check_wear_due] no overdue in_use items')
    return { checked: 0, updated: 0 }
  }

  const result = await db
    .prepare(
      `UPDATE wardrobe_items
       SET status = 'needs_wash',
           in_use_since = NULL
       WHERE status = 'in_use'
         AND COALESCE(in_use_since, updated_at) <= datetime('now', '-3 days')`
    )
    .run()

  const updated = result.meta.changes ?? 0
  console.log(`[check_wear_due] transitioned ${updated}/${checked} items from in_use -> needs_wash`)

  return { checked, updated }
}
