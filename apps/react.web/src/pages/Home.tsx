import Calendar from '../components/calendar'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Home</h1>
        <span className="text-xs font-medium px-2.5 py-1 rounded-sm bg-secondary text-background">According to plan</span>
      </div>
      <p className="text-white/60 text-sm sm:text-base">Welcome to Recall — your canvas is <span className="text-white">ready</span>.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-md bg-white/[0.06] border border-white/10 p-5">
          <p className="text-sm text-white/60">Active</p>
          <p className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-secondary" /> 12
          </p>
          <div className="h-1.5 rounded-sm bg-white/10 mt-3 overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: '70%' }} />
          </div>
        </div>
        <div className="rounded-md bg-white/[0.06] border border-white/10 p-5">
          <p className="text-sm text-white/60">StrataScratch</p>
          <p className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <span className="w-7 h-7 rounded-sm bg-teal flex items-center justify-center text-xs">⬢</span> 3
          </p>
          <div className="h-1.5 rounded-sm bg-white/10 mt-3 overflow-hidden flex">
            <div className="h-full bg-teal" style={{ width: '45%' }} />
          </div>
        </div>
        <div className="rounded-md bg-primary p-5 text-white">
          <p className="text-sm text-white/80">Quick action</p>
          <button className="mt-3 bg-white text-primary px-4 py-2 rounded-sm text-sm font-medium">+ Create new</button>
        </div>
      </div>

      <div className="mt-2 overflow-x-hidden">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">Calendar</h2>
        <Calendar />
      </div>
    </div>
  )
}
