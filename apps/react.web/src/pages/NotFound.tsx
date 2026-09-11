import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="text-white/60">Page not found</p>
      <Link to="/" className="bg-primary text-white px-5 py-2.5 rounded-sm text-sm font-medium">
        Go home
      </Link>
    </div>
  )
}
