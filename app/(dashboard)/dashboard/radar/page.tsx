export default function RadarPage() {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sound Radar</h1>
        <p className="text-lg text-muted-foreground tracking-tight">Real-time market insights and trending sonic profiles across film, TV, and advertising.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-3xl border border-border bg-card p-8 min-h-[300px]">
          <h3 className="text-xl font-medium mb-4">Trending Genres</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 min-h-[300px]">
          <h3 className="text-xl font-medium mb-4">Market Opportunity</h3>
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Analyzing market data...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
