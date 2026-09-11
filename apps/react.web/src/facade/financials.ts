import { useFinancialStore } from '../stores/financials'
import { useFinancialList, useFinancial, useCreateFinancial, useUpdateFinancial, useDeleteFinancial } from '../hooks/useFinancials'

export function useFinancialFacade() {
  const { filters, selectedId, setFilters, resetFilters, setSelectedId, nextPage, prevPage } = useFinancialStore()
  const list = useFinancialList(filters)
  const detail = useFinancial(selectedId)
  const create = useCreateFinancial()
  const update = useUpdateFinancial()
  const remove = useDeleteFinancial()

  const items = list.data?.data.items ?? []
  const incomes = items.filter((i) => i.type === 'income').reduce((s, i) => s + i.amount, 0)
  const expenses = items.filter((i) => i.type === 'expense').reduce((s, i) => s + i.amount, 0)
  const balance = incomes - expenses

  return {
    filters,
    selectedId,
    setFilters,
    resetFilters,
    setSelectedId,
    nextPage,
    prevPage,
    list,
    items,
    total: list.data?.data.total ?? 0,
    totalPages: list.data?.data.totalPages ?? 0,
    incomes,
    expenses,
    balance,
    detail,
    create,
    update,
    remove,
  }
}
