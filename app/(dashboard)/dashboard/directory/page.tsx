export default function DirectoryPage() {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">Agency Directory</h1>
        <p className="text-lg text-muted-foreground tracking-tight">Connect with the world's leading sync agencies and music supervisors.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-border bg-card p-8 flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground italic">Directory features coming soon...</p>
        </div>
      </div>
    </div>
  )
}
