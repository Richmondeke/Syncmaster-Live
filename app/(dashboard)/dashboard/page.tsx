import { ArrowRight, Sparkles, Search, Building2, CheckSquare, FileText, LayoutGrid, Users, Music2, Radio } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cookies } from 'next/headers'
import type { Role } from '@/types/database.types'
import { Suspense } from 'react'
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
    description: 'Track your pitches and submissions',
    href: '/dashboard/submissions',
    icon: FileText,
    color: 'bg-orange-500/10 text-orange-500',
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
  let role: Role = 'admin'
  let fullName = 'Godliverse'

  try {
    const cookieStore = await cookies()
    role = (cookieStore.get('role')?.value || 'admin') as Role
    fullName = cookieStore.get('full_name')?.value || 'Godliverse'
  } catch {
    // cookies() failed — use defaults
  }

  const filteredTools = TOOLS.filter((tool) => !tool.adminOnly || role === 'admin')

  return (
    <div className="flex flex-col gap-10 pt-2 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground sm:text-5xl">
          Welcome, {fullName}
        </h1>
        <Suspense fallback={null}>
          <UserBadgeModal />
        </Suspense>
      </div>

      {/* Hero Banner */}
      <section className="group relative overflow-hidden rounded-[2.5rem] bg-[#4b4bc0] p-10 md:p-14 text-white shadow-2xl transition-all duration-500 border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-8 max-w-2xl text-center md:text-left">
            <div className="space-y-5">
              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.068em] leading-[1.1]">
                Your sync operations, simplified.
              </h2>
              <p className="text-lg md:text-2xl text-white/80 font-medium tracking-[-0.04em] max-w-xl leading-normal">
                {role === 'composer'
                  ? 'Upload your catalog, track submissions, and connect with supervisors from one central hub.'
                  : role === 'producer'
                  ? 'Post briefs, review curated matches, and track placements from one central hub.'
                  : 'Manage the full roster, match briefs, and track every placement.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-2">
              <Link
                href="/dashboard/briefs"
                className={buttonVariants({ variant: "default", size: "lg" }) + " rounded-2xl px-10 h-16 text-lg font-black bg-white text-[#4b4bc0] hover:bg-white/90 border-none transition-all shadow-xl shadow-black/10"}
              >
                Explore Briefs
              </Link>
              {(role === 'composer' || role === 'admin') && (
                <Link
                  href="/dashboard/tracks"
                  className={buttonVariants({ variant: "outline", size: "lg" }) + " border-white/20 bg-white/5 font-black text-white hover:bg-white/10 backdrop-blur-sm px-10 h-16 text-lg rounded-2xl"}
                >
                  View Catalog
                </Link>
              )}
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
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/30 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-black/30 blur-[120px]" />
      </section>

      {/* Top Briefs — Empty State */}
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

        <div className="flex flex-col items-center justify-center py-16 text-center gap-4 rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/20">
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
