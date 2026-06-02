import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Mic2, FileText, Radio, BarChart3, Sparkles, Globe2, Music2, Send } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { ThemeToggle } from '@/components/ThemeToggle'

export const metadata = {
  title: "For Composers — SyncMaster",
  description: "Get vetted, receive brief invites, and land sync placements in film, TV, games and ads. SyncMaster is the curated sync pathway for African composers.",
}

const steps = [
  {
    number: "01",
    title: "Apply to the platform",
    description: "Submit your profile, genre, and a sample of your best work. Our team reviews every application personally — no bots, no automated rejections.",
  },
  {
    number: "02",
    title: "Get vetted by our team",
    description: "Once approved, you join a curated roster of composers. Your rights documentation is verified so you're ready to pitch any brief, anywhere.",
  },
  {
    number: "03",
    title: "Receive brief invites",
    description: "When a brief matches your sound, we invite you directly. No browsing thousands of listings. No cold submissions into a void. Just relevant opportunities.",
  },
  {
    number: "04",
    title: "Submit and get placed",
    description: "Submit up to 3 tracks per brief. If your track is shortlisted, we facilitate the deal. You focus on creating — we handle the rest.",
  },
]

const features = [
  {
    icon: FileText,
    title: "Electronic Press Kit",
    description: "Build a professional EPK with your bio, catalog, and audio samples. Share a single link with any producer or supervisor in the world.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Music2,
    title: "Track Catalog",
    description: "Organize and tag your full catalog inside SyncMaster. When a brief drops, your best tracks are already ready to pitch.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Send,
    title: "Direct Brief Invites",
    description: "No cold outreach. No mass submission forms. When you're the right fit, we bring the brief to you personally.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "Placement Tracking",
    description: "See every submission, shortlist, and confirmed placement in one dashboard. Your sync history builds your credibility over time.",
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
  },
  {
    icon: Radio,
    title: "Radio Directory",
    description: "Discover radio stations and music supervisors actively looking for African sound. Expand your network beyond sync.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description: "Your profile and EPK are accessible to producers and supervisors from Netflix to Nollywood. One platform, worldwide visibility.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
]

export default function ComposersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-screen-2xl w-full mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-40 h-10 transition-transform group-hover:scale-105">
              <Image src="/syncmasterwhite.png" alt="SyncMaster Logo" fill className="object-contain" priority />
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link href="/#features" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/#solutions" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
            <Link href="/composers" className="text-sm font-bold text-foreground transition-colors">For Composers</Link>
            <Link href="/supervisors" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">For Supervisors</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">Login</Link>
            <ThemeToggle />
            <Link href="/signup" className={buttonVariants({ variant: "default", size: "sm" }) + " rounded-full px-6 font-bold"}>
              Get early access
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
          </div>

          <div className="max-w-screen-2xl w-full mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center gap-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Mic2 className="w-3.5 h-3.5" />
                For Composers
              </div>

              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Your talent belongs on <span className="text-primary italic">the world stage.</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                You have the sound. We have the connections. SyncMaster is the bridge between African composers and the global briefs that need you — without the gatekeepers, the guesswork, or the silence.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Link
                  href="/signup"
                  className={buttonVariants({ size: "lg" }) + " h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 gap-2"}
                >
                  Apply as a composer
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground font-medium animate-in fade-in duration-1000">
                {["Manually vetted", "Rights verified", "No submission fees", "Direct brief invites"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The problem we solve */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-wider w-fit">
                  The problem
                </div>
                <h2 className="text-4xl font-black tracking-tight">Technically skilled. Professionally invisible.</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  African composers produce world-class music every day. But the global sync industry doesn&apos;t have a direct line to you. Platforms built for the West ignore the African sound. Labels in Lagos don&apos;t have London connections. The music exists — the pathway doesn&apos;t.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider w-fit">
                  <Sparkles className="w-3 h-3" />
                  The SyncMaster way
                </div>
                <h2 className="text-4xl font-black tracking-tight">One vetting. Lifetime access.</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Apply once. Get verified once. Then sit back and let the briefs come to you. Every time a producer needs your sound, we call you — not the other 500 composers on an open directory.
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
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">Four steps from application to placement.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-card border border-border relative">
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
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Everything you need to get placed</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tools built specifically for the composer — not a generic platform repurposed for music.</p>
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
                <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-2xl">Your next placement starts with an application.</h2>
                <p className="text-lg text-muted-foreground max-w-xl">Join the SyncMaster composer roster. We review every application personally.</p>
                <Link
                  href="/signup"
                  className={buttonVariants({ size: "lg" }) + " h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 gap-2"}
                >
                  Apply as a composer
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-sm text-muted-foreground">No fees. No subscription. Commission only on confirmed placements.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-20 bg-card">
        <div className="max-w-screen-2xl w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-32 h-8">
                <Image src="/syncmasterwhite.png" alt="SyncMaster Logo" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground font-medium">© 2026 SyncMaster Operations. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-muted-foreground">
            <Link href="/composers" className="hover:text-foreground transition-colors">For Composers</Link>
            <Link href="/supervisors" className="hover:text-foreground transition-colors">For Supervisors</Link>
            <Link href="/brand" className="hover:text-foreground transition-colors">Brand Assets</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
