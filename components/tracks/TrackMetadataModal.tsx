'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Plus, Trash2, User, Tag, Music2, AlertCircle, CheckCircle2, Loader2, Mail, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Writer = {
  id?: string
  name: string
  email: string
  percentage: number
  confirmed?: boolean
  profile_id?: string | null
}

type TrackMetadata = {
  bpm: string
  key: string
  duration: string
  tags: string[]
  mood: string
  instruments: string[]
  isrc: string
  writers: Writer[]
}

type Props = {
  track: any
  onClose: () => void
  onSave: (track: any) => void
}

const MOODS = ['Happy', 'Sad', 'Energetic', 'Calm', 'Dark', 'Romantic', 'Tense', 'Uplifting', 'Mysterious']
const COMMON_INSTRUMENTS = ['Piano', 'Guitar', 'Drums', 'Bass', 'Strings', 'Brass', 'Synth', 'Vocals', 'Violin']
const API = '/api/supabase'
const H = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'apikey': 'mock-key' }

function totalPct(writers: Writer[]) {
  return writers.reduce((sum, w) => sum + (Number(w.percentage) || 0), 0)
}

export function TrackMetadataModal({ track, onClose, onSave }: Props) {
  const [activeTab, setActiveTab] = useState<'details' | 'writers' | 'tags'>('details')
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [instrInput, setInstrInput] = useState('')

  const [metadata, setMetadata] = useState<TrackMetadata>({
    bpm: track?.bpm || '',
    key: track?.key || '',
    duration: track?.duration || '',
    tags: track?.tags || [],
    mood: track?.mood || '',
    instruments: track?.instruments || [],
    isrc: track?.isrc || '',
    writers: [],
  })

  // Load persisted metadata + writers
  useEffect(() => {
    if (!track?.id) return
    async function load() {
      try {
        const [mRes, wRes] = await Promise.all([
          fetch(`${API}/rest/v1/track_metadata?track_id=eq.${track.id}`, { headers: H }),
          fetch(`${API}/rest/v1/track_writers?track_id=eq.${track.id}`, { headers: H }),
        ])
        if (mRes.ok) {
          const m = await mRes.json()
          if (m && !Array.isArray(m)) {
            setMetadata(prev => ({ ...prev, ...m, writers: prev.writers }))
          }
        }
        if (wRes.ok) {
          const w = await wRes.json()
          if (Array.isArray(w)) setMetadata(prev => ({ ...prev, writers: w }))
        }
      } catch {}
    }
    load()
  }, [track?.id])

  // --- Writers ---
  const addWriter = () => {
    setMetadata(prev => ({
      ...prev,
      writers: [...prev.writers, { name: '', email: '', percentage: 0 }]
    }))
  }

  const removeWriter = (idx: number) => {
    setMetadata(prev => ({ ...prev, writers: prev.writers.filter((_, i) => i !== idx) }))
  }

  const updateWriter = (idx: number, field: keyof Writer, value: string | number) => {
    setMetadata(prev => ({
      ...prev,
      writers: prev.writers.map((w, i) => i === idx ? { ...w, [field]: value } : w)
    }))
  }

  // Email autocomplete
  const WriterRow = ({ writer, idx }: { writer: Writer; idx: number }) => {
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [loadingSug, setLoadingSug] = useState(false)
    const [showSug, setShowSug] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const rowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      function outside(e: MouseEvent) {
        if (rowRef.current && !rowRef.current.contains(e.target as Node)) setShowSug(false)
      }
      document.addEventListener('mousedown', outside)
      return () => document.removeEventListener('mousedown', outside)
    }, [])

    const handleEmailChange = (val: string) => {
      updateWriter(idx, 'email', val)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (val.length < 3) { setSuggestions([]); setShowSug(false); return }
      debounceRef.current = setTimeout(async () => {
        setLoadingSug(true)
        try {
          const res = await fetch(`${API}/rest/v1/profiles?email_like=${encodeURIComponent(val)}`, { headers: H })
          if (res.ok) {
            const data = await res.json()
            setSuggestions(Array.isArray(data) ? data : [])
            setShowSug(true)
          }
        } catch {} finally { setLoadingSug(false) }
      }, 350)
    }

    const selectSuggestion = (s: any) => {
      setMetadata(prev => ({
        ...prev,
        writers: prev.writers.map((w, i) => i === idx ? { ...w, name: s.full_name || '', email: s.email, profile_id: s.id, confirmed: true } : w)
      }))
      setSuggestions([])
      setShowSug(false)
    }

    const pct = totalPct(metadata.writers)
    const isOverflow = pct > 100

    return (
      <div ref={rowRef} className="p-4 rounded-xl border border-border/50 bg-background/50 flex flex-col gap-3 relative group hover:border-primary/30 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Writer {idx + 1}</span>
          <button type="button" onClick={() => removeWriter(idx)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Full name</Label>
            <Input
              value={writer.name}
              onChange={e => updateWriter(idx, 'name', e.target.value)}
              placeholder="Jane Doe"
              className="h-9 text-sm bg-background/50"
            />
          </div>

          {/* Email with autocomplete */}
          <div className="flex flex-col gap-1.5 relative">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <div className="relative">
              <Input
                value={writer.email}
                onChange={e => handleEmailChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSug(true)}
                placeholder="email@example.com"
                className={cn('h-9 text-sm bg-background/50 pr-8', writer.confirmed && 'border-green-500/50')}
              />
              {loadingSug && <Loader2 className="absolute right-2.5 top-2.5 w-4 h-4 animate-spin text-muted-foreground" />}
              {writer.confirmed && !loadingSug && <CheckCircle2 className="absolute right-2.5 top-2.5 w-4 h-4 text-green-500" />}
            </div>
            {showSug && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                {suggestions.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{s.full_name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label className="text-xs text-muted-foreground">Composition %</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                value={writer.percentage}
                onChange={e => updateWriter(idx, 'percentage', Number(e.target.value))}
                className="h-9 w-24 text-sm bg-background/50"
              />
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', isOverflow ? 'bg-destructive' : 'bg-primary')}
                  style={{ width: `${Math.min(writer.percentage, 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-muted-foreground w-12 text-right">{writer.percentage}%</span>
            </div>
          </div>
          {!writer.confirmed && writer.email && (
            <div className="flex items-center gap-1.5 text-amber-600 text-xs mt-5">
              <Mail className="w-3.5 h-3.5" />
              <span>Invite pending</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // --- Tags ---
  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !metadata.tags.includes(tag)) {
      setMetadata(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    }
    setTagInput('')
  }
  const removeTag = (tag: string) => setMetadata(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))

  const toggleInstrument = (instr: string) => {
    setMetadata(prev => ({
      ...prev,
      instruments: prev.instruments.includes(instr)
        ? prev.instruments.filter(i => i !== instr)
        : [...prev.instruments, instr]
    }))
  }

  // --- Save ---
  const handleSave = async () => {
    const pct = totalPct(metadata.writers)
    if (metadata.writers.length > 0 && pct !== 100) {
      alert(`Writer percentages must total 100%. Currently: ${pct}%`)
      return
    }

    setSaving(true)
    try {
      // Save metadata
      await fetch(`${API}/rest/v1/track_metadata`, {
        method: 'POST',
        headers: H,
        body: JSON.stringify({ track_id: track.id, bpm: metadata.bpm, key: metadata.key, duration: metadata.duration, tags: metadata.tags, mood: metadata.mood, instruments: metadata.instruments, isrc: metadata.isrc })
      })
      // Save writers
      await fetch(`${API}/rest/v1/track_writers`, {
        method: 'POST',
        headers: H,
        body: JSON.stringify({ track_id: track.id, writers: metadata.writers })
      })
      onSave({ ...track, ...metadata })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const pct = totalPct(metadata.writers)
  const pctOk = metadata.writers.length === 0 || pct === 100

  const tabs = [
    { id: 'details', label: 'Details', icon: Music2 },
    { id: 'writers', label: `Writers ${metadata.writers.length > 0 ? `(${metadata.writers.length})` : ''}`, icon: User },
    { id: 'tags', label: 'Tags & Mood', icon: Tag },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-black tracking-tight">{track?.title}</h2>
            <p className="text-sm text-muted-foreground font-medium mt-0.5">{track?.genre}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3.5 text-sm font-bold transition-all border-b-2 -mb-px',
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">BPM</Label>
                <Input value={metadata.bpm} onChange={e => setMetadata(p => ({ ...p, bpm: e.target.value }))} placeholder="120" className="bg-background/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key</Label>
                <Input value={metadata.key} onChange={e => setMetadata(p => ({ ...p, key: e.target.value }))} placeholder="Am" className="bg-background/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</Label>
                <Input value={metadata.duration} onChange={e => setMetadata(p => ({ ...p, duration: e.target.value }))} placeholder="3:45" className="bg-background/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ISRC</Label>
                <Input value={metadata.isrc} onChange={e => setMetadata(p => ({ ...p, isrc: e.target.value }))} placeholder="USRC17607839" className="bg-background/50" />
              </div>
            </div>
          )}

          {activeTab === 'writers' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Split composition rights between writers. Total must equal 100%.</p>
                <div className={cn('flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full', pctOk ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive')}>
                  {pctOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {pct}% / 100%
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {metadata.writers.map((writer, idx) => (
                  <WriterRow key={idx} writer={writer} idx={idx} />
                ))}
              </div>

              <Button type="button" variant="outline" onClick={addWriter} className="w-full rounded-xl border-dashed gap-2">
                <Plus className="w-4 h-4" /> Add writer
              </Button>

              {metadata.writers.length > 0 && !pctOk && (
                <p className="text-xs text-destructive bg-destructive/10 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Percentages must total exactly 100% before saving. Remaining: {100 - pct}%
                </p>
              )}

              {metadata.writers.some(w => !w.confirmed && w.email) && (
                <p className="text-xs text-amber-600 bg-amber-500/10 rounded-lg p-3 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  Writers without a SyncMaster account will receive an email invite to confirm their composition credit.
                </p>
              )}
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mood</Label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(mood => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setMetadata(p => ({ ...p, mood: p.mood === mood ? '' : mood }))}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-bold transition-all border',
                        metadata.mood === mood ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/40 border-border/50 text-muted-foreground hover:border-primary/30'
                      )}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Instruments</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_INSTRUMENTS.map(instr => (
                    <button
                      key={instr}
                      type="button"
                      onClick={() => toggleInstrument(instr)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-bold transition-all border',
                        metadata.instruments.includes(instr) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/40 border-border/50 text-muted-foreground hover:border-primary/30'
                      )}
                    >
                      {instr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag…"
                    className="bg-background/50"
                  />
                  <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border shrink-0 bg-muted/10">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !pctOk} className="rounded-xl gap-2 px-8">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
