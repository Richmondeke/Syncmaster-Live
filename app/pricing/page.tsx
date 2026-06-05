import Link from 'next/link'
import { CheckCircle2, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'
import { FAQAccordion, type FAQSection } from '@/components/pricing/FAQAccordion'

export const metadata = {
  title: 'Pricing — SyncMaster',
  description: 'SyncMaster is commission-only for composers and free to post for supervisors. No subscription fees. No hidden costs.',
}

const composerPricing = [
  {
    title: 'Success-Based',
    price: '20%',
    description: 'Commission on confirmed placements',
    features: [
      'Zero monthly fees',
      'No application fee',
      'Free EPK hosting',
      'Direct brief invites',
      'Full metadata & rights support',
    ],
  },
]

const supervisorPricing = [
  {
    title: 'Post for Free',
    price: '$0',
    description: 'To post a brief and receive matches',
    features: [
      'Unlimited brief posting',
      'AI-assisted matching',
      'Human editorial review',
      '3–5 curated matches',
      'Rights pre-verification',
    ],
  },
]

const faqSections: FAQSection[] = [
  {
    title: 'For Composers',
    items: [
      {
        q: 'How do I apply to the SyncMaster roster?',
        a: (
          <span>
            Apply through the signup flow at{' '}
            <Link href="/signup" className="text-primary hover:underline">
              syncmaster.live/signup
            </Link>
            . You&apos;ll be asked for your composer profile, a link to your work, and basic rights documentation. Our team reviews every application manually — we&apos;re not an open directory. If you&apos;re shortlisted, we&apos;ll reach out within 5 business days to begin the vetting process.
          </span>
        ),
      },
      {
        q: 'What does vetting actually check?',
        a: 'Three things: rights clarity (we need to confirm you own the master and the publishing, or have documentation if rights are split), metadata quality (proper titles, ISRC if applicable, genre tagging), and sonic readiness (stems available or can be delivered within 48 hours of a placement request). We\'re not judging genre or style at the vetting stage — we\'re checking that your music is brief-ready.',
      },
      {
        q: 'What types of music does SyncMaster represent?',
        a: 'We focus on African composers — Afrobeats, Amapiano, Afrofusion, contemporary African classical, African electronic, and hybrid genres that sit between African roots and global production styles. We do not represent artists primarily focused on hip-hop or Western pop without a strong African sonic identity. If you\'re unsure whether your sound fits, apply — our team will assess.',
      },
      {
        q: 'Are you exclusive? Can I still work with other sync agents?',
        a: 'SyncMaster is non-exclusive. You are free to work with other sync libraries, agents, or platforms simultaneously. We only ask that the specific tracks you submit to a brief are not under an exclusive hold with another party at that time. You keep full control of your catalog.',
      },
      {
        q: 'How do briefs work once I\'m on the roster?',
        a: 'When a brief matches your sonic profile, you\'ll receive a direct invite to submit. You don\'t browse an open board and self-submit — we send curated invites to the 3–5 composers whose work best fits that brief. This means you receive fewer invites than on open platforms, but each one is a genuine, targeted opportunity rather than a long shot.',
      },
    ],
  },
  {
    title: 'For Supervisors & Producers',
    items: [
      {
        q: 'How do I post a brief?',
        a: (
          <span>
            Sign up as a supervisor or producer at{' '}
            <Link href="/signup" className="text-primary hover:underline">
              syncmaster.live/signup
            </Link>
            . Once your account is active, you can submit a brief from your dashboard — describe the project, the mood and tone you need, your budget range, and your deadline. Our team reviews every brief before it goes to the roster.
          </span>
        ),
      },
      {
        q: 'How quickly will I receive matches after posting a brief?',
        a: 'Standard turnaround is 3–5 business days from brief confirmation to curated shortlist. If you have a tighter deadline, flag it in the brief — we can expedite for projects where the timeline demands it.',
      },
      {
        q: 'How many matches will I receive?',
        a: 'You\'ll receive 3–5 curated tracks per brief — not a directory of 200 options. Every match has been reviewed by a human editor before it reaches you. If none of the options work for your project, let us know — we can run a second pass with revised parameters.',
      },
      {
        q: 'How do I know the rights are actually clear?',
        a: 'Every composer on our roster has been manually vetted before they receive their first brief invite. Rights documentation — master ownership, publishing splits, ISRC — is confirmed at the vetting stage, not scrambled at the licensing stage. This is the core of what we do. You will not receive a "perfect track" and then discover a rights problem six weeks later.',
      },
    ],
  },
  {
    title: 'Deals & Payments',
    items: [
      {
        q: 'Do you take a share of the sync fee and performance royalties?',
        a: 'We only take a commission on the upfront sync fee (the license fee). We do not touch your performance royalties (PRO distributions) or your master royalties. You keep 100% of your writer\'s share.',
      },
      {
        q: 'What happens if I already have a sync agent?',
        a: 'SyncMaster is non-exclusive. You are free to work with other agents or libraries. We only ask that you clear the rights for the specific tracks you submit to our briefs.',
      },
      {
        q: 'How do I get paid?',
        a: 'Once a deal is closed and the supervisor pays the license fee, we facilitate the transfer to you (minus our commission) within 14 days of receiving the funds.',
      },
      {
        q: 'What is a typical sync fee range?',
        a: 'Sync fees vary enormously based on the medium, territory, and duration of use. As a rough benchmark: a 30-second placement in a UK/US TV advertisement can range from $3,000 to $30,000+. A scene placement in a streaming series (Netflix, Prime, etc.) typically ranges from $5,000 to $25,000 for a limited-term license. Trailers and games tend to pay higher flat fees. Regional Nollywood and African broadcast placements are typically lower — $500 to $3,000. We\'ll always advise on fair market rate before any deal is finalised.',
      },
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
          </div>
          <div className="max-w-screen-2xl w-full mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8">
                <Zap className="w-3.5 h-3.5" />
                Pricing
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.068em] leading-[1.05] mb-8">
                We only win when<br />
                <span className="text-primary italic">you win.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                No monthly subscriptions. No pay-to-play. SyncMaster is built on a simple, success-based model that aligns our interests with yours.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Composers */}
              <div className="flex flex-col gap-8 p-10 md:p-12 rounded-[2.5rem] bg-card border border-border/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                <div className="flex flex-col gap-4">
                  <span className="text-sm font-black uppercase tracking-widest text-primary">For Composers</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tight">{composerPricing[0].price}</span>
                    <span className="text-muted-foreground font-bold">commission</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{composerPricing[0].description}</p>
                </div>
                <div className="h-px bg-border" />
                <ul className="flex flex-col gap-4">
                  {composerPricing[0].features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-muted-foreground font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={buttonVariants({ size: 'lg' }) + ' h-14 md:h-16 rounded-2xl text-base md:text-lg font-black gap-2 w-full mt-4'}>
                  Apply to the roster <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Supervisors */}
              <div className="flex flex-col gap-8 p-10 md:p-12 rounded-[2.5rem] bg-card border border-border/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                <div className="flex flex-col gap-4">
                  <span className="text-sm font-black uppercase tracking-widest text-emerald-500">For Supervisors</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tight">{supervisorPricing[0].price}</span>
                    <span className="text-muted-foreground font-bold">to post</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{supervisorPricing[0].description}</p>
                </div>
                <div className="h-px bg-border" />
                <ul className="flex flex-col gap-4">
                  {supervisorPricing[0].features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-muted-foreground font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' h-14 md:h-16 rounded-2xl text-base md:text-lg font-black gap-2 w-full mt-4 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'}>
                  Post a brief <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why this model */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-20 flex flex-col items-center gap-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em]">Why we don&apos;t charge a subscription</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-black tracking-tight">Zero Entry Barrier</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  We want the best African composers, not just the ones who can afford a monthly fee. Talent is the only prerequisite for joining our roster.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-black tracking-tight">Aligned Incentives</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  When we work on a brief, we&apos;re incentivized to find the absolute best match that results in a placement. We don&apos;t profit from your membership; we profit from your success.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-black tracking-tight">Market Scalability</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  By keeping the platform free for supervisors to post, we maximize the number of briefs coming into the corridor, creating more opportunities for the roster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em]">Everything you need to know</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
                  From applying to getting paid — the full picture.
                </p>
              </div>
              <FAQAccordion sections={faqSections} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
