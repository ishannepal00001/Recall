import type { FinancialItem } from '../../hooks/useFinancials'

type Point = { x: number; y: number; label: string }

function buildSeries(items: FinancialItem[]) {
  const sorted = [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const incomeMap = new Map<string, number>()
  const expenseMap = new Map<string, number>()
  sorted.forEach((it) => {
    const d = new Date(it.date).toISOString().slice(0, 10)
    if (it.type === 'income') incomeMap.set(d, (incomeMap.get(d) ?? 0) + it.amount)
    else expenseMap.set(d, (expenseMap.get(d) ?? 0) + it.amount)
  })
  const allDates = Array.from(new Set([...incomeMap.keys(), ...expenseMap.keys()])).sort()
  if (allDates.length === 0) return { labels: [], income: [], expense: [], balance: [] }
  let running = 0
  const income: number[] = []
  const expense: number[] = []
  const balance: number[] = []
  allDates.forEach((d) => {
    const inc = incomeMap.get(d) ?? 0
    const exp = expenseMap.get(d) ?? 0
    running += inc - exp
    income.push(inc)
    expense.push(exp)
    balance.push(running)
  })
  return { labels: allDates, income, expense, balance }
}

function toPath(values: number[], width: number, height: number, pad: number, max: number, min: number): string {
  if (values.length === 0) return ''
  const range = max - min || 1
  const stepX = values.length === 1 ? 0 : (width - pad * 2) / (values.length - 1)
  const points: Point[] = values.map((v, i) => ({
    x: pad + i * stepX,
    y: pad + (1 - (v - min) / range) * (height - pad * 2),
    label: String(v),
  }))
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

export function FinancialChart({ data }: { data: FinancialItem[] }) {
  if (data.length === 0) {
    return <div className="text-center text-white/40 py-12 border border-white/10 rounded-lg">No data to chart</div>
  }
  const { labels, income, expense, balance } = buildSeries(data)
  const allVals = [...income, ...expense, ...balance]
  const max = Math.max(...allVals, 0)
  const min = Math.min(...allVals, 0)
  const W = 800
  const H = 280
  const pad = 36

  const incomePath = toPath(income, W, H, pad, max, min)
  const expensePath = toPath(expense, W, H, pad, max, min)
  const balancePath = toPath(balance, W, H, pad, max, min)

  const yTicks = [max, (max + min) / 2, min]

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 overflow-x-auto">
      <div className="flex items-center gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-400 inline-block" /> Incomes</span>
        <span className="flex items-center gap-1.5 text-white/70"><span className="w-3 h-0.5 bg-red-400 inline-block" /> Expenses</span>
        <span className="flex items-center gap-1.5 text-white/70"><span className="w-3 h-0.5 bg-white inline-block" /> Balance</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[280px] text-white">
        {yTicks.map((v, i) => {
          const y = pad + (1 - (v - min) / (max - min || 1)) * (H - pad * 2)
          return (
            <g key={i}>
              <line x1={pad} x2={W - pad} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              <text x={4} y={y + 4} fontSize={10} fill="rgba(255,255,255,0.5)">${Math.round(v).toLocaleString()}</text>
            </g>
          )
        })}
        {labels.map((l, i) => {
          const x = pad + (labels.length === 1 ? 0 : (i * (W - pad * 2)) / (labels.length - 1))
          return (
            <text key={l} x={x} y={H - 8} fontSize={10} fill="rgba(255,255,255,0.5)" textAnchor="middle">
              {l.slice(5)}
            </text>
          )
        })}
        <path d={expensePath} fill="none" stroke="#f87171" strokeWidth={2} strokeLinejoin="round" />
        <path d={incomePath} fill="none" stroke="#4ade80" strokeWidth={2} strokeLinejoin="round" />
        <path d={balancePath} fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round" strokeDasharray="6 3" />
      </svg>
    </div>
  )
}
