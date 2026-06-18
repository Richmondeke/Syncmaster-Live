'use client'

import { useState, useMemo, useCallback } from 'react'
import { syncMedia, syncPlacements, type SyncMedia, type SyncPlacement } from '@/lib/data/sync-placements'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
// @ts-ignore – lucide-react 1.11 ships CJS .d.ts but no ESM .d.mts; Turbopack resolves ESM and misses some exports at type-check time
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
  LayoutGrid,
  List,
  SlidersHorizontal,
  Calendar,
  MapPin,
  ArrowUpDown,
  Plus,
  X,
  Send,
  TrendingUp,
  Hash,
  Clock,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'film' | 'tv' | 'game' | 'ad' | 'african'
type ViewMode = 'grid' | 'list'
type SortBy = 'newest' | 'oldest' | 'most-songs' | 'most-african' | 'a-z'

const COUNTRY_FLAGS: Record<string, string> = {
  Nigeria: '🇳🇬', 'South Africa': '🇿🇦', Ghana: '🇬🇭', Kenya: '🇰🇪', Tanzania: '🇹🇿',
  Benin: '🇧🇯', Mali: '🇲🇱', Senegal: '🇸🇳', Ethiopia: '🇪🇹', Uganda: '🇺🇬',
  'Democratic Republic of the Congo': '🇨🇩', Cameroon: '🇨🇲', Angola: '🇦🇴',
  Mozambique: '🇲🇿', Zimbabwe: '🇿🇼', Rwanda: '🇷🇼', Egypt: '🇪🇬', Morocco: '🇲🇦',
  'Ivory Coast': '🇨🇮', Niger: '🇳🇪', 'UK-Nigerian': '🇬🇧🇳🇬', 'UK-Zambian': '🇬🇧🇿🇲',
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

const TYPE_LABELS: Record<SyncMedia['type'], string> = {
  film: 'Film', tv: 'TV', game: 'Game', ad: 'Ad', documentary: 'Doc',
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-primary/20 text-primary rounded px-0.5">{part}</span>
    ) : (part)
  )
}

// ─── Data derivations ─────────────────────────────────────────────────────────

const ALL_YEARS = Array.from(new Set(syncMedia.map(m => m.year))).sort((a, b) => b - a)
const ALL_COUNTRIES = Array.from(
  new Set(syncPlacements.filter(p => p.artistCountry).map(p => p.artistCountry!))
).sort()

// ─── Component ────────────────────────────────────────────────────────────────

