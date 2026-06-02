import Link from 'next/link'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: 'Terms of Service — SyncMaster',
  description: 'Terms of service for SyncMaster. Last updated June 2026.',
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="py-24 max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-black tracking-tight mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: June 2, 2026</p>
          
          <div className="flex flex-col gap-10 text-muted-foreground leading-relaxed">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">1. Acceptance of Terms</h2>
              <p>By accessing and using SyncMaster, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">2. The Platform</h2>
              <p>SyncMaster is a curated sync licensing platform connecting African composers with global sync briefs. We facilitate matching and licensing deals but do not guarantee specific placements.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">3. Composer Obligations</h2>
              <p>Composers must provide accurate rights documentation and ensure they have the full legal right to license any music submitted to the platform. Misrepresentation of rights is grounds for immediate termination.</p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">4. Commission & Fees</h2>
              <p>SyncMaster operates on a commission-only basis for composers (typically 20% of the sync fee). Supervisors can post briefs for free. Detailed fee structures are outlined in individual licensing agreements.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">5. Intellectual Property</h2>
              <p>Composers retain ownership of their musical works. SyncMaster is granted a non-exclusive right to represent and pitch the music to potential licensees during the duration of their roster membership.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
