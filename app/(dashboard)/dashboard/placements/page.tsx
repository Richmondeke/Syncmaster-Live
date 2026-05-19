import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  DollarSign, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import { getPlacements } from '@/app/actions/placements'

export default async function PlacementsPage() {
  const placements = await getPlacements()

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Placements</h1>
        <p className="text-muted-foreground">Your history of successfully synchronized tracks.</p>
      </div>

      <div className="grid gap-6">
        {placements.map((plc) => (
          <Link key={plc.id} href={`/dashboard/placements/${plc.id}`} className="block group">
            <Card className="bg-card border-border rounded-[2rem] overflow-hidden relative hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>

              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black tracking-[-0.04em] text-foreground group-hover:text-primary transition-colors">{plc.track_name}</h3>
                      <Badge className="bg-primary/20 text-primary border-primary/30 rounded-full font-bold">WIN</Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      {plc.company} <span className="text-muted-foreground/40">•</span> {plc.brief_title}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3" /> License Fee
                      </span>
                      <p className="text-lg font-semibold text-primary">{plc.license_fee || '—'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold flex items-center gap-1.5">
                        <Layers className="w-3 h-3" /> Usage
                      </span>
                      <p className="text-lg font-semibold text-foreground/80">{plc.usage || '—'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> Date
                      </span>
                      <p className="text-lg font-semibold text-foreground/80">{plc.placed_at || '—'}</p>
                    </div>

                    <div className="flex items-end justify-end">
                      <span className="flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        View Details <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {placements.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-border rounded-[2rem]">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black tracking-[-0.04em] text-foreground">No placements yet</h3>
              <p className="text-muted-foreground">Keep submitting tracks. Your first win is just around the corner.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
