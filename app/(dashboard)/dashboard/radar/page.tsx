'use client'

import { useState, useMemo } from 'react'
import { syncMedia, syncPlacements, type SyncMedia, type SyncPlacement } from '@/lib/data/sync-placements'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Film,
  Tv,
  Gamepad2,
  Megaphone,
  Globe2,
  Music2,
  ChevronDown,
  ChevronUp,
  Play,
  ExternalLink,
  Disc3,
  Star,
  Sparkles,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'film' | 'tv' | 'game' | 'ad' | 'african'

const COUNTRY_FLAGS: Record<string, string> = {
  Nigeria: '🇳🇬',
  'South Africa': '🇿🇦',
  Ghana: '🇬🇭',
  Kenya: '🇰🇪',
  Tanzania: '🇹🇿',
  Benin: '🇧🇯',
  Mali: '🇲🇱',
  Senegal: '🇸🇳',
  Ethiopia: '🇪🇹',
  Uganda: '🇺🇬',
  'Democratic Republic of the Congo': '🇨🇩',
  Cameroon: '🇨🇲',
  Angola: '🇦🇴',
  Mozambique: '🇲🇿',
  Zimbabwe: '🇿🇼',
  Rwanda: '🇷🇼',
  Egypt: '🇪🇬',
  Morocco: '🇲🇦',
  'Ivory Coast': '🇨🇮',
}

function getFlag(country: string | null): string {
  if (!country) return ''
  return COUNTRY_FLAGS[country] || '🌍'
}

const TYPE_ICONS: Record<SyncMedia['type'], React.ReactNode> = {
  film: <Film className="w-4 h-4" />,
  tv: <Tv className="w-4 h-4" />,
  game: <Gamepad2 className="w-4 h-4" />,
  ad: <Megaphone className="w-4 h-4" />,
  documentary: <Film className="w-4 h-4" />,
}

const TYPE_COLORS: Record<SyncMedia['type'], string> = {
  film: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  tv: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  game: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  ad: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  documentary: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
}

