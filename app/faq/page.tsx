import Link from 'next/link'
import { CircleQuestionMark } from 'lucide-react'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'
import { FAQAccordion, type FAQSection } from '@/components/pricing/FAQAccordion'

export const metadata = {
  title: 'FAQ — SyncMaster',
  description: 'Frequently asked questions about SyncMaster. Learn about applying, vetting, curation, matching, fees, and payouts.',
}

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

export default function FAQPage() {
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
                <CircleQuestionMark className="w-3.5 h-3.5" />
                FAQ
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.068em] leading-[1.05] mb-8">
                Frequently Asked<br />
                <span className="text-primary italic">Questions</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                From applying to getting paid — everything you need to know about how the SyncMaster corridor operates.
              </p>
            </div>
          </div>
        </section>

        {/* Accordion Content */}
        <section className="py-24 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <FAQAccordion sections={faqSections} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
