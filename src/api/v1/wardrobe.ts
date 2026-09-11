import { Hono } from 'hono'
import type { CloudflareBindings } from '../../types/env'
import { isLoggedIn, type AuthVariables } from '../../middlewares/auth'
import { AppError } from '../../utils/errors'
import {
  CreateWardrobeController,
  ListWardrobeController,
  GetWardrobeController,
  UpdateWardrobeController,
  DeleteWardrobeController,
} from '../../controllers/wardrobe'

const wardrobe = new Hono<{ Bindings: CloudflareBindings; Variables: AuthVariables }>()

// All wardrobe routes require authentication
wardrobe.use('/*', isLoggedIn)

/**
 * Parse request body supporting both JSON and multipart/form-data.
 * For multipart, extracts File for `image` and string fields.
 */
async function parseWardrobeBody(c: any): Promise<unknown> {
  const contentType = c.req.header('content-type') ?? ''
  if (contentType.includes('multipart/form-data')) {
    const form = await c.req.formData()
    const obj: Record<string, unknown> = {}
    // string fields
    for (const key of ['title', 'type', 'description', 'status', 'store_location', 'storeLocation', 'borrowed_by', 'borrowedBy']) {
      const v = form.get(key)
      if (v !== null && typeof v === 'string' && v !== '') obj[key] = v
      else if (v === '') obj[key] = null
    }
    const image = form.get('image')
    if (image instanceof File && image.size > 0) {
      obj.image = image
    } else if (image instanceof File && image.size === 0) {
      // empty file -> ignore
    }
    return obj
  }
  // fallback JSON
  try {
    return await c.req.json()
  } catch (error) {
    throw new AppError(`Invalid JSON body: ${error instanceof Error ? error.message : String(error)}`, 400)
  }
}

// POST /api/v1/wardrobe — create item
wardrobe.post('/', async (c) => {
  let body: unknown
  try {
    body = await parseWardrobeBody(c)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: `Invalid body: ${error instanceof Error ? error.message : String(error)}`, status: 400 }, 400 as any)
  }
  const user = c.get('user')
  try {
    const result = await CreateWardrobeController(c.env.recall_db, user, body, c.env)
    return c.json(result as any, (result as any)?.status ?? 201 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

// GET /api/v1/wardrobe — list items (with query filters)
wardrobe.get('/', async (c) => {
  const user = c.get('user')
  const query = c.req.query()
  try {
    const result = await ListWardrobeController(c.env.recall_db, user, query)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

// GET /api/v1/wardrobe/:id — get single item
wardrobe.get('/:id', async (c) => {
  const user = c.get('user')
  const params = { id: c.req.param('id') }
  try {
    const result = await GetWardrobeController(c.env.recall_db, user, params)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

// PATCH /api/v1/wardrobe/:id — update item
wardrobe.patch('/:id', async (c) => {
  let body: unknown
  try {
    body = await parseWardrobeBody(c)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: `Invalid body: ${error instanceof Error ? error.message : String(error)}`, status: 400 }, 400 as any)
  }
  const user = c.get('user')
  const params = { id: c.req.param('id') }
  try {
    const result = await UpdateWardrobeController(c.env.recall_db, user, params, body, c.env)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

// PUT /api/v1/wardrobe/:id — alias to PATCH for full update
wardrobe.put('/:id', async (c) => {
  let body: unknown
  try {
    body = await parseWardrobeBody(c)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: `Invalid body: ${error instanceof Error ? error.message : String(error)}`, status: 400 }, 400 as any)
  }
  const user = c.get('user')
  const params = { id: c.req.param('id') }
  try {
    const result = await UpdateWardrobeController(c.env.recall_db, user, params, body, c.env)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

// DELETE /api/v1/wardrobe/:id — delete item (also deletes ImageKit file)
wardrobe.delete('/:id', async (c) => {
  const user = c.get('user')
  const params = { id: c.req.param('id') }
  try {
    const result = await DeleteWardrobeController(c.env.recall_db, user, params, c.env)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

export default wardrobe
