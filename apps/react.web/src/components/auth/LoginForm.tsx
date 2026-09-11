import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

type LoginFormProps = {
  onLogin: (payload: { email: string; password: string }) => Promise<unknown>
  isPending?: boolean
}

export function LoginForm({ onLogin, isPending }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onLogin({ email: email.trim().toLowerCase(), password })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-white/70">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-sm bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium text-white/70">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-sm bg-white/5 border border-white/10 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={!!isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#6b4ee6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-sm py-2.5 text-sm font-medium transition-colors"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
