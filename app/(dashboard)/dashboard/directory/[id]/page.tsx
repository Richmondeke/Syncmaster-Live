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
  Award,
  Mail,
  Phone,
  Send,
  Calendar,
  Building2,
  Lock,
  ExternalLink,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react'
import { agencies } from '@/lib/data/agencies'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from '@/lib/supabase/session'
import { cn } from '@/lib/utils'

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

  const supabase = await createClient()
  const userSession = await getSessionUser()
  let isPro = false
  if (userSession) {
    const { data } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', userSession.id)
      .single()
    isPro = !!data?.is_pro
  }

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
          {isPro ? (
            <>
              <a href={agency.website} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full gap-2 border-border')}>
                <Globe className="w-4 h-4" />
                Website
              </a>
              <a href={`mailto:${agency.email}`} className={cn(buttonVariants(), 'rounded-full gap-2 bg-primary hover:bg-primary/95 text-primary-foreground animate-in fade-in zoom-in duration-300')}>
                <MessageSquare className="w-4 h-4" />
                Contact Agency
              </a>
            </>
          ) : (
            <Link href="/dashboard/settings">
              <Button className="rounded-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold border-0 shadow-lg hover:scale-102 active:scale-98 transition-all duration-200">
                <Zap className="w-4 h-4 fill-current" />
                Unlock Contact with Pro
              </Button>
            </Link>
          )}
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
                {agency.acceptingSubmissions ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Accepting Submissions
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Not Accepting
                  </Badge>
                )}
                {agency.founded && (
                  <Badge variant="outline" className="rounded-full px-4 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border-border bg-muted/30">
                    <Calendar className="w-3.5 h-3.5" />
                    Est. {agency.founded}
                  </Badge>
                )}
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
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Info — Pro Gated */}
          <Card className="rounded-[2.5rem] border-border bg-card overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Contact Information</h2>
                {!isPro && (
                  <Badge className="ml-auto bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    <Lock className="w-3 h-3 mr-1" /> Pro Only
                  </Badge>
                )}
              </div>

              <div className="relative">
                <div className={cn("space-y-4", !isPro && "blur-md select-none pointer-events-none")}>
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Email</p>
                      <p className="font-bold text-lg">{agency.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <Globe className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Website</p>
                      <p className="font-bold text-lg">{agency.website}</p>
                    </div>
                  </div>
                  {agency.phone && (
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
                      <Phone className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Phone</p>
                        <p className="font-bold text-lg">{agency.phone}</p>
                      </div>
                    </div>
                  )}
                  {agency.submissionUrl && (
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
                      <Send className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Submission Portal</p>
                        <p className="font-bold text-lg">{agency.submissionUrl}</p>
                      </div>
                    </div>
                  )}
                  {/* Social Links */}
                  <div className="flex items-center gap-3 pt-2">
                    {agency.socialLinks.instagram && (
                      <a href={`https://instagram.com/${agency.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all text-sm font-medium">
                        <Instagram className="w-4 h-4" /> Instagram
                      </a>
                    )}
                    {agency.socialLinks.linkedin && (
                      <a href={`https://linkedin.com/company/${agency.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all text-sm font-medium">
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                    {agency.socialLinks.twitter && (
                      <a href={`https://twitter.com/${agency.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all text-sm font-medium">
                        <Twitter className="w-4 h-4" /> Twitter
                      </a>
                    )}
                  </div>
                </div>
                {!isPro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 rounded-3xl p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-md">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold tracking-tight text-foreground">Contact Info Locked</h4>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Upgrade to Pro to reveal email, phone, website, submission portal, and social media links for all agencies.
                      </p>
                    </div>
                    <Link href="/dashboard/settings">
                      <Button size="sm" className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 shadow-md border-0">
                        <Zap className="w-4 h-4 mr-1 fill-current" /> Upgrade to Pro
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Placements — Pro Gated */}
          <Card className="rounded-[2.5rem] border-border bg-card overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Recent Placements</h2>
              </div>

              <div className="relative">
                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", !isPro && "blur-md select-none pointer-events-none")}>
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
                {!isPro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 rounded-3xl p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary border border-primary/20 shadow-md">
                      <Zap className="w-6 h-6 fill-current animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold tracking-tight text-foreground">Placements Gated</h4>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Upgrade to Pro to view recent sync placements and track which shows and brands this agency works with.
                      </p>
                    </div>
                    <Link href="/dashboard/settings">
                      <Button size="sm" className="rounded-full bg-primary hover:bg-primary/95 text-white font-bold px-6 shadow-md shadow-primary/20">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats & Meta */}
        <div className="space-y-8">
          {/* Genres */}
          <Card className="rounded-[2.5rem] border-border bg-card overflow-hidden">
            <CardContent className="p-8 space-y-5">
              <h3 className="text-xl font-bold tracking-tight">Preferred Genres</h3>
              <div className="flex flex-wrap gap-2">
                {agency.genres.map(genre => (
                  <Badge key={genre} variant="outline" className="rounded-full px-4 py-2 text-xs font-bold border-border bg-muted/30">
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notable Clients */}
          <Card className="rounded-[2.5rem] border-border bg-card overflow-hidden">
            <CardContent className="p-8 space-y-5">
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                Notable Clients
              </h3>
              <div className="space-y-3">
                {agency.notableClients.map((client, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {client.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{client}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agency Highlights */}
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
              
              {isPro ? (
                <a href={`mailto:${agency.email}?subject=Brief Submission via SyncMaster – ${encodeURIComponent(agency.name)}`} className={cn(buttonVariants(), 'w-full rounded-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg')}>
                  Send Direct Brief
                </a>
              ) : (
                <Link href="/dashboard/settings" className="w-full block">
                  <Button className="w-full rounded-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-700 hover:to-primary/90 text-white transition-all shadow-lg gap-2">
                    <Zap className="w-4 h-4 fill-current" />
                    Unlock Direct Brief
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
