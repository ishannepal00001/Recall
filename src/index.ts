import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from './api/v1/auth'
import wardrobe from './api/v1/wardrobe'
import type { CloudflareBindings } from './types/env'

const app = new Hono<{ Bindings: CloudflareBindings }>()

// CORS for local dev (Vite on 5173) + production
app.use(
  '*',
  cors({
    origin: (origin) => {
      // allow localhost dev origins and same-origin production
      if (!origin) return origin
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) return origin
      return origin
    },
    allowHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 86400,
  }),
)

app.get('/health', (c) => {
  return c.json({ status: 'Recall is running sucessfully!' })
})

app.route('/api/v1/auth', auth)
app.route('/api/v1/wardrobe', wardrobe)
app.route('/api/v1/wardobe', wardrobe)

export default app
