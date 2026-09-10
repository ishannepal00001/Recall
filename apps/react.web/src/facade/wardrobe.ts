import { useWardrobeStore } from '../stores/wardrobe'
import { useWardrobeList, useWardrobe, useCreateWardrobe, useUpdateWardrobe, useDeleteWardrobe } from '../hooks/useWardrobe'

export function useWardrobeFacade() {
  const { filters, selectedId, setFilters, resetFilters, setSelectedId, nextPage, prevPage } = useWardrobeStore()
  const list = useWardrobeList(filters)
  const detail = useWardrobe(selectedId)
  const create = useCreateWardrobe()
  const update = useUpdateWardrobe()
  const remove = useDeleteWardrobe()

  return {
    filters,
    selectedId,
    setFilters,
    resetFilters,
    setSelectedId,
    nextPage,
    prevPage,
    list,
    items: list.data?.data.items ?? [],
    total: list.data?.data.total ?? 0,
    totalPages: list.data?.data.totalPages ?? 0,
    detail,
    create,
    update,
    remove,
  }
}
