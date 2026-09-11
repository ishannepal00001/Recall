import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './api'
import type { FinancialFilters } from '../stores/financials'

export type FinancialItem = {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string | null
  date: string
  created_at: string
  updated_at: string
}

type ListResponse = { message: string; status: number; data: { items: FinancialItem[]; total: number; page: number; limit: number; totalPages: number } }
type SingleResponse = { message: string; status: number; data: FinancialItem }

export const financialKeys = {
  all: ['financials'] as const,
  list: (f: FinancialFilters) => [...financialKeys.all, 'list', f] as const,
  detail: (id: string) => [...financialKeys.all, 'detail', id] as const,
}

export function useFinancialList(filters: FinancialFilters) {
  return useQuery({
    queryKey: financialKeys.list(filters),
    queryFn: () =>
      apiFetch<ListResponse>('/api/v1/financials', {
        params: filters as unknown as Record<string, string | number | boolean | undefined>,
      }),
    placeholderData: (prev) => prev,
  })
}

export function useFinancial(id: string | null) {
  return useQuery({
    queryKey: financialKeys.detail(id ?? ''),
    queryFn: () => apiFetch<SingleResponse>(`/api/v1/financials/${id}`),
    enabled: !!id,
  })
}

export function useCreateFinancial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<SingleResponse>('/api/v1/financials', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialKeys.all }),
  })
}

export function useUpdateFinancial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: { id: string } & Record<string, unknown>) =>
      apiFetch<SingleResponse>(`/api/v1/financials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(rest),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: financialKeys.all })
      qc.invalidateQueries({ queryKey: financialKeys.detail(vars.id) })
    },
  })
}

export function useDeleteFinancial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ message: string; status: number }>(`/api/v1/financials/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialKeys.all }),
  })
}
