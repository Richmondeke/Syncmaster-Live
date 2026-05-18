import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Shield, Globe, Layers, Sparkles, ArrowDownToLine } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

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
            <Link href="#pricing" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">Login</Link>
            <Link 
              href="/dashboard" 
              className={buttonVariants({ variant: "default", size: "sm" }) + " rounded-full px-6 font-bold"}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
            <div className="absolute top-40 left-1/4 w-[600px] h-[400px] bg-fuchsia-500/10 blur-[100px] rounded-full opacity-30" />
          </div>

          <div className="max-w-screen-2xl w-full mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center gap-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Sparkles className="w-3.5 h-3.5" />
                Next Generation Sync Platform
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.04em] leading-[1.1] max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                Get your songs synced in <span className="text-primary italic">TV, Games, Movies and Ads</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Join thousands of artistes using Syncmaster to discover and track sync opportunities. Syncmaster provides artistes and labels the tools they need to manage their sync operations.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Link 
                  href="/waiting-list" 
                  className={buttonVariants({ size: "lg" }) + " h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 gap-2"}
                >
                  Join waiting list
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Logos Section */}
              <div className="flex flex-col items-center gap-8 mt-12 mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Discover opportunities across...
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

              {/* DASHBOARD PREVIEW IMAGE - The core request */}
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
                      alt="SyncMaster Dashboard Preview" 
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

        {/* Feature Grid */}
        <section id="features" className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Unified Catalog</h3>
                  <p className="text-muted-foreground leading-relaxed">Manage thousands of tracks with AI-powered tagging and metadata optimization.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-card border border-border hover:border-emerald-500/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Global Network</h3>
                  <p className="text-muted-foreground leading-relaxed">Connect directly with industry-leading music supervisors and production houses.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-card border border-border hover:border-orange-500/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Rights Clarity</h3>
                  <p className="text-muted-foreground leading-relaxed">Ensure every placement is fully cleared with our integrated verification engine.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Brand Assets / Downloads Section */}
        <section id="downloads" className="py-24 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-card border border-border rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
              
              <div className="flex flex-col gap-6 max-w-xl text-center lg:text-left relative z-10">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Brand Assets</h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  Download the official SyncMaster logos for use in your presentations, marketing materials, and press kits.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                <a 
                  href="/syncmasterwhite.png" 
                  download 
                  className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-muted/50 border border-border hover:border-primary/50 transition-all group no-underline"
                >
                  <div className="w-40 h-10 relative">
                    <Image src="/syncmasterwhite.png" alt="Light Logo" fill className="object-contain" />
                  </div>
                  <span className="text-sm font-bold flex items-center gap-2 group-hover:text-primary transition-colors text-foreground">
                    Download Light Logo
                    <ArrowDownToLine className="w-4 h-4" />
                  </span>
                </a>
                
                <a 
                  href="/Syncdark.png" 
                  download 
                  className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-[#0f0f1a] border border-white/10 hover:border-primary/50 transition-all group no-underline"
                >
                  <div className="w-40 h-10 relative">
                    <Image src="/Syncdark.png" alt="Dark Logo" fill className="object-contain" />
                  </div>
                  <span className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-primary transition-colors">
                    Download Dark Logo
                    <ArrowDownToLine className="w-4 h-4" />
                  </span>
                </a>
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
                <Image 
                  src="/syncmasterwhite.png" 
                  alt="SyncMaster Logo" 
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground font-medium">© 2026 SyncMaster Operations. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-8 text-sm font-bold text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
