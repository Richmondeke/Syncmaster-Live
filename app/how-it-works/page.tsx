import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Layers,
  Mic2,
  BarChart3,
  FileSearch,
  Music2,
  Users,
} from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: 'How It Works — SyncMaster',
  description:
    'SyncMaster runs a two-sided curation system. Composers are vetted before they join. Supervisors get 3–5 matched tracks, not 500 unfiltered submissions.',
}

const composerSteps = [
  {
    number: '01',
    title: 'Apply to the roster',
    description: 'Submit your profile and sample work. Every application is reviewed by a human.',
  },
  {
    number: '02',
    title: 'Get vetted',
    description: 'Rights documentation verified. Stems confirmed. Metadata complete. You’re brief-ready.',
  },
  {
    number: '03',
    title: 'Receive brief invites',
    description: 'When a brief matches your sound, we contact you directly. No cold submissions into the void.',
  },
  {
    number: '04',
    title: 'Submit and earn',
    description: 'Up to 3 tracks per brief. If selected, we facilitate the licensing deal. You keep your rights.',
  },
]

const supervisorSteps = [
  {
    number: '01',
    title: 'Post a brief',
    description: 'Describe the project, mood, tempo, genre, deadline. Takes under 5 minutes.',
  },
  {
    number: '02',
    title: 'We match your brief',
    description: 'Our curation engine + human editors review the roster and select the best fits.',
  },
  {
    number: '03',
    title: 'Review 3–5 tracks',
    description: 'Not 500 submissions. Hand-picked tracks with full metadata, stems, and rights documentation.',
  },
  {
    number: '04',
    title: 'Close the deal',
    description: 'Select a track. We facilitate licensing. Rights are already verified — no last-minute surprises.',
  },
]

