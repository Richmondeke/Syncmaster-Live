export default function TasksPage() {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">Admin Tasks</h1>
        <p className="text-lg text-muted-foreground tracking-tight">Review pending submissions, composer applications, and platform alerts.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border bg-card p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">Pending Reviews</h3>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">12</span>
          </div>
          <p className="text-muted-foreground text-sm">Applications and track submissions waiting for manual verification.</p>
          <button className="w-full mt-4 py-3 border border-border rounded-2xl hover:bg-muted/50 transition-colors font-bold text-sm">
            View All
          </button>
        </div>
        
        <div className="rounded-3xl border border-border bg-card p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">System Alerts</h3>
            <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold">3</span>
          </div>
          <p className="text-muted-foreground text-sm">Critical updates regarding rights clearance and sync licensing agreements.</p>
          <button className="w-full mt-4 py-3 border border-border rounded-2xl hover:bg-muted/50 transition-colors font-bold text-sm">
            Check Logs
          </button>
        </div>
      </div>
    </div>
  )
}
