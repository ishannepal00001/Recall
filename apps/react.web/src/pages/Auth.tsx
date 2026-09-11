import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldCheck, AlertCircle } from 'lucide-react'
import { LoginForm } from '../components/auth/LoginForm'
import { useAuthFacade } from '../facade/auth'

const toastBaseStyle: React.CSSProperties = {
  background: '#1E1F26',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.10)',
  backdropFilter: 'blur(12px)',
  borderRadius: '14px',
  padding: '12px 14px',
  fontSize: '13px',
  fontWeight: 500,
  boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05) inset',
}

function notifyError(message: string) {
  toast.error(message, {
    duration: 3800,
    icon: <AlertCircle size={18} className="text-red-400 shrink-0" />,
    style: { ...toastBaseStyle, borderLeft: '3px solid #ef4444' },
  })
}

function notifySuccess(message: string) {
  toast.success(message, {
    duration: 3000,
    icon: <ShieldCheck size={18} className="text-secondary shrink-0" />,
    style: { ...toastBaseStyle, borderLeft: '3px solid #2ED47A' },
  })
}

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'
  const { loginAsync, isLoggingIn, isAuthenticated } = useAuthFacade()

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  const handleLogin = async (payload: { email: string; password: string }) => {
    const trimmedEmail = payload.email.trim().toLowerCase()
    if (!trimmedEmail) {
      notifyError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      notifyError('Please enter a valid email address')
      return
    }
    if (!payload.password) {
      notifyError('Password is required')
      return
    }
    if (payload.password.length < 8) {
      notifyError('Password must be at least 8 characters')
      return
    }

    try {
      const data = await loginAsync({ email: trimmedEmail, password: payload.password })
      notifySuccess(data.message ?? 'Welcome back — login successful')
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed — please try again'
      notifyError(msg)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-white/60">Sign in to your Recall account</p>
        </div>

        <div className="rounded-md bg-white/[0.06] border border-white/10 p-6 sm:p-7 backdrop-blur">
          <LoginForm onLogin={handleLogin} isPending={isLoggingIn} />
        </div>

        <p className="text-center text-xs text-white/30">© 2026 Recall — Secure login</p>
      </div>
    </div>
  )
}
