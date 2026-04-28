export default function BriefsLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-24 rounded-md bg-muted" />
          <div className="h-4 w-64 rounded-md bg-muted" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 flex justify-between items-start">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="h-5 w-20 rounded-full bg-muted" />
              </div>
              <div className="h-4 w-56 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
            <div className="h-8 w-16 rounded-md bg-muted shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
