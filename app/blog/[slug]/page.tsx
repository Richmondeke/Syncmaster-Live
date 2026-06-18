import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getPostBySlug, getAllSlugs, getAllPosts, getClusterStyle, buildSlugMap } from '@/lib/blog'
import { renderMarkdown } from '@/lib/markdown'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'
import { ShareBar } from '@/components/blog/ShareBar'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllSlugs().map((slug: string) => ({ slug }))
}

const BASE_URL = 'https://syncmaster-live.vercel.app'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${BASE_URL}/blog/${slug}`
  const title = `${post.title} — SyncMaster Blog`
  const description = post.excerpt || post.title

  return {
    title,
    description,
    keywords: post.keyword,
    authors: [{ name: 'SyncMaster' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'SyncMaster',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishDate || undefined,
      authors: ['SyncMaster'],
      images: [
        {
          url: post.coverImage || `${BASE_URL}/syncscreen.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.coverImage || `${BASE_URL}/syncscreen.png`],
    },
  }
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
  const cs = getClusterStyle(post.cluster)
  const allPosts = getAllPosts()
  const htmlContent = renderMarkdown(post.content, buildSlugMap(allPosts))
  // getAllPosts returns normalized clusters; find the normalized cluster for this post
  const thisPostMeta = allPosts.find(p => p.slug === slug)
  const normalizedCluster = thisPostMeta?.cluster ?? post.cluster
  const related = allPosts
    .filter(p => p.cluster === normalizedCluster && p.slug !== slug)
    .slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || post.title,
            image: post.coverImage || `${BASE_URL}/syncscreen.png`,
            datePublished: post.publishDate || new Date().toISOString(),
            dateModified: post.publishDate || new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: 'SyncMaster',
              url: BASE_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: 'SyncMaster',
              url: BASE_URL,
              logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/syncscreen.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${BASE_URL}/blog/${slug}`,
            },
            wordCount: post.wordCount,
            articleSection: post.cluster,
            keywords: post.keyword,
          }),
        }}
      />
      <Navbar />

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

          <ShareBar title={post.title} slug={post.slug} />

          {/* Article body */}
          <div
            className="text-foreground"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <RelatedPosts posts={related} currentSlug={slug} />

          {/* Post footer CTA */}
          <div className="mt-16 pt-10 border-t border-border rounded-2xl bg-muted/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                {normalizedCluster === 'Supervisor Side' ? 'Find the right sound' : 'Get your music heard'}
              </p>
              <p className="text-2xl font-black tracking-[-0.068em] text-foreground">
                {normalizedCluster === 'Supervisor Side'
                  ? 'Post a brief. Get 3–5 curated matches in 48h.'
                  : 'Apply to SyncMaster. African composers, global briefs.'}
              </p>
            </div>
            <Link
              href={normalizedCluster === 'Supervisor Side' ? '/supervisors' : '/signup'}
              className="shrink-0 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-black text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              {normalizedCluster === 'Supervisor Side' ? 'Post a brief' : 'Apply now'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
