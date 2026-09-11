import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { AlertCircle, ShieldCheck } from 'lucide-react'
import { Modal } from '../modal'
import { useCreateWardrobe, useUpdateWardrobe, type WardrobeItem } from '../../hooks/useWardrobe'

const toastBaseStyle: React.CSSProperties = {
  background: '#1E1F26',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.10)',
  backdropFilter: 'blur(12px)',
  borderRadius: '14px',
  padding: '12px 14px',
  fontSize: '13px',
  fontWeight: 500,
  boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05) inset',
}

function notifyError(message: string) {
  toast.error(message, {
    duration: 3800,
    icon: <AlertCircle size={18} className="text-red-400 shrink-0" />,
    style: { ...toastBaseStyle, borderLeft: '3px solid #ef4444' },
  })
}

function notifySuccess(message: string) {
  toast.success(message, {
    duration: 3000,
    icon: <ShieldCheck size={18} className="text-secondary shrink-0" />,
    style: { ...toastBaseStyle, borderLeft: '3px solid #2ED47A' },
  })
}

type Props = {
  open: boolean
  onClose: () => void
  initial?: WardrobeItem | null
  onSuccess?: (msg: string) => void
}

export function WardrobeItemForm({ open, onClose, initial, onSuccess }: Props) {
  const create = useCreateWardrobe()
  const update = useUpdateWardrobe()
  const isEdit = !!initial

  const [title, setTitle] = useState('')
  const [type, setType] = useState<WardrobeItem['type']>('accessory')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<WardrobeItem['status']>('available')
  const [image, setImage] = useState<File | null>(null)
  const [store_location, setStoreLocation] = useState('')
  const [borrowed_by, setBorrowedBy] = useState('')

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setType(initial.type)
      setDescription(initial.description ?? '')
      setStatus(initial.status)
      setImage(null)
      setStoreLocation(initial.store_location ?? '')
      setBorrowedBy(initial.borrowed_by ?? '')
    } else {
      setTitle('')
      setType('accessory')
      setDescription('')
      setStatus('available')
      setImage(null)
      setStoreLocation('')
      setBorrowedBy('')
    }
  }, [initial, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { notifyError('Title is required'); return }
    if (status === 'borrowed' && !borrowed_by.trim()) { notifyError('Borrowed by is required when status is borrowed'); return }
    const form = new FormData()
    form.set('title', title.trim())
    form.set('type', type)
    if (description.trim()) form.set('description', description.trim())
    form.set('status', status)
    if (image) form.set('image', image)
    if (store_location.trim()) form.set('store_location', store_location.trim())
    if (status === 'borrowed') form.set('borrowed_by', borrowed_by.trim())
    try {
      if (isEdit && initial) await (update.mutateAsync as unknown as (v: unknown) => Promise<unknown>)({ id: initial.id, form })
      else await (create.mutateAsync as unknown as (v: unknown) => Promise<unknown>)(form)
      notifySuccess(isEdit ? 'Item updated — wardrobe saved' : 'Item created — added to wardrobe')
      onSuccess?.(isEdit ? 'Item updated' : 'Item created')
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Request failed — please try again'
      notifyError(msg)
    }
  }

  const pending = create.isPending || update.isPending

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit item' : 'Add wardrobe item'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Vintage Denim Jacket" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as WardrobeItem['type'])} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary">
              <option value="accessory" className="bg-[#1e1f26]">Accessory</option>
              <option value="shirt_long_sleeved" className="bg-[#1e1f26]">Long Sleeve</option>
              <option value="shirt_short_sleeved" className="bg-[#1e1f26]">Short Sleeve</option>
              <option value="pant" className="bg-[#1e1f26]">Pant</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as WardrobeItem['status'])} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary">
              <option value="available" className="bg-[#1e1f26]">Available</option>
              <option value="in_use" className="bg-[#1e1f26]">In use</option>
              <option value="to_wash" className="bg-[#1e1f26]">To wash</option>
              <option value="needs_wash" className="bg-[#1e1f26]">Needs wash</option>
              <option value="borrowed" className="bg-[#1e1f26]">Borrowed</option>
            </select>
          </div>
        </div>

        {status === 'borrowed' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Borrowed by</label>
            <input value={borrowed_by} onChange={(e) => setBorrowedBy(e.target.value)} placeholder="e.g. Aarav" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary" />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Image</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:text-white focus:outline-none focus:border-primary" />
          {initial?.image_url && !image && <p className="text-xs text-white/40">Current image will be kept unless you select a new one</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Store location</label>
          <input value={store_location} onChange={(e) => setStoreLocation(e.target.value)} placeholder="e.g. Main Closet" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/70">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" rows={3} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition-colors">Cancel</button>
          <button type="submit" disabled={pending} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#6b4ee6] disabled:opacity-50 transition-colors">
            {pending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
