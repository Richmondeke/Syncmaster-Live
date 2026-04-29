'use client'

import { useEffect, useState, useTransition } from 'react'
import { Sparkles, Loader2, AlertCircle, CheckCircle, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { inviteComposer } from '@/app/actions/outreach'
import { Button } from '@/components/ui/button'

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
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">AI Suggested Composers</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          <p className="text-sm text-muted-foreground">Analyzing composer profiles against this brief…</p>
        </div>
      </div>
    )
  }

  // Error states
  if (status === 'failed') {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">AI Suggested Composers</p>
        </div>
        <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-red-900 dark:text-red-200">Analysis failed</p>
            <p className="text-xs text-red-800 dark:text-red-300">
              AI analysis failed. Revert to draft and reactivate to retry.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'no_composers') {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">AI Suggested Composers</p>
        </div>
        <div className="flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            No active composers matched this brief at the time of activation.
          </p>
        </div>
      </div>
    )
  }

  // Pending state
  if (status === 'pending') {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">AI Suggested Composers</p>
        </div>
        <p className="text-xs text-muted-foreground">Waiting to analyze when brief is activated.</p>
      </div>
    )
  }

  // Complete state with suggestions
  if (status === 'complete') {
    if (suggestions.length === 0) {
      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold">AI Suggested Composers</p>
          </div>
          <p className="text-xs text-muted-foreground">No matches found for this brief.</p>
        </div>
      )
    }

    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <p className="text-sm font-semibold">AI Suggested Composers</p>
          <span className="ml-auto text-xs text-muted-foreground">Ranked by fit</span>
        </div>

        <ol className="flex flex-col gap-3">
          {suggestions.map((suggestion, index) => {
            const composer = composers.get(suggestion.composer_id)
            const invited = invitedIds.has(suggestion.composer_id)
            const isPending = pendingInvites.has(suggestion.composer_id)
            const name = composer?.name ?? 'Unknown'

            return (
              <li key={suggestion.composer_id} className="flex flex-col gap-3 rounded-lg border p-3 md:p-4">
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <p className="text-sm font-medium">
                      {index + 1}. {name}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-primary">{suggestion.match_score.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">/10</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.match_reason}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="h-1.5 w-16 rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${suggestion.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{(suggestion.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleInvite(suggestion.composer_id)}
                  disabled={invited || isPending}
                  className="w-full md:w-auto"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Inviting...
                    </>
                  ) : invited ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Invited
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Invite
                    </>
                  )}
                </Button>
              </li>
            )
          })}
        </ol>

        <p className="text-xs text-muted-foreground">
          Use the outreach panel below to send invitations.
        </p>
      </div>
    )
  }

  return null
}
