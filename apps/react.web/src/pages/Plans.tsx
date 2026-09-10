export default function PlansPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Plans</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium">+ New Plan</button>
      </div>
      <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-6">
        <p className="text-white/60 text-sm">Organize your strategic plans</p>
        <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden flex">
          <div className="h-full bg-secondary" style={{ width: '55%' }} />
          <div className="h-full bg-teal" style={{ width: '20%' }} />
        </div>
        <p className="text-xs text-white/50 mt-2">5 active • 2 in review</p>
      </div>
    </div>
  )
}
