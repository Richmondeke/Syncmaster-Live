'use client'

import { useEffect, useState, useTransition } from 'react'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { Sparkles, Loader2, AlertCircle, CheckCircle, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { inviteComposer } from '@/app/actions/outreach'
import { Button } from '@/components/ui/button'
import { ScoreBar } from '@/components/ScoreBar'
import { Banner } from '@/components/Banner'

type SuggestionDetail = {
  composer_id: string
  match_score: number
  match_reason: string
  confidence: number
}

type ComposerInfo = {
  id: string
  name: string
}

type Props = {
  briefId: string
}

export function AiSuggestionsPanel({ briefId }: Props) {
  const [status, setStatus] = useState<'pending' | 'running' | 'complete' | 'failed' | 'no_composers'>('pending')
  const [suggestions, setSuggestions] = useState<SuggestionDetail[]>([])
  const [composers, setComposers] = useState<Map<string, ComposerInfo>>(new Map())
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set())
  const [pendingInvites, setPendingInvites] = useState<Set<string>>(new Set())
  const [, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to brief changes
    const channel = supabase
      .channel(`brief:${briefId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'briefs',
          filter: `id=eq.${briefId}`,
        },
        (payload) => {
          const brief = payload.new as {
            ai_match_status: 'pending' | 'running' | 'complete' | 'failed' | 'no_composers'
            ai_suggested_composers_detail: SuggestionDetail[]
          }
          setStatus(brief.ai_match_status)
          setSuggestions(brief.ai_suggested_composers_detail ?? [])
        }
      )
      .subscribe()

    // Fetch initial brief state
    supabase
      .from('briefs')
      .select('ai_match_status, ai_suggested_composers_detail')
      .eq('id', briefId)
      .single()
      .then(({ data }) => {
        if (data) {
          setStatus(data.ai_match_status)
          setSuggestions(data.ai_suggested_composers_detail ?? [])
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [briefId])

  // Fetch composer names for suggestions
  useEffect(() => {
    if (suggestions.length === 0) {
      setComposers(new Map())
      return
    }

    const supabase = createClient()
    const composerIds = suggestions.map((s) => s.composer_id)

    supabase
      .from('composers')
      .select('id, profiles!inner(full_name)')
      .in('id', composerIds)
      .then(({ data }) => {
        const map = new Map<string, ComposerInfo>()
        if (data) {
          for (const composer of data) {
            map.set(
              composer.id,
              {
                id: composer.id,
                name: (composer.profiles as { full_name: string | null } | null)?.full_name ?? 'Unknown',
              }
            )
          }
        }
        setComposers(map)
      })
  }, [suggestions])

  // Fetch invited composers for this brief
  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('outreach')
      .select('composer_id')
      .eq('brief_id', briefId)
      .then(({ data }) => {
        const ids = new Set(data?.map((o) => o.composer_id) ?? [])
        setInvitedIds(ids)
      })

    // Subscribe to outreach changes
    const channel = supabase
      .channel(`outreach:${briefId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'outreach',
          filter: `brief_id=eq.${briefId}`,
        },
        (payload) => {
          setInvitedIds((prev) => new Set([...prev, payload.new.composer_id]))
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [briefId])

  const handleInvite = (composerId: string) => {
    setPendingInvites((prev) => new Set([...prev, composerId]))

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('briefId', briefId)
        formData.append('composerId', composerId)
        await inviteComposer(formData)
        setInvitedIds((prev) => new Set([...prev, composerId]))
      } catch (err) {
        console.error('[AiSuggestionsPanel] invite failed:', err)
      } finally {
        setPendingInvites((prev) => {
          const next = new Set(prev)
          next.delete(composerId)
          return next
        })
      }
    })
  }


  // Loading skeleton
  if (status === 'running') {
    return (
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-10 flex flex-col items-center justify-center gap-6 shadow-elevation-low min-h-[300px]">
        <div className="relative">
          <Sparkles className="h-12 w-12 text-acid-lime animate-pulse" />
          <Loader2 className="absolute -bottom-2 -right-2 h-6 w-6 text-primary animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl display tracking-tight uppercase">Analyzing Matches</h2>
          <p className="text-sm font-medium text-muted-foreground max-w-[300px]">
            Our AI engine is currently cross-referencing composer profiles with your brief requirements...
          </p>
        </div>
      </div>
    )
  }

  // Error states
  if (status === 'failed') {
    return (
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-10 flex flex-col gap-6 shadow-elevation-low">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-500/10">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-2xl display tracking-tight uppercase">Match Analysis Failed</h2>
        </div>
        <Banner variant="error">
          <p className="text-sm font-medium">
            We encountered an error while analyzing this brief. Please try reverting to draft and reactivating to retry the process.
          </p>
        </Banner>
      </div>
    )
  }

  if (status === 'no_composers') {
    return (
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-10 flex flex-col gap-6 shadow-elevation-low">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <h2 className="text-2xl display tracking-tight uppercase">No Matches Found</h2>
        </div>
        <Banner variant="warning">
          <p className="text-sm font-medium">
            No active composers in our network currently match the specific requirements of this brief.
          </p>
        </Banner>
      </div>
    )
  }

  // Pending state
  if (status === 'pending') {
    return (
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-10 flex flex-col gap-6 shadow-elevation-low">
        <div className="flex items-center gap-3 opacity-50">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-2xl display tracking-tight uppercase">AI Match Analysis</h2>
        </div>
        <div className="border border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/5">
          <p className="text-sm font-medium text-muted-foreground max-w-[280px]">
            Analysis will automatically trigger once the brief is set to <span className="text-foreground font-bold">Active</span>.
          </p>
        </div>
      </div>
    )
  }

  // Complete state with suggestions
  if (status === 'complete') {
    if (suggestions.length === 0) {
      return (
        <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-10 flex flex-col gap-6 shadow-elevation-low">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-acid-lime" />
            <h2 className="text-2xl display tracking-tight uppercase">Match Analysis Complete</h2>
          </div>
          <div className="border border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/5">
            <p className="text-sm font-medium text-muted-foreground">
              Analysis finished, but no high-confidence matches were identified.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 flex flex-col gap-8 shadow-elevation-low transition-all border-acid-lime/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-acid-lime/20 blur-sm rounded-full animate-pulse" />
              <Sparkles className="h-6 w-6 text-acid-lime relative" />
            </div>
            <h2 className="text-3xl display tracking-tighter uppercase">AI Shortlist</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-foreground text-background px-3 py-1 rounded-full tracking-[0.2em] uppercase">V1.0 ENGINE</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/20 px-3 py-1 rounded-full border">Ranked by score</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {suggestions.map((suggestion, index) => {
            const composer = composers.get(suggestion.composer_id)
            const invited = invitedIds.has(suggestion.composer_id)
            const isPending = pendingInvites.has(suggestion.composer_id)
            const name = composer?.name ?? 'Unknown'

            return (
              <div 
                key={suggestion.composer_id} 
                className="group relative flex flex-col gap-5 rounded-[0.375rem] border bg-surface-primary/40 p-7 transition-all hover:border-acid-lime/40 hover:bg-surface-primary/70 shadow-elevation-low overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-acid-lime/20 group-hover:bg-acid-lime transition-colors" />
                
                <div className="flex items-start justify-between gap-6">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-acid-lime font-mono text-[10px] font-bold opacity-60">MATCH {index + 1}</span>
                      <h3 className="text-2xl font-black tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score</span>
                        <ScoreBar score={Math.round(suggestion.match_score * 10)} />
                      </div>
                      <div className="w-[1px] h-3 bg-border/40" />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-12 rounded-full bg-muted/30 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/60"
                              style={{ width: `${suggestion.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-muted-foreground">{(suggestion.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleInvite(suggestion.composer_id)}
                    disabled={invited || isPending}
                    className="rounded-full font-black px-6 shadow-elevation-low transition-all active:scale-95 uppercase tracking-widest text-[10px] h-10 shrink-0 border border-transparent hover:border-acid-lime/30"
                    variant={invited ? "secondary" : "default"}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                        Processing
                      </>
                    ) : invited ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 mr-2 text-acid-lime" />
                        Invited
                      </>
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5 mr-2" />
                        Invite
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="relative pl-6 py-4 rounded-xl bg-background/40 border border-border/30 group-hover:bg-background/60 transition-colors">
                  <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-acid-lime/30 rounded-full" />
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium italic">
                    "{suggestion.match_reason}"
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/30 opacity-40">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em]">
            SyncMaster Engine // Match Protocol Alpha
          </p>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    )
  }

  return null
}
