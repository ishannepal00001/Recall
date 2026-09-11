import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../modal'
import { useCreateFinancial, useUpdateFinancial, type FinancialItem } from '../../hooks/useFinancials'

type Props = {
  open: boolean
  onClose: () => void
  initial?: FinancialItem | null
}

const categories = [
  'salary','freelance','investment','gift','other_income',
  'food','transport','housing','utilities','healthcare','entertainment','shopping','education','other_expense'
] as const

export function TransactionForm({ open, onClose, initial }: Props) {
  const create = useCreateFinancial()
  const update = useUpdateFinancial()
  const isEdit = !!initial

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<FinancialItem['type']>('expense')
  const [category, setCategory] = useState<string>('food')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setAmount(String(initial.amount))
      setType(initial.type)
      setCategory(initial.category)
      setDate(initial.date.slice(0, 10))
      setDescription(initial.description ?? '')
    } else {
      setTitle('')
      setAmount('')
      setType('expense')
      setCategory('food')
      setDate(new Date().toISOString().slice(0, 10))
      setDescription('')
    }
  }, [initial, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { toast.error('Title is required'); return }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { toast.error('Amount must be greater than 0'); return }
    if (!date) { toast.error('Date is required'); return }
    const body: Record<string, unknown> = {
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date: new Date(date).toISOString(),
      description: description.trim() || null,
    }
    try {
      if (isEdit && initial) await update.mutateAsync({ id: initial.id, ...body })
      else await create.mutateAsync(body)
      toast.success(isEdit ? 'Transaction updated' : 'Transaction created')
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed')
    }
  }

  const pending = create.isPending || update.isPending

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit transaction' : 'New transaction'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Salary" className="w-full rounded-sm bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Amount</label>
            <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full rounded-sm bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as FinancialItem['type'])} className="w-full rounded-sm bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary">
              <option value="expense" className="bg-[#1e1f26]">Expense</option>
              <option value="income" className="bg-[#1e1f26]">Income</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-sm bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary">
              {categories.map((c) => <option key={c} value={c} className="bg-[#1e1f26]">{c.replace('_',' ')}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-sm bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" rows={3} className="w-full rounded-sm bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-sm text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition-colors">Cancel</button>
          <button type="submit" disabled={pending} className="px-5 py-2.5 rounded-sm text-sm font-medium bg-primary text-white hover:bg-[#6b4ee6] disabled:opacity-50 transition-colors">
            {pending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
