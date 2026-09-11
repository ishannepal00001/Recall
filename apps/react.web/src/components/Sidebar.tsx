import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Shirt, CheckSquare, Wallet, CalendarDays, Plus, PanelLeftClose, PanelLeftOpen, X, Bot } from 'lucide-react'

const navItems = [
  { label: 'Home', to: '/', icon: LayoutDashboard },
  { label: 'AI', to: '/ai', icon: Bot },
  { label: 'Plans', to: '/plans', icon: ClipboardList },
  { label: 'Wardrobe', to: '/wardrobe', icon: Shirt },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Financials', to: '/financials', icon: Wallet },
  { label: 'Events', to: '/events', icon: CalendarDays },
]

type Props = {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: Props) {
  const widthClass = collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'

  const sidebarContent = (
    <>
      {/* Logo + toggle */}
      <div className={`flex items-center gap-3 px-2 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
        <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
          R
        </div>
        {!collapsed && (
          <>
            <span className="text-white font-semibold tracking-tight">Recall</span>
            <span className="ml-auto w-2 h-2 rounded-sm bg-secondary shadow-[0_0_8px_#2ED47A] hidden lg:block" title="online" />
          </>
        )}
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className={`hidden lg:flex ml-auto w-8 h-8 rounded-sm bg-white/10 hover:bg-white/15 border border-white/10 items-center justify-center text-white/70 hover:text-white transition-colors ${collapsed ? 'lg:ml-0' : ''}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        {/* Mobile close */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden ml-auto w-8 h-8 rounded-sm bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/70"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Add button */}
      <button className={`w-full bg-primary hover:bg-[#6b4ee6] text-white rounded-sm py-2.5 font-medium flex items-center justify-center gap-2 transition-colors ${collapsed ? 'lg:px-0 lg:aspect-square lg:rounded-sm lg:w-10 lg:h-10 lg:mx-auto' : ''}`}>
        <Plus size={16} /> {!collapsed && <span>New</span>}
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
              }
            >
              <span className="w-7 h-7 rounded-sm flex items-center justify-center bg-white/10 shrink-0">
                <Icon size={16} />
              </span>
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Status card */}
      {!collapsed ? (
        <div className="mt-auto rounded-md bg-white/[0.06] border border-white/10 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-secondary" />
            <span className="text-xs font-medium px-2 py-1 rounded-sm bg-secondary text-background">According to plan</span>
          </div>
          <p className="text-xs text-white/60">Progress</p>
          <div className="h-2 rounded-sm bg-white/10 overflow-hidden flex">
            <div className="h-full bg-secondary" style={{ width: '68%' }} />
            <div className="h-full bg-teal" style={{ width: '22%' }} />
          </div>
          <p className="text-xs text-white/50">68% completed • 22% in review</p>
        </div>
      ) : (
        <div className="mt-auto hidden lg:flex flex-col items-center gap-2 py-3 rounded-md bg-white/[0.06] border border-white/10">
          <span className="w-2 h-2 rounded-sm bg-secondary" />
          <div className="w-10 h-1.5 rounded-sm bg-white/10 overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: '68%' }} />
          </div>
        </div>
      )}

      {!collapsed && <p className="text-[11px] text-white/30 px-2">© 2026 Recall</p>}
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex ${widthClass} min-h-screen bg-sidebar border-r border-white/10 flex-col p-4 gap-6 shrink-0 sticky top-0 h-screen transition-all duration-300 ease-in-out`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 transition ${mobileOpen ? 'visible' : 'invisible'}`} aria-hidden={!mobileOpen}>
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onCloseMobile}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-sidebar border-r border-white/10 flex flex-col p-4 gap-6 overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  )
}
