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
  Percent, 
  ExternalLink,
  Play,
  Share2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Waveform } from '@/components/Waveform'

export const dynamic = 'force-dynamic'

type PlacementDetail = {
  id: string
  trackName: string
  briefTitle: string
  licenseFee: string
  placedAt: string
  usage: string
  company: string
  bpm: number
  key: string
  genre: string[]
  duration: string
  isrc: string
  composerShare: string
  commission: string
  contractId: string
  exclusivity: string
  territory: string
  media: string
  writers: Array<{
    name: string
    role: string
    email: string
    split: number
    status: string
  }>
}

const placementDetails: Record<string, PlacementDetail> = {
  plc_1: {
    id: 'plc_1',
    trackName: 'Neon Pulse',
    briefTitle: 'Cyberpunk 2077 Expansion',
    licenseFee: '$4,500',
    placedAt: '2024-02-15',
    usage: 'Main Trailer',
    company: 'CD Projekt Red',
    bpm: 128,
    key: 'F# Minor',
    genre: ['Cyberpunk', 'Synthwave', 'Electronic'],
    duration: '3:42',
    isrc: 'US-SM1-24-00109',
    composerShare: '50% / $2,250',
    commission: '20% / $900',
    contractId: 'SM-CON-2024-098',
    exclusivity: 'Non-Exclusive',
    territory: 'Worldwide',
    media: 'All Media including Internet, TV, & Cinema',
    writers: [
      { name: 'Kofi Mensah', role: 'Composer', email: 'kofi@guava.earth', split: 70, status: 'confirmed' },
      { name: 'Amara Diop', role: 'Lyricist', email: 'amara@diop.audio', split: 30, status: 'confirmed' }
    ]
  },
  plc_2: {
    id: 'plc_2',
    trackName: 'Arctic Winds',
    briefTitle: 'Patagonia Winter Campaign',
    licenseFee: '$2,800',
    placedAt: '2024-01-22',
    usage: 'Digital / Social',
    company: 'Patagonia',
    bpm: 96,
    key: 'C Major',
    genre: ['Cinematic', 'Ambient', 'Orchestral'],
    duration: '2:58',
    isrc: 'US-SM1-24-00042',
    composerShare: '50% / $1,400',
    commission: '20% / $560',
    contractId: 'SM-CON-2024-041',
    exclusivity: 'Non-Exclusive',
    territory: 'Worldwide',
    media: 'Digital, Social Media & VOD',
    writers: [
      { name: 'Chioma Adebayo', role: 'Composer', email: 'chioma@guava.earth', split: 100, status: 'confirmed' }
    ]
  }
}

type Props = { params: Promise<{ id: string }> }

export default async function PlacementDetailPage({ params }: Props) {
  const { id } = await params
  const placement = placementDetails[id]

  if (!placement) {
    notFound()
  }

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
          <Badge className="bg-acid-lime/20 text-[#222] border-acid-lime/30 rounded-full font-bold px-3 py-1 flex items-center gap-1.5">
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
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.068em] text-foreground">
                  {placement.trackName}
                </h1>
                <Badge className="bg-primary/20 text-primary border-primary/30 rounded-full font-bold">WIN</Badge>
              </div>
              <p className="text-xl text-muted-foreground font-medium">
                Placed by <span className="text-foreground">{placement.company}</span>
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {placement.genre.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 text-xs font-semibold bg-muted/40 border border-border/50 text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold block mb-1">
              Total License Fee
            </span>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-primary">
              {placement.licenseFee}
            </div>
            <span className="text-xs text-muted-foreground mt-1.5 block font-medium">
              Secured on {placement.placedAt}
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
                <h4 className="font-bold text-foreground">{placement.trackName}</h4>
                <p className="text-xs text-muted-foreground font-mono">{placement.isrc}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Duration</span>
                <span className="font-semibold text-foreground font-mono">{placement.duration}</span>
              </div>
              <div className="h-8 w-[1px] bg-border/40" />
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Tempo</span>
                <span className="font-semibold text-foreground font-mono">{placement.bpm} BPM</span>
              </div>
              <div className="h-8 w-[1px] bg-border/40" />
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Key</span>
                <span className="font-semibold text-foreground font-mono">{placement.key}</span>
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
                <span className="text-xl font-bold text-primary font-mono">{placement.composerShare}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">SyncMaster Cut</span>
                <span className="text-xl font-bold text-foreground/80 font-mono">{placement.commission}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold">Writers & Splits</h4>
              <div className="space-y-3">
                {placement.writers.map((writer) => (
                  <div 
                    key={writer.email}
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
                  <span className="font-semibold text-foreground text-right">{placement.briefTitle}</span>
                </div>
                <div className="h-[1px] bg-border/40" />
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Placement Usage</span>
                  <Badge variant="outline" className="border-border rounded-full font-semibold px-2.5">
                    {placement.usage}
                  </Badge>
                </div>
                <div className="h-[1px] bg-border/40" />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Exclusivity</span>
                  <span className="font-semibold text-foreground">{placement.exclusivity}</span>
                </div>
                <div className="h-[1px] bg-border/40" />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Territory Coverage</span>
                  <span className="font-semibold text-foreground">{placement.territory}</span>
                </div>
                <div className="h-[1px] bg-border/40" />

                <div className="flex justify-between items-start text-sm">
                  <span className="text-muted-foreground font-medium shrink-0">Permitted Media</span>
                  <span className="font-semibold text-foreground text-right max-w-[200px] leading-relaxed">
                    {placement.media}
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
                    <p className="text-xs text-muted-foreground font-mono">{placement.contractId}</p>
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
