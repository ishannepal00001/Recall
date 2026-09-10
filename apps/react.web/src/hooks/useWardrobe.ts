import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from './api'
import type { WardrobeFilters } from '../stores/wardrobe'

export type WardrobeItem = {
  id: string
  image_url: string | null
  title: string
  type: 'accessory' | 'shirt_long_sleeved' | 'shirt_short_sleeved' | 'pant'
  description: string | null
  status: 'available' | 'in_use' | 'to_wash' | 'needs_wash' | 'borrowed'
  store_location: string | null
  borrowed_by: string | null
  created_at: string
  updated_at: string
}

type ListResponse = { message: string; status: number; data: { items: WardrobeItem[]; total: number; page: number; limit: number; totalPages: number } }
type SingleResponse = { message: string; status: number; data: WardrobeItem }

export const wardrobeKeys = {
  all: ['wardrobe'] as const,
  list: (f: WardrobeFilters) => [...wardrobeKeys.all, 'list', f] as const,
  detail: (id: string) => [...wardrobeKeys.all, 'detail', id] as const,
}

export function useWardrobeList(filters: WardrobeFilters) {
  return useQuery({
    queryKey: wardrobeKeys.list(filters),
    queryFn: () =>
      apiFetch<ListResponse>('/api/v1/wardrobe', {
        params: filters as unknown as Record<string, string | number | boolean | undefined>,
      }),
    placeholderData: (prev) => prev,
  })
}

export function useWardrobe(id: string | null) {
  return useQuery({
    queryKey: wardrobeKeys.detail(id ?? ''),
    queryFn: () => apiFetch<SingleResponse>(`/api/v1/wardrobe/${id}`),
    enabled: !!id,
  })
}

export function useCreateWardrobe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown> | FormData) => {
      const isForm = body instanceof FormData
      return apiFetch<SingleResponse>('/api/v1/wardrobe', {
        method: 'POST',
        body: isForm ? body as unknown as string : JSON.stringify(body),
        headers: isForm ? {} : { 'Content-Type': 'application/json' },
      } as unknown as never)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: wardrobeKeys.all }),
  })
}

export function useUpdateWardrobe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...rest }: { id: string } & Record<string, unknown>) => {
      const form = (rest as unknown as { form?: FormData }).form as FormData | undefined
      const isForm = form instanceof FormData
      if (isForm) {
        return apiFetch<SingleResponse>(`/api/v1/wardrobe/${id}`, { method: 'PATCH', body: form as unknown as string, headers: {} } as unknown as never)
      }
      return apiFetch<SingleResponse>(`/api/v1/wardrobe/${id}`, { method: 'PATCH', body: JSON.stringify(rest), headers: { 'Content-Type': 'application/json' } } as unknown as never)
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: wardrobeKeys.all })
      qc.invalidateQueries({ queryKey: wardrobeKeys.detail(vars.id) })
    },
  })
}

export function useDeleteWardrobe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ message: string; status: number }>(`/api/v1/wardrobe/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: wardrobeKeys.all }),
  })
}
