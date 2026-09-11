import { ZodError } from 'zod'
import { AppError } from '../utils/errors'
import {
  financialCreateSchema,
  financialUpdateSchema,
  financialIdParamSchema,
  financialQuerySchema,
} from '../../shared/schemas/financials'
import * as financialService from '../services/financials'

function parseOrThrow<T>(schema: { parse: (v: unknown) => T }, data: unknown, label: string): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      const msg = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
      throw new AppError(`Validation failed (${label}): ${msg}`, 400)
    }
    throw new AppError(`Schema error (${label}): ${error instanceof Error ? error.message : String(error)}`, 400)
  }
}

export async function CreateFinancialController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  body: unknown
) {
  try {
    const parsed = parseOrThrow(financialCreateSchema, body, 'create financial')
    try {
      return await financialService.createFinancialService(db, user.sub, parsed)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller CreateFinancialController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function ListFinancialsController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  query: unknown
) {
  try {
    const parsed = parseOrThrow(financialQuerySchema, query, 'list financials query')
    try {
      return await financialService.listFinancialsService(db, user.sub, parsed)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller ListFinancialsController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function GetFinancialController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  params: unknown
) {
  try {
    const parsed = parseOrThrow(financialIdParamSchema, params, 'get financial params')
    try {
      return await financialService.getFinancialService(db, user.sub, parsed.id)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller GetFinancialController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function UpdateFinancialController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  params: unknown,
  body: unknown
) {
  try {
    const parsedParams = parseOrThrow(financialIdParamSchema, params, 'update financial params')
    const parsedBody = parseOrThrow(financialUpdateSchema, body, 'update financial body')
    try {
      return await financialService.updateFinancialService(db, user.sub, parsedParams.id, parsedBody)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller UpdateFinancialController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function DeleteFinancialController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  params: unknown
) {
  try {
    const parsed = parseOrThrow(financialIdParamSchema, params, 'delete financial params')
    try {
      return await financialService.deleteFinancialService(db, user.sub, parsed.id)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller DeleteFinancialController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