const curationLayers = [
  {
    icon: Sparkles,
    title: 'AI Brief Analysis',
    description: 'Our engine reads the brief and maps it to genre, mood, tempo, instrumentation, and cultural markers across the composer roster.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Users,
    title: 'Human Editorial',
    description: 'A SyncMaster editor reviews every AI match. We don’t ship a shortlist without a human signing off on every track.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Shield,
    title: 'Rights Pre-clearance',
    description: 'Before any track reaches a supervisor, ownership, splits, ISRC, and master rights are confirmed. Zero surprises.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
]

const stats = [
  { value: '3–5', label: 'Tracks per brief. Not 500.', sub: 'Every shortlist is hand-picked.' },
  { value: '31 hrs', label: 'Average brief-to-delivery time.', sub: 'Month 2 baseline.' },
  { value: '0', label: 'Rights issues across all placements to date.', sub: 'Pre-cleared before delivery.' },
  { value: '$500M', label: 'Global sync market.', sub: 'African composers earn a fraction of a percent. We’re changing that.' },
]

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
            <div className="absolute top-32 left-1/4 w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full opacity-40" />
          </div>
          <div className="max-w-screen-2xl w-full mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center gap-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Layers className="w-3.5 h-3.5" />
                How It Works
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.068em] leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Brief in. Curated tracks out.{' '}
                <span className="text-primary italic">No noise.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-3xl">
                SyncMaster runs a two-sided curation system. Composers are vetted before they join. Supervisors get 3&ndash;5 matched tracks, not 500 unfiltered submissions. Here&apos;s the full loop.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full max-w-md md:max-w-none px-6 md:px-0">
                <Link href="/composers" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' w-full sm:w-auto h-14 px-6 md:px-8 rounded-2xl text-base font-black gap-2'}>
                  I&apos;m a composer <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/supervisors" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' w-full sm:w-auto h-14 px-6 md:px-8 rounded-2xl text-base font-black gap-2'}>
                  I need music <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Two-column split */}
        <section className="py-24 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden border border-border/50">
              {/* Composer side */}
              <div className="flex flex-col gap-10 p-12 md:p-16 bg-card/50 border-b lg:border-b-0 lg:border-r border-border/50">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                    <Mic2 className="w-3 h-3" />
                    For Composers
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-[-0.068em] leading-tight">
                    From application to placement.
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed">One roster. Curated briefs. No blind submissions.</p>
                </div>
                <div className="flex flex-col gap-8">
                  {composerSteps.map((step) => (
                    <div key={step.number} className="flex gap-6 items-start">
                      <span className="text-4xl font-black text-primary/25 leading-none shrink-0 tabular-nums">{step.number}</span>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-black tracking-tight text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/signup" className={buttonVariants({ variant: 'default', size: 'lg' }) + ' w-full sm:w-auto h-12 px-6 rounded-xl font-black gap-2'}>
                  Apply to the roster <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Supervisor side */}
              <div className="flex flex-col gap-10 p-12 md:p-16 bg-emerald-500/5">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider w-fit">
                    <Music2 className="w-3 h-3" />
                    For Supervisors
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-[-0.068em] leading-tight">
                    From brief to licensed track.
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed">Post once. Receive the right music. No haystack.</p>
                </div>
                <div className="flex flex-col gap-8">
                  {supervisorSteps.map((step) => (
                    <div key={step.number} className="flex gap-6 items-start">
                      <span className="text-4xl font-black text-emerald-500/30 leading-none shrink-0 tabular-nums">{step.number}</span>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-black tracking-tight text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/signup" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' w-full sm:w-auto h-12 px-6 rounded-xl font-black gap-2 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'}>
                  Post a brief <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Curation layer */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-20 flex flex-col gap-4 items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <Zap className="w-3 h-3" />
                The Curation Layer
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] max-w-2xl">What happens in the middle</h2>
              <p className="text-lg text-muted-foreground max-w-xl">The part no other platform does.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {curationLayers.map((layer) => (
                <div key={layer.title} className="flex flex-col gap-5 p-8 rounded-[2rem] bg-card border border-border/50 hover:border-border transition-colors group">
                  <div className={`w-12 h-12 rounded-xl ${layer.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <layer.icon className={`w-6 h-6 ${layer.color}`} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-black tracking-tight">{layer.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{layer.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-3xl mx-auto">
              <blockquote className="relative p-10 md:p-14 rounded-[2rem] border-l-4 border-l-primary bg-card border border-border/50">
                <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                <p className="text-xl md:text-2xl font-black tracking-[-0.04em] leading-relaxed text-foreground relative z-10">
                  &ldquo;A Lagos-based independent composer. Clean rights from day one. Second brief: a global campaign for an international NGO. That placement paid more than 6 months of streaming income.&rdquo;
                </p>
                <footer className="mt-6 text-sm font-bold text-muted-foreground relative z-10">
                  Composer, SyncMaster Roster &middot; Lagos
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-20 flex flex-col gap-4 items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <BarChart3 className="w-3 h-3" />
                By the Numbers
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em]">The model in numbers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.value} className="flex flex-col gap-3 p-8 rounded-[2rem] bg-card border border-border/50 hover:border-border transition-colors">
                  <span className="font-black text-5xl md:text-6xl tracking-tight text-primary leading-none tabular-nums">{stat.value}</span>
                  <p className="text-base font-black text-foreground leading-snug">{stat.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dual CTA */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden border border-border/50">
              <div className="relative flex flex-col items-start gap-6 p-12 md:p-16 bg-primary/5 border-b md:border-b-0 md:border-r border-border/50 overflow-hidden">
                <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                    <Mic2 className="w-3 h-3" /> Composers
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-[-0.068em] leading-tight">Ready to join the roster?</h3>
                  <p className="text-muted-foreground text-base leading-relaxed max-w-sm">Applications reviewed individually. Rights-verified. Brief-ready.</p>
                  <Link href="/signup" className={buttonVariants({ variant: 'default', size: 'lg' }) + ' w-full sm:w-auto h-14 px-8 rounded-2xl text-base font-black gap-2 shadow-2xl shadow-primary/20'}>
                    Apply as a composer <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="relative flex flex-col items-start gap-6 p-12 md:p-16 bg-emerald-500/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider w-fit">
                    <FileSearch className="w-3 h-3" /> Supervisors
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-[-0.068em] leading-tight">Have a brief to fill?</h3>
                  <p className="text-muted-foreground text-base leading-relaxed max-w-sm">Describe your project. We&apos;ll have 3&ndash;5 curated matches in your inbox within days.</p>
                  <Link href="/signup" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' w-full sm:w-auto h-14 px-8 rounded-2xl text-base font-black gap-2 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'}>
                    Post a brief <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
