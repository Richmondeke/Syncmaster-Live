'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { submitTrack, type SubmissionFormState } from '@/app/actions/submissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { Music2, Link2, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Submission = {
  id: string
  track_url: string
  notes: string | null
  status: string
}

type CatalogTrack = {
  id: string
  title: string
  genre: string
  bpm?: string
  key?: string
  duration?: string
}

type Props = {
  briefId: string
  submissions: Submission[]
}

const MAX = 3
const INITIAL: SubmissionFormState = { error: null }

export function SubmitTrackForm({ briefId, submissions }: Props) {
  const [state, action, pending] = useActionState(submitTrack, INITIAL)
  const remaining = MAX - submissions.length

  const [mode, setMode] = useState<'url' | 'catalog'>('url')
  const [catalog, setCatalog] = useState<CatalogTrack[]>([])
  const [selectedTrack, setSelectedTrack] = useState<CatalogTrack | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load catalog from API (falls back to localStorage for resilience)
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/supabase/rest/v1/tracks', {
          headers: { 'Accept': 'application/json', 'apikey': 'mock-key' }
        })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setCatalog(data)
            return
          }
        }
      } catch {}
      // Fallback: localStorage
      try {
        const saved = localStorage.getItem('syncmaster_tracks')
        if (saved) setCatalog(JSON.parse(saved))
      } catch {}
    }
    loadCatalog()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 shadow-elevation-low transition-all flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="label">Submissions</p>
        <h2 className="text-2xl display text-foreground">Submit tracks</h2>
        <p className="text-lg leading-relaxed text-muted-foreground font-medium">
          {remaining} of {MAX} submission{remaining === 1 ? '' : 's'} remaining. You can submit your best work that matches the creative direction.
        </p>
      </div>

      {submissions.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Submissions</p>
          <ol className="flex flex-col gap-3">
            {submissions.map((s, i) => (
              <li key={s.id} className="flex items-start gap-4 p-4 rounded-md bg-background/50 border border-border/50 group hover:border-primary/30 transition-all">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <a href={s.track_url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold truncate block hover:text-primary transition-colors">
                    {s.track_url}
                  </a>
                  {s.notes && <p className="text-sm text-foreground/70 mt-1 leading-relaxed">{s.notes}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s.status}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {remaining > 0 && (
        <form action={action} className="flex flex-col gap-6 pt-6 border-t border-border/50">
          <input type="hidden" name="briefId" value={briefId} />

          {/* Mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-xl w-fit border border-border/40">
            <button
              type="button"
              onClick={() => { setMode('url'); setSelectedTrack(null) }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                mode === 'url'
                  ? 'bg-white shadow-sm text-primary border border-border/40'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Link2 className="w-3.5 h-3.5" /> Enter URL
            </button>
            <button
              type="button"
              onClick={() => setMode('catalog')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                mode === 'catalog'
                  ? 'bg-white shadow-sm text-primary border border-border/40'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Music2 className="w-3.5 h-3.5" /> From Catalog
            </button>
          </div>

          {mode === 'url' ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="trackUrl" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Track URL</Label>
              <Input
                id="trackUrl"
                name="trackUrl"
                type="url"
                placeholder="https://soundcloud.com/..."
                required
                className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all text-lg"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select from Catalog</Label>
              {/* Hidden field carries the selected track as a synthesised URL */}
              <input type="hidden" name="trackUrl" value={selectedTrack ? `syncmaster://catalog/${selectedTrack.id}` : ''} required={mode === 'catalog'} />

              {catalog.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-border/40 bg-muted/20 text-center gap-2">
                  <Music2 className="w-6 h-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No tracks in your catalog yet.</p>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full h-12 px-4 flex items-center justify-between bg-background/50 border border-border/50 rounded-md text-sm font-medium hover:border-primary/40 transition-all"
                  >
                    {selectedTrack ? (
                      <span className="flex items-center gap-3">
                        <Music2 className="w-4 h-4 text-primary/60" />
                        <span className="font-bold">{selectedTrack.title}</span>
                        <span className="text-muted-foreground text-xs">{selectedTrack.genre}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Choose a track…</span>
                    )}
                    <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', dropdownOpen && 'rotate-180')} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="max-h-56 overflow-y-auto">
                        {catalog.map(track => (
                          <button
                            key={track.id}
                            type="button"
                            onClick={() => { setSelectedTrack(track); setDropdownOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Music2 className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate">{track.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{track.genre}{track.bpm ? ` · ${track.bpm} BPM` : ''}{track.key ? ` · ${track.key}` : ''}</p>
                            </div>
                            {selectedTrack?.id === track.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Creative note <span className="text-muted-foreground font-normal lowercase">(optional)</span>
            </Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Brief note on why this track fits the brief..."
              className="flex w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-lg placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all resize-none"
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">{state.error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={pending || (mode === 'catalog' && !selectedTrack)}
            className="self-start rounded-full px-10"
          >
            {pending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Submitting…
              </>
            ) : (
              'Submit track'
            )}
          </Button>
        </form>
      )}

      {remaining === 0 && (
        <div className="p-6 rounded-md bg-muted/30 border border-dashed border-border flex items-center justify-center">
          <p className="text-base font-medium text-muted-foreground">
            You&apos;ve submitted the maximum number of tracks for this brief.
          </p>
        </div>
      )}
    </div>
  )
}
