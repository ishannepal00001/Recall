import { create } from 'zustand'

export type WardrobeFilters = {
  type?: 'accessory' | 'shirt_long_sleeved' | 'shirt_short_sleeved' | 'pant'
  status?: 'available' | 'in_use' | 'to_wash' | 'needs_wash' | 'borrowed'
  search?: string
  store_location?: string
  page: number
  limit: number
  sortBy: 'created_at' | 'updated_at' | 'title' | 'type' | 'status'
  sortOrder: 'asc' | 'desc'
}

type WardrobeStore = {
  filters: WardrobeFilters
  selectedId: string | null
  setFilters: (patch: Partial<WardrobeFilters>) => void
  resetFilters: () => void
  setSelectedId: (id: string | null) => void
  nextPage: () => void
  prevPage: () => void
}

const defaultFilters: WardrobeFilters = {
  page: 1,
  limit: 20,
  sortBy: 'created_at',
  sortOrder: 'desc',
}

export const useWardrobeStore = create<WardrobeStore>((set) => ({
  filters: defaultFilters,
  selectedId: null,
  setFilters: (patch) =>
    set((s) => ({
      filters: { ...s.filters, ...patch, ...(patch.page === undefined && (patch.type !== undefined || patch.status !== undefined || patch.search !== undefined) ? { page: 1 } : {}) },
    })),
  resetFilters: () => set({ filters: defaultFilters, selectedId: null }),
  setSelectedId: (id) => set({ selectedId: id }),
  nextPage: () => set((s) => ({ filters: { ...s.filters, page: s.filters.page + 1 } })),
  prevPage: () => set((s) => ({ filters: { ...s.filters, page: Math.max(1, s.filters.page - 1) } })),
}))
