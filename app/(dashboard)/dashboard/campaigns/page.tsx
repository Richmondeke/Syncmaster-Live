'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { 
  Send,
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Users,
  MousePointer2,
  BarChart3,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowUpRight,
  Edit3
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const mockCampaigns = [
  {
    id: 'camp_1',
    title: 'Spring Sync Catalog Update',
    status: 'Sent',
    sentDate: 'Oct 12, 2023',
    recipients: '1,240',
    openRate: 42,
    clickRate: 12,
    type: 'Newsletter'
  },
  {
    id: 'camp_2',
    title: 'New Artist Spotlight: Malena Cadiz',
    status: 'Scheduled',
    sentDate: 'Oct 20, 2023',
    recipients: '850',
    openRate: 0,
    clickRate: 0,
    type: 'Promotion'
  },
  {
    id: 'camp_3',
    title: 'SyncMaster 2.0 Feature Launch',
    status: 'Draft',
    sentDate: '-',
    recipients: '5,000',
    openRate: 0,
    clickRate: 0,
    type: 'Announcement'
  }
]

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Campaigns</h1>
          <p className="text-muted-foreground font-medium text-sm">Design and distribute email campaigns for your music releases.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-black h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus className="w-5 h-5 mr-2" /> New Campaign
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border p-2 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground/50 pl-11 h-10"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <Button variant="ghost" className="h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 font-bold">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {mockCampaigns.map((camp) => (
          <Card key={camp.id} className="bg-card border-border rounded-3xl hover:border-primary/40 hover:shadow-xl transition-all border-l-4 group" style={{ borderLeftColor: camp.status === 'Sent' ? '#10b981' : camp.status === 'Scheduled' ? '#6366f1' : '#94a3b8' }}>
            <CardContent className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-black tracking-[-0.04em] text-foreground text-lg truncate">{camp.title}</h4>
                  <Badge variant="outline" className="rounded-full text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-border">
                    {camp.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    {camp.sentDate}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Users className="w-3.5 h-3.5" />
                    {camp.recipients} Recipients
                  </div>
                </div>
              </div>

              {camp.status === 'Sent' && (
                <div className="flex items-center gap-10 px-8 border-l border-border/50">
                  <div className="space-y-1 w-24">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Open Rate</span>
                      <span className="text-foreground">{camp.openRate}%</span>
                    </div>
                    <Progress value={camp.openRate} className="h-1 bg-muted" indicatorClassName="bg-green-500" />
                  </div>
                  <div className="space-y-1 w-24">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Click Rate</span>
                      <span className="text-foreground">{camp.clickRate}%</span>
                    </div>
                    <Progress value={camp.clickRate} className="h-1 bg-muted" indicatorClassName="bg-primary" />
                  </div>
                </div>
              )}

              {camp.status === 'Scheduled' && (
                <div className="px-8 border-l border-border/50 flex items-center gap-3 text-primary">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Starts in 3 days</span>
                </div>
              )}

              {camp.status === 'Draft' && (
                <div className="px-8 border-l border-border/50 flex items-center gap-3 text-muted-foreground/60">
                  <Edit3 className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">In Progress</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button className="rounded-full bg-muted hover:bg-muted/80 text-foreground font-black h-10 px-6 transition-all">
                  {camp.status === 'Draft' ? 'Edit Draft' : 'View Report'}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground/40 hover:text-foreground">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Strategy Card */}
      <Card className="bg-primary/5 border-primary/20 rounded-[3rem] p-10 mt-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full group-hover:bg-primary/20 transition-all duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 rounded-[2rem] bg-white border border-primary/20 flex items-center justify-center shadow-xl rotate-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black tracking-[-0.04em] text-foreground">Optimize your outreach</h3>
            <p className="text-muted-foreground max-w-lg font-medium">Use our professional templates and drag-and-drop builder to create newsletters that stand out in any inbox.</p>
          </div>
          <Button className="rounded-full bg-foreground text-background font-black h-14 px-8 shadow-xl hover:scale-105 transition-all">
            Explore Templates <ArrowUpRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

