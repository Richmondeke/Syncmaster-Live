'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  ExternalLink, 
  Users,
  ArrowUpRight,
  Globe,
  Mail,
  Phone,
  Lock,
  Zap,
  Calendar,
  Building2,
  X,
  School,
  User,
  Info,
  FileText,
  ChevronRight,
  Radio,
  Copy,
  Filter,
  BookOpen,
  Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { agencies } from '@/lib/data/agencies'
import Link from 'next/link'
import type { RadioStation } from '@/app/actions/radio-stations'

// ─── Types ────────────────────────────────────────────────────────────────────

type DirectoryTab = 'agencies' | 'radio'

interface DirectoryClientProps {
  initialStations: RadioStation[]
  isPro: boolean
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DirectoryClient({ initialStations, isPro }: DirectoryClientProps) {
  const [activeTab, setActiveTab] = useState<DirectoryTab>('agencies')

  return (
    <div className="flex flex-col gap-8 pt-4 pb-20 max-w-7xl mx-auto px-4 md:px-0 animate-in fade-in duration-500">
      {/* ───── Header ───── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-500/10 via-background to-amber-500/10 border border-border/40 px-8 py-10 md:py-14">
        <div className="absolute top-4 right-6 text-violet-400/15 animate-pulse">
          <BookOpen className="w-20 h-20" />
        </div>

        <div className="relative z-10 flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Directory
              </h1>
              <p className="text-sm text-muted-foreground">
                Your gateway to the music industry
              </p>
            </div>
          </div>
          <p className="text-base text-muted-foreground tracking-tight">
            Connect with sync agencies, music supervisors, and college radio stations — all in one place.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10">
              <Building2 className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-foreground">{agencies.length}</span>
              <span className="text-xs text-muted-foreground">agencies</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10">
              <Radio className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-foreground">{initialStations.length}</span>
              <span className="text-xs text-muted-foreground">radio stations</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-foreground">
                {agencies.filter(a => a.acceptingSubmissions).length}
              </span>
              <span className="text-xs text-muted-foreground">accepting submissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Tab Switcher ───── */}
      <div className="flex items-center gap-1 p-1.5 bg-card/80 backdrop-blur-sm border border-border/60 rounded-full w-fit">
        <button
          onClick={() => setActiveTab('agencies')}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300',
            activeTab === 'agencies'
              ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          )}
        >
          <Briefcase className="w-4 h-4" />
          Sync Agencies
          <span className={cn(
            'text-[10px] rounded-full px-1.5 py-0.5',
            activeTab === 'agencies' ? 'bg-white/20' : 'bg-muted/60'
          )}>
            {agencies.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('radio')}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300',
            activeTab === 'radio'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          )}
        >
          <Radio className="w-4 h-4" />
          Radio Stations
          <span className={cn(
            'text-[10px] rounded-full px-1.5 py-0.5',
            activeTab === 'radio' ? 'bg-white/20' : 'bg-muted/60'
          )}>
            {initialStations.length}
          </span>
        </button>
      </div>

      {/* ───── Tab Content ───── */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'agencies' && <AgencyDirectory />}
        {activeTab === 'radio' && <RadioDirectory initialStations={initialStations} isPro={isPro} />}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Agency Directory Tab
// ═══════════════════════════════════════════════════════════════════════════════

function AgencyDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filters = ['All', 'Ads', 'Film', 'TV', 'Trailers', 'Electronic', 'Indie', 'Publishing', 'Production Music']

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         agency.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agency.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = selectedFilter === 'All' || 
                          agency.specialization.includes(selectedFilter)
    
    return matchesSearch && matchesFilter
  })

  const acceptingCount = filteredAgencies.filter(a => a.acceptingSubmissions).length

  return (
    <div className="flex flex-col gap-8">
      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`
              px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border
              ${selectedFilter === filter 
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25 border-violet-500' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted border-border/40'}
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-violet-500 transition-colors pointer-events-none" />
        <Input 
          placeholder="Search by agency name, specialty, genre..." 
          className="h-14 pl-14 pr-8 rounded-[2rem] border-border/60 bg-card/50 text-lg font-medium focus-visible:ring-violet-500/20 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stats line */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground px-1">
        <span><span className="font-bold text-foreground">{filteredAgencies.length}</span> agencies</span>
        <span className="text-border">•</span>
        <span><span className="font-bold text-emerald-400">{acceptingCount}</span> accepting submissions</span>
      </div>

      {/* Agency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => (
          <Card key={agency.id} className="rounded-[2rem] border-border/60 bg-card/80 hover:bg-violet-500/[0.03] hover:border-violet-500/30 transition-all duration-300 group overflow-hidden">
            <CardContent className="p-0">
              <div className="p-7 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border border-border/40 group-hover:scale-105 transition-transform duration-500">
                    <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-2">
                    {agency.acceptingSubmissions ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        Open
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-border/40 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        Closed
                      </Badge>
                    )}
                    {agency.verified && (
                      <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/20 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-2 group-hover:text-violet-400 transition-colors">
                    {agency.name}
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors" />
                  </h3>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {agency.location}
                    </span>
                    {agency.founded && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Est. {agency.founded}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                  {agency.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {agency.specialization.slice(0, 3).map(spec => (
                    <Badge key={spec} variant="outline" className="rounded-full text-[10px] uppercase tracking-wider font-bold border-border/40 bg-muted/20">
                      {spec}
                    </Badge>
                  ))}
                </div>

                {/* Pro-gated contact preview */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                    <Mail className="w-3 h-3" />
                    <span className="blur-[4px] select-none">{agency.email.slice(0, 6)}...</span>
                  </div>
                  {agency.website && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                      <Globe className="w-3 h-3" />
                      <span className="blur-[4px] select-none">{agency.website.replace('https://', '').slice(0, 10)}...</span>
                    </div>
                  )}
                  <Lock className="w-3 h-3 text-amber-500/60 ml-auto" />
                </div>
              </div>

              <div className="px-7 py-4 bg-muted/20 border-t border-border/40 flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Notable Clients</span>
                  <p className="text-xs font-medium truncate max-w-[180px]">{agency.notableClients.slice(0, 2).join(', ')}</p>
                </div>
                <Link href={`/dashboard/directory/${agency.id}`}>
                  <Button variant="outline" size="sm" className="rounded-full border-border/40 hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-all">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgencies.length === 0 && (
        <div className="py-20 text-center space-y-4 rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/10">
          <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto">
            <Users className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-black tracking-tight">No agencies found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Radio Directory Tab
// ═══════════════════════════════════════════════════════════════════════════════

function RadioDirectory({ initialStations, isPro }: { initialStations: RadioStation[]; isPro: boolean }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('All')
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const states = useMemo(() => {
    const uniqueStates = new Set<string>()
    initialStations.forEach(s => {
      const state = s.state_city.split(',')[0]?.trim()
      if (state && state.length === 2) {
        uniqueStates.add(state)
      }
    })
    return ['All', ...Array.from(uniqueStates).sort()]
  }, [initialStations])

  const filteredStations = useMemo(() => {
    return initialStations.filter(station => {
      const matchesSearch = 
        station.station.toLowerCase().includes(searchQuery.toLowerCase()) || 
        station.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.state_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (station.dj_music_dir && station.dj_music_dir.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const stationState = station.state_city.split(',')[0]?.trim()
      const matchesState = selectedState === 'All' || stationState === selectedState
      
      return matchesSearch && matchesState
    })
  }, [initialStations, searchQuery, selectedState])

  const handleSelectStation = (station: RadioStation) => {
    setSelectedStation(station)
    setIsDrawerOpen(true)
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDrawerOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="flex flex-col gap-8">
      {/* State filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 p-1 bg-card/60 border border-border/40 rounded-full">
          <div className="px-2.5 text-muted-foreground border-r border-border/40 pr-2.5">
            <Filter className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[300px] md:max-w-md lg:max-w-lg pr-1">
            {['All', 'NY', 'CA', 'TX', 'IL', 'MA', 'GA', 'PA', 'WA'].map(state => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`
                  px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap
                  ${selectedState === state 
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}
                `}
              >
                {state}
              </button>
            ))}
            <select 
              className="bg-transparent border-none text-xs font-bold text-muted-foreground hover:text-foreground focus:ring-0 outline-none pr-2 cursor-pointer transition-colors"
              value={states.includes(selectedState) ? selectedState : 'More...'}
              onChange={(e) => {
                if (e.target.value !== 'More...') {
                  setSelectedState(e.target.value)
                }
              }}
            >
              <option disabled value="More...">More States</option>
              {states.filter(s => !['All', 'NY', 'CA', 'TX', 'IL', 'MA', 'GA', 'PA', 'WA'].includes(s)).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-amber-500 transition-colors pointer-events-none" />
        <Input 
          placeholder="Search by station, school, city, or music director..." 
          className="h-14 pl-14 pr-8 rounded-[2rem] border-border/60 bg-card/50 text-lg font-medium focus-visible:ring-amber-500/20 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground px-1">
        <span><span className="font-bold text-foreground">{filteredStations.length}</span> stations</span>
        {selectedState !== 'All' && (
          <>
            <span className="text-border">•</span>
            <span>in <span className="font-bold text-amber-400">{selectedState}</span></span>
          </>
        )}
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStations.map((station) => (
          <Card 
            key={station.id} 
            onClick={() => handleSelectStation(station)}
            className="rounded-[2rem] border-border/60 bg-card/80 hover:bg-amber-500/[0.03] hover:border-amber-500/30 transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            <CardContent className="p-7 flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-black text-amber-500 tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-full w-fit">
                    {station.state_city.split(',')[0]?.trim() || 'N/A'}
                  </span>
                  <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
                    {station.station}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-all duration-300">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground/80 font-bold text-sm tracking-tight">
                  <div className="w-5 h-5 rounded-md bg-muted/40 flex items-center justify-center shrink-0">
                    <School className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span className="truncate">{station.school}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm tracking-tight">
                  <div className="w-5 h-5 rounded-md bg-muted/40 flex items-center justify-center shrink-0">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span className="truncate">{station.state_city.split(',')[1]?.trim() || station.state_city}</span>
                </div>
              </div>

              {station.dj_music_dir && (
                <div className="pt-1 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/30">
                  <User className="w-3 h-3" />
                  <span className="font-bold truncate">{station.dj_music_dir}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStations.length === 0 && (
        <div className="py-20 text-center space-y-4 rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/10">
          <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto">
            <Radio className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-black tracking-tight">No stations found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
          <Button 
            variant="outline" 
            onClick={() => { setSearchQuery(''); setSelectedState('All'); }}
            className="rounded-full"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* ───── Station Detail Drawer ───── */}
      {isDrawerOpen && selectedStation && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l border-border z-[70] shadow-2xl transition-transform duration-500 transform translate-x-0 overflow-y-auto no-scrollbar">
            <div className="p-8 h-full flex flex-col gap-10">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/20 rounded-full py-1 px-3">
                  Station Details
                </Badge>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-3 bg-muted hover:bg-amber-500/10 hover:text-amber-500 rounded-2xl transition-all group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-black text-amber-500 tracking-[0.2em] uppercase">
                    {selectedStation.state_city}
                  </span>
                  <h2 className="text-5xl font-black tracking-[-0.08em] leading-[0.9]">
                    {selectedStation.station}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xl text-muted-foreground font-black tracking-tight leading-tight">
                  <School className="w-6 h-6 text-amber-500" />
                  {selectedStation.school}
                </div>
              </div>

              <div className="relative">
                {isPro ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedStation.email && (
                      <Button 
                        className="h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg gap-2 shadow-lg shadow-amber-500/20"
                        onClick={() => window.location.href = `mailto:${selectedStation.email}`}
                      >
                        <Mail className="w-5 h-5" />
                        Email
                      </Button>
                    )}
                    {selectedStation.website && (
                      <Button 
                        variant="outline" 
                        className="h-14 rounded-2xl border-border hover:bg-muted font-black text-lg gap-2"
                        onClick={() => window.open(selectedStation.website!, '_blank')}
                      >
                        <Globe className="w-5 h-5" />
                        Website
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button 
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg gap-2 shadow-lg"
                    onClick={() => {
                      setIsDrawerOpen(false)
                      window.location.href = '/dashboard/settings'
                    }}
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    Unlock with Pro
                  </Button>
                )}
              </div>

              <div className="relative flex-1">
                <div className={cn("space-y-10 pb-12", !isPro && "blur-md select-none pointer-events-none")}>
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <Info className="w-4 h-4 text-amber-500" />
                      Contact Information
                    </h4>
                    <div className="bg-muted/30 border border-border rounded-3xl overflow-hidden divide-y divide-border">
                      {selectedStation.email && (
                        <div className="p-5 flex items-center justify-between group">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                              <Mail className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Email</span>
                              <span className="font-bold truncate text-foreground">{selectedStation.email}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleCopyEmail(selectedStation.email!)}
                            className="p-2.5 hover:bg-amber-500/10 rounded-xl transition-all"
                            disabled={!isPro}
                          >
                            {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground hover:text-amber-500" />}
                          </button>
                        </div>
                      )}
                      {selectedStation.phone && (
                        <div className="p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Phone</span>
                            <span className="font-bold text-foreground">{selectedStation.phone}</span>
                          </div>
                        </div>
                      )}
                      {selectedStation.address && (
                        <div className="p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Address</span>
                            <span className="font-bold text-foreground text-sm leading-relaxed">{selectedStation.address}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {(selectedStation.dj_music_dir || selectedStation.show_name) && (
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <User className="w-4 h-4 text-amber-500" />
                        Music & Programming
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedStation.dj_music_dir && (
                          <div className="p-5 bg-card border border-border rounded-3xl flex flex-col gap-1 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Music Director</span>
                            <span className="font-black text-foreground text-lg tracking-tight leading-tight">{selectedStation.dj_music_dir}</span>
                          </div>
                        )}
                        {selectedStation.show_name && (
                          <div className="p-5 bg-card border border-border rounded-3xl flex flex-col gap-1 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Featured Show</span>
                            <span className="font-black text-foreground text-lg tracking-tight leading-tight">{selectedStation.show_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedStation.notes && (
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <FileText className="w-4 h-4 text-amber-500" />
                        Station Notes
                      </h4>
                      <div className="p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-3xl relative overflow-hidden">
                        <p className="text-foreground/90 font-medium leading-relaxed italic">
                          &quot;{selectedStation.notes}&quot;
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {!isPro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-background/50 rounded-3xl">
                    <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-md">
                      <Zap className="w-6 h-6 fill-current animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold tracking-tight text-foreground">Contact Details Gated</h4>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Upgrade to Pro to unlock email contacts, phone numbers, and addresses for {initialStations.length}+ stations.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsDrawerOpen(false)
                        window.location.href = '/dashboard/settings'
                      }}
                      className="rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 shadow-md shadow-amber-500/20 text-sm transition-all"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
