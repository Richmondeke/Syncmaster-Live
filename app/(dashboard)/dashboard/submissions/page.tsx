import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Music, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

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
  under_review: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  declined: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
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
        <h1 className="text-3xl font-bold tracking-tight text-white">Submissions</h1>
        <p className="text-white/50">Track your pitches and active submissions.</p>
      </div>

      <div className="grid gap-4">
        {mockSubmissions.map((sub) => (
          <Card key={sub.id} className="bg-white/5 border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.07] transition-all group">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Music className="w-7 h-7 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-lg font-semibold text-white truncate">{sub.trackName}</h3>
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <span>to:</span>
                    <Link href={`/dashboard/briefs/${sub.briefId}`} className="text-primary/70 hover:text-primary transition-colors flex items-center gap-1 font-medium">
                      {sub.briefTitle}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge className={`rounded-full px-3 py-1 flex items-center gap-1.5 border capitalize ${statusStyles[sub.status as keyof typeof statusStyles]}`}>
                      {statusIcons[sub.status as keyof typeof statusIcons]}
                      {sub.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
                      Submitted {sub.submittedAt}
                    </span>
                  </div>
                  
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockSubmissions.length === 0 && (
        <Card className="bg-transparent border-dashed border-white/10 rounded-3xl p-20 text-center">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <Music className="w-8 h-8 text-white/20" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white">No submissions yet</h3>
              <p className="text-sm text-white/40">Apply to a brief to see your active submissions here.</p>
            </div>
            <Button asChild className="rounded-full bg-white text-black hover:bg-white/90">
              <Link href="/dashboard/briefs">Browse Briefs</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
