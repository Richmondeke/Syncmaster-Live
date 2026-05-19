'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Award, Shield, Star, Music, CheckCircle2, Medal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export function UserBadgeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [tracksCount, setTracksCount] = useState(0)
  const [submissionsCount, setSubmissionsCount] = useState(0)
  const [placementsCount, setPlacementsCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    
    // Fetch counts
    supabase
      .from('tracks')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => {
        if (count !== null) setTracksCount(count)
      })

    supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => {
        if (count !== null) setSubmissionsCount(count)
      })

    supabase
      .from('placements')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => {
        if (count !== null) setPlacementsCount(count)
      })
  }, [isOpen])

  // Mock data for badges - could be fetched based on user progress
  const badges = [
    {
      id: 'syncnoob',
      title: 'SyncNoob',
      description: 'Awarded upon successfully joining SyncMaster.',
      icon: <Medal className="w-8 h-8 text-primary" />,
      earned: true,
      level: 1,
      color: 'bg-primary/10 border-primary/20 text-primary',
    },
    {
      id: 'first_upload',
      title: 'Trackstar',
      description: 'Upload your first track to the catalog.',
      icon: <Music className="w-8 h-8 text-emerald-500" />,
      earned: tracksCount >= 1,
      level: 2,
      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
    },
    {
      id: 'first_pitch',
      title: 'Pitch Perfect',
      description: 'Apply to your first brief opportunity.',
      icon: <Star className="w-8 h-8 text-amber-500" />,
      earned: submissionsCount >= 1,
      level: 3,
      color: 'bg-amber-500/10 border-amber-500/20 text-amber-600',
    },
    {
      id: 'sync_master',
      title: 'Sync Master',
      description: 'Land your first successful placement.',
      icon: <Award className="w-8 h-8 text-fuchsia-500" />,
      earned: placementsCount >= 1,
      level: 4,
      color: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-600',
    },
  ]

  const activeBadge = [...badges].reverse().find((b) => b.earned) || badges[0]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group" />
        }
      >
        <div className="relative">
          <Medal className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold leading-none text-foreground">{activeBadge.title}</p>
          <p className="text-[10px] font-medium text-muted-foreground">Level {activeBadge.level}</p>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md md:max-w-xl rounded-[2rem] border-border bg-card p-0 overflow-hidden shadow-2xl">
        <div className="relative h-32 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute -bottom-8 left-8">
            <div className="w-20 h-20 rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-xl">
              <Award className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="px-8 pt-12 pb-8 space-y-8">
          <DialogHeader className="text-left space-y-1.5">
            <DialogTitle className="text-2xl font-bold tracking-tight">Milestones & Rank</DialogTitle>
            <DialogDescription className="text-base">
              Track your progress and earn badges as you reach new milestones on the platform.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                  badge.earned 
                    ? 'bg-card border-border shadow-sm' 
                    : 'bg-muted/30 border-dashed border-border/50 opacity-60 grayscale-[0.5]'
                }`}
              >
                <div className={`w-16 h-16 rounded-xl flex shrink-0 items-center justify-center border ${badge.color}`}>
                  {badge.icon}
                </div>
                
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-foreground text-base tracking-tight truncate">{badge.title}</h4>
                    {badge.earned && (
                      <Badge variant="outline" className="shrink-0 bg-primary/10 text-primary border-primary/20 rounded-full text-[10px] uppercase font-bold py-0 h-5 px-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Earned
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
