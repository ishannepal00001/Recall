import { AppError } from '../utils/errors'
import { generateFinancialId, assertFinancialOwnership, toFinancialResponse } from '../utils/financials'
import * as crud from '../crud/financials'
import type { FinancialCreateInput, FinancialUpdateInput, FinancialQueryInput } from '../../shared/schemas/financials'
import type { ServiceResult } from '../types/auth'

export async function createFinancialService(
  db: D1Database,
  userId: string,
  input: FinancialCreateInput
): Promise<ServiceResult> {
  try {
    const id = generateFinancialId()
    const now = new Date().toISOString()

    const row = await crud.insertFinancial(db, {
      id,
      user_id: userId,
      title: input.title,
      amount: input.amount,
      type: input.type,
      category: input.category,
      description: input.description ?? null,
      date: new Date(input.date).toISOString(),
      created_at: now,
      updated_at: now,
    })
    return { status: 201, message: 'Financial record created', data: toFinancialResponse(row) as any }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service createFinancialService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function listFinancialsService(
  db: D1Database,
  userId: string,
  query: FinancialQueryInput
): Promise<ServiceResult> {
  try {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const offset = (page - 1) * limit
    const sortBy = query.sortBy ?? 'date'
    const sortOrder = query.sortOrder ?? 'desc'

    const filters = {
      type: query.type,
      category: query.category,
      search: query.search,
      date_from: query.date_from ? new Date(query.date_from).toISOString() : undefined,
      date_to: query.date_to ? new Date(query.date_to).toISOString() : undefined,
      min_amount: query.min_amount,
      max_amount: query.max_amount,
    }

    const [total, items] = await Promise.all([
      crud.countFinancials(db, userId, filters),
      crud.listFinancials(db, userId, filters, { limit, offset, sortBy, sortOrder }),
    ])

    return {
      status: 200,
      message: 'Financial records fetched',
      data: {
        items: items.map(toFinancialResponse),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      } as any,
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service listFinancialsService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function getFinancialService(db: D1Database, userId: string, id: string): Promise<ServiceResult> {
  try {
    const row = await crud.getFinancialById(db, id)
    assertFinancialOwnership(row, userId, id)
    return { status: 200, message: 'Financial record fetched', data: toFinancialResponse(row!) as any }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service getFinancialService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function updateFinancialService(
  db: D1Database,
  userId: string,
  id: string,
  input: FinancialUpdateInput
): Promise<ServiceResult> {
  try {
    const existing = await crud.getFinancialById(db, id)
    assertFinancialOwnership(existing, userId, id)

    const patch: Record<string, unknown> = {}
    if (input.title !== undefined) patch.title = input.title
    if (input.amount !== undefined) patch.amount = input.amount
    if (input.type !== undefined) patch.type = input.type
    if (input.category !== undefined) patch.category = input.category
    if (input.description !== undefined) patch.description = input.description
    if (input.date !== undefined) patch.date = new Date(input.date).toISOString()

    if (Object.keys(patch).length === 0) {
      return { status: 200, message: 'No changes', data: toFinancialResponse(existing!) as any }
    }

    const updated = await crud.updateFinancial(db, id, patch as any)
    if (!updated) throw new AppError('Financial record not found after update', 404)
    return { status: 200, message: 'Financial record updated', data: toFinancialResponse(updated) as any }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service updateFinancialService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function deleteFinancialService(db: D1Database, userId: string, id: string): Promise<ServiceResult> {
  try {
    const row = await crud.getFinancialById(db, id)
    assertFinancialOwnership(row, userId, id)
    await crud.deleteFinancial(db, id)
    return { status: 200, message: 'Financial record deleted' }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Service deleteFinancialService failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
