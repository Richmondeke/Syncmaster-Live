import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getAllPosts } from '@/lib/blog'
import type { PostMeta } from '@/lib/blog'

export const metadata = {
  title: 'Blog — SyncMaster',
  description:
    'Sync knowledge and African music perspective. Education, industry insight, and proof — written for composers and supervisors navigating the sync market.',
}

const CLUSTER_STYLES: Record<string, { bg: string; text: string }> = {
  'Pillar Keywords':            { bg: 'bg-primary/10',    text: 'text-primary' },
  'Case Studies':               { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'Licensing Education':        { bg: 'bg-orange-500/10',  text: 'text-orange-500' },
  'Technical/Metadata':         { bg: 'bg-sky-500/10',     text: 'text-sky-500' },
  'African Music Infrastructure':{ bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500' },
}

function clusterStyle(cluster: string) {
  return CLUSTER_STYLES[cluster] ?? { bg: 'bg-muted', text: 'text-muted-foreground' }
}

function readTime(wordCount: number): string {
  return `${Math.max(1, Math.round(wordCount / 200))} min read`
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  const posts: PostMeta[] = getAllPosts()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-screen-2xl w-full mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-40 h-10 transition-transform group-hover:scale-105">
              <Image src="/syncmasterwhite.png" alt="SyncMaster Logo" fill className="object-contain" priority />
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link href="/#features" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/composers" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">For Composers</Link>
            <Link href="/supervisors" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">For Supervisors</Link>
            <Link href="/blog" className="text-sm font-bold text-foreground transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">Login</Link>
            <ThemeToggle />
            <Link href="/signup" className={buttonVariants({ variant: 'default', size: 'sm' }) + ' rounded-full px-6 font-bold'}>
              Get early access
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="pt-24 pb-20 border-b border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="max-w-3xl">
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

        {/* Posts grid */}
        <section className="py-20">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            {posts.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-muted-foreground text-lg">Posts coming soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const cs = clusterStyle(post.cluster)
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col gap-4 border border-border/50 rounded-2xl p-6 bg-card/50 hover:border-input hover:bg-card transition-all duration-200"
                    >
                      {/* Cluster badge */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider w-fit ${cs.bg} ${cs.text}`}>
                        {post.cluster}
                      </span>

                      {/* Title */}
                      <h2 className="text-lg font-black tracking-[-0.068em] leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatDate(post.publishDate)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground font-medium">{readTime(post.wordCount)}</span>
                          <span className="flex items-center gap-1 text-xs font-bold text-primary">
                            Read <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-20 bg-card">
        <div className="max-w-screen-2xl w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <Link href="/">
              <div className="relative w-32 h-8">
                <Image src="/syncmasterwhite.png" alt="SyncMaster Logo" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground font-medium">© 2026 SyncMaster Operations. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-muted-foreground">
            <Link href="/composers" className="hover:text-foreground transition-colors">For Composers</Link>
            <Link href="/supervisors" className="hover:text-foreground transition-colors">For Supervisors</Link>
            <Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
