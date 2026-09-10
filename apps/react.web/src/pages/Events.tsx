export default function EventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Events</h1>
      <div className="flex flex-col gap-3">
        {[
          { date: 'Sep 28', title: 'Wardrobe Refresh', tag: 'Plan' },
          { date: 'Oct 02', title: 'Financial Review', tag: 'Finance' },
          { date: 'Oct 15', title: 'Task Sprint', tag: 'Tasks' },
        ].map((e) => (
          <div key={e.title} className="flex items-center gap-4 rounded-xl bg-white/[0.06] border border-white/10 p-4">
            <span className="px-3 py-2 rounded-lg bg-teal text-white text-sm font-medium">{e.date}</span>
            <span className="text-white flex-1">{e.title}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary text-white">{e.tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
