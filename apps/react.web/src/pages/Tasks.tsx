export default function TasksPage() {
  const tasks = [
    { title: 'Review quarterly report', status: 'In progress', color: 'bg-secondary' },
    { title: 'Update wardrobe inventory', status: 'Pending', color: 'bg-teal' },
    { title: 'Schedule event', status: 'Done', color: 'bg-primary' },
  ]
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Tasks</h1>
      <div className="flex flex-col gap-3">
        {tasks.map((t) => (
          <div key={t.title} className="flex items-center gap-4 rounded-xl bg-white/[0.06] border border-white/10 p-4">
            <span className={`w-2 h-2 rounded-full ${t.color}`} />
            <span className="text-white flex-1">{t.title}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
