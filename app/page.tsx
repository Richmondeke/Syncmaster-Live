'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Shield, Globe, Layers, Sparkles, Mic2, Film } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-screen-2xl w-full mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-40 h-10 transition-transform group-hover:scale-105">
              <Image
                src="/syncmasterwhite.png"
                alt="SyncMaster Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#solutions" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
            <Link href="/composers" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">For Composers</Link>
            <Link href="/supervisors" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">For Supervisors</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">Login</Link>
            <ThemeToggle />
            <Link
              href="/signup"
              className={buttonVariants({ variant: "default", size: "sm" }) + " rounded-full px-6 font-bold"}
            >
              Get early access
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
            <div className="absolute top-40 left-1/4 w-[600px] h-[400px] bg-fuchsia-500/10 blur-[100px] rounded-full opacity-30" />
          </div>

          <div className="max-w-screen-2xl w-full mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center gap-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Sparkles className="w-3.5 h-3.5" />
                African Composers. Global Briefs.
              </div>

              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[1.1] max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                Your music, placed in <span className="text-primary italic">film, TV, games and ads</span> worldwide.
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                SyncMaster connects vetted African composers with briefs from production houses worldwide. Human curation. Rights clarity. 3–5 curated matches — not 500 unvetted submissions.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Link
                  href="/signup"
                  className={buttonVariants({ size: "lg" }) + " h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 gap-2"}
                >
                  Get early access
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/composers"
                  className={buttonVariants({ variant: "outline", size: "lg" }) + " h-16 px-10 rounded-2xl text-lg font-bold gap-2"}
                >
                  I&apos;m a composer
                </Link>
              </div>

              {/* Platform logos */}
              <div className="flex flex-col items-center gap-8 mt-12 mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Discover opportunities across
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <Image src="/Netflixlogo.png" alt="Netflix" width={100} height={40} className="object-contain h-8 md:h-10" />
                  <Image src="/Hululogo.webp" alt="Hulu" width={100} height={40} className="object-contain h-6 md:h-8" />
                  <Image src="/Primevideo.png" alt="Prime Video" width={100} height={40} className="object-contain h-8 md:h-10" />
                  <Image src="/Disneylogo.png" alt="Disney" width={100} height={40} className="object-contain h-10 md:h-12" />
                  <Image src="/HBOlogo.svg" alt="HBO" width={80} height={40} className="object-contain h-6 md:h-8" />
                  <Image src="/Paramountlogo.svg" alt="Paramount" width={100} height={40} className="object-contain h-8 md:h-10" />
                  <Image src="/EAlogo.png" alt="EA" width={50} height={40} className="object-contain h-8 md:h-10" />
                  <Image src="/NBA2klogo.png" alt="NBA 2K" width={80} height={40} className="object-contain h-8 md:h-10" />
                </div>
              </div>

              {/* Dashboard preview */}
              <div className="mt-12 relative w-full max-w-6xl mx-auto group animate-in zoom-in-95 duration-1000 delay-300">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-fuchsia-600 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative rounded-[2.5rem] border border-border bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden">
                  <div className="absolute top-0 w-full h-12 bg-muted/50 border-b border-border flex items-center px-6 gap-2 z-20">
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="w-3 h-3 rounded-full bg-border" />
                  </div>
                  <div className="pt-12 relative aspect-video bg-background">
                    <Image
                      src="/dashboard-preview.png"
                      alt="SyncMaster Dashboard"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Built for the sync workflow</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Every tool a composer or supervisor needs — from first brief to final placement.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Unified Catalog</h3>
                  <p className="text-muted-foreground leading-relaxed">Upload, tag, and organize your tracks with your EPK — ready to pitch the moment a brief lands.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-card border border-border hover:border-emerald-500/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Curated Matching</h3>
                  <p className="text-muted-foreground leading-relaxed">AI-assisted and human-verified. Producers get 3–5 perfect matches. Composers get real opportunities.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-card border border-border hover:border-orange-500/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Rights Clarity</h3>
                  <p className="text-muted-foreground leading-relaxed">Every composer manually vetted. Every placement fully cleared. No surprises at the licensing stage.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Who it&apos;s built for</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Two sides of the same sync deal — both served without compromise.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link href="/composers" className="group flex flex-col gap-6 p-10 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic2 className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">For Composers</h3>
                  <p className="text-muted-foreground leading-relaxed">Talented but invisible? We vet you once, then match you to briefs from producers worldwide. Your EPK travels the globe while you focus on music.</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold text-sm mt-auto pt-2">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link href="/supervisors" className="group flex flex-col gap-6 p-10 rounded-[2.5rem] bg-card border border-border hover:border-emerald-500/50 transition-all hover:shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Film className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">For Supervisors</h3>
                  <p className="text-muted-foreground leading-relaxed">Post a brief and receive 3–5 hand-curated African tracks within days. Vetted. Rights-cleared. No directories. No noise.</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm mt-auto pt-2">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="flex flex-col items-center text-center gap-8 p-16 rounded-[3rem] bg-primary/5 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  Early Access Open
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-2xl">Ready to get your music placed?</h2>
                <p className="text-lg text-muted-foreground max-w-xl">Join the first cohort of African composers and supervisors on SyncMaster.</p>
                <Link
                  href="/signup"
                  className={buttonVariants({ size: "lg" }) + " h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 gap-2"}
                >
                  Get early access
                  <ArrowRight className="w-5 h-5" />
                </Link>
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
