import Link from 'next/link'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: 'Privacy Policy — SyncMaster',
  description: 'Privacy policy for SyncMaster. We respect your data and the privacy of our composers and supervisors.',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="py-24 max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: June 2, 2026</p>
          </div>
          
          <div className="flex flex-col gap-10 text-muted-foreground leading-relaxed">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">1. Information We Collect</h2>
              <p>We collect information necessary to operate the platform, including composer profiles, contact details, and rights documentation. For supervisors, we collect brief details and project context.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">2. How We Use Your Data</h2>
              <p>Your data is used to facilitate matching, communicate brief opportunities, and manage licensing deals. We do not sell your personal information to third parties.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">3. Security</h2>
              <p>We implement industry-standard security measures to protect your data and rights documentation. Audio files are hosted securely with restricted access.</p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">4. Cookies</h2>
              <p>We use essential cookies for authentication and platform functionality. We do not use invasive tracking cookies for advertising purposes.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground">5. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time through your dashboard or by contacting us directly.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
