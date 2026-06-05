import { Search } from 'lucide-react'

export default function RadarPage() {
  return (
    <div className="flex flex-col gap-8 pt-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Sound Radar</h1>
        <p className="text-lg text-muted-foreground tracking-tight">
          Real-time market insights and trending sonic profiles across film, TV, and advertising.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 gap-6 rounded-[2.5rem] border-2 border-dashed border-border/40 bg-muted/20">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Search className="w-8 h-8 text-primary/60" />
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <p className="font-black text-foreground text-lg">Sound Radar is coming soon</p>
          <p className="text-sm text-muted-foreground">
            We&apos;re building real-time sync market data. When it launches, you&apos;ll see trending genres,
            emerging brief patterns, and which sounds are winning placements right now.
          </p>
        </div>
      </div>
    </div>
  )
}
