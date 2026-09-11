import { useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { WardrobeItemCard } from '../components/wardrobe/itemcard'
import { WardrobeEmpty } from '../components/wardrobe/empty'
import { WardrobeItemForm } from '../components/wardrobe/itemform'
import { useWardrobeFacade } from '../facade/wardrobe'
import type { WardrobeItem } from '../hooks/useWardrobe'

type Props = {
  items: WardrobeItem[]
  isLoading: boolean
}

export default function WardrobePage({ items, isLoading }: Props) {
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<WardrobeItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<WardrobeItem | null>(null)

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Wardrobe</h1>
        <button onClick={() => { setEditItem(null); setOpen(true) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-[#6b4ee6] text-white px-4 py-2.5 text-sm font-medium transition-colors w-full sm:w-auto">
          <Plus size={16} /> Add new item
        </button>
      </div>
      {isLoading ? (
        <p className="text-sm text-white/50">Loading wardrobe...</p>
      ) : items.length === 0 ? (
        <WardrobeEmpty onAdd={() => { setEditItem(null); setOpen(true) }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item) => (
            <WardrobeItemCard key={item.id} item={item} onEdit={() => { setEditItem(item); setOpen(true) }} onDelete={() => setDeleteItem(item)} />
          ))}
        </div>
      )}
      <WardrobeItemForm
        open={open}
        onClose={() => { setOpen(false); setEditItem(null) }}
        initial={editItem}
        onSuccess={(msg) => toast.success(msg)}
      />
      {deleteItem && <DeleteConfirmModal item={deleteItem} onClose={() => setDeleteItem(null)} onSuccess={(msg) => toast.success(msg)} />}
    </div>
  )
}

function DeleteConfirmModal({ item, onClose, onSuccess }: { item: WardrobeItem; onClose: () => void; onSuccess?: (msg: string) => void }) {
  const facade = useWardrobeFacade()
  const pending = facade.remove.isPending
  const handleDelete = async () => {
    try {
      await facade.remove.mutateAsync(item.id)
      toast.success('Item deleted')
      onSuccess?.('Item deleted')
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-[#1e1f26] border border-white/10 p-6">
        <h3 className="text-base font-semibold text-white">Delete "{item.title}"?</h3>
        <p className="text-sm text-white/60 mt-2">This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm">Cancel</button>
          <button onClick={handleDelete} disabled={pending} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm disabled:opacity-50">{pending ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  )
}
