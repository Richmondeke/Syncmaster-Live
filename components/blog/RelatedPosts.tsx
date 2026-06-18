import Link from 'next/link'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { ArrowRight } from 'lucide-react'
import type { PostMeta } from '@/lib/blog'

const CLUSTER_GRADIENT: Record<string, string> = {
  'Composer Stories':   'from-primary/30 to-primary/5',
  'Supervisor Side':    'from-sky-500/30 to-sky-500/5',
  'Proof & Placements': 'from-emerald-500/30 to-emerald-500/5',
  'African Music':      'from-fuchsia-500/30 to-fuchsia-500/5',
  'Education':          'from-orange-500/30 to-orange-500/5',
  'Industry':           'from-muted to-muted/50',
}

const CLUSTER_STYLE: Record<string, { bg: string; text: string }> = {
  'Composer Stories':   { bg: 'bg-primary/10',    text: 'text-primary' },
  'Supervisor Side':    { bg: 'bg-sky-500/10',     text: 'text-sky-500' },
  'Proof & Placements': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'African Music':      { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500' },
  'Education':          { bg: 'bg-orange-500/10',  text: 'text-orange-500' },
  'Industry':           { bg: 'bg-muted',          text: 'text-muted-foreground' },
}

type Props = {
  posts: PostMeta[]
  currentSlug: string
}

export function RelatedPosts({ posts, currentSlug }: Props) {
  if (posts.length === 0) return null

  return (
    <aside className="mt-20 pt-10 border-t border-border">
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Related articles</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {posts.map(post => {
          const cs = CLUSTER_STYLE[post.cluster] ?? { bg: 'bg-muted', text: 'text-muted-foreground' }
          const gradient = CLUSTER_GRADIENT[post.cluster] ?? 'from-muted to-muted/50'
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 border border-border/50 rounded-2xl overflow-hidden bg-card/50 hover:border-input hover:bg-card transition-all duration-200"
            >
              <div className={`h-20 w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <span className="text-3xl font-black tracking-[-0.068em] text-foreground/10 select-none">
                  {post.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="px-4 pb-4 flex flex-col gap-2 flex-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider w-fit ${cs.bg} ${cs.text}`}>
                  {post.cluster}
                </span>
                <h3 className="text-sm font-black tracking-[-0.04em] leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <span className="flex items-center gap-1 text-xs font-bold text-primary mt-auto">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
