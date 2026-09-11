import { create } from 'zustand'

export type FinancialFilters = {
  type?: 'income' | 'expense'
  category?: string
  search?: string
  date_from?: string
  date_to?: string
  page: number
  limit: number
  sortBy: 'created_at' | 'updated_at' | 'date' | 'amount' | 'title'
  sortOrder: 'asc' | 'desc'
}

type FinancialStore = {
  filters: FinancialFilters
  selectedId: string | null
  setFilters: (patch: Partial<FinancialFilters>) => void
  resetFilters: () => void
  setSelectedId: (id: string | null) => void
  nextPage: () => void
  prevPage: () => void
}

const defaultFilters: FinancialFilters = {
  page: 1,
  limit: 20,
  sortBy: 'date',
  sortOrder: 'desc',
}

export const useFinancialStore = create<FinancialStore>((set) => ({
  filters: defaultFilters,
  selectedId: null,
  setFilters: (patch) =>
    set((s) => ({
      filters: {
        ...s.filters,
        ...patch,
        ...(patch.page === undefined && (patch.type !== undefined || patch.category !== undefined || patch.search !== undefined) ? { page: 1 } : {}),
      },
    })),
  resetFilters: () => set({ filters: defaultFilters, selectedId: null }),
  setSelectedId: (id) => set({ selectedId: id }),
  nextPage: () => set((s) => ({ filters: { ...s.filters, page: s.filters.page + 1 } })),
  prevPage: () => set((s) => ({ filters: { ...s.filters, page: Math.max(1, s.filters.page - 1) } })),
}))
