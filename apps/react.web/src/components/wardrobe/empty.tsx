import { Shirt } from 'lucide-react'

export function WardrobeEmpty({ onAdd }: { onAdd?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/[0.06] border border-dashed border-white/15 py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
        <Shirt size={24} className="text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-white">No items yet</h3>
        <p className="text-sm text-white/50 max-w-sm">Your wardrobe is empty. Add your first item to keep track of clothes, accessories and their status.</p>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="mt-2 rounded-xl bg-primary hover:bg-[#6b4ee6] text-white px-5 py-2.5 text-sm font-medium transition-colors">
          Add new item
        </button>
      )}
    </div>
  )
}
