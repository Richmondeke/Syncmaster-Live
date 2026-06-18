import Link from 'next/link'

export default function DashboardPage() {
  const tools = [
    { label: 'AI Tagger', description: 'Auto-tag tracks with smart AI engine', href: '/dashboard/tagger', emoji: '✨' },
    { label: 'Sound Radar', description: 'Discover trending sync sounds', href: '/dashboard/radar', emoji: '🔍' },
    { label: 'Agency Directory', description: 'Connect with music supervisors', href: '/dashboard/directory', emoji: '🏢' },
    { label: 'Radio Directory', description: 'Connect with college radio stations', href: '/dashboard/radio-directory', emoji: '📻' },
    { label: 'Submissions', description: 'Track your pitches and submissions', href: '/dashboard/submissions', emoji: '📄' },
    { label: 'Marketplace', description: 'Explore opportunities', href: '/dashboard/marketplace', emoji: '🛒' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingTop: '0.5rem', paddingBottom: '3rem', maxWidth: '80rem', margin: '0 auto' }}>
      {/* Header */}
      <h1 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground sm:text-5xl">
        Welcome to SyncMaster
      </h1>

      {/* Hero Banner */}
      <section className="group relative overflow-hidden rounded-[2.5rem] bg-[#4b4bc0] p-10 md:p-14 text-white shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col gap-8 max-w-2xl">
          <div className="space-y-5">
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.068em] leading-[1.1]">
              Your sync operations, simplified.
            </h2>
            <p className="text-lg md:text-2xl text-white/80 font-medium tracking-[-0.04em] max-w-xl leading-normal">
              Upload your catalog, track submissions, and connect with supervisors from one central hub.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <Link
              href="/dashboard/briefs"
              className="inline-flex items-center justify-center rounded-2xl px-10 h-16 text-lg font-black bg-white text-[#4b4bc0] hover:bg-white/90 transition-all shadow-xl"
            >
              Explore Briefs
            </Link>
            <Link
              href="/dashboard/tracks"
              className="inline-flex items-center justify-center border border-white/20 bg-white/5 font-black text-white hover:bg-white/10 backdrop-blur-sm px-10 h-16 text-lg rounded-2xl transition-all"
            >
              View Catalog
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-black/30 blur-[120px]" />
      </section>

      {/* Top Briefs — Empty State */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Top Briefs</h2>
            <p className="text-sm font-medium text-muted-foreground tracking-[-0.02em]">Latest opportunities from producers</p>
          </div>
          <Link
            href="/dashboard/briefs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center gap-4 rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/20">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
            🎵
          </div>
          <div className="space-y-1">
            <p className="font-bold text-foreground/70">No active briefs yet</p>
            <p className="text-sm text-muted-foreground">Check back soon — new opportunities are added regularly.</p>
          </div>
          <Link href="/dashboard/briefs" className="inline-flex items-center justify-center rounded-full border border-border px-4 h-9 text-sm font-medium hover:bg-muted transition-colors mt-2">
            Browse all briefs
          </Link>
        </div>
      </section>

      {/* Tools Section */}
      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-foreground/5 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Tools</h2>
            <p className="text-sm font-medium text-muted-foreground tracking-[-0.02em]">Centralized utilities for your operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative flex items-center gap-6 rounded-[2rem] border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl transition-all duration-300 group-hover:bg-primary group-hover:scale-110 shadow-sm">
                {tool.emoji}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-black text-lg tracking-[-0.04em] text-foreground leading-tight">
                  {tool.label}
                </h3>
                <p className="text-sm font-medium text-muted-foreground tracking-[-0.02em] opacity-80 leading-snug">
                  {tool.description}
                </p>
              </div>
              <span className="ml-auto text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary text-xl">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
