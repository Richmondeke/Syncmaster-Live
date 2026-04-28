export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-8 w-48 rounded-md bg-muted" />
      <div className="h-4 w-72 rounded-md bg-muted" />
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 flex flex-col gap-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-56 rounded bg-muted" />
            <div className="h-3 w-40 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
