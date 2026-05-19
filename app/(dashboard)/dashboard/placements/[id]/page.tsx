import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, 
  Trophy, 
  DollarSign, 
  Calendar, 
  Layers, 
  Music, 
  Shield, 
  FileText, 
  User, 
  ExternalLink,
  Play,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Waveform } from '@/components/Waveform'
import { getPlacement } from '@/app/actions/placements'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function PlacementDetailPage({ params }: Props) {
  const { id } = await params
  const placement = await getPlacement(id)

  if (!placement) {
    notFound()
  }

  const writers: Array<{ name: string; role: string; email: string; split: number }> =
    Array.isArray(placement.writers) ? placement.writers : []

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Back navigation & Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link 
          href="/dashboard/placements"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Placements
        </Link>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 rounded-full font-bold px-3 py-1 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Placement Secured
          </Badge>
        </div>
      </div>

      {/* Main Placement Heading / Banner */}
      <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 relative">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {placement.track_name}
                </h1>
                <Badge className="bg-primary/20 text-primary border-primary/30 rounded-full font-bold">WIN</Badge>
              </div>
              <p className="text-xl text-muted-foreground font-medium">
                Placed by <span className="text-foreground">{placement.company || 'Unknown Company'}</span>
              </p>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold block mb-1">
              Total License Fee
            </span>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-primary">
              {placement.license_fee || '—'}
            </div>
            <span className="text-xs text-muted-foreground mt-1.5 block font-medium">
              Secured on {placement.placed_at || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Audio Waveform Player Block */}
      <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div className="flex items-center gap-4">
              <button className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-md shrink-0">
                <Play className="w-6 h-6 fill-current pl-1" />
              </button>
              <div>
                <h4 className="font-bold text-foreground">{placement.track_name}</h4>
                <p className="text-xs text-muted-foreground font-mono">{placement.isrc || 'No ISRC'}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Usage</span>
                <span className="font-semibold text-foreground font-mono">{placement.usage || '—'}</span>
              </div>
              <div className="h-8 w-[1px] bg-border/40" />
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Territory</span>
                <span className="font-semibold text-foreground font-mono">{placement.territory || '—'}</span>
              </div>
              <div className="h-8 w-[1px] bg-border/40" />
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Exclusivity</span>
                <span className="font-semibold text-foreground font-mono">{placement.exclusivity || '—'}</span>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <Waveform color="var(--border)" height={48} />
          </div>
        </CardContent>
      </Card>

      {/* Grid: Split Breakdown & License/Contract Rights */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Card: Financials & Writers splits */}
        <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-black tracking-[-0.04em]">Royalty & Split Shares</CardTitle>
            <CardDescription>Visual breakdown of synchronized income shares and composer cuts.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Your Net Share</span>
                <span className="text-xl font-bold text-primary font-mono">{placement.composer_share || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">SyncMaster Cut</span>
                <span className="text-xl font-bold text-foreground/80 font-mono">{placement.commission || '—'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold">Writers & Splits</h4>
              {writers.length > 0 ? (
                <div className="space-y-3">
                  {writers.map((writer, i) => (
                    <div 
                      key={writer.email || i}
                      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{writer.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{writer.email} • {writer.role}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full font-bold">
                          {writer.split}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No writer splits recorded.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Contract & License Details */}
        <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-black tracking-[-0.04em]">License & Rights Info</CardTitle>
            <CardDescription>Scope of rights, placement brief context and legal outlines.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Brief Reference</span>
                  <span className="font-semibold text-foreground text-right">{placement.brief_title}</span>
                </div>
                <div className="h-[1px] bg-border/40" />
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Placement Usage</span>
                  <Badge variant="outline" className="border-border rounded-full font-semibold px-2.5">
                    {placement.usage || '—'}
                  </Badge>
                </div>
                <div className="h-[1px] bg-border/40" />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Exclusivity</span>
                  <span className="font-semibold text-foreground">{placement.exclusivity || '—'}</span>
                </div>
                <div className="h-[1px] bg-border/40" />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Territory Coverage</span>
                  <span className="font-semibold text-foreground">{placement.territory || '—'}</span>
                </div>
                <div className="h-[1px] bg-border/40" />

                <div className="flex justify-between items-start text-sm">
                  <span className="text-muted-foreground font-medium shrink-0">Permitted Media</span>
                  <span className="font-semibold text-foreground text-right max-w-[200px] leading-relaxed">
                    {placement.media || '—'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Sync License Contract</p>
                    <p className="text-xs text-muted-foreground font-mono">{placement.contract_id || 'No contract ID'}</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View Legal PDF <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
