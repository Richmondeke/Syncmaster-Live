import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Play,
  Clock,
  Star,
  Globe,
  MessageSquare,
  Film,
  Music,
  Music2,
  ExternalLink,
  Radio,
  Sparkles,
} from 'lucide-react'
import { getEPKBySlug } from '@/app/actions/epks'
import type { EPK, EPKTrack, EPKSocialLinks } from '@/types/epk.types'

export const dynamic = 'force-dynamic'

// ─── Metadata ────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getEPKBySlug(slug)

  if (!result.success || !result.data) {
    return { title: 'EPK Not Found — SyncMaster' }
  }

  const epk = result.data

  return {
    title: `${epk.title} — EPK | SyncMaster`,
    description: epk.bio
      ? epk.bio.slice(0, 160)
      : `Check out ${epk.title} on SyncMaster — the platform connecting African composers with global briefs.`,
    openGraph: {
      title: `${epk.title} — Electronic Press Kit`,
      description: epk.bio?.slice(0, 160) || `${epk.title} on SyncMaster`,
      ...(epk.image_url && {
        images: [{ url: epk.image_url, width: 1200, height: 630, alt: epk.title }],
      }),
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${epk.title} — EPK`,
      description: epk.bio?.slice(0, 160) || `${epk.title} on SyncMaster`,
      ...(epk.image_url && { images: [epk.image_url] }),
    },
  }
}

// ─── Social Icon Map ─────────────────────────────────────────
function SocialIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  switch (platform) {
    case 'instagram':
      return <Star size={size} />
    case 'twitter':
      return <MessageSquare size={size} />
    case 'youtube':
      return <Film size={size} />
    case 'spotify':
      return <Music size={size} />
    case 'soundcloud':
      return <Radio size={size} />
    case 'website':
      return <Globe size={size} />
    default:
      return <ExternalLink size={size} />
  }
}

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'Twitter / X',
  spotify: 'Spotify',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
  website: 'Website',
}

// ─── Track Row ───────────────────────────────────────────────
function TrackRow({ track, index }: { track: EPKTrack; index: number }) {
  return (
    <div className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-white/[0.04]">
      {/* Track number / play */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <span className="text-sm font-medium text-white/30 transition-opacity group-hover:opacity-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        {track.audioUrl && (
          <a
            href={track.audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            aria-label={`Play ${track.title}`}
          >
            <Play size={16} className="ml-0.5 text-white" fill="white" />
          </a>
        )}
      </div>

      {/* Track info */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="truncate text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
          {track.title}
        </span>
        {track.duration && (
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-white/30">
            <Clock size={12} />
            {track.duration}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────
export default async function EPKPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getEPKBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  const epk = result.data

  // Don't show drafts publicly
  if (epk.status === 'draft') {
    notFound()
  }

  const hasSocialLinks = Object.values(epk.social_links || {}).some(Boolean)
  const hasTracks = epk.tracks && epk.tracks.length > 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070f]">
      {/* ── Ambient Background ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Primary gradient orb */}
        <div className="absolute -left-[30%] -top-[20%] h-[800px] w-[800px] rounded-full bg-[#4b4bc0]/20 blur-[180px]" />
        {/* Secondary accent orb */}
        <div className="absolute -bottom-[10%] -right-[20%] h-[600px] w-[600px] rounded-full bg-[#7c3aed]/15 blur-[160px]" />
        {/* Subtle warm accent */}
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#14b8a6]/8 blur-[140px]" />
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10">
        {/* ── Hero Section ── */}
        <section className="relative">
          {/* Cover image area */}
          {epk.image_url ? (
            <div className="relative h-[50vh] min-h-[400px] w-full sm:h-[60vh] sm:min-h-[500px]">
              <Image
                src={epk.image_url}
                alt={epk.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Gradient overlays for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#07070f]/60 via-transparent to-[#07070f]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#07070f]/40 to-transparent" />
            </div>
          ) : (
            /* Fallback hero when no image */
            <div className="relative flex h-[40vh] min-h-[350px] items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-[#4b4bc0]/10 via-[#07070f] to-[#07070f]" />
              <Music2 size={120} className="relative animate-[spin_8s_linear_infinite] text-white/[0.06]" />
            </div>
          )}

          {/* Hero content overlay */}
          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10 md:px-16 lg:px-24">
            <div className="mx-auto max-w-5xl">
              {/* EPK type badge */}
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 backdrop-blur-md">
                  <Sparkles size={12} className="text-[#4b4bc0]" />
                  {epk.type}
                </span>
                {/* View count */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/40 backdrop-blur-sm">
                  <Star size={12} />
                  {epk.views.toLocaleString()} {epk.views === 1 ? 'view' : 'views'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {epk.title}
              </h1>
            </div>
          </div>
        </section>

        {/* ── Main Content ── */}
        <main className="relative px-6 pb-32 pt-12 sm:px-10 md:px-16 lg:px-24">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_360px]">
            {/* ── Left Column ── */}
            <div className="space-y-10">
              {/* Bio Section */}
              {epk.bio && (
                <section>
                  <div className="mb-5 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                      About
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8">
                    <p className="whitespace-pre-wrap text-base font-normal leading-[1.8] text-white/70 sm:text-lg">
                      {epk.bio}
                    </p>
                  </div>
                </section>
              )}

              {/* Tracks Section */}
              {hasTracks && (
                <section>
                  <div className="mb-5 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                      Tracklist
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                    {/* Track list header */}
                    <div className="flex items-center gap-4 border-b border-white/[0.04] px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
                          #
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
                        Title
                      </span>
                    </div>
                    {/* Track rows */}
                    <div className="divide-y divide-white/[0.03]">
                      {epk.tracks.map((track, i) => (
                        <TrackRow key={track.id} track={track} index={i} />
                      ))}
                    </div>
                    {/* Track count footer */}
                    <div className="border-t border-white/[0.04] px-4 py-3">
                      <span className="text-xs text-white/20">
                        {epk.tracks.length} {epk.tracks.length === 1 ? 'track' : 'tracks'}
                      </span>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* ── Right Column / Sidebar ── */}
            <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              {/* Social Links Card */}
              {hasSocialLinks && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
                  <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                    Connect
                  </h3>
                  <div className="space-y-2">
                    {(Object.entries(epk.social_links) as [keyof EPKSocialLinks, string | undefined][])
                      .filter(([, url]) => url)
                      .map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/[0.05]"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-white/50 transition-all duration-300 group-hover:bg-[#4b4bc0]/20 group-hover:text-[#4b4bc0]">
                            <SocialIcon platform={platform} size={16} />
                          </div>
                          <span className="text-sm font-medium text-white/60 transition-colors group-hover:text-white/90">
                            {SOCIAL_LABELS[platform] || platform}
                          </span>
                          <ExternalLink
                            size={12}
                            className="ml-auto text-white/0 transition-all group-hover:text-white/30"
                          />
                        </a>
                      ))}
                  </div>
                </div>
              )}

              {/* Quick Stats Card */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
                <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                  Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Type</span>
                    <span className="text-xs font-semibold text-white/70">{epk.type}</span>
                  </div>
                  <div className="h-px bg-white/[0.04]" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Tracks</span>
                    <span className="text-xs font-semibold text-white/70">
                      {epk.tracks?.length || 0}
                    </span>
                  </div>
                  <div className="h-px bg-white/[0.04]" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Views</span>
                    <span className="text-xs font-semibold text-white/70">
                      {epk.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-white/[0.04]" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Published</span>
                    <span className="text-xs font-semibold text-white/70">
                      {new Date(epk.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="relative border-t border-white/[0.04] bg-[#07070f]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:justify-between sm:px-10 md:px-16 lg:px-24">
            <Link
              href="/"
              className="group flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4b4bc0]">
                <Music size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold tracking-[-0.02em] text-white/70 transition-colors group-hover:text-white/90">
                SyncMaster
              </span>
            </Link>
            <p className="text-center text-[11px] text-white/25 sm:text-right">
              Powered by{' '}
              <Link
                href="/"
                className="font-semibold text-white/40 transition-colors hover:text-[#4b4bc0]"
              >
                SyncMaster
              </Link>{' '}
              — African Composers. Global Briefs.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
