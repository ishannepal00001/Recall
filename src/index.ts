import { Hono } from 'hono'
import auth from './api/v1/auth'
import type { CloudflareBindings } from './types/env'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/health', (c) => {
  return c.json({ status: 'Recall is running sucessfully!' })
})

app.route('/api/v1/auth', auth)

export default app
