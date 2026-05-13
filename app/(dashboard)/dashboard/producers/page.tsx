export default function ProducersPage() {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">Producers</h1>
        <p className="text-lg text-muted-foreground tracking-tight">Manage approved producers and their contributions to the platform.</p>
      </div>
      
      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Tracks</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 font-medium">Global Sound Collective</td>
              <td className="px-6 py-4">42</td>
              <td className="px-6 py-4"><span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">Active</span></td>
              <td className="px-6 py-4 text-right text-primary font-bold cursor-pointer hover:underline">Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
