import { Hono } from 'hono'

const app = new Hono()
app.get('/health', (c) => {
  return c.json({ status: 'Recall is running sucessfully!' })
})

export default app
