import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Globe, 
  MessageSquare,
  Star,
  Zap,
  Music2,
  Award
} from 'lucide-react'
import { agencies } from '@/lib/data/agencies'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const agency = agencies.find(a => a.id === id)
  return {
    title: agency ? `${agency.name} | SyncMaster` : 'Agency Details',
    description: agency?.description
  }
}

export default async function AgencyDetailPage({ params }: Props) {
  const { id } = await params
  const agency = agencies.find(a => a.id === id)

  if (!agency) notFound()

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pt-4">
      {/* Back Button & Header Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/directory">
          <Button variant="ghost" className="rounded-full gap-2 hover:bg-accent/50">
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full gap-2 border-border">
            <Globe className="w-4 h-4" />
            Website
          </Button>
          <Button className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <MessageSquare className="w-4 h-4" />
            Contact Agency
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-[3rem] overflow-hidden bg-card border border-border shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative p-10 md:p-16 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-muted border-2 border-border shadow-2xl overflow-hidden shrink-0">
            <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex flex-col gap-6 flex-1">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {agency.verified && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-4 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Partner
                  </Badge>
                )}
                <Badge variant="outline" className="rounded-full px-4 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border-border bg-muted/30">
                  <MapPin className="w-3.5 h-3.5" />
                  {agency.location}
                </Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[0.95]">
                {agency.name}
              </h1>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium tracking-tight">
              {agency.description}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {agency.specialization.map(spec => (
                <Badge key={spec} variant="secondary" className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-tight bg-accent/10 text-accent-foreground border-accent/20">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Placements */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-border bg-card overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Recent Placements</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agency.recentSyncs.map((sync, idx) => (
                  <div key={idx} className="group p-6 rounded-3xl bg-muted/30 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-default">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                          <Music2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">{sync}</span>
                      </div>
                      <Zap className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats & Meta */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-border bg-card overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-bold tracking-tight">Agency Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
                  <span className="text-sm text-muted-foreground font-medium">Response Time</span>
                  <span className="font-bold">~24 hours</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
                  <span className="text-sm text-muted-foreground font-medium">Brief Acceptance</span>
                  <span className="font-bold text-green-500 text-lg">98%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
                  <span className="text-sm text-muted-foreground font-medium">Success Rate</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-lg">4.9/5</span>
                  </div>
                </div>
              </div>
              <Button className="w-full rounded-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg">
                Send Direct Brief
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
