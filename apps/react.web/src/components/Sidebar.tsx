import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Shirt, CheckSquare, Wallet, CalendarDays, Plus } from 'lucide-react'

const navItems = [
  { label: 'Home', to: '/', icon: LayoutDashboard },
  { label: 'Plans', to: '/plans', icon: ClipboardList },
  { label: 'Wardrobe', to: '/wardrobe', icon: Shirt },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Financials', to: '/financials', icon: Wallet },
  { label: 'Events', to: '/events', icon: CalendarDays },
]

export default function Sidebar() {
  return (
    <aside className="w-[260px] min-h-screen bg-sidebar border-r border-white/10 flex flex-col p-4 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
          R
        </div>
        <span className="text-white font-semibold tracking-tight">Recall</span>
        <span className="ml-auto w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#2ED47A]" title="online" />
      </div>

      {/* Add button */}
      <button className="w-full bg-primary hover:bg-[#6b4ee6] text-white rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 transition-colors">
        <Plus size={16} /> New
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10">
                <Icon size={16} />
              </span>
              <span className="flex-1">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Status card */}
      <div className="mt-auto rounded-2xl bg-white/[0.06] border border-white/10 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-background">According to plan</span>
        </div>
        <p className="text-xs text-white/60">Progress</p>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden flex">
          <div className="h-full bg-secondary" style={{ width: '68%' }} />
          <div className="h-full bg-teal" style={{ width: '22%' }} />
        </div>
        <p className="text-xs text-white/50">68% completed • 22% in review</p>
      </div>

      <p className="text-[11px] text-white/30 px-2">© 2026 Recall</p>
    </aside>
  )
}
