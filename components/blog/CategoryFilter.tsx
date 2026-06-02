'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'

const CLUSTER_STYLE_MAP: Record<string, { bg: string; text: string; activeBg: string }> = {
  'Composer Stories':   { bg: 'bg-primary/10',    text: 'text-primary',            activeBg: 'bg-primary' },
  'Supervisor Side':    { bg: 'bg-sky-500/10',     text: 'text-sky-500',            activeBg: 'bg-sky-500' },
  'Proof & Placements': { bg: 'bg-emerald-500/10', text: 'text-emerald-500',        activeBg: 'bg-emerald-500' },
  'African Music':      { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500',        activeBg: 'bg-fuchsia-500' },
  'Education':          { bg: 'bg-orange-500/10',  text: 'text-orange-500',         activeBg: 'bg-orange-500' },
  'Industry':           { bg: 'bg-muted',          text: 'text-muted-foreground',   activeBg: 'bg-foreground' },
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

export function CategoryFilter({ posts, featured }: Props) {
  const [active, setActive] = useState('All')
  const [sort, setSort] = useState<SortOrder>('latest')
  const [visible, setVisible] = useState(12)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Build tag counts
  const tagCounts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.cluster] = (acc[p.cluster] ?? 0) + 1
    return acc
  }, {})

  const tags = ['All', ...Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])]

  // Filter
  const filtered = active === 'All' ? posts : posts.filter(p => p.cluster === active)

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'popular') return tagCounts[b.cluster] - tagCounts[a.cluster]
    if (!a.publishDate) return 1
    if (!b.publishDate) return -1
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })

  // For "All" view, exclude the featured post from the grid
  const gridPosts = active === 'All' ? sorted.filter(p => p.slug !== featured.slug) : sorted

  const scrollTags = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Tag bar + sort */}
      <div className="flex items-center gap-3">
        {/* Scroll left */}
        <button
          onClick={() => scrollTags('left')}
          className="hidden md:flex shrink-0 w-8 h-8 rounded-full bg-muted items-center justify-center hover:bg-muted/80 transition-colors"
          aria-label="Scroll tags left"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        {/* Scrollable pill row */}
        <div
          ref={scrollRef}
          className="flex-1 flex gap-2 overflow-x-auto scrollbar-none pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {tags.map(tag => {
            const isActive = active === tag
            const cs = tag === 'All' ? null : getClusterStyle(tag)
            const count = tag === 'All' ? posts.length : tagCounts[tag]
            return (
              <button
                key={tag}
                onClick={() => { setActive(tag); setVisible(12) }}
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

        {/* Scroll right */}
        <button
          onClick={() => scrollTags('right')}
          className="hidden md:flex shrink-0 w-8 h-8 rounded-full bg-muted items-center justify-center hover:bg-muted/80 transition-colors"
          aria-label="Scroll tags right"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* Sort toggle */}
        <div className="shrink-0 hidden md:flex items-center gap-1 bg-muted rounded-full p-1">
          {(['latest', 'popular'] as SortOrder[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                sort === s ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'latest' ? 'Latest' : 'Popular'}
            </button>
          ))}
        </div>
      </div>

      {/* Featured post — only when showing All */}
      {active === 'All' && (
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
      {gridPosts.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">No posts in this category yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.slice(0, visible).map(post => {
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

          {/* Load more */}
          {visible < gridPosts.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisible(v => v + 12)}
                className="px-8 py-3 rounded-full bg-muted text-foreground text-sm font-black uppercase tracking-wider hover:bg-muted/80 transition-colors"
              >
                Load more · {gridPosts.length - visible} remaining
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