const TYPE_LABELS: Record<SyncMedia['type'], string> = {
  film: 'Film',
  tv: 'TV',
  game: 'Game',
  ad: 'Ad',
  documentary: 'Doc',
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-amber-400/30 text-amber-200 rounded px-0.5">
        {part}
      </span>
    ) : (
      part
    )
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SyncRadarPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [expandedMedia, setExpandedMedia] = useState<Set<string>>(new Set())

  // ── Derived data ──────────────────────────────────────────────────────────

  const africanPlacements = useMemo(
    () => syncPlacements.filter((p) => p.isAfricanArtist),
    []
  )

  const uniqueAfricanArtists = useMemo(
    () => new Set(africanPlacements.map((p) => p.artistName)).size,
    [africanPlacements]
  )

  const filteredMedia = useMemo(() => {
    if (activeFilter === 'african') return syncMedia
    if (activeFilter === 'all') return syncMedia
    return syncMedia.filter((m) => m.type === activeFilter)
  }, [activeFilter])

  const filteredPlacements = useMemo(() => {
    let placements = syncPlacements

    // Type filter
    if (activeFilter !== 'all' && activeFilter !== 'african') {
      const mediaIds = new Set(syncMedia.filter((m) => m.type === activeFilter).map((m) => m.id))
      placements = placements.filter((p) => mediaIds.has(p.mediaId))
    }

    // African filter
    if (activeFilter === 'african') {
      placements = placements.filter((p) => p.isAfricanArtist)
    }

    return placements
  }, [activeFilter])

  const searchResults = useMemo(() => {
    if (!search.trim()) return null

    const q = search.toLowerCase()
    const matching = filteredPlacements.filter(
      (p) =>
        p.artistName.toLowerCase().includes(q) ||
        p.songTitle.toLowerCase().includes(q) ||
        syncMedia.find((m) => m.id === p.mediaId)?.title.toLowerCase().includes(q)
    )

    // Group by media
    const grouped = new Map<string, SyncPlacement[]>()
    matching.forEach((p) => {
      const list = grouped.get(p.mediaId) || []
      list.push(p)
      grouped.set(p.mediaId, list)
    })

    return grouped
  }, [search, filteredPlacements])

  const getMediaById = (id: string) => syncMedia.find((m) => m.id === id)

  const placementsForMedia = (mediaId: string) =>
    filteredPlacements.filter((p) => p.mediaId === mediaId)

  const mediaForFilter = useMemo(() => {
    if (activeFilter === 'african') {
      const mediaIds = new Set(africanPlacements.map((p) => p.mediaId))
      return syncMedia.filter((m) => mediaIds.has(m.id))
    }
    return filteredMedia
  }, [activeFilter, filteredMedia, africanPlacements])

  function toggleExpanded(mediaId: string) {
    setExpandedMedia((prev) => {
      const next = new Set(prev)
      if (next.has(mediaId)) next.delete(mediaId)
      else next.add(mediaId)
      return next
    })
  }

  // ── Filter tabs config ────────────────────────────────────────────────────

  const TABS: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Disc3 className="w-4 h-4" /> },
    { key: 'film', label: 'Film 🎬', icon: <Film className="w-4 h-4" /> },
    { key: 'tv', label: 'TV 📺', icon: <Tv className="w-4 h-4" /> },
    { key: 'game', label: 'Games 🎮', icon: <Gamepad2 className="w-4 h-4" /> },
    { key: 'ad', label: 'Ads 📢', icon: <Megaphone className="w-4 h-4" /> },
    { key: 'african', label: 'African Artists 🌍', icon: <Globe2 className="w-4 h-4" /> },
  ]

  // ── Render ────────────────────────────────────────────────────────────────

  const isSearching = !!search.trim()

  return (
    <div className="flex flex-col gap-8 pt-4 pb-20 animate-in fade-in duration-500">
      {/* ───── Header ───── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500/10 via-background to-violet-500/10 border border-border/40 px-8 py-10 md:py-14">
        {/* Decorative elements */}
        <div className="absolute top-4 right-6 text-amber-400/20 animate-pulse">
          <Sparkles className="w-20 h-20" />
        </div>
        <div className="absolute bottom-2 left-6 text-violet-400/10 animate-pulse" style={{ animationDelay: '1s' }}>
          <Star className="w-16 h-16" />
        </div>

        <div className="relative z-10 flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Disc3 className="w-6 h-6 text-black animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Sync Radar
            </h1>
          </div>
          <p className="text-lg text-muted-foreground tracking-tight">
            Discover every song placed in movies, TV shows, games, and ads
          </p>
        </div>
      </div>

      {/* ───── Search Bar ───── */}
      <div className="relative group">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-amber-500/20 via-violet-500/20 to-amber-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl" />
        <div className="relative flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/60 rounded-[2rem] px-6 py-3 group-focus-within:border-amber-500/40 transition-all duration-300">
          <Search className="w-5 h-5 text-muted-foreground shrink-0 group-focus-within:text-amber-400 transition-colors" />
          <Input
            type="text"
            placeholder="Search by artist, song title, or media…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent h-10 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-0 rounded-none px-0"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-muted-foreground hover:text-foreground bg-muted/60 rounded-full px-3 py-1 transition-colors shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ───── Filter Tabs ───── */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeFilter === tab.key ? 'default' : 'frosted'}
            size="sm"
            onClick={() => {
              setActiveFilter(tab.key)
              setExpandedMedia(new Set())
            }}
            className={`
              rounded-full transition-all duration-300
              ${activeFilter === tab.key
                ? 'shadow-md shadow-white/10 scale-[1.02]'
                : 'hover:scale-[1.02]'
              }
            `}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* ───── Stats Bar ───── */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground px-1">
        <span className="flex items-center gap-1.5">
          <Music2 className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-foreground">{filteredPlacements.length}</span> placements
        </span>
        <span className="text-border">•</span>
        <span className="flex items-center gap-1.5">
          <Film className="w-4 h-4 text-violet-400" />
          <span className="font-bold text-foreground">{mediaForFilter.length}</span> media titles
        </span>
        <span className="text-border">•</span>
        <span className="flex items-center gap-1.5">
          <Globe2 className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-foreground">{uniqueAfricanArtists}</span> African artists
        </span>
      </div>

      {/* ───── Search Results ───── */}
      {isSearching && searchResults && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 px-1">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-muted-foreground">
              Found <span className="font-bold text-foreground">{Array.from(searchResults.values()).flat().length}</span> results
            </span>
          </div>

          {searchResults.size === 0 && (
            <div className="py-20 flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/10">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-black text-foreground text-lg">No matches found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </div>
          )}

          {Array.from(searchResults.entries()).map(([mediaId, placements]) => {
            const media = getMediaById(mediaId)
            if (!media) return null
            return (
              <Card key={mediaId} className="rounded-[2rem] bg-card/80 backdrop-blur-sm border-border/60 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${TYPE_COLORS[media.type]}`}>
                      {TYPE_ICONS[media.type]}
                    </div>
                    <div>
                      <h3 className="font-black tracking-tight text-foreground">
                        {highlightMatch(media.title, search)}
                      </h3>
                      <p className="text-xs text-muted-foreground">{media.year} · {TYPE_LABELS[media.type]}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {placements.map((p) => (
                      <SearchResultRow key={p.id} placement={p} query={search} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ───── African Artists Spotlight ───── */}
      {!isSearching && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-foreground">
                African Artists Spotlight
              </h2>
              <p className="text-sm text-muted-foreground">
                Breaking barriers in global sync licensing
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {africanPlacements.map((placement) => {
                const media = getMediaById(placement.mediaId)
                return (
                  <div
                    key={placement.id}
                    className="snap-start shrink-0 w-[280px] group"
                  >
                    <div className="relative rounded-[1.5rem] bg-gradient-to-br from-amber-500/10 via-card to-orange-500/10 border border-amber-500/20 p-5 h-full hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
                      {/* Shimmer overlay */}
                      <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-transparent via-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="relative z-10 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getFlag(placement.artistCountry)}</span>
                            <div>
                              <p className="font-black text-foreground tracking-tight text-sm leading-tight">
                                {placement.artistName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {placement.artistCountry}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] shrink-0">
                            {placement.genre}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2">
                          <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {placement.songTitle}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              in {media?.title}
                            </p>
                          </div>
                        </div>

                        {placement.sceneDescription && (
                          <p className="text-xs text-muted-foreground/70 italic line-clamp-2">
                            &ldquo;{placement.sceneDescription}&rdquo;
                          </p>
                        )}

                        {placement.spotifyUrl && (
                          <a
                            href={placement.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors mt-auto"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Listen on Spotify
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───── Browse by Media ───── */}
      {!isSearching && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Browse by Media
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mediaForFilter.map((media) => {
              const isExpanded = expandedMedia.has(media.id)
              const placements = activeFilter === 'african'
                ? africanPlacements.filter((p) => p.mediaId === media.id)
                : placementsForMedia(media.id)

              return (
                <div key={media.id} className={`${isExpanded ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                  <Card className="rounded-[2rem] bg-card/80 backdrop-blur-sm border-border/60 overflow-hidden hover:border-foreground/20 transition-all duration-300 group/media">
                    {/* Media Header — always visible */}
                    <button
                      onClick={() => toggleExpanded(media.id)}
                      className="w-full text-left"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Poster placeholder */}
                          <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-muted/60 to-muted/30 border border-border/40 flex items-center justify-center shrink-0 overflow-hidden group-hover/media:scale-[1.03] transition-transform duration-300">
                            <div className={`w-full h-full flex items-center justify-center ${TYPE_COLORS[media.type]} bg-opacity-20`}>
                              {TYPE_ICONS[media.type]}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-black tracking-tight text-foreground text-sm leading-tight truncate group-hover/media:text-amber-300 transition-colors">
                                  {media.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {media.year}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge className={`${TYPE_COLORS[media.type]} text-[10px]`}>
                                  {TYPE_LABELS[media.type]}
                                </Badge>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Music2 className="w-3 h-3" />
                                {placements.length} song{placements.length !== 1 ? 's' : ''}
                              </span>
                              {placements.some((p) => p.isAfricanArtist) && (
                                <span className="flex items-center gap-1 text-amber-400">
                                  <Globe2 className="w-3 h-3" />
                                  {placements.filter((p) => p.isAfricanArtist).length} African
                                </span>
                              )}
                            </div>

                            {/* Genre pills */}
                            <div className="flex flex-wrap gap-1">
                              {media.genre.slice(0, 3).map((g) => (
                                <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </button>

                    {/* Expanded: placement list */}
                    {isExpanded && (
                      <div className="border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="p-5 space-y-2">
                          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2 mb-3">
                            <Star className="w-3 h-3" />
                            Placements in {media.title}
                          </div>
                          {placements.map((p, idx) => (
                            <PlacementRow key={p.id} placement={p} index={idx} />
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function PlacementRow({ placement, index }: { placement: SyncPlacement; index: number }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/40 transition-all duration-200 group/row animate-in fade-in duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Track number */}
      <span className="text-xs text-muted-foreground/40 font-mono w-5 text-right shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Play icon on hover */}
      <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 group-hover/row:bg-amber-500/20 transition-colors">
        <Music2 className="w-4 h-4 text-muted-foreground group-hover/row:text-amber-400 transition-colors" />
      </div>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">
            {placement.songTitle}
          </span>
          {placement.isAfricanArtist && (
            <span className="text-sm" title={placement.artistCountry || 'African Artist'}>
              {getFlag(placement.artistCountry)} 🌍
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{placement.artistName}</span>
          {placement.season != null && placement.episode != null && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="shrink-0">S{placement.season}E{placement.episode}</span>
            </>
          )}
        </div>
      </div>

      {/* Genre badge */}
      <Badge variant="secondary" className="text-[10px] shrink-0 hidden sm:inline-flex">
        {placement.genre}
      </Badge>

      {/* Spotify link */}
      {placement.spotifyUrl && (
        <a
          href={placement.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  )
}

function SearchResultRow({ placement, query }: { placement: SyncPlacement; query: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/40 transition-all duration-200 group/row">
      <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 group-hover/row:bg-amber-500/20 transition-colors">
        <Music2 className="w-4 h-4 text-muted-foreground group-hover/row:text-amber-400 transition-colors" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">
            {highlightMatch(placement.songTitle, query)}
          </span>
          {placement.isAfricanArtist && (
            <span className="text-sm">
              {getFlag(placement.artistCountry)} 🌍
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{highlightMatch(placement.artistName, query)}</span>
          {placement.season != null && placement.episode != null && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="shrink-0">S{placement.season}E{placement.episode}</span>
            </>
          )}
        </div>
      </div>

      <Badge variant="secondary" className="text-[10px] shrink-0 hidden sm:inline-flex">
        {placement.genre}
      </Badge>

      {placement.spotifyUrl && (
        <a
          href={placement.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  )
}
