'use client'

import { useState, useMemo, useCallback } from 'react'
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
  Niger: '🇳🇪',
  'UK-Nigerian': '🇬🇧🇳🇬',
  'UK-Zambian': '🇬🇧🇿🇲',
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

// ─── Data derivations ─────────────────────────────────────────────────────────

const ALL_YEARS = Array.from(new Set(syncMedia.map(m => m.year))).sort((a, b) => b - a)
const ALL_COUNTRIES = Array.from(
  new Set(syncPlacements.filter(p => p.artistCountry).map(p => p.artistCountry!))
).sort()
const ALL_GENRES = Array.from(
  new Set(syncPlacements.map(p => p.genre).filter(Boolean))
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
    () => syncPlacements.filter((p) => p.isAfricanArtist),
    []
  )

  const uniqueAfricanArtists = useMemo(
    () => new Set(africanPlacements.map((p) => p.artistName)).size,
    [africanPlacements]
  )

  const filteredMedia = useMemo(() => {
    let media = syncMedia

    // Type filter
    if (activeFilter !== 'all' && activeFilter !== 'african') {
      media = media.filter((m) => m.type === activeFilter)
    }

    // Year filter
    if (yearFilter) {
      media = media.filter((m) => m.year === yearFilter)
    }

    // Country filter (only show media that has placements from that country)
    if (countryFilter) {
      const mediaIds = new Set(
        syncPlacements.filter(p => p.artistCountry === countryFilter).map(p => p.mediaId)
      )
      media = media.filter(m => mediaIds.has(m.id))
    }

    return media
  }, [activeFilter, yearFilter, countryFilter])

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

    // Year filter
    if (yearFilter) {
      const mediaIds = new Set(syncMedia.filter(m => m.year === yearFilter).map(m => m.id))
      placements = placements.filter(p => mediaIds.has(p.mediaId))
    }

    // Country filter
    if (countryFilter) {
      placements = placements.filter(p => p.artistCountry === countryFilter)
    }

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

    // Year filter applied in filteredMedia already, but for african tab:
    if (activeFilter === 'african' && yearFilter) {
      media = media.filter(m => m.year === yearFilter)
    }
    if (activeFilter === 'african' && countryFilter) {
      const mediaIds = new Set(
        syncPlacements.filter(p => p.artistCountry === countryFilter).map(p => p.mediaId)
      )
      media = media.filter(m => mediaIds.has(m.id))
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        media = [...media].sort((a, b) => b.year - a.year)
        break
      case 'oldest':
        media = [...media].sort((a, b) => a.year - b.year)
        break
      case 'most-songs':
        media = [...media].sort((a, b) => {
          const aCount = syncPlacements.filter(p => p.mediaId === a.id).length
          const bCount = syncPlacements.filter(p => p.mediaId === b.id).length
          return bCount - aCount
        })
        break
      case 'most-african':
        media = [...media].sort((a, b) => {
          const aCount = syncPlacements.filter(p => p.mediaId === a.id && p.isAfricanArtist).length
          const bCount = syncPlacements.filter(p => p.mediaId === b.id && p.isAfricanArtist).length
          return bCount - aCount
        })
        break
      case 'a-z':
        media = [...media].sort((a, b) => a.title.localeCompare(b.title))
        break
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
    setYearFilter(null)
    setCountryFilter(null)
    setActiveFilter('all')
    setSortBy('newest')
    setSearch('')
  }

  const hasActiveFilters = yearFilter || countryFilter || activeFilter !== 'all'

  // ── Filter tabs config ────────────────────────────────────────────────────

  const TABS: { key: FilterTab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'all', label: 'All', icon: <Disc3 className="w-4 h-4" />, count: syncMedia.length },
    { key: 'film', label: 'Films', icon: <Film className="w-4 h-4" />, count: syncMedia.filter(m => m.type === 'film').length },
    { key: 'tv', label: 'TV', icon: <Tv className="w-4 h-4" />, count: syncMedia.filter(m => m.type === 'tv').length },
    { key: 'game', label: 'Games', icon: <Gamepad2 className="w-4 h-4" />, count: syncMedia.filter(m => m.type === 'game').length },
    { key: 'ad', label: 'Ads & Events', icon: <Megaphone className="w-4 h-4" />, count: syncMedia.filter(m => m.type === 'ad').length },
    { key: 'african', label: 'African 🌍', icon: <Globe2 className="w-4 h-4" />, count: new Set(africanPlacements.map(p => p.mediaId)).size },
  ]

  // ── Sort options ──────────────────────────────────────────────────────────

  const SORT_OPTIONS: { key: SortBy; label: string; icon: React.ReactNode }[] = [
    { key: 'newest', label: 'Newest First', icon: <Clock className="w-3.5 h-3.5" /> },
    { key: 'oldest', label: 'Oldest First', icon: <Clock className="w-3.5 h-3.5 rotate-180" /> },
    { key: 'most-songs', label: 'Most Songs', icon: <Hash className="w-3.5 h-3.5" /> },
    { key: 'most-african', label: 'Most African Artists', icon: <Globe2 className="w-3.5 h-3.5" /> },
    { key: 'a-z', label: 'A → Z', icon: <ArrowUpDown className="w-3.5 h-3.5" /> },
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
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Sync Radar
              </h1>
              <p className="text-sm text-muted-foreground">
                Searchable music placement library
              </p>
            </div>
          </div>
          <p className="text-base text-muted-foreground tracking-tight">
            Discover every song placed in movies, TV shows, games, and ads — with a focus on African artists breaking barriers globally
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10">
              <Music2 className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-foreground">{syncPlacements.length}</span>
              <span className="text-xs text-muted-foreground">placements</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10">
              <Film className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-foreground">{syncMedia.length}</span>
              <span className="text-xs text-muted-foreground">media titles</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-foreground">{uniqueAfricanArtists}</span>
              <span className="text-xs text-muted-foreground">African artists</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <span className="text-xs text-muted-foreground">2014–2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Search Bar ───── */}
      <div className="relative group">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-amber-500/20 via-violet-500/20 to-amber-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl" />
        <div className="relative flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/60 rounded-[2rem] px-6 py-3 group-focus-within:border-amber-500/40 transition-all duration-300">
          <Search className="w-5 h-5 text-muted-foreground shrink-0 group-focus-within:text-amber-400 transition-colors" />
          <Input
            type="text"
            placeholder="Search any song, artist, movie, show, or game…"
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

      {/* ───── Filter Tabs + Controls ───── */}
      <div className="flex flex-col gap-3">
        {/* Tabs row */}
        <div className="flex flex-wrap items-center gap-2">
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
                rounded-full transition-all duration-300 gap-1.5
                ${activeFilter === tab.key
                  ? 'shadow-md shadow-white/10 scale-[1.02]'
                  : 'hover:scale-[1.02]'
                }
              `}
            >
              {tab.label}
              <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${activeFilter === tab.key ? 'bg-white/20' : 'bg-muted/60'}`}>
                {tab.count}
              </span>
            </Button>
          ))}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Advanced filters toggle */}
          <Button
            variant="frosted"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-full gap-1.5 ${showFilters ? 'border-amber-500/40 text-amber-300' : ''}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </Button>

          {/* View mode toggles */}
          <div className="flex items-center bg-muted/30 rounded-full p-0.5 border border-border/40">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-full p-1.5 transition-all ${viewMode === 'grid' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-full p-1.5 transition-all ${viewMode === 'list' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Submit button */}
          <Button
            variant="frosted"
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            className="rounded-full gap-1.5 border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60"
          >
            <Plus className="w-3.5 h-3.5" />
            Submit
          </Button>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-wrap gap-3 bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-4">
            {/* Year filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Year
              </label>
              <select
                value={yearFilter || ''}
                onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : null)}
                className="bg-muted/40 text-foreground border border-border/40 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 outline-none"
              >
                <option value="">All Years</option>
                {ALL_YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Country filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Country
              </label>
              <select
                value={countryFilter || ''}
                onChange={(e) => setCountryFilter(e.target.value || null)}
                className="bg-muted/40 text-foreground border border-border/40 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 outline-none"
              >
                <option value="">All Countries</option>
                {ALL_COUNTRIES.map(c => (
                  <option key={c} value={c}>{getFlag(c)} {c}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="bg-muted/40 text-foreground border border-border/40 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 outline-none"
              >
                {SORT_OPTIONS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Clear all */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-foreground bg-muted/40 rounded-lg px-3 py-1.5 border border-border/40 hover:border-rose-500/40 transition-all flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </button>
              </div>
            )}

            {/* Active filter chips */}
            {(yearFilter || countryFilter) && (
              <div className="w-full flex flex-wrap gap-1.5 pt-1">
                {yearFilter && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full px-2.5 py-0.5">
                    {yearFilter}
                    <button onClick={() => setYearFilter(null)} className="hover:text-amber-100"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {countryFilter && (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full px-2.5 py-0.5">
                    {getFlag(countryFilter)} {countryFilter}
                    <button onClick={() => setCountryFilter(null)} className="hover:text-emerald-100"><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
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
          <span className="font-bold text-foreground">
            {new Set(filteredPlacements.filter(p => p.isAfricanArtist).map(p => p.artistName)).size}
          </span> African artists
        </span>
      </div>

      {/* ───── Search Results ───── */}
      {isSearching && searchResults && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 px-1">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-muted-foreground">
              Found <span className="font-bold text-foreground">{Array.from(searchResults.values()).flat().length}</span> results
              {search && <> for &ldquo;<span className="text-amber-300">{search}</span>&rdquo;</>}
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
              <Button variant="frosted" size="sm" onClick={() => setShowSubmitModal(true)} className="rounded-full gap-1.5 mt-2">
                <Plus className="w-3.5 h-3.5" />
                Submit this placement
              </Button>
            </div>
          )}

          {Array.from(searchResults.entries()).map(([mediaId, placements]) => {
            const media = getMediaById(mediaId)
            if (!media) return null
            return (
              <Card key={mediaId} className="rounded-[2rem] bg-card/80 backdrop-blur-sm border-border/60 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-16 rounded-xl bg-gradient-to-br from-muted/60 to-muted/30 border border-border/40 shrink-0 overflow-hidden">
                      <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
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

          {/* Grid view */}
          {viewMode === 'grid' && (
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
                            {/* Movie/Show Poster */}
                            <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-muted/60 to-muted/30 border border-border/40 shrink-0 overflow-hidden group-hover/media:scale-[1.03] transition-transform duration-300">
                              <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
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
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <div className="flex flex-col gap-2">
              {mediaForFilter.map((media) => {
                const isExpanded = expandedMedia.has(media.id)
                const placements = activeFilter === 'african'
                  ? africanPlacements.filter((p) => p.mediaId === media.id)
                  : placementsForMedia(media.id)

                return (
                  <div key={media.id}>
                    <button
                      onClick={() => toggleExpanded(media.id)}
                      className="w-full text-left group/row"
                    >
                      <div className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-card/80 transition-all duration-200 border border-transparent hover:border-border/40">
                        <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-muted/30">
                          <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-foreground truncate group-hover/row:text-amber-300 transition-colors">
                              {media.title}
                            </h3>
                            <Badge className={`${TYPE_COLORS[media.type]} text-[10px]`}>
                              {TYPE_LABELS[media.type]}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{media.year} · {placements.length} songs</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {placements.some(p => p.isAfricanArtist) && (
                            <span className="text-amber-400 text-xs flex items-center gap-1">
                              <Globe2 className="w-3 h-3" />
                              {placements.filter(p => p.isAfricanArtist).length}
                            </span>
                          )}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="ml-14 pl-4 border-l-2 border-amber-500/20 mb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        {media.description && (
                          <p className="text-xs text-muted-foreground italic mb-3 max-w-xl">
                            {media.description}
                          </p>
                        )}
                        {placements.map((p, idx) => (
                          <PlacementRow key={p.id} placement={p} index={idx} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ───── Submit Modal ───── */}
      {showSubmitModal && (
        <SubmitPlacementModal onClose={() => setShowSubmitModal(false)} />
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

      {/* Scene description tooltip */}
      {placement.sceneDescription && (
        <span className="text-[10px] text-muted-foreground/50 max-w-[200px] truncate hidden lg:inline italic">
          {placement.sceneDescription}
        </span>
      )}

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

// ─── Submit Modal ─────────────────────────────────────────────────────────────

function SubmitPlacementModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    mediaTitle: '',
    mediaType: 'film',
    mediaYear: '',
    artistName: '',
    songTitle: '',
    isAfricanArtist: false,
    artistCountry: '',
    genre: '',
    sceneDescription: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In future: call server action submitPlacement(formData)
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-card border border-border/60 rounded-[2rem] shadow-2xl shadow-black/40 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Send className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-black text-foreground">Submit a Placement</h3>
                <p className="text-xs text-muted-foreground">Help grow our library</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted/40 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 pt-2 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="font-black text-foreground text-lg">Thanks for contributing!</h4>
            <p className="text-sm text-muted-foreground">Your submission will be reviewed by our team and added to the library if verified.</p>
            <Button onClick={onClose} variant="frosted" className="rounded-full mt-2">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
            {/* Media info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-bold text-muted-foreground">Media Title *</label>
                <Input
                  required
                  placeholder="e.g. Squid Game"
                  value={formData.mediaTitle}
                  onChange={(e) => setFormData({ ...formData, mediaTitle: e.target.value })}
                  className="mt-1 bg-muted/30 border-border/40 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Type *</label>
                <select
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                  className="mt-1 w-full bg-muted/30 text-foreground border border-border/40 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="film">Film</option>
                  <option value="tv">TV Series</option>
                  <option value="game">Video Game</option>
                  <option value="ad">Ad / Campaign</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Year</label>
                <Input
                  type="number"
                  placeholder="2025"
                  value={formData.mediaYear}
                  onChange={(e) => setFormData({ ...formData, mediaYear: e.target.value })}
                  className="mt-1 bg-muted/30 border-border/40 rounded-xl"
                />
              </div>
            </div>

            {/* Song info */}
            <div className="border-t border-border/30 pt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Artist Name *</label>
                <Input
                  required
                  placeholder="e.g. Burna Boy"
                  value={formData.artistName}
                  onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                  className="mt-1 bg-muted/30 border-border/40 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Song Title *</label>
                <Input
                  required
                  placeholder="e.g. Last Last"
                  value={formData.songTitle}
                  onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                  className="mt-1 bg-muted/30 border-border/40 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Genre</label>
                <Input
                  placeholder="e.g. Afrobeats"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="mt-1 bg-muted/30 border-border/40 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Country</label>
                <Input
                  placeholder="e.g. Nigeria"
                  value={formData.artistCountry}
                  onChange={(e) => setFormData({ ...formData, artistCountry: e.target.value })}
                  className="mt-1 bg-muted/30 border-border/40 rounded-xl"
                />
              </div>
            </div>

            {/* African artist checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAfricanArtist}
                onChange={(e) => setFormData({ ...formData, isAfricanArtist: e.target.checked })}
                className="w-4 h-4 rounded border-border/40 bg-muted/30 text-amber-500 focus:ring-amber-500/40"
              />
              <span className="text-sm text-muted-foreground">African artist 🌍</span>
            </label>

            {/* Scene description */}
            <div>
              <label className="text-xs font-bold text-muted-foreground">Scene Description</label>
              <textarea
                placeholder="Describe the scene where the song plays..."
                value={formData.sceneDescription}
                onChange={(e) => setFormData({ ...formData, sceneDescription: e.target.value })}
                className="mt-1 w-full bg-muted/30 text-foreground border border-border/40 rounded-xl px-3 py-2 text-sm resize-none h-20 focus:ring-1 focus:ring-amber-500/40 outline-none"
              />
            </div>

            <Button type="submit" className="w-full rounded-xl gap-2">
              <Send className="w-4 h-4" />
              Submit Placement
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
