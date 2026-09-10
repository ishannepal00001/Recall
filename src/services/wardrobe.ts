import { AppError } from '../utils/errors'
import { generateWardrobeId, assertWardrobeOwnership, toWardrobeResponse, resolveBorrowedByForUpdate } from '../utils/wardrobe'
import * as crud from '../crud/wardrobe'
import type { WardrobeCreateInput, WardrobeUpdateInput, WardrobeQueryInput } from '../../shared/schemas/wardrobe'
import type { ServiceResult } from '../types/auth'

// Inputs are zod-inferred — not hand-written types

export async function createWardrobeService(
  db: D1Database,
  userId: string,
  input: WardrobeCreateInput
): Promise<ServiceResult> {
  try {
    const id = generateWardrobeId()
    const now = new Date().toISOString()
    const row = await crud.insertWardrobeItem(db, {
      id,
      user_id: userId,
      image_url: input.image_url,
      title: input.title,
      type: input.type,
      description: input.description,
      status: input.status,
      store_location: input.store_location,
      borrowed_by: input.borrowed_by,
      created_at: now,
      updated_at: now,
    })
    return { status: 201, message: 'Wardrobe item created', data: toWardrobeResponse(row) as any }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service createWardrobeService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function listWardrobeService(
  db: D1Database,
  userId: string,
  query: WardrobeQueryInput
): Promise<ServiceResult> {
  try {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const offset = (page - 1) * limit
    const sortBy = query.sortBy ?? 'created_at'
    const sortOrder = query.sortOrder ?? 'desc'

    const filters = {
      type: query.type,
      status: query.status,
      store_location: query.store_location,
      search: query.search,
    }

    const [total, items] = await Promise.all([
      crud.countWardrobeItems(db, userId, filters),
      crud.listWardrobeItems(db, userId, filters, { limit, offset, sortBy, sortOrder }),
    ])

    return {
      status: 200,
      message: 'Wardrobe items fetched',
      data: {
        items: items.map(toWardrobeResponse),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      } as any,
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service listWardrobeService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function getWardrobeService(db: D1Database, userId: string, id: string): Promise<ServiceResult> {
  try {
    const row = await crud.getWardrobeById(db, id)
    assertWardrobeOwnership(row, userId, id)
    return { status: 200, message: 'Wardrobe item fetched', data: toWardrobeResponse(row!) as any }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service getWardrobeService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function updateWardrobeService(
  db: D1Database,
  userId: string,
  id: string,
  input: WardrobeUpdateInput
): Promise<ServiceResult> {
  try {
    const existing = await crud.getWardrobeById(db, id)
    assertWardrobeOwnership(existing, userId, id)

    // Resolve borrowed_by invariant using helper in utils/
    const borrowed_by = resolveBorrowedByForUpdate(existing!, input.status, input.borrowed_by)

    // Build patch — only include fields that were actually supplied
    const patch: Record<string, unknown> = {}
    if (input.image_url !== undefined) patch.image_url = input.image_url
    if (input.title !== undefined) patch.title = input.title
    if (input.type !== undefined) patch.type = input.type
    if (input.description !== undefined) patch.description = input.description
    if (input.status !== undefined) patch.status = input.status
    if (input.store_location !== undefined) patch.store_location = input.store_location
    // borrowed_by always resolved to enforce invariant (null when not borrowed)
    if (input.status !== undefined || input.borrowed_by !== undefined) {
      patch.borrowed_by = borrowed_by
    }

    if (Object.keys(patch).length === 0) {
      return { status: 200, message: 'No changes', data: toWardrobeResponse(existing!) as any }
    }

    const updated = await crud.updateWardrobeItem(db, id, patch as any)
    if (!updated) throw new AppError('Wardrobe item not found after update', 404)
    return { status: 200, message: 'Wardrobe item updated', data: toWardrobeResponse(updated) as any }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service updateWardrobeService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function deleteWardrobeService(db: D1Database, userId: string, id: string): Promise<ServiceResult> {
  try {
    const row = await crud.getWardrobeById(db, id)
    assertWardrobeOwnership(row, userId, id)
    await crud.deleteWardrobeItem(db, id)
    return { status: 200, message: 'Wardrobe item deleted' }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service deleteWardrobeService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
