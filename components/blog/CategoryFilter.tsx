'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Search, X } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'

const POSTS_PER_PAGE = 12

const CLUSTER_STYLE_MAP: Record<string, { bg: string; text: string; activeBg: string }> = {
  'Composer Stories':   { bg: 'bg-primary/10',    text: 'text-primary',          activeBg: 'bg-primary' },
  'Supervisor Side':    { bg: 'bg-sky-500/10',     text: 'text-sky-500',          activeBg: 'bg-sky-500' },
  'Proof & Placements': { bg: 'bg-emerald-500/10', text: 'text-emerald-500',      activeBg: 'bg-emerald-500' },
  'African Music':      { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500',      activeBg: 'bg-fuchsia-500' },
  'Education':          { bg: 'bg-orange-500/10',  text: 'text-orange-500',       activeBg: 'bg-orange-500' },
  'Industry':           { bg: 'bg-muted',          text: 'text-muted-foreground', activeBg: 'bg-foreground' },
}

function getClusterStyle(cluster: string) {
  return CLUSTER_STYLE_MAP[cluster] ?? CLUSTER_STYLE_MAP['Industry']
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getReadTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200))
}

const CLUSTER_GRADIENT: Record<string, string> = {
  'Composer Stories':   'from-primary/30 to-primary/5',
  'Supervisor Side':    'from-sky-500/30 to-sky-500/5',
  'Proof & Placements': 'from-emerald-500/30 to-emerald-500/5',
  'African Music':      'from-fuchsia-500/30 to-fuchsia-500/5',
  'Education':          'from-orange-500/30 to-orange-500/5',
  'Industry':           'from-muted to-muted/50',
}

type SortOrder = 'latest' | 'popular'

type Props = {
  posts: PostMeta[]
  featured: PostMeta
}

function buildPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

export function CategoryFilter({ posts, featured }: Props) {
  const [active, setActive] = useState('All')
  const [sort, setSort] = useState<SortOrder>('latest')
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const resultsRef = useRef<HTMLDivElement>(null)

  const tagCounts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.cluster] = (acc[p.cluster] ?? 0) + 1
    return acc
  }, {})

  const tags = ['All', ...Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])]

  // Search filter (across title, excerpt, keyword — case insensitive)
  const q = query.trim().toLowerCase()
  const searched = q
    ? posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.keyword.toLowerCase().includes(q)
      )
    : posts

  // Category filter (skip when searching)
  const filtered = q || active === 'All' ? searched : searched.filter(p => p.cluster === active)

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'popular') return tagCounts[b.cluster] - tagCounts[a.cluster]
    if (!a.publishDate) return 1
    if (!b.publishDate) return -1
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })

  const showFeatured = !q && active === 'All'
  const gridPosts = showFeatured ? sorted.filter(p => p.slug !== featured.slug) : sorted

  const totalPages = Math.max(1, Math.ceil(gridPosts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pagePosts = gridPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
  const pageNumbers = buildPageNumbers(currentPage, totalPages)

  function selectTag(tag: string) {
    setActive(tag)
    setPage(1)
    setQuery('')
    // Scroll results into view
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function goToPage(p: number) {
    setPage(p)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1) }}
          placeholder="Search articles — title, topic, keyword…"
          className="w-full h-12 pl-11 pr-10 rounded-2xl bg-muted border border-border/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setPage(1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tag bar + sort */}
      <div className="flex items-center gap-3" ref={resultsRef}>
        <div
          className="flex-1 flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tags.map(tag => {
            const isActive = !q && active === tag
            const cs = tag === 'All' ? null : getClusterStyle(tag)
            const count = tag === 'All' ? posts.length : tagCounts[tag]
            return (
              <button
                key={tag}
                onClick={() => selectTag(tag)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? cs
                      ? `${cs.activeBg} text-white`
                      : 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                {tag}
                <span className="text-[10px] font-bold opacity-60">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Sort toggle */}
        <div className="shrink-0 hidden md:flex items-center gap-1 bg-muted rounded-full p-1">
          {(['latest', 'popular'] as SortOrder[]).map(s => (
            <button
              key={s}
              onClick={() => { setSort(s); setPage(1) }}
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                sort === s ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'latest' ? 'Latest' : 'Popular'}
            </button>
          ))}
        </div>
      </div>

      {/* Search result count */}
      {q && (
        <p className="text-sm text-muted-foreground font-medium -mt-2">
          {filtered.length === 0
            ? `No results for "${query}"`
            : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`}
        </p>
      )}

      {/* Featured post — only when showing All with no search */}
      {showFeatured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-border/50 hover:border-input transition-all duration-200 bg-card/50 hover:bg-card"
        >
          <div className="relative aspect-video md:aspect-auto md:min-h-[300px] overflow-hidden">
            {featured.coverImage ? (
              <Image src={featured.coverImage} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${CLUSTER_GRADIENT[featured.cluster] ?? 'from-muted to-muted/50'} flex items-center justify-center`}>
                <span className="text-7xl font-black tracking-[-0.068em] text-foreground/10 select-none">
                  {featured.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 p-8 md:p-10 justify-center">
            {(() => {
              const cs = getClusterStyle(featured.cluster)
              return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider w-fit ${cs.bg} ${cs.text}`}>
                  {featured.cluster}
                </span>
              )
            })()}
            <h2 className="text-2xl md:text-3xl font-black tracking-[-0.068em] leading-snug text-foreground group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{featured.excerpt}</p>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground font-medium">{formatDate(featured.publishDate)}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-medium">{getReadTime(featured.wordCount)} min read</span>
                <span className="flex items-center gap-1 text-xs font-bold text-primary">Read <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      {pagePosts.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          {q ? `No articles match "${query}". Try a different search.` : 'No posts in this category yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagePosts.map(post => {
            const cs = getClusterStyle(post.cluster)
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-0 border border-border/50 rounded-2xl overflow-hidden bg-card/50 hover:border-input hover:bg-card transition-all duration-200"
              >
                <div className="relative aspect-video overflow-hidden">
                  {post.coverImage ? (
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${CLUSTER_GRADIENT[post.cluster] ?? 'from-muted to-muted/50'} flex items-center justify-center`}>
                      <span className="text-4xl font-black tracking-[-0.068em] text-foreground/10 select-none">
                        {post.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider w-fit ${cs.bg} ${cs.text}`}>
                    {post.cluster}
                  </span>
                  <h2 className="text-base font-black tracking-[-0.068em] leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground font-medium">{formatDate(post.publishDate)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">{getReadTime(post.wordCount)} min read</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-primary">Read <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Numbered pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          {/* Prev */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous page"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {pageNumbers.map((n, i) =>
            n === '…' ? (
              <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground select-none">
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => goToPage(n)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                  n === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                aria-label={`Page ${n}`}
                aria-current={n === currentPage ? 'page' : undefined}
              >
                {n}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next page"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}
