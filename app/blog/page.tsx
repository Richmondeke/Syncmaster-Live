import { BookOpen } from 'lucide-react'
import { getAllPosts } from '@/lib/blog'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'
import { CategoryFilter } from '@/components/blog/CategoryFilter'

export const metadata = {
  title: 'Blog — SyncMaster',
  description:
    'Sync knowledge and African music perspective. Education, industry insight, and proof — written for composers and supervisors navigating the sync market.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const featured = posts[0]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="pt-24 pb-20 border-b border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <BookOpen className="w-3.5 h-3.5" />
                The Blog
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-[-0.068em] leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                Sync knowledge.<br />
                <span className="text-primary">African perspective.</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Education, industry insight, and proof — written for composers and supervisors navigating the sync market.
              </p>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="py-20">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            {posts.length === 0 || !featured ? (
              <div className="text-center py-32">
                <p className="text-muted-foreground text-lg">Posts coming soon.</p>
              </div>
            ) : (
              <CategoryFilter posts={posts} featured={featured} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
