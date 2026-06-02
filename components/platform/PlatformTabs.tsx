'use client'

import { useState } from 'react'
import {
  FileText,
  Music2,
  Send,
  BarChart3,
  Shield,
  Layers,
  FileSearch,
  Sparkles,
  Download,
  Users,
  Star,
  Upload,
  Trophy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  icon: LucideIcon
  title: string
  description: string
  color: string
  bg: string
}

type Tab = 'composers' | 'supervisors'

const composerFeatures: Feature[] = [
  {
    icon: FileText,
    title: 'Electronic Press Kit',
    description: 'Build a professional EPK with bio, catalog, and audio samples. Share a single link with any producer or supervisor in the world.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Music2,
    title: 'Track Catalog',
    description: 'Organize and tag your full catalog inside SyncMaster. When a brief drops, your best tracks are already ready to pitch.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Send,
    title: 'Brief Invites',
    description: "No cold outreach. When you're the right fit for a brief, we bring it to you directly.",
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: BarChart3,
    title: 'Placement Tracking',
    description: 'Every submission, shortlist, and confirmed placement tracked in one dashboard. Your sync history builds your credibility over time.',
    color: 'text-fuchsia-500',
    bg: 'bg-fuchsia-500/10',
  },
  {
    icon: Shield,
    title: 'Rights Documentation',
    description: 'Store and verify your ownership docs, ISRC codes, and split agreements in one place. Always brief-ready.',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
  {
    icon: Layers,
    title: 'Stems & Metadata',
    description: 'Our pre-vetting process ensures your stems are packaged and metadata is complete before any brief ever arrives.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
]

const supervisorFeatures: Feature[] = [
  {
    icon: FileSearch,
    title: 'Brief Management',
    description: 'Create and manage briefs in minutes. Describe mood, genre, tempo, and deadline. We handle everything after you submit.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Sparkles,
    title: 'Curated Match Delivery',
    description: 'Receive 3–5 hand-curated tracks per brief. Human-reviewed, not just algorithmically ranked. Every match is intentional.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Shield,
    title: 'Rights-Ready Documentation',
    description: 'Every track comes with verified rights documentation. ISRC, master clearance, sync rights, and one-stop confirmation included.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Download,
    title: 'Stems on Request',
    description: "Need stems for an edit? Every SyncMaster composer confirms stem availability during vetting. Request and receive within 24 hours.",
    color: 'text-fuchsia-500',
    bg: 'bg-fuchsia-500/10',
  },
  {
    icon: Users,
    title: 'Shortlist Sharing',
    description: 'Share your shortlisted tracks with directors, producers, or clients. Track who listened and for how long.',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
  {
    icon: BarChart3,
    title: 'Placement History',
    description: "Track every brief, every match, every deal in one dashboard. Build your own library of African music you've licensed.",
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
]

type Milestone = {
  icon: LucideIcon
  badge: string
  title: string
  description: string
  earned: boolean
  color: string
  bg: string
}

const milestones: Milestone[] = [
  {
    icon: Star,
    badge: 'SyncNoob',
    title: 'Welcome to the roster',
    description: 'Awarded upon successfully joining SyncMaster. Your sync journey starts here.',
    earned: true,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Upload,
    badge: 'Trackstar',
    title: 'First track uploaded',
    description: 'Upload your first track to the catalog. Your music is now pitchable.',
    earned: false,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Send,
    badge: 'Pitch Perfect',
    title: 'First brief application',
    description: 'Apply to your first brief opportunity. You’re in the room.',
    earned: false,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Trophy,
    badge: 'Sync Master',
    title: 'First placement landed',
    description: 'Land your first successful sync placement. This is what it’s all about.',
    earned: false,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
]

export function PlatformTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('composers')

  const features = activeTab === 'composers' ? composerFeatures : supervisorFeatures

  return (
    <div className="flex flex-col items-center gap-12">
      {/* Tab toggle */}
      <div className="inline-flex rounded-full p-1 bg-muted gap-1">
        <button
          onClick={() => setActiveTab('composers')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
            activeTab === 'composers'
              ? 'bg-primary text-primary-foreground'
              : 'bg-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          For Composers
        </button>
        <button
          onClick={() => setActiveTab('supervisors')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
            activeTab === 'supervisors'
              ? 'bg-primary text-primary-foreground'
              : 'bg-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          For Supervisors
        </button>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-5 border border-border/50 rounded-2xl p-6 bg-card/50 hover:border-input transition-colors group"
          >
            <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-black tracking-[-0.068em]">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Milestones — composer only */}
      {activeTab === 'composers' && (
        <div className="w-full mt-4">
          <div className="flex flex-col gap-6 p-8 md:p-10 rounded-[2rem] bg-card border border-border/50">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider w-fit">
                <Trophy className="w-3 h-3" />
                Milestones &amp; Rank
              </div>
              <h3 className="text-2xl font-black tracking-[-0.068em]">Track your progress. Earn your badges.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Every action you take on SyncMaster moves you closer to your first placement. Hit milestones, earn badges, build your reputation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.badge}
                  className={`relative flex flex-col gap-3 p-5 rounded-2xl border transition-colors ${
                    milestone.earned
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border/50 bg-muted/30 opacity-70'
                  }`}
                >
                  {milestone.earned && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                      Earned
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${milestone.bg} flex items-center justify-center`}>
                    <milestone.icon className={`w-5 h-5 ${milestone.color}`} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-black uppercase tracking-widest ${milestone.color}`}>{milestone.badge}</span>
                    <h4 className="text-sm font-black tracking-tight text-foreground">{milestone.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
