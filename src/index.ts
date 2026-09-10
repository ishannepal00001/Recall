import { Hono } from 'hono'
import auth from './api/v1/auth'
import wardrobe from './api/v1/wardrobe'
import type { CloudflareBindings } from './types/env'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/health', (c) => {
  return c.json({ status: 'Recall is running sucessfully!' })
})

app.route('/api/v1/auth', auth)
app.route('/api/v1/wardrobe', wardrobe)
app.route('/api/v1/wardobe', wardrobe)

export default app
