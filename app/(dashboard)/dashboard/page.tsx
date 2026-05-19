import { getAdminClient } from '@/lib/supabase/admin'
import { Clock, ArrowRight, Sparkles, Search, Building2, CheckSquare, FileText, LayoutGrid, Users, Music2, Radio } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { BriefCard, type BriefCardData } from '@/components/briefs/BriefCard'
import { cookies } from 'next/headers'
import type { Role } from '@/types/database.types'
import { UserBadgeModal } from '@/components/dashboard/UserBadgeModal'

const TOOLS = [
  {
    label: 'AI Tagger',
    description: 'Auto-tag tracks with smart AI engine',
    href: '/dashboard/tagger',
    icon: Sparkles,
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    label: 'Sound Radar',
    description: 'Discover trending sync sounds',
    href: '/dashboard/radar',
    icon: Search,
    color: 'bg-fuchsia-500/10 text-fuchsia-500',
  },
  {
    label: 'Agency Directory',
    description: 'Connect with music supervisors',
    href: '/dashboard/directory',
    icon: Building2,
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    label: 'Radio Directory',
    description: 'Connect with college radio stations',
    href: '/dashboard/radio-directory',
    icon: Radio,
    color: 'bg-violet-500/10 text-violet-500',
  },
  {
    label: 'Submissions',
    description: 'Manage track submissions',
    href: '/dashboard/submissions',
    icon: FileText,
    color: 'bg-orange-500/10 text-orange-500',
    adminOnly: true
  },
  {
    label: 'Marketplace',
    description: 'Explore opportunities',
    href: '/dashboard/marketplace',
    icon: LayoutGrid,
    color: 'bg-rose-500/10 text-rose-500',
    adminOnly: true
  },
  {
    label: 'Composers',
    description: 'Manage composer applications',
    href: '/dashboard/composers',
    icon: Users,
    color: 'bg-cyan-500/10 text-cyan-500',
    adminOnly: true
  },
  {
    label: 'Producers',
    description: 'Manage producer profiles',
    href: '/dashboard/producers',
    icon: Building2,
    color: 'bg-indigo-500/10 text-indigo-500',
    adminOnly: true
  },
  {
    label: 'Tasks',
    description: 'Pending operations',
    href: '/dashboard/tasks',
    icon: CheckSquare,
    color: 'bg-blue-500/10 text-blue-500',
    adminOnly: true
  },
]

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const roleOverride = (cookieStore.get('role')?.value || 'admin') as Role
  const fullNameOverride = cookieStore.get('full_name')?.value || 'Godliverse'

  const profile = { role: roleOverride, full_name: fullNameOverride }
  const composer = { status: 'active' }

  // Fetch live briefs from mock DB
  const supabase = getAdminClient()
  const { data: briefs } = await supabase
    .from('briefs')
    .select('id, title, description, genres, budget_min, budget_max, deadline, status, producers:producers(company, profiles:profiles(full_name))')
    .eq('status', 'active')
    .limit(5)

  const topBriefs: BriefCardData[] = (briefs || []) as BriefCardData[]
  const filteredTools = TOOLS.filter((tool) => !tool.adminOnly || profile.role === 'admin')

  if (composer?.status === 'pending') {
    return (
      <div className="flex flex-col gap-8 pt-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Dashboard</h1>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-md">
          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-primary mt-1 shrink-0" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Application under review</h2>
              <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-2xl">
                We&apos;ve received your application and our team is reviewing it. We manually vet every
                composer to ensure rights clarity and quality standards. We&apos;ll notify you by email
                once the review is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (composer?.status === 'rejected') {
    return (
      <div className="flex flex-col gap-8 pt-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Dashboard</h1>
        <div className="rounded-3xl border border-destructive/30 bg-card p-8">
          <h2 className="text-xl font-black tracking-[-0.068em] leading-[1.2] text-destructive">Application not approved</h2>
          <p className="text-base text-muted-foreground font-medium mt-2 leading-relaxed max-w-2xl">
            Unfortunately your application wasn&apos;t approved at this time. Please contact us if
            you have any questions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 pt-2 pb-12 max-w-7xl mx-auto">
      {/* Header section with greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground sm:text-5xl">
          Welcome, {profile.full_name}
        </h1>
        <UserBadgeModal />
      </div>

      {/* Hero Banner - Premium & Modern */}
      <section className="group relative overflow-hidden rounded-[2.5rem] bg-[#4b4bc0] p-10 md:p-14 text-white shadow-2xl transition-all duration-500 border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-8 max-w-2xl text-center md:text-left">
            <div className="space-y-5">
              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.068em] leading-[1.1]">
                Your sync operations, simplified.
              </h2>
              <p className="text-lg md:text-2xl text-white/80 font-medium tracking-[-0.04em] max-w-xl leading-normal">
                Manage your music assets, track submissions, and connect with supervisors from one central hub.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-2">
              <Link 
                href="/dashboard/briefs"
                className={buttonVariants({ variant: "default", size: "lg" }) + " rounded-2xl px-10 h-16 text-lg font-black bg-white text-[#4b4bc0] hover:bg-white/90 border-none transition-all shadow-xl shadow-black/10"}
              >
                  Explore Briefs
              </Link>
              <Link 
                href="/dashboard/tracks"
                className={buttonVariants({ variant: "outline", size: "lg" }) + " border-white/20 bg-white/5 font-black text-white hover:bg-white/10 backdrop-blur-sm px-10 h-16 text-lg rounded-2xl"}
              >
                  View Catalog
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block shrink-0 relative">
            <div className="relative h-[280px] w-[460px] overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-md shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
              <Image 
                src="/dashboard-preview.png" 
                alt="Dashboard Preview" 
                fill 
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            {/* Decorative background flair */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/30 rounded-full blur-3xl" />
          </div>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-black/30 blur-[120px]" />
      </section>

      {/* Top Briefs Row */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Top Briefs</h2>
            <p className="text-sm font-medium text-muted-foreground tracking-[-0.02em]">Latest opportunities from producers</p>
          </div>
          <Link
            href="/dashboard/briefs"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="relative -mx-4 md:-mx-6">
          {topBriefs.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto px-4 md:px-6 pb-4 scrollbar-hide relative z-0">
              {topBriefs.map((brief) => (
                <div key={brief.id}>
                  <BriefCard brief={brief} showProducer />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4 rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/20 mx-4 md:mx-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Music2 className="w-7 h-7 text-primary/60" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-foreground/70">No active briefs yet</p>
                <p className="text-sm text-muted-foreground">Check back soon — new opportunities are added regularly.</p>
              </div>
              <Link href="/dashboard/briefs" className={buttonVariants({ variant: 'outline', size: 'sm' }) + ' rounded-full mt-2'}>
                Browse all briefs
              </Link>
            </div>
          )}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-[5]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-[5]" />
        </div>
      </section>

      {/* Tools Section */}
      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-foreground/5 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Tools</h2>
            <p className="text-sm font-medium text-muted-foreground tracking-[-0.02em]">Centralized utilities for your operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link 
              key={tool.href} 
              href={tool.href}
              className="group relative flex items-center gap-6 rounded-[2rem] border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <div className={`w-16 h-16 shrink-0 rounded-2xl ${tool.color} flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-sm`}>
                <tool.icon className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-black text-lg tracking-[-0.04em] text-foreground leading-tight">
                  {tool.label}
                </h3>
                <p className="text-sm font-medium text-muted-foreground tracking-[-0.02em] opacity-80 leading-snug">
                  {tool.description}
                </p>
              </div>
              <ArrowRight className="ml-auto w-6 h-6 text-muted-foreground opacity-0 -translate-x-3 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
