import { Hono } from 'hono'
import type { CloudflareBindings } from '../../types/env'
import { isLoggedIn, type AuthVariables } from '../../middlewares/auth'
import { AppError } from '../../utils/errors'
import {
  CreateFinancialController,
  ListFinancialsController,
  GetFinancialController,
  UpdateFinancialController,
  DeleteFinancialController,
} from '../../controllers/financials'

const financials = new Hono<{ Bindings: CloudflareBindings; Variables: AuthVariables }>()

financials.use('/*', isLoggedIn)

financials.post('/', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch (error) {
    return c.json({ message: `Invalid JSON body: ${error instanceof Error ? error.message : String(error)}`, status: 400 }, 400 as any)
  }
  const user = c.get('user')
  try {
    const result = await CreateFinancialController(c.env.recall_db, user, body)
    return c.json(result as any, (result as any)?.status ?? 201 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

financials.get('/', async (c) => {
  const user = c.get('user')
  const query = c.req.query()
  try {
    const result = await ListFinancialsController(c.env.recall_db, user, query)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

financials.get('/:id', async (c) => {
  const user = c.get('user')
  const params = { id: c.req.param('id') }
  try {
    const result = await GetFinancialController(c.env.recall_db, user, params)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

financials.patch('/:id', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch (error) {
    return c.json({ message: `Invalid JSON body: ${error instanceof Error ? error.message : String(error)}`, status: 400 }, 400 as any)
  }
  const user = c.get('user')
  const params = { id: c.req.param('id') }
  try {
    const result = await UpdateFinancialController(c.env.recall_db, user, params, body)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

financials.put('/:id', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch (error) {
    return c.json({ message: `Invalid JSON body: ${error instanceof Error ? error.message : String(error)}`, status: 400 }, 400 as any)
  }
  const user = c.get('user')
  const params = { id: c.req.param('id') }
  try {
    const result = await UpdateFinancialController(c.env.recall_db, user, params, body)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

financials.delete('/:id', async (c) => {
  const user = c.get('user')
  const params = { id: c.req.param('id') }
  try {
    const result = await DeleteFinancialController(c.env.recall_db, user, params)
    return c.json(result as any, (result as any)?.status ?? 200 as any)
  } catch (error) {
    if (error instanceof AppError) return c.json({ message: error.message, status: error.status }, error.status as any)
    return c.json({ message: error instanceof Error ? error.message : 'Internal server error', status: 500 }, 500 as any)
  }
})

export default financials
