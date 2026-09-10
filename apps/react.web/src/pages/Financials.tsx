export default function FinancialsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Financials</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-6">
          <p className="text-sm text-white/60">Total Spent</p>
          <p className="text-2xl font-bold text-white mt-2">$12,340</p>
          <div className="h-2 rounded-full bg-white/10 mt-4 overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: '62%' }} />
          </div>
        </div>
        <div className="rounded-2xl bg-primary p-6 text-white">
          <p className="text-sm text-white/80">Budget Remaining</p>
          <p className="text-2xl font-bold mt-2">$7,660</p>
          <div className="h-2 rounded-full bg-white/30 mt-4 overflow-hidden">
            <div className="h-full bg-teal" style={{ width: '38%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
