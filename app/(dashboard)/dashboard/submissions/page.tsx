import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { 
  Music, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'


const mockSubmissions = [
  {
    id: 'sub_1',
    trackName: 'Midnight Horizon',
    briefTitle: 'Netflix Sci-Fi Action Sequence',
    submittedAt: '2024-03-10',
    status: 'under_review',
    briefId: 'brief_1'
  },
  {
    id: 'sub_2',
    trackName: 'Neon Pulse',
    briefTitle: 'Cyberpunk 2077 Expansion',
    submittedAt: '2024-03-08',
    status: 'accepted',
    briefId: 'brief_2'
  },
  {
    id: 'sub_3',
    trackName: 'Ethereal Echoes',
    briefTitle: 'BMW Electric Vision Ad',
    submittedAt: '2024-03-05',
    status: 'declined',
    briefId: 'brief_3'
  }
]

const statusStyles = {
  under_review: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  accepted: 'bg-acid-lime text-black border-acid-lime/20',
  declined: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
}

const statusIcons = {
  under_review: <Clock className="w-3.5 h-3.5" />,
  accepted: <CheckCircle2 className="w-3.5 h-3.5" />,
  declined: <XCircle className="w-3.5 h-3.5" />
}

export default function SubmissionsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Submissions</h1>
        <p className="text-muted-foreground text-sm font-medium">Track your pitches and active submissions across all briefs.</p>
      </div>

      <div className="grid gap-4">
        {mockSubmissions.map((sub) => (
          <Link key={sub.id} href={`/dashboard/briefs/${sub.briefId}`} className="block group">
            <Card className="bg-card border-border rounded-[2rem] overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
                    <Music className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-lg font-black tracking-[-0.04em] text-foreground truncate group-hover:text-primary transition-colors">{sub.trackName}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <span className="label">to:</span>
                      <span className="text-primary/70 group-hover:text-primary transition-colors flex items-center gap-1 font-medium">
                        {sub.briefTitle}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${statusStyles[sub.status as keyof typeof statusStyles]}`}>
                        {statusIcons[sub.status as keyof typeof statusIcons]}
                        {sub.status.replace('_', ' ')}
                      </Badge>
                      <span className="label">
                        Submitted {sub.submittedAt}
                      </span>
                    </div>
                    
                    <div className="p-2 rounded-full bg-muted/40 group-hover:bg-muted transition-colors">
                      <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground/60 transition-colors" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {mockSubmissions.length === 0 && (
        <Card className="bg-card border-dashed border-border rounded-[2rem] p-16 text-center">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mx-auto">
              <Music className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-[-0.04em] text-foreground">No submissions yet</h3>
              <p className="text-sm text-muted-foreground">Apply to a brief to see your active submissions here.</p>
            </div>
            <Link 
              href="/dashboard/briefs"
              className={buttonVariants({ variant: "default" }) + " rounded-full bg-primary text-white hover:bg-primary/90"}
            >
              Browse Briefs
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
