'use client'

import { useState, useMemo, useEffect } from 'react'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { 
  Search, 
  MapPin, 
  ExternalLink, 
  Mail, 
  Phone, 
  School, 
  User, 
  Info, 
  FileText, 
  ChevronRight, 
  X, 
  Globe,
  Radio,
  Copy,
  CheckCircle2,
  Filter,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RadioStation } from '@/app/actions/radio-stations'

interface RadioDirectoryClientProps {
  initialStations: RadioStation[]
  isPro: boolean
}

export default function RadioDirectoryClient({ initialStations, isPro }: RadioDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('All')
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Extract unique states from the dataset
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

  // Filtering logic
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

  // Handle station selection
  const handleSelectStation = (station: RadioStation) => {
    setSelectedStation(station)
    setIsDrawerOpen(true)
  }

  // Handle copy email
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // Close drawer on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDrawerOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="flex flex-col gap-8 pt-4 pb-20 max-w-7xl mx-auto px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-500/10 rounded-xl">
              <Radio className="w-6 h-6 text-violet-500" />
            </div>
            <Badge variant="outline" className="bg-violet-500/5 text-violet-500 border-violet-500/20 rounded-full py-0.5">
              {initialStations.length} Stations
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Radio Directory</h1>
          <p className="text-lg text-muted-foreground font-medium tracking-tight">The ultimate database of college radio stations for sync promotion.</p>
        </div>
        
        {/* State Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar lg:max-w-xl">
          <div className="flex items-center gap-2 p-1.5 bg-card/80 backdrop-blur-md border border-border rounded-full">
            <div className="px-3 text-muted-foreground border-r border-border pr-3">
              <Filter className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[300px] md:max-w-md lg:max-w-lg pr-2">
              {['All', 'NY', 'CA', 'TX', 'IL', 'MA', 'GA', 'PA', 'WA'].map(state => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap
                    ${selectedState === state 
                      ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                  `}
                >
                  {state}
                </button>
              ))}
              
              {/* Custom State Select (styled like the pills) */}
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
      </div>

      {/* Search Section */}
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-violet-500 transition-colors pointer-events-none">
          <Search />
        </div>
        <Input 
          placeholder="Search by station, school, city, or music director..." 
          className="h-16 pl-16 pr-8 rounded-2xl border-border bg-card/50 text-xl font-medium focus-visible:ring-violet-500/20 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Grid Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStations.map((station) => (
          <Card 
            key={station.id} 
            onClick={() => handleSelectStation(station)}
            className="rounded-[2rem] border-border bg-card hover:bg-violet-500/[0.03] hover:border-violet-500/30 transition-all duration-300 group cursor-pointer overflow-hidden relative shadow-sm hover:shadow-md"
          >
            <CardContent className="p-8 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-black text-violet-500 tracking-widest bg-violet-500/5 px-2 py-0.5 rounded-full w-fit">
                    {station.state_city.split(',')[0]?.trim() || 'N/A'}
                  </span>
                  <h3 className="text-2xl font-black tracking-[-0.04em] leading-tight group-hover:text-violet-500 transition-colors">
                    {station.station}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-violet-500/10 group-hover:text-violet-500 transition-all duration-300">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-foreground/80 font-bold text-sm tracking-tight">
                  <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <School className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="truncate">{station.school}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground font-medium text-sm tracking-tight">
                  <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{station.state_city.split(',')[1]?.trim() || station.state_city}</span>
                </div>
              </div>

              {station.dj_music_dir && (
                <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-bold truncate">{station.dj_music_dir}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStations.length === 0 && (
        <div className="py-24 text-center space-y-6 bg-card/30 border border-dashed border-border rounded-[3rem]">
          <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto shadow-inner">
            <Radio className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-[-0.05em]">No stations found</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium tracking-tight">
              We couldn&apos;t find any radio stations matching &quot;{searchQuery}&quot;. 
              Try using broader terms or different filters.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { setSearchQuery(''); setSelectedState('All'); }}
            className="rounded-full px-8 py-6 h-auto text-lg font-bold border-border hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-all"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Sliding Details Drawer */}
      {isDrawerOpen && selectedStation && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l border-border z-[70] shadow-2xl transition-transform duration-500 transform translate-x-0 overflow-y-auto no-scrollbar">
            <div className="p-8 h-full flex flex-col gap-10">
              {/* Drawer Header */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-violet-500/5 text-violet-500 border-violet-500/20 rounded-full py-1 px-3">
                  Station Details
                </Badge>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-3 bg-muted hover:bg-violet-500/10 hover:text-violet-500 rounded-2xl transition-all group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Station Hero */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-black text-violet-500 tracking-[0.2em] uppercase">
                    {selectedStation.state_city}
                  </span>
                  <h2 className="text-5xl font-black tracking-[-0.08em] leading-[0.9]">
                    {selectedStation.station}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xl text-muted-foreground font-black tracking-tight leading-tight">
                  <School className="w-6 h-6 text-violet-500" />
                  {selectedStation.school}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative">
                {isPro ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedStation.email && (
                      <Button 
                        className="h-14 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white font-black text-lg gap-2 shadow-lg shadow-violet-500/20"
                        onClick={() => window.location.href = `mailto:${selectedStation.email}`}
                      >
                        <Mail className="w-5 h-5" />
                        Send Email
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

              {/* Data Sections */}
              <div className="relative flex-1">
                <div className={cn("space-y-10 pb-12", !isPro && "blur-md select-none pointer-events-none")}>
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <Info className="w-4 h-4 text-violet-500" />
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
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Email Address</span>
                              <span className="font-bold truncate text-foreground">{selectedStation.email}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleCopyEmail(selectedStation.email!)}
                            className="p-2.5 hover:bg-violet-500/10 rounded-xl transition-all"
                            disabled={!isPro}
                          >
                            {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground hover:text-violet-500" />}
                          </button>
                        </div>
                      )}
                      {selectedStation.phone && (
                        <div className="p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Phone Number</span>
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Physical Address</span>
                            <span className="font-bold text-foreground text-sm leading-relaxed">{selectedStation.address}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Info */}
                  {(selectedStation.dj_music_dir || selectedStation.show_name) && (
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <User className="w-4 h-4 text-violet-500" />
                        Music & Programming
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedStation.dj_music_dir && (
                          <div className="p-5 bg-card border border-border rounded-3xl flex flex-col gap-1 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Music Director / DJ</span>
                            <span className="font-black text-foreground text-xl tracking-tight leading-tight">{selectedStation.dj_music_dir}</span>
                          </div>
                        )}
                        {selectedStation.show_name && (
                          <div className="p-5 bg-card border border-border rounded-3xl flex flex-col gap-1 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Featured Show</span>
                            <span className="font-black text-foreground text-xl tracking-tight leading-tight">{selectedStation.show_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedStation.notes && (
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <FileText className="w-4 h-4 text-violet-500" />
                        Station Notes
                      </h4>
                      <div className="p-6 bg-violet-500/[0.03] border border-violet-500/10 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-violet-500/10 transition-colors" />
                        <p className="text-foreground/90 font-medium leading-relaxed italic relative z-10">
                          &quot;{selectedStation.notes}&quot;
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {!isPro && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-background/50 rounded-3xl">
                    <div className="w-12 h-12 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-500 border border-violet-500/20 shadow-md">
                      <Zap className="w-6 h-6 fill-current animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold tracking-tight text-foreground">Contact Details Gated</h4>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Upgrade to Pro to unlock email contacts, phone numbers, and physical addresses for over 400 college radio stations.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsDrawerOpen(false)
                        window.location.href = '/dashboard/settings'
                      }}
                      className="rounded-full bg-violet-500 hover:bg-violet-600 text-white font-bold px-6 py-2.5 shadow-md shadow-violet-500/20 text-sm transition-all"
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
