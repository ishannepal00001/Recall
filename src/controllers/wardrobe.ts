import { ZodError } from 'zod'
import { AppError } from '../utils/errors'
import {
  wardrobeCreateSchema,
  wardrobeUpdateSchema,
  wardrobeIdParamSchema,
  wardrobeQuerySchema,
} from '../../shared/schemas/wardrobe'
import * as wardrobeService from '../services/wardrobe'
import type { ImageKitEnv } from '../utils/imagekit'

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

export async function CreateWardrobeController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  body: unknown,
  env: ImageKitEnv,
) {
  try {
    const parsed = parseOrThrow(wardrobeCreateSchema, body, 'create wardrobe')
    try {
      return await wardrobeService.createWardrobeService(db, user.sub, parsed, env)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller CreateWardrobeController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function ListWardrobeController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  query: unknown,
) {
  try {
    const parsed = parseOrThrow(wardrobeQuerySchema, query, 'list wardrobe query')
    try {
      return await wardrobeService.listWardrobeService(db, user.sub, parsed)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller ListWardrobeController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function GetWardrobeController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  params: unknown,
) {
  try {
    const parsed = parseOrThrow(wardrobeIdParamSchema, params, 'get wardrobe params')
    try {
      return await wardrobeService.getWardrobeService(db, user.sub, parsed.id)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller GetWardrobeController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function UpdateWardrobeController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  params: unknown,
  body: unknown,
  env: ImageKitEnv,
) {
  try {
    const parsedParams = parseOrThrow(wardrobeIdParamSchema, params, 'update wardrobe params')
    const parsedBody = parseOrThrow(wardrobeUpdateSchema, body, 'update wardrobe body')
    try {
      return await wardrobeService.updateWardrobeService(db, user.sub, parsedParams.id, parsedBody, env)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller UpdateWardrobeController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function DeleteWardrobeController(
  db: D1Database,
  user: { sub: string; email: string; role: string },
  params: unknown,
  env: ImageKitEnv,
) {
  try {
    const parsed = parseOrThrow(wardrobeIdParamSchema, params, 'delete wardrobe params')
    try {
      return await wardrobeService.deleteWardrobeService(db, user.sub, parsed.id, env)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(`Service call failed: ${error instanceof Error ? error.message : String(error)}`, 500)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Controller DeleteWardrobeController failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}
