import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useFinancialFacade } from '../facade/financials'
import { FinancialTable } from '../components/financials/TableComponent'
import { FinancialChart } from '../components/financials/FinancialChart'
import { TransactionForm } from '../components/financials/TransactionForm'

export default function FinancialsPage() {
  const { items, incomes, expenses, balance, list } = useFinancialFacade()
  const [showChart, setShowChart] = useState(false)
  const [open, setOpen] = useState(false)

  const balanceIsLow = balance < 3000

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Financials</h1>
        <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary hover:bg-[#6b4ee6] text-white px-4 py-2.5 text-sm font-medium transition-colors w-full sm:w-auto">
          <Plus size={16} /> New Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-md border p-6 bg-green-500/10 border-green-500/20">
          <p className="text-sm text-green-400">Incomes</p>
          <p className="text-2xl font-bold text-green-400 mt-2">${incomes.toLocaleString()}</p>
        </div>

        <div className={`rounded-md border p-6 ${balanceIsLow ? 'bg-orange-500/10 border-orange-500/20' : 'bg-white text-black border-white'}`}>
          <p className={`text-sm ${balanceIsLow ? 'text-orange-400' : 'text-black/60'}`}>Balance</p>
          <p className={`text-2xl font-bold mt-2 ${balanceIsLow ? 'text-orange-400' : 'text-black'}`}>${balance.toLocaleString()}</p>
        </div>

        <div className="rounded-md border p-6 bg-red-500/10 border-red-500/20">
          <p className="text-sm text-red-400">Expenses</p>
          <p className="text-2xl font-bold text-red-400 mt-2">${expenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold">{showChart ? 'Overview' : 'Recent Transactions'}</h2>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-sm text-white/60">{showChart ? 'Chart' : 'Table'}</span>
          <button
            onClick={() => setShowChart((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${showChart ? 'bg-primary' : 'bg-white/20'}`}
            aria-label="Toggle chart"
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${showChart ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </label>
      </div>

      {list.isLoading ? (
        <div className="text-white/40 py-12 text-center border border-white/10 rounded-lg">Loading...</div>
      ) : showChart ? (
        <FinancialChart data={items} />
      ) : (
        <FinancialTable data={items} />
      )}

      <TransactionForm open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
