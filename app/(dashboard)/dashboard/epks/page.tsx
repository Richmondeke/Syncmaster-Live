'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { 
  MonitorPlay,
  Plus,
  Search,
  MoreHorizontal,
  ExternalLink,
  Copy,
  BarChart3,
  Eye,
  Settings2,
  Image as ImageIcon,
  Music2,
  Globe,
  Edit3
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const mockEPKs = [
  {
    id: 'epk_1',
    title: 'Malena Cadiz - Hellbent & Moonbound',
    type: 'Album Release',
    views: '1,240',
    status: 'Published',
    lastUpdated: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'epk_2',
    title: 'Neon Pulse - EP Launch',
    type: 'EP Page',
    views: '892',
    status: 'Draft',
    lastUpdated: '1 day ago',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'epk_3',
    title: 'Artist Portfolio 2024',
    type: 'Artist Profile',
    views: '4,102',
    status: 'Published',
    lastUpdated: '3 days ago',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300&h=300&auto=format&fit=crop'
  }
]

export default function EPKsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Pages (EPK)</h1>
          <p className="text-muted-foreground font-medium text-sm">Professional presentation pages for your artists and releases.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-black h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus className="w-5 h-5 mr-2" /> Create New Page
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border p-2 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search your pages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground/50 pl-11 h-10"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <Button variant="ghost" className="h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 font-bold">
            All Types
          </Button>
          <Button variant="ghost" className="h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 font-bold">
            Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEPKs.map((epk) => (
          <Card key={epk.id} className="bg-card border-border rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-2 hover:border-primary/20">
            <div className="aspect-[16/10] relative overflow-hidden">
              <img 
                src={epk.image} 
                alt={epk.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute top-4 left-4">
                <Badge className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                  epk.status === 'Published' ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                )}>
                  {epk.status}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/90">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs font-black">{epk.views}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border-white/20 text-white hover:bg-white/40">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="font-black tracking-[-0.04em] text-foreground text-lg leading-tight truncate">
                  {epk.title}
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {epk.type} • Updated {epk.lastUpdated}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="rounded-xl border-border font-bold text-xs h-10 hover:bg-muted/50">
                  <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit Page
                </Button>
                <Button variant="outline" className="rounded-xl border-border font-bold text-xs h-10 hover:bg-muted/50">
                  <BarChart3 className="w-3.5 h-3.5 mr-2" /> Analytics
                </Button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                    <Music2 className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground/40 hover:text-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Card */}
        <button className="aspect-[16/10] md:aspect-auto border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 hover:border-primary/40 hover:bg-primary/5 transition-all group">
          <div className="w-16 h-16 rounded-[2rem] bg-muted border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-black text-foreground">Create New Page</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Artist or Release EPK</p>
          </div>
        </button>
      </div>
    </div>
  )
}
