export default function WardrobePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Wardrobe</h1>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
            <div className="h-24 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">Outfit {i}</div>
            <p className="text-sm text-white mt-3">Look #{i}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-background">Ready</span>
          </div>
        ))}
      </div>
    </div>
  )
}
