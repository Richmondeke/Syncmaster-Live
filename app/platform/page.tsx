import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { ThemeToggle } from '@/components/ThemeToggle'
import { PlatformTabs } from '@/components/platform/PlatformTabs'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: 'The Platform — SyncMaster',
  description:
    'From brief to placement, SyncMaster manages the full sync licensing workflow for composers and supervisors. No scattered tools. No missing documentation.',
}

const differentiators = [
  {
    headline: '3–5 matches. Not 500.',
    body: 'Every brief returns a curated shortlist, not an open call. Supervisors get less noise. Composers get more relevant opportunities.',
  },
  {
    headline: 'Human curation. Every time.',
    body: 'AI maps the brief to the roster. A human editor reviews every match before it ships. No brief goes out unreviewed.',
  },
  {
    headline: 'Rights-clean from day one.',
    body: 'Every composer on the roster has verified documentation before they receive their first brief invite. Zero rights surprises.',
  },
]

export default function PlatformPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
          </div>
          <div className="max-w-screen-2xl w-full mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center gap-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Zap className="w-3.5 h-3.5" />
                The Platform
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.068em] leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Everything the sync corridor needs.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                From brief to placement, SyncMaster manages the full workflow for composers and supervisors. No scattered tools. No missing documentation. One platform for the whole process.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Link href="/composers" className={buttonVariants({ size: 'lg' }) + ' h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 gap-2'}>
                  For composers <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/supervisors" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' h-16 px-10 rounded-2xl text-lg font-black gap-2'}>
                  For supervisors <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground font-medium animate-in fade-in duration-1000">
                {['Brief to placement in one tool', 'Rights verified at vetting', 'Human + AI curation', 'Commission only'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tab toggle */}
        <section className="py-24 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] mb-4">Two sides. One platform.</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every feature is purpose-built for the role that uses it. Composers get tools for their workflow. Supervisors get tools for theirs.
              </p>
            </div>
            <PlatformTabs />
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] mb-4">
                One dashboard. Both sides of the sync market.
              </h2>
            </div>
            <div className="relative w-full max-w-6xl mx-auto group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-fuchsia-600 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative rounded-[2.5rem] border border-border bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="absolute top-0 w-full h-12 bg-muted/50 border-b border-border flex items-center px-6 gap-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                </div>
                <div className="pt-12 relative aspect-video bg-background">
                  <Image src="/dashboard-preview.png" alt="SyncMaster Dashboard" fill className="object-cover" priority />
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
              The SyncMaster dashboard — brief management, catalog, submissions, and placements in one place.
            </p>
          </div>
        </section>

        {/* Differentiators */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] mb-4">What makes this different</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {differentiators.map((d) => (
                <div key={d.headline} className="flex flex-col gap-4 border border-border/50 rounded-2xl p-8 bg-card/50 hover:border-input transition-colors">
                  <h3 className="text-2xl font-black tracking-[-0.068em] text-foreground">{d.headline}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="flex flex-col items-center text-center gap-8 p-16 rounded-[3rem] bg-primary/5 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] max-w-2xl">Ready to use the platform?</h2>
                <p className="text-lg text-muted-foreground max-w-xl">Commission-only. No subscription fees.</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/signup" className={buttonVariants({ size: 'lg' }) + ' h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 gap-2'}>
                    Apply as a composer <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/signup" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' h-16 px-10 rounded-2xl text-lg font-black gap-2'}>
                    Post a brief <ArrowRight className="w-5 h-5" />
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
