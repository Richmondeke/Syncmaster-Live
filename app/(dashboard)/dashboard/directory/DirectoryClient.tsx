'use client'

import { useState, useMemo, useEffect } from 'react'
// @ts-ignore – lucide-react 1.11 CJS/.d.ts vs Turbopack ESM mismatch
import { 
  Search, MapPin, CheckCircle2, Users, ArrowUpRight, Globe, Mail, Phone, Lock, Zap,
  Calendar, Building2, X, School, User, Info, FileText, ChevronRight, Radio, Copy,
  Filter, BookOpen, Briefcase,
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
    <div className="flex flex-col gap-10 pt-2 pb-20 max-w-6xl mx-auto">

      {/* ───── Header ───── */}
      <section className="group relative overflow-hidden rounded-[2.5rem] bg-primary p-10 md:p-14 text-white shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-[-0.068em] leading-[1.1]">
                Directory
              </h1>
            </div>
            <p className="text-lg text-white/70 font-medium tracking-[-0.02em] max-w-xl">
              Connect with sync agencies, music supervisors, and college radio stations — all in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm bg-white/10 border border-white/10 rounded-full px-4 py-1.5 font-bold">
              <Building2 className="w-4 h-4" /> {agencies.length} agencies
            </span>
            <span className="inline-flex items-center gap-2 text-sm bg-white/10 border border-white/10 rounded-full px-4 py-1.5 font-bold">
              <Radio className="w-4 h-4" /> {initialStations.length} radio stations
            </span>
            <span className="inline-flex items-center gap-2 text-sm bg-white/10 border border-white/10 rounded-full px-4 py-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" /> {agencies.filter(a => a.acceptingSubmissions).length} accepting
            </span>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-black/30 blur-[120px]" />
      </section>

      {/* ───── Tab Switcher ───── */}
      <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full w-fit">
        <button
          onClick={() => setActiveTab('agencies')}
          className={cn(
            'flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all',
            activeTab === 'agencies'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Briefcase className="w-4 h-4" />
          Sync Agencies
          <span className={cn('text-[10px] rounded-full px-1.5 py-0.5', activeTab === 'agencies' ? 'bg-white/20' : 'bg-muted')}>
            {agencies.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('radio')}
          className={cn(
            'flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all',
            activeTab === 'radio'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Radio className="w-4 h-4" />
          Radio Stations
          <span className={cn('text-[10px] rounded-full px-1.5 py-0.5', activeTab === 'radio' ? 'bg-white/20' : 'bg-muted')}>
            {initialStations.length}
          </span>
        </button>
      </div>

      {/* ───── Tab Content ───── */}
      {activeTab === 'agencies' && <AgencyDirectory />}
      {activeTab === 'radio' && <RadioDirectory initialStations={initialStations} isPro={isPro} />}
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
    const matchesFilter = selectedFilter === 'All' || agency.specialization.includes(selectedFilter)
    return matchesSearch && matchesFilter
  })

  const acceptingCount = filteredAgencies.filter(a => a.acceptingSubmissions).length

  return (
    <div className="flex flex-col gap-8">
      {/* Filter pills */}
      <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full overflow-x-auto no-scrollbar">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              selectedFilter === filter 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
        <Input 
          placeholder="Search by agency name, specialty, genre..." 
          className="h-14 pl-14 pr-12 rounded-2xl border-border bg-card text-base font-medium focus-visible:ring-primary/20 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span><span className="font-bold text-foreground">{filteredAgencies.length}</span> agencies</span>
        <span className="text-border">·</span>
        <span><span className="font-bold text-primary">{acceptingCount}</span> accepting submissions</span>
      </div>

      {/* Agency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAgencies.map((agency) => (
          <Card key={agency.id} className="rounded-[2rem] border-border bg-card hover:border-primary/20 transition-all duration-300 group overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border border-border group-hover:scale-105 transition-transform duration-500">
                    <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {agency.acceptingSubmissions ? (
                      <Badge className="bg-[var(--status-green)]/10 text-[var(--status-green)] border-[var(--status-green)]/20 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">Open</Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">Closed</Badge>
                    )}
                    {agency.verified && (
                      <Badge variant="secondary" className="rounded-full px-2 py-0.5 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3 text-primary" /></Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black tracking-[-0.04em] flex items-center gap-2 group-hover:text-primary transition-colors">
                    {agency.name}
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </h3>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {agency.location}</span>
                    {agency.founded && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Est. {agency.founded}</span>}
                  </div>
                </div>

                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{agency.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {agency.specialization.slice(0, 3).map(spec => (
                    <span key={spec} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{spec}</span>
                  ))}
                </div>

                {/* Pro-gated contact preview */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="blur-[4px] select-none">{agency.email.slice(0, 6)}...</span>
                  </div>
                  {agency.website && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      <span className="blur-[4px] select-none">{agency.website.replace('https://', '').slice(0, 10)}...</span>
                    </div>
                  )}
                  <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
                </div>
              </div>

              <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <span className="label">Notable Clients</span>
                  <p className="text-xs font-medium truncate max-w-[180px]">{agency.notableClients.slice(0, 2).join(', ')}</p>
                </div>
                <Link href={`/dashboard/directory/${agency.id}`}>
                  <Button variant="outline" size="sm" className="rounded-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgencies.length === 0 && (
        <div className="py-20 text-center space-y-4 rounded-[2rem] border-2 border-dashed border-border bg-muted/20">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto"><Users className="w-7 h-7 text-muted-foreground" /></div>
          <h3 className="text-xl font-black tracking-[-0.068em]">No agencies found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
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
      if (state && state.length === 2) uniqueStates.add(state)
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

  const handleSelectStation = (station: RadioStation) => { setSelectedStation(station); setIsDrawerOpen(true) }
  const handleCopyEmail = (email: string) => { navigator.clipboard.writeText(email); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000) }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsDrawerOpen(false) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="flex flex-col gap-8">
      {/* State filter */}
      <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-full overflow-x-auto no-scrollbar">
        <div className="px-2.5 text-muted-foreground border-r border-border pr-2.5"><Filter className="w-4 h-4" /></div>
        {['All', 'NY', 'CA', 'TX', 'IL', 'MA', 'GA', 'PA', 'WA'].map(state => (
          <button key={state} onClick={() => setSelectedState(state)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedState === state ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >{state}</button>
        ))}
        <select className="bg-transparent border-none text-xs font-bold text-muted-foreground hover:text-foreground focus:ring-0 outline-none pr-2 cursor-pointer"
          value={states.includes(selectedState) ? selectedState : 'More...'}
          onChange={(e) => { if (e.target.value !== 'More...') setSelectedState(e.target.value) }}
        >
          <option disabled value="More...">More States</option>
          {states.filter(s => !['All', 'NY', 'CA', 'TX', 'IL', 'MA', 'GA', 'PA', 'WA'].includes(s)).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
        <Input placeholder="Search by station, school, city, or music director..." 
          className="h-14 pl-14 pr-12 rounded-2xl border-border bg-card text-base font-medium focus-visible:ring-primary/20 shadow-sm"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span><span className="font-bold text-foreground">{filteredStations.length}</span> stations</span>
        {selectedState !== 'All' && <><span className="text-border">·</span><span>in <span className="font-bold text-primary">{selectedState}</span></span></>}
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStations.map((station) => (
          <Card key={station.id} onClick={() => handleSelectStation(station)}
            className="rounded-[2rem] border-border bg-card hover:border-primary/20 transition-all duration-300 group cursor-pointer overflow-hidden">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="label bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit !text-[10px]">
                    {station.state_city.split(',')[0]?.trim() || 'N/A'}
                  </span>
                  <h3 className="text-xl font-black tracking-[-0.04em] leading-tight group-hover:text-primary transition-colors">{station.station}</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground/80 font-bold text-sm">
                  <School className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> <span className="truncate">{station.school}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{station.state_city.split(',')[1]?.trim() || station.state_city}</span>
                </div>
              </div>
              {station.dj_music_dir && (
                <div className="pt-1 flex items-center gap-2 text-xs text-muted-foreground border-t border-border">
                  <User className="w-3.5 h-3.5" /> <span className="font-bold truncate">{station.dj_music_dir}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStations.length === 0 && (
        <div className="py-20 text-center space-y-4 rounded-[2rem] border-2 border-dashed border-border bg-muted/20">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto"><Radio className="w-7 h-7 text-muted-foreground" /></div>
          <h3 className="text-xl font-black tracking-[-0.068em]">No stations found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedState('All') }} className="rounded-full">Clear all filters</Button>
        </div>
      )}

      {/* ───── Station Detail Drawer ───── */}
      {isDrawerOpen && selectedStation && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l border-border z-[70] shadow-[var(--shadow-elev-3)] overflow-y-auto no-scrollbar">
            <div className="p-8 h-full flex flex-col gap-10">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="rounded-full py-1 px-3">Station Details</Badge>
                <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-muted hover:bg-primary/10 hover:text-primary rounded-2xl transition-all group">
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="label text-primary">{selectedStation.state_city}</span>
                  <h2 className="text-5xl font-black tracking-[-0.068em] leading-[0.9]">{selectedStation.station}</h2>
                </div>
                <div className="flex items-center gap-3 text-xl text-muted-foreground font-black tracking-[-0.02em]">
                  <School className="w-6 h-6 text-primary" /> {selectedStation.school}
                </div>
              </div>

              <div className="relative">
                {isPro ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedStation.email && (
                      <Button className="h-14 rounded-2xl gap-2 font-black text-lg" onClick={() => window.location.href = `mailto:${selectedStation.email}`}>
                        <Mail className="w-5 h-5" /> Email
                      </Button>
                    )}
                    {selectedStation.website && (
                      <Button variant="outline" className="h-14 rounded-2xl border-border font-black text-lg gap-2" onClick={() => window.open(selectedStation.website!, '_blank')}>
                        <Globe className="w-5 h-5" /> Website
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button className="w-full h-14 rounded-2xl font-black text-lg gap-2" onClick={() => { setIsDrawerOpen(false); window.location.href = '/dashboard/settings' }}>
                    <Zap className="w-5 h-5 fill-current" /> Unlock with Pro
                  </Button>
                )}
              </div>

              <div className="relative flex-1">
                <div className={cn("space-y-10 pb-12", !isPro && "blur-md select-none pointer-events-none")}>
                  <div className="space-y-4">
                    <h4 className="label flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> Contact Information</h4>
                    <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden divide-y divide-border">
                      {selectedStation.email && (
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-muted-foreground" /></div>
                            <div className="flex flex-col min-w-0"><span className="label">Email</span><span className="font-bold truncate text-foreground">{selectedStation.email}</span></div>
                          </div>
                          <button onClick={() => handleCopyEmail(selectedStation.email!)} className="p-2.5 hover:bg-primary/10 rounded-xl transition-all" disabled={!isPro}>
                            {copySuccess ? <CheckCircle2 className="w-4 h-4 text-[var(--status-green)]" /> : <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />}
                          </button>
                        </div>
                      )}
                      {selectedStation.phone && (
                        <div className="p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-muted-foreground" /></div>
                          <div className="flex flex-col min-w-0"><span className="label">Phone</span><span className="font-bold text-foreground">{selectedStation.phone}</span></div>
                        </div>
                      )}
                      {selectedStation.address && (
                        <div className="p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-muted-foreground" /></div>
                          <div className="flex flex-col min-w-0"><span className="label">Address</span><span className="font-bold text-foreground text-sm leading-relaxed">{selectedStation.address}</span></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {(selectedStation.dj_music_dir || selectedStation.show_name) && (
                    <div className="space-y-4">
                      <h4 className="label flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Music & Programming</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedStation.dj_music_dir && (
                          <div className="p-5 bg-card border border-border rounded-2xl flex flex-col gap-1">
                            <span className="label">Music Director</span>
                            <span className="font-black text-foreground text-lg tracking-[-0.02em] leading-tight">{selectedStation.dj_music_dir}</span>
                          </div>
                        )}
                        {selectedStation.show_name && (
                          <div className="p-5 bg-card border border-border rounded-2xl flex flex-col gap-1">
                            <span className="label">Featured Show</span>
                            <span className="font-black text-foreground text-lg tracking-[-0.02em] leading-tight">{selectedStation.show_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedStation.notes && (
                    <div className="space-y-4">
                      <h4 className="label flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Station Notes</h4>
                      <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                        <p className="text-foreground/90 font-medium leading-relaxed italic">&quot;{selectedStation.notes}&quot;</p>
                      </div>
                    </div>
                  )}
                </div>

                {!isPro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-background/50 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold tracking-[-0.02em] text-foreground">Contact Details Gated</h4>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">Upgrade to Pro to unlock contacts for {initialStations.length}+ stations.</p>
                    </div>
                    <button onClick={() => { setIsDrawerOpen(false); window.location.href = '/dashboard/settings' }}
                      className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 text-sm transition-all">
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