export default function SyncRadarPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [expandedMedia, setExpandedMedia] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [yearFilter, setYearFilter] = useState<number | null>(null)
  const [countryFilter, setCountryFilter] = useState<string | null>(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // ── Derived data ──────────────────────────────────────────────────────────

  const africanPlacements = useMemo(
    () => syncPlacements.filter((p) => p.isAfricanArtist), []
  )

  const uniqueAfricanArtists = useMemo(
    () => new Set(africanPlacements.map((p) => p.artistName)).size,
    [africanPlacements]
  )

  const filteredMedia = useMemo(() => {
    let media = syncMedia
    if (activeFilter !== 'all' && activeFilter !== 'african') {
      media = media.filter((m) => m.type === activeFilter)
    }
    if (yearFilter) media = media.filter((m) => m.year === yearFilter)
    if (countryFilter) {
      const mediaIds = new Set(syncPlacements.filter(p => p.artistCountry === countryFilter).map(p => p.mediaId))
      media = media.filter(m => mediaIds.has(m.id))
    }
    return media
  }, [activeFilter, yearFilter, countryFilter])

  const filteredPlacements = useMemo(() => {
    let placements = syncPlacements
    if (activeFilter !== 'all' && activeFilter !== 'african') {
      const mediaIds = new Set(syncMedia.filter((m) => m.type === activeFilter).map((m) => m.id))
      placements = placements.filter((p) => mediaIds.has(p.mediaId))
    }
    if (activeFilter === 'african') placements = placements.filter((p) => p.isAfricanArtist)
    if (yearFilter) {
      const mediaIds = new Set(syncMedia.filter(m => m.year === yearFilter).map(m => m.id))
      placements = placements.filter(p => mediaIds.has(p.mediaId))
    }
    if (countryFilter) placements = placements.filter(p => p.artistCountry === countryFilter)
    return placements
  }, [activeFilter, yearFilter, countryFilter])

  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    const matching = filteredPlacements.filter(
      (p) =>
        p.artistName.toLowerCase().includes(q) ||
        p.songTitle.toLowerCase().includes(q) ||
        p.genre?.toLowerCase().includes(q) ||
        p.sceneDescription?.toLowerCase().includes(q) ||
        syncMedia.find((m) => m.id === p.mediaId)?.title.toLowerCase().includes(q)
    )
    const grouped = new Map<string, SyncPlacement[]>()
    matching.forEach((p) => {
      const list = grouped.get(p.mediaId) || []
      list.push(p)
      grouped.set(p.mediaId, list)
    })
    return grouped
  }, [search, filteredPlacements])

  const getMediaById = (id: string) => syncMedia.find((m) => m.id === id)

  const placementsForMedia = useCallback((mediaId: string) =>
    filteredPlacements.filter((p) => p.mediaId === mediaId),
    [filteredPlacements]
  )

  const mediaForFilter = useMemo(() => {
    let media: SyncMedia[]
    if (activeFilter === 'african') {
      const mediaIds = new Set(africanPlacements.map((p) => p.mediaId))
      media = syncMedia.filter((m) => mediaIds.has(m.id))
    } else {
      media = filteredMedia
    }
    if (activeFilter === 'african' && yearFilter) media = media.filter(m => m.year === yearFilter)
    if (activeFilter === 'african' && countryFilter) {
      const mediaIds = new Set(syncPlacements.filter(p => p.artistCountry === countryFilter).map(p => p.mediaId))
      media = media.filter(m => mediaIds.has(m.id))
    }

    switch (sortBy) {
      case 'newest': media = [...media].sort((a, b) => b.year - a.year); break
      case 'oldest': media = [...media].sort((a, b) => a.year - b.year); break
      case 'most-songs': media = [...media].sort((a, b) => syncPlacements.filter(p => p.mediaId === b.id).length - syncPlacements.filter(p => p.mediaId === a.id).length); break
      case 'most-african': media = [...media].sort((a, b) => syncPlacements.filter(p => p.mediaId === b.id && p.isAfricanArtist).length - syncPlacements.filter(p => p.mediaId === a.id && p.isAfricanArtist).length); break
      case 'a-z': media = [...media].sort((a, b) => a.title.localeCompare(b.title)); break
    }
    return media
  }, [activeFilter, filteredMedia, africanPlacements, sortBy, yearFilter, countryFilter])

  function toggleExpanded(mediaId: string) {
    setExpandedMedia((prev) => {
      const next = new Set(prev)
      if (next.has(mediaId)) next.delete(mediaId)
      else next.add(mediaId)
      return next
    })
  }

  const clearAllFilters = () => {
    setYearFilter(null); setCountryFilter(null); setActiveFilter('all'); setSortBy('newest'); setSearch('')
  }

  const hasActiveFilters = yearFilter || countryFilter || activeFilter !== 'all'

  const TABS: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: syncMedia.length },
    { key: 'film', label: 'Films', count: syncMedia.filter(m => m.type === 'film').length },
    { key: 'tv', label: 'TV', count: syncMedia.filter(m => m.type === 'tv').length },
    { key: 'game', label: 'Games', count: syncMedia.filter(m => m.type === 'game').length },
    { key: 'ad', label: 'Ads & Events', count: syncMedia.filter(m => m.type === 'ad').length },
    { key: 'african', label: 'African 🌍', count: new Set(africanPlacements.map(p => p.mediaId)).size },
  ]

  const SORT_OPTIONS: { key: SortBy; label: string }[] = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'most-songs', label: 'Most Songs' },
    { key: 'most-african', label: 'Most African Artists' },
    { key: 'a-z', label: 'A → Z' },
  ]

  const isSearching = !!search.trim()

  return (
    <div className="flex flex-col gap-10 pt-2 pb-20 max-w-6xl mx-auto">

      {/* ───── Header ───── */}
      <section className="group relative overflow-hidden rounded-[2.5rem] bg-primary p-10 md:p-14 text-white shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <Disc3 className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-[-0.068em] leading-[1.1]">
                Sync Radar
              </h1>
            </div>
            <p className="text-lg text-white/70 font-medium tracking-[-0.02em] max-w-xl">
              Discover every song placed in movies, TV shows, games, and ads — with a focus on African artists breaking barriers globally.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm bg-white/10 border border-white/10 rounded-full px-4 py-1.5 font-bold">
              <Music2 className="w-4 h-4" /> {syncPlacements.length} placements
            </span>
            <span className="inline-flex items-center gap-2 text-sm bg-white/10 border border-white/10 rounded-full px-4 py-1.5 font-bold">
              <Film className="w-4 h-4" /> {syncMedia.length} media titles
            </span>
            <span className="inline-flex items-center gap-2 text-sm bg-white/10 border border-white/10 rounded-full px-4 py-1.5 font-bold">
              <Globe2 className="w-4 h-4" /> {uniqueAfricanArtists} African artists
            </span>
            <span className="inline-flex items-center gap-2 text-sm bg-white/10 border border-white/10 rounded-full px-4 py-1.5 font-medium text-white/70">
              <TrendingUp className="w-4 h-4" /> 2014–2026
            </span>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-black/30 blur-[120px]" />
      </section>

      {/* ───── Search Bar ───── */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
        <Input
          type="text"
          placeholder="Search any song, artist, movie, show, or game…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-14 pl-14 pr-12 rounded-2xl border-border bg-card text-base font-medium focus-visible:ring-primary/20 shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ───── Filter Tabs + Controls ───── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveFilter(tab.key); setExpandedMedia(new Set()) }}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeFilter === tab.key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab.label} <span className="text-[10px] ml-0.5 opacity-70">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Filters toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-full gap-1.5 border-border ${showFilters ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
          </Button>

          {/* View mode */}
          <div className="flex items-center bg-card border border-border rounded-full p-0.5">
            <button onClick={() => setViewMode('grid')} className={`rounded-full p-1.5 transition-all ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`rounded-full p-1.5 transition-all ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Submit */}
          <Button variant="outline" size="sm" onClick={() => setShowSubmitModal(true)} className="rounded-full gap-1.5 border-border">
            <Plus className="w-3.5 h-3.5" /> Submit
          </Button>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 bg-card border border-border rounded-2xl p-4">
            <div className="flex flex-col gap-1.5">
              <label className="label flex items-center gap-1"><Calendar className="w-3 h-3" /> Year</label>
              <select value={yearFilter || ''} onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : null)}
                className="bg-muted text-foreground border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary/40 outline-none">
                <option value="">All Years</option>
                {ALL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label flex items-center gap-1"><MapPin className="w-3 h-3" /> Country</label>
              <select value={countryFilter || ''} onChange={(e) => setCountryFilter(e.target.value || null)}
                className="bg-muted text-foreground border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary/40 outline-none">
                <option value="">All Countries</option>
                {ALL_COUNTRIES.map(c => <option key={c} value={c}>{getFlag(c)} {c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label flex items-center gap-1"><ArrowUpDown className="w-3 h-3" /> Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="bg-muted text-foreground border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary/40 outline-none">
                {SORT_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground bg-muted rounded-lg px-3 py-1.5 border border-border transition-all flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear All
                </button>
              </div>
            )}
            {(yearFilter || countryFilter) && (
              <div className="w-full flex flex-wrap gap-1.5 pt-1">
                {yearFilter && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
                    {yearFilter} <button onClick={() => setYearFilter(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {countryFilter && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
                    {getFlag(countryFilter)} {countryFilter} <button onClick={() => setCountryFilter(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ───── Stats Bar ───── */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Music2 className="w-4 h-4 text-primary" /> <span className="font-bold text-foreground">{filteredPlacements.length}</span> placements</span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1.5"><Film className="w-4 h-4 text-primary" /> <span className="font-bold text-foreground">{mediaForFilter.length}</span> media</span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1.5"><Globe2 className="w-4 h-4 text-primary" /> <span className="font-bold text-foreground">{new Set(filteredPlacements.filter(p => p.isAfricanArtist).map(p => p.artistName)).size}</span> African artists</span>
      </div>

      {/* ───── Search Results ───── */}
      {isSearching && searchResults && (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-bold text-foreground">{Array.from(searchResults.values()).flat().length}</span> results
            {search && <> for &ldquo;<span className="text-primary">{search}</span>&rdquo;</>}
          </p>

          {searchResults.size === 0 && (
            <div className="py-20 flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-border bg-muted/20">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><Search className="w-7 h-7 text-muted-foreground" /></div>
              <p className="font-black text-foreground text-lg">No matches found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              <Button variant="outline" size="sm" onClick={() => setShowSubmitModal(true)} className="rounded-full gap-1.5 mt-2"><Plus className="w-3.5 h-3.5" /> Submit this placement</Button>
            </div>
          )}

          {Array.from(searchResults.entries()).map(([mediaId, placements]) => {
            const media = getMediaById(mediaId)
            if (!media) return null
            return (
              <Card key={mediaId} className="rounded-[2rem] border-border bg-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-16 rounded-xl bg-muted border border-border shrink-0 overflow-hidden">
                      <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-black tracking-[-0.068em] text-foreground">{highlightMatch(media.title, search)}</h3>
                      <p className="text-xs text-muted-foreground">{media.year} · {TYPE_LABELS[media.type]}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {placements.map((p) => <SearchResultRow key={p.id} placement={p} query={search} />)}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ───── African Artists Spotlight ───── */}
      {!isSearching && (
        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-[-0.068em] text-foreground">African Artists Spotlight</h2>
            <p className="text-sm text-muted-foreground font-medium tracking-[-0.02em]">Breaking barriers in global sync licensing</p>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {africanPlacements.map((placement) => {
                const media = getMediaById(placement.mediaId)
                return (
                  <div key={placement.id} className="snap-start shrink-0 w-[280px] group">
                    <div className="rounded-[2rem] bg-card border border-border p-5 h-full hover:border-primary/30 hover:shadow-[var(--shadow-primary-glow)] transition-all duration-300 hover:-translate-y-0.5">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getFlag(placement.artistCountry)}</span>
                            <div>
                              <p className="font-black text-foreground tracking-[-0.02em] text-sm leading-tight">{placement.artistName}</p>
                              <p className="text-xs text-muted-foreground">{placement.artistCountry}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[10px] shrink-0 rounded-full">{placement.genre}</Badge>
                        </div>

                        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                          <Play className="w-3.5 h-3.5 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{placement.songTitle}</p>
                            <p className="text-xs text-muted-foreground truncate">in {media?.title}</p>
                          </div>
                        </div>

                        {placement.sceneDescription && (
                          <p className="text-xs text-muted-foreground italic line-clamp-2">&ldquo;{placement.sceneDescription}&rdquo;</p>
                        )}

                        {placement.spotifyUrl && (
                          <a href={placement.spotifyUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-auto">
                            <ExternalLink className="w-3 h-3" /> Listen on Spotify
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───── Browse by Media ───── */}
      {!isSearching && (
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-[-0.068em] text-foreground">Browse by Media</h2>

          {/* Grid view */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mediaForFilter.map((media) => {
                const isExpanded = expandedMedia.has(media.id)
                const placements = activeFilter === 'african'
                  ? africanPlacements.filter((p) => p.mediaId === media.id)
                  : placementsForMedia(media.id)
                return (
                  <div key={media.id} className={isExpanded ? 'md:col-span-2 lg:col-span-3' : ''}>
                    <Card className="rounded-[2rem] border-border bg-card overflow-hidden hover:border-primary/20 transition-all duration-300 group/media">
                      <button onClick={() => toggleExpanded(media.id)} className="w-full text-left">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-20 rounded-xl bg-muted border border-border shrink-0 overflow-hidden group-hover/media:scale-[1.03] transition-transform duration-300">
                              <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h3 className="font-black tracking-[-0.04em] text-foreground text-sm leading-tight truncate group-hover/media:text-primary transition-colors">{media.title}</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">{media.year}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge variant="secondary" className="text-[10px] rounded-full">{TYPE_LABELS[media.type]}</Badge>
                                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Music2 className="w-3 h-3" /> {placements.length} song{placements.length !== 1 ? 's' : ''}</span>
                                {placements.some((p) => p.isAfricanArtist) && (
                                  <span className="flex items-center gap-1 text-primary"><Globe2 className="w-3 h-3" /> {placements.filter((p) => p.isAfricanArtist).length} African</span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {media.genre.slice(0, 3).map((g) => (
                                  <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{g}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-border">
                          <div className="p-5 space-y-1">
                            <p className="label flex items-center gap-2 mb-3"><Star className="w-3 h-3" /> Placements in {media.title}</p>
                            {placements.map((p, idx) => <PlacementRow key={p.id} placement={p} index={idx} />)}
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                )
              })}
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <div className="flex flex-col gap-1">
              {mediaForFilter.map((media) => {
                const isExpanded = expandedMedia.has(media.id)
                const placements = activeFilter === 'african'
                  ? africanPlacements.filter((p) => p.mediaId === media.id)
                  : placementsForMedia(media.id)
                return (
                  <div key={media.id}>
                    <button onClick={() => toggleExpanded(media.id)} className="w-full text-left group/row">
                      <div className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-card transition-all border border-transparent hover:border-border">
                        <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-muted border border-border">
                          <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-foreground truncate group-hover/row:text-primary transition-colors">{media.title}</h3>
                            <Badge variant="secondary" className="text-[10px] rounded-full">{TYPE_LABELS[media.type]}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{media.year} · {placements.length} songs</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {placements.some(p => p.isAfricanArtist) && (
                            <span className="text-primary text-xs flex items-center gap-1"><Globe2 className="w-3 h-3" />{placements.filter(p => p.isAfricanArtist).length}</span>
                          )}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="ml-14 pl-4 border-l-2 border-primary/20 mb-2">
                        {media.description && <p className="text-xs text-muted-foreground italic mb-3 max-w-xl">{media.description}</p>}
                        {placements.map((p, idx) => <PlacementRow key={p.id} placement={p} index={idx} />)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* ───── Submit Modal ───── */}
      {showSubmitModal && <SubmitPlacementModal onClose={() => setShowSubmitModal(false)} />}
    </div>
  )
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function PlacementRow({ placement, index }: { placement: SyncPlacement; index: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-all duration-200 group/row">
      <span className="text-xs text-muted-foreground font-mono w-5 text-right shrink-0">{String(index + 1).padStart(2, '0')}</span>
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover/row:bg-primary/10 transition-colors">
        <Music2 className="w-4 h-4 text-muted-foreground group-hover/row:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{placement.songTitle}</span>
          {placement.isAfricanArtist && <span className="text-sm">{getFlag(placement.artistCountry)} 🌍</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{placement.artistName}</span>
          {placement.season != null && placement.episode != null && (
            <><span className="text-border">·</span><span className="shrink-0">S{placement.season}E{placement.episode}</span></>
          )}
        </div>
      </div>
      {placement.sceneDescription && <span className="text-[10px] text-muted-foreground max-w-[200px] truncate hidden lg:inline italic">{placement.sceneDescription}</span>}
      <Badge variant="secondary" className="text-[10px] shrink-0 hidden sm:inline-flex rounded-full">{placement.genre}</Badge>
      {placement.spotifyUrl && (
        <a href={placement.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors shrink-0" onClick={(e) => e.stopPropagation()}>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  )
}

function SearchResultRow({ placement, query }: { placement: SyncPlacement; query: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-all duration-200 group/row">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover/row:bg-primary/10 transition-colors">
        <Music2 className="w-4 h-4 text-muted-foreground group-hover/row:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{highlightMatch(placement.songTitle, query)}</span>
          {placement.isAfricanArtist && <span className="text-sm">{getFlag(placement.artistCountry)} 🌍</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{highlightMatch(placement.artistName, query)}</span>
        </div>
      </div>
      <Badge variant="secondary" className="text-[10px] shrink-0 hidden sm:inline-flex rounded-full">{placement.genre}</Badge>
    </div>
  )
}

// ─── Submit Modal ─────────────────────────────────────────────────────────────

function SubmitPlacementModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    mediaTitle: '', mediaType: 'film', mediaYear: '', artistName: '', songTitle: '',
    isAfricanArtist: false, artistCountry: '', genre: '', sceneDescription: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-card border border-border rounded-[2rem] shadow-[var(--shadow-elev-3)] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Send className="w-5 h-5 text-primary" /></div>
              <div>
                <h3 className="font-black tracking-[-0.068em] text-foreground">Submit a Placement</h3>
                <p className="text-xs text-muted-foreground">Help grow our library</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted transition-all"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 pt-2 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">✨</div>
            <h4 className="font-black text-foreground text-lg">Thanks for contributing!</h4>
            <p className="text-sm text-muted-foreground">Your submission will be reviewed and added if verified.</p>
            <Button onClick={onClose} variant="outline" className="rounded-full mt-2">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Media Title *</label>
                <Input required placeholder="e.g. Squid Game" value={formData.mediaTitle} onChange={(e) => setFormData({ ...formData, mediaTitle: e.target.value })} className="mt-1 bg-muted border-border rounded-xl" />
              </div>
              <div>
                <label className="label">Type *</label>
                <select value={formData.mediaType} onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })} className="mt-1 w-full bg-muted text-foreground border border-border rounded-xl px-3 py-2 text-sm">
                  <option value="film">Film</option><option value="tv">TV Series</option><option value="game">Video Game</option><option value="ad">Ad / Campaign</option>
                </select>
              </div>
              <div>
                <label className="label">Year</label>
                <Input type="number" placeholder="2025" value={formData.mediaYear} onChange={(e) => setFormData({ ...formData, mediaYear: e.target.value })} className="mt-1 bg-muted border-border rounded-xl" />
              </div>
            </div>
            <div className="hairline pt-4 grid grid-cols-2 gap-3">
              <div><label className="label">Artist Name *</label><Input required placeholder="e.g. Burna Boy" value={formData.artistName} onChange={(e) => setFormData({ ...formData, artistName: e.target.value })} className="mt-1 bg-muted border-border rounded-xl" /></div>
              <div><label className="label">Song Title *</label><Input required placeholder="e.g. Last Last" value={formData.songTitle} onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })} className="mt-1 bg-muted border-border rounded-xl" /></div>
              <div><label className="label">Genre</label><Input placeholder="e.g. Afrobeats" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} className="mt-1 bg-muted border-border rounded-xl" /></div>
              <div><label className="label">Country</label><Input placeholder="e.g. Nigeria" value={formData.artistCountry} onChange={(e) => setFormData({ ...formData, artistCountry: e.target.value })} className="mt-1 bg-muted border-border rounded-xl" /></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isAfricanArtist} onChange={(e) => setFormData({ ...formData, isAfricanArtist: e.target.checked })} className="w-4 h-4 rounded border-border bg-muted text-primary focus:ring-primary/40" />
              <span className="text-sm text-muted-foreground">African artist 🌍</span>
            </label>
            <div>
              <label className="label">Scene Description</label>
              <textarea placeholder="Describe the scene..." value={formData.sceneDescription} onChange={(e) => setFormData({ ...formData, sceneDescription: e.target.value })} className="mt-1 w-full bg-muted text-foreground border border-border rounded-xl px-3 py-2 text-sm resize-none h-20 focus:ring-1 focus:ring-primary/40 outline-none" />
            </div>
            <Button type="submit" className="w-full rounded-xl gap-2"><Send className="w-4 h-4" /> Submit Placement</Button>
          </form>
        )}
      </div>
    </div>
  )
}
