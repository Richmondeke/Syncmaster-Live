import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Sparkles, Trophy } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { getAllPosts, getClusterStyle } from '@/lib/blog'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: 'Placement Stories — SyncMaster',
  description: 'Real stories of African composers landing sync placements in film, TV, and advertising through SyncMaster.',
}

export default function StoriesPage() {
  const allPosts = getAllPosts()
  const stories = allPosts.filter(p => p.cluster === 'Case Studies' || p.cluster === 'Proof/Placements')

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full opacity-50" />
          </div>
          <div className="max-w-screen-2xl w-full mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider mb-8">
                <Trophy className="w-3.5 h-3.5" />
                Placement Stories
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.068em] leading-[1.05] mb-8">
                From the studio to<br />
                <span className="text-emerald-500 italic">the world stage.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                Real results. Real income. Real impact. Explore how African composers are bridging the gap to global sync through SyncMaster.
              </p>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-24 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            {stories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Stories coming soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story) => {
                  const cs = getClusterStyle(story.cluster)
                  return (
                    <Link
                      key={story.slug}
                      href={`/blog/${story.slug}`}
                      className="group flex flex-col gap-0 border border-border/50 rounded-[2rem] overflow-hidden bg-card/50 hover:border-input hover:bg-card transition-all duration-300"
                    >
                      <div className="relative aspect-[16/10] bg-muted/50 overflow-hidden">
                        {story.coverImage ? (
                          <Image src={story.coverImage} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-primary/5 flex items-center justify-center">
                            <Star className="w-12 h-12 text-emerald-500/20" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cs.bg} ${cs.text} backdrop-blur-md`}>
                            {story.cluster}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col gap-4">
                        <h3 className="text-xl font-black tracking-tight leading-snug group-hover:text-primary transition-colors">
                          {story.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {story.excerpt}
                        </p>
                        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground">Read Story</span>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="flex flex-col items-center text-center gap-8 p-16 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-2xl">Want to be our next success story?</h2>
                <p className="text-lg text-muted-foreground max-w-xl">Join the SyncMaster roster. We handle the vetting, the briefs, and the deals.</p>
                <Link
                  href="/signup"
                  className={buttonVariants({ size: "lg" }) + " h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-emerald-500/20 gap-2"}
                >
                  Apply as a composer
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
