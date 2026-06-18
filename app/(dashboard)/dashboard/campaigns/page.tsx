'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
} from '@/components/ui/card'
import { 
  Send,
  Plus,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function CampaignsPage() {
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

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-24 text-center gap-6 rounded-[2.5rem] border-2 border-dashed border-border/40 bg-muted/10">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-primary/60" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Send className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-black tracking-[-0.04em] text-foreground">No campaigns yet</h3>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Create your first email campaign to promote your releases, share catalog updates, 
            and connect directly with music supervisors and labels.
          </p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-black h-12 px-8 shadow-lg shadow-primary/20 transition-all active:scale-95 mt-2">
          <Plus className="w-5 h-5 mr-2" /> Create Your First Campaign
        </Button>
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
            Explore Templates <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
