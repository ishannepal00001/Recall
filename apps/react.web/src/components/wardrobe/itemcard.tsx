import { Shirt, PocketKnife, Footprints, UserRound, Package, Droplets, Pencil, Trash2 } from 'lucide-react'
import type { WardrobeItem } from '../../hooks/useWardrobe'

const typeLabel: Record<string, string> = {
  accessory: 'Accessory',
  shirt_long_sleeved: 'Long Sleeve',
  shirt_short_sleeved: 'Short Sleeve',
  pant: 'Pant',
}

const typeIcon: Record<string, React.ElementType> = {
  accessory: PocketKnife,
  shirt_long_sleeved: Shirt,
  shirt_short_sleeved: Shirt,
  pant: Footprints,
}

const statusTone: Record<string, string> = {
  available: 'bg-secondary text-background',
  in_use: 'bg-primary text-white',
  to_wash: 'bg-teal text-white',
  needs_wash: 'bg-amber-500 text-white',
  borrowed: 'bg-white/15 text-white border border-white/20',
}

const statusLabel: Record<string, string> = {
  available: 'Available',
  in_use: 'In use',
  to_wash: 'To wash',
  needs_wash: 'Needs wash',
  borrowed: 'Borrowed',
}

export function WardrobeItemCard({ item, onEdit, onDelete }: { item: WardrobeItem; onEdit?: () => void; onDelete?: () => void }) {
  const TypeIcon = typeIcon[item.type] ?? Shirt
  return (
    <div className="group flex flex-col h-full rounded-md bg-white/[0.06] border border-white/10 overflow-hidden hover:border-white/20 hover:bg-white/[0.08] transition-colors">
      <div className="relative h-40 shrink-0 bg-black/20 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-primary/10">
            <TypeIcon size={28} className="text-primary" />
            <span className="text-xs text-white/40">{typeLabel[item.type] ?? item.type}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-sm bg-black/60 backdrop-blur px-2 py-1 border border-white/10">
          <TypeIcon size={12} className="text-white/80" />
          <span className="text-[11px] font-medium text-white">{typeLabel[item.type] ?? item.type}</span>
        </div>
        <span className={`absolute top-2 right-2 text-[11px] font-medium px-2 py-1 rounded-sm ${statusTone[item.status] ?? 'bg-white/10 text-white'}`}>
          {statusLabel[item.status] ?? item.status}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1">{item.title}</h3>
        {item.description && <p className="text-xs text-white/50 line-clamp-2 leading-relaxed min-h-[32px]">{item.description}</p>}
        {!item.description && <p className="text-xs text-transparent line-clamp-2 leading-relaxed min-h-[32px]" aria-hidden>placeholder</p>}
        <div className="flex flex-wrap gap-1.5 mt-1 min-h-[22px]">
          {item.store_location && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-sm bg-white/10 text-white/70 border border-white/10">
              <Package size={11} /> {item.store_location}
            </span>
          )}
          {item.status === 'borrowed' && item.borrowed_by && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-sm bg-white/10 text-white/70 border border-white/10">
              <UserRound size={11} /> {item.borrowed_by}
            </span>
          )}
          {(item.status === 'to_wash' || item.status === 'needs_wash') && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-sm bg-amber-500/20 text-amber-200 border border-amber-500/20">
              <Droplets size={11} /> {item.status === 'to_wash' ? 'At wash' : 'Wash needed'}
            </span>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-auto pt-3">
          <button onClick={onEdit} aria-label="Edit" className="w-8 h-8 rounded-sm bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} aria-label="Delete" className="w-8 h-8 rounded-sm bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-300 flex items-center justify-center transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
