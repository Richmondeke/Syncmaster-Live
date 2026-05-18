'use client'

import { useState } from 'react'
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  ExternalLink, 
  Filter,
  Users,
  Star,
  ArrowUpRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { agencies } from '@/lib/data/agencies'
import Link from 'next/link'

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filters = ['All', 'Ads', 'Film', 'TV', 'Trailers', 'Electronic']

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         agency.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'All' || 
                          agency.specialization.includes(selectedFilter)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col gap-10 pt-4 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">Agency Directory</h1>
          <p className="text-lg text-muted-foreground tracking-tight">Connect with the world's leading sync agencies and music supervisors.</p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border p-1.5 rounded-full overflow-x-auto no-scrollbar">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${selectedFilter === filter 
                  ? 'bg-foreground text-background shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search by agency name, specialty, or description..." 
          className="h-16 pl-16 pr-8 rounded-full border-border bg-card/50 text-xl focus-visible:ring-primary/20 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => (
          <Card key={agency.id} className="rounded-[2.5rem] border-border bg-card hover:bg-accent/5 transition-all group overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden border border-border group-hover:scale-105 transition-transform duration-500">
                    <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                  </div>
                  {agency.verified && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    {agency.name}
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {agency.location}
                  </div>
                </div>

                <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                  {agency.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {agency.specialization.slice(0, 3).map(spec => (
                    <Badge key={spec} variant="outline" className="rounded-full text-[10px] uppercase tracking-wider font-bold border-border/50 bg-muted/30">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="px-8 py-6 bg-muted/30 border-t border-border flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Recent Placements</span>
                  <p className="text-xs font-medium truncate max-w-[150px]">{agency.recentSyncs[0]}</p>
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
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto opacity-50">
            <Users className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-medium tracking-tight">No agencies found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  )
}
