import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { Building2, ArrowLeft, Mail, Globe, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'


export default async function ProducerDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  const isDemo = true
  if (!user && !isDemo) redirect('/login')

  // In a real app, we would fetch the producer by ID
  // For demo, we just show a placeholder based on the ID
  const producer = {
    id,
    company: id === 'prod-1' ? 'Global Sound Collective' : id === 'prod-2' ? 'Sync Pulse Media' : 'Vibrant Audio',
    representative: 'Alex Rivera',
    tracks_count: 42,
    status: 'active',
    location: 'London, UK',
    website: 'globalsound.co',
    email: 'contact@globalsound.co',
    bio: 'A leading synchronization agency connecting top-tier musical talent with global media projects across film, television, and advertising.'
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <Link 
          href="/dashboard/producers" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Producers
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-[1.1] text-foreground">
                {producer.company}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground font-bold">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {producer.location}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-widest font-black">
                  {producer.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 rounded-xl font-bold px-6 border-border/50">
              Edit Producer
            </Button>
            <Button className="h-12 rounded-xl font-black px-6 shadow-lg shadow-primary/20">
              Contact Rep
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm space-y-6">
            <h2 className="text-2xl font-black tracking-tight">About the Company</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              {producer.bio}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-muted/30 flex items-center gap-4">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Website</p>
                  <p className="font-bold">{producer.website}</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contact</p>
                  <p className="font-bold">{producer.email}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
            <h2 className="text-2xl font-black tracking-tight mb-6">Catalog Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Tracks', value: producer.tracks_count },
                { label: 'Placements', value: 12 },
                { label: 'Active Briefs', value: 3 },
                { label: 'Licenses', value: 8 }
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-black text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
            <h3 className="text-xl font-black tracking-tight mb-4">Representative</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted">
                <img 
                  src={`https://ui-avatars.com/api/?name=${producer.representative}&background=random&color=fff&bold=true`} 
                  alt={producer.representative}
                />
              </div>
              <div>
                <p className="font-black text-lg leading-tight">{producer.representative}</p>
                <p className="text-sm font-bold text-muted-foreground">Account Manager</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
