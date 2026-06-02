import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, BookOpen } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getPostBySlug, getAllSlugs } from '@/lib/blog'
import { renderMarkdown } from '@/lib/markdown'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllSlugs().map((slug: string) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — SyncMaster Blog`,
    description: post.excerpt,
    keywords: post.keyword,
  }
}

const CLUSTER_STYLES: Record<string, { bg: string; text: string }> = {
  'Pillar Keywords':             { bg: 'bg-primary/10',     text: 'text-primary' },
  'Case Studies':                { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'Licensing Education':         { bg: 'bg-orange-500/10',  text: 'text-orange-500' },
  'Technical/Metadata':          { bg: 'bg-sky-500/10',     text: 'text-sky-500' },
  'African Music Infrastructure':{ bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500' },
}

function clusterStyle(cluster: string) {
  return CLUSTER_STYLES[cluster] ?? { bg: 'bg-muted', text: 'text-muted-foreground' }
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const readTime = Math.max(1, Math.round(post.wordCount / 200))
  const cs = clusterStyle(post.cluster)
  const htmlContent = renderMarkdown(post.content)

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
            <Link href="/composers" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">For Composers</Link>
            <Link href="/supervisors" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">For Supervisors</Link>
            <Link href="/blog" className="text-sm font-bold text-foreground transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">Login</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20">
        <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          {/* Article header */}
          <header className="mb-12 flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${cs.bg} ${cs.text}`}>
                {post.cluster}
              </span>
              {post.keyword && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">
                  {post.keyword}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-[1.1] text-foreground">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground font-medium">
              {post.publishDate && (
                <span>{formatDate(post.publishDate)}</span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                SyncMaster Blog
              </span>
            </div>

            <div className="h-px bg-border mt-2" />
          </header>

          {/* Article body */}
          <div
            className="text-foreground"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Footer CTA */}
          <div className="mt-20 pt-10 border-t border-border flex flex-col gap-6">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Continue reading</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-base font-black text-primary hover:text-primary/80 transition-colors"
            >
              Browse all articles <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </article>
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
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
