import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('recall:sidebar-collapsed') === '1'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('recall:sidebar-collapsed', collapsed ? '1' : '0')
    } catch { /* ignore */ }
  }, [collapsed])

  // close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // lock body when mobile drawer open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-3 bg-background/80 backdrop-blur border-b border-white/10 lg:border-white/5">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          {/* Desktop collapsed trigger when hidden - also visible as secondary toggle */}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="hidden lg:flex w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 items-center justify-center text-white/70 hover:text-white transition-colors shrink-0"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <Menu size={18} />
            </button>
          )}
          <div className="flex-1 min-w-0 lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">R</div>
            <span className="text-white font-semibold text-sm">Recall</span>
          </div>
          <div className="hidden lg:block flex-1" />
        </header>

        <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
