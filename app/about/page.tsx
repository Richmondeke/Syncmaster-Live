import Link from 'next/link'
import Image from 'next/image'
import { Shield, Zap, FileText, Sparkles, Users, Mic2, ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: 'About — SyncMaster',
  description:
    'SyncMaster connects vetted African composers to global sync briefs. Human curation, rights clarity, and the infrastructure the market was missing.',
}

const howWeWork = [
  {
    icon: Shield,
    title: 'We vet the composers',
    description: 'Every composer on our roster is reviewed by a human. Rights verified. Stems confirmed. Metadata complete. Brief-ready before the first invite goes out.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Zap,
    title: 'We match the briefs',
    description: 'When a brief arrives, our curation engine and human editors select the best 3–5 fits. Not algorithmic ranking. Actual editorial judgment.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: FileText,
    title: 'We facilitate the deal',
    description: 'Selected track? We handle the licensing conversation. Rights documentation is already in order. No last-minute surprises.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
]

const team = [
  {
    initials: 'FC',
    role: 'Founder & CEO',
    bio: '10 years across music production and licensing. Built this because the pathway didn’t exist for the composers I worked with.',
  },
  {
    initials: 'HC',
    role: 'Head of Curation',
    bio: 'Former music supervisor. Worked briefs for streaming and advertising. Joined SyncMaster to build the source she always needed.',
  },
  {
    initials: 'HR',
    role: 'Head of Composer Relations',
    bio: 'Trained in Lagos, worked globally. Spent years watching African composers miss opportunities that should have been theirs.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="pt-24 pb-32">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Sparkles className="w-3.5 h-3.5" />
                About SyncMaster
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.068em] leading-[1.05] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                The corridor that<br />didn&apos;t exist.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                We connect vetted African composers to global sync briefs. Human curation. Rights clarity. The infrastructure the market was missing.
              </p>
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border border border-border text-muted-foreground text-xs font-bold uppercase tracking-wider mb-12">
                The infrastructure gap
              </div>
              <p className="text-3xl font-black tracking-[-0.068em] italic leading-snug text-foreground mb-12 max-w-2xl">
                &ldquo;This is not a talent gap. The music exists. It&apos;s an infrastructure gap — and that&apos;s what SyncMaster is solving.&rdquo;
              </p>
              <div className="flex flex-col gap-8 max-w-2xl">
                <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                  The global sync market is worth $500M annually. African composers earn a fraction of a percent of that. Not because the music isn&apos;t there. It is. Nigeria, South Africa, Kenya, Ghana — the output is extraordinary.
                </p>
                <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                  The problem is infrastructure. No pipeline to briefs. No rights clarity. No metadata standards. No stems. No one to facilitate the deal.
                </p>
                <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                  Music supervisors have the budgets and the need. A 30-second placement in a premium TV ad pays $10,000–$75,000. A single Netflix scene: $5,000–$20,000. One placement can pay more than six months of streaming royalties. But finding rights-clean African music at production speed is nearly impossible. So most supervisors don&apos;t try.
                </p>
                <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                  SyncMaster is the infrastructure that closes that gap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="mb-20 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                The model
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-tight max-w-xl mx-auto">
                One curated corridor.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howWeWork.map((item) => (
                <div key={item.title} className="flex flex-col gap-5 p-8 rounded-[2rem] bg-card border border-border/50 hover:border-border transition-colors group">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black tracking-[-0.068em]">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why now */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="mb-16 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border border border-border text-muted-foreground text-xs font-bold uppercase tracking-wider mb-6">
                Why now
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-tight mb-4">
                The window is open.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <p className="text-xl leading-relaxed text-muted-foreground">
                Streaming has made African music globally audible for the first time. The audience already knows Afrobeats, Amapiano, Afrofusion. Music supervisors are actively looking for authentic African sound — but have no reliable, rights-clean source.
              </p>
              <p className="text-xl leading-relaxed text-muted-foreground">
                The sync market rewards specificity. Generic sounds from stock libraries are losing briefs to composers with cultural precision. African music has both: extraordinary specificity and extraordinary breadth. The market is ready. The composers are ready. The infrastructure is now.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="mb-16 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Users className="w-3 h-3" />
                The team
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-tight mb-4 max-w-3xl mx-auto">
                Built by people who know both rooms.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mx-auto">
                We&apos;ve been in the studio and in the supervisor&apos;s office. We built this because we&apos;ve seen both sides of the gap.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.role} className="border border-border/50 rounded-2xl p-6 bg-card/50 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                      {member.initials}
                    </div>
                    <span className="text-sm font-black tracking-tight text-foreground">{member.role}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investor / Press CTA */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="rounded-[2.5rem] bg-foreground text-background overflow-hidden">
              <div className="p-12 md:p-20">
                <div className="mb-16 max-w-2xl mx-auto flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 border border-background/20 text-background text-xs font-bold uppercase tracking-wider mb-8">
                    <Mic2 className="w-3 h-3" />
                    Work with us
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-tight">
                    Building the African music sync infrastructure.
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 border-t border-background/10 pt-12">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-black tracking-tight">For press and media</h3>
                    <p className="text-background/70 leading-relaxed text-sm">
                      We&apos;re building in public. If you&apos;re covering African music, the sync industry, or emerging market music infrastructure — we&apos;d like to talk.
                    </p>
                    <a href="mailto:press@syncmaster.io" className="inline-flex items-center gap-1 text-sm font-bold text-background hover:text-background/70 transition-colors mt-2">
                      Press enquiries <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-black tracking-tight">For investors</h3>
                    <p className="text-background/70 leading-relaxed text-sm">
                      SyncMaster is pre-seed, focused on market validation and roster quality. If you&apos;re investing in music infrastructure or the African creative economy — we&apos;re building something durable.
                    </p>
                    <a href="mailto:investors@syncmaster.io" className="inline-flex items-center gap-1 text-sm font-bold text-background hover:text-background/70 transition-colors mt-2">
                      Investor enquiries <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
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
