import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Film, Sparkles, Shield, Clock, BarChart3, Users, FileSearch, Zap } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: "For Supervisors — SyncMaster",
  description: "Post a brief and receive 3–5 hand-curated, rights-cleared African tracks within days. No directories. No noise. Just the right music.",
}

const steps = [
  {
    number: "01",
    title: "Post a brief",
    description: "Describe your project — mood, tempo, genre, placement context, deadline. It takes less than 5 minutes and goes straight to our curation team.",
  },
  {
    number: "02",
    title: "We curate your matches",
    description: "Our AI-assisted engine + human editors review the composer roster and select the best fits. Every composer is pre-vetted and rights-verified.",
  },
  {
    number: "03",
    title: "Review 3–5 tracks",
    description: "Not 500 submissions. Just 3–5 hand-picked tracks that actually match your brief. Stream, shortlist, and share directly from the platform.",
  },
  {
    number: "04",
    title: "Close with clarity",
    description: "Once you select a track, we facilitate the licensing deal. Rights documentation is already in order — no last-minute legal surprises.",
  },
]

const features = [
  {
    icon: FileSearch,
    title: "Brief Management",
    description: "Create and manage multiple briefs simultaneously. Track status from active to matched to closed in one clean dashboard.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Matching",
    description: "Our brief analyzer reads your project context and surfaces the most relevant composers from our vetted roster — then a human editor confirms the picks.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Users,
    title: "Composer Profiles",
    description: "Every match comes with a full EPK — bio, catalog, audio samples, and placement history. Make informed decisions before you even listen.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Shield,
    title: "Rights Clarity",
    description: "Every composer is manually vetted before joining the platform. Rights documentation verified. No surprises when it's time to license.",
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Most briefs are matched within 2–5 business days. For time-sensitive placements, flag it and we prioritize accordingly.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: BarChart3,
    title: "Placement History",
    description: "Track every brief, every submission, every deal in one place. Build your own library of African music you&apos;ve licensed and loved.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
]

export default function SupervisorsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      {/* Navigation */}
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
                <Film className="w-3.5 h-3.5" />
                For Music Supervisors &amp; Producers
              </div>

              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Stop sifting. Start placing <span className="text-primary italic">great African music.</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Post a brief and receive 3–5 hand-curated, rights-cleared African tracks within days. No open directories. No 500-submission inboxes. Just the right music, ready to license.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full max-w-md md:max-w-none px-6 md:px-0">
                <Link
                  href="/signup"
                  className={buttonVariants({ size: "lg" }) + " w-full sm:w-auto h-14 md:h-16 px-6 md:px-10 rounded-2xl text-base md:text-lg font-black shadow-2xl shadow-primary/20 gap-2"}
                >
                  Post your first brief
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground font-medium animate-in fade-in duration-1000">
                {["3–5 curated matches", "Rights pre-verified", "2–5 day turnaround", "Human + AI curation"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-wider w-fit">
                  The old way
                </div>
                <h2 className="text-4xl font-black tracking-tight">You post. 500 people submit. You spend a week listening to the wrong music.</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Generic sync platforms are open directories. Anyone can submit anything. The result is an inbox full of unvetted tracks — most of them wrong for your project, none of them rights-clear. That&apos;s your time. We protect it.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                  <Zap className="w-3 h-3" />
                  The SyncMaster way
                </div>
                <h2 className="text-4xl font-black tracking-tight">You post. We curate. You choose from 3–5 perfect fits.</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our team reads your brief, matches it against our vetted roster, and delivers a shortlist of the best African composers for your specific project. Every track comes with cleared rights and a full composer profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">How it works</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">From brief to placement in four steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-card border border-border">
                  <span className="text-5xl font-black text-primary/20 leading-none">{step.number}</span>
                  <h3 className="text-xl font-black tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Everything you need to place</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tools designed around your workflow — not a generic marketplace bolted with a music player.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col gap-5 p-8 rounded-[2rem] bg-card border border-border hover:border-border/80 transition-colors group">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                  </div>
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
                <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-2xl">Your next brief deserves the right music.</h2>
                <p className="text-lg text-muted-foreground max-w-xl">Post your brief today. We&apos;ll have curated matches for you within days.</p>
                <Link
                  href="/signup"
                  className={buttonVariants({ size: "lg" }) + " w-full sm:w-auto h-14 md:h-16 px-6 md:px-10 rounded-2xl text-base md:text-lg font-black shadow-2xl shadow-primary/20 gap-2"}
                >
                  Post your first brief
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-sm text-muted-foreground">Commission on confirmed placements only. No subscription required to post a brief.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
