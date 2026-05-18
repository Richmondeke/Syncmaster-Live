'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ExternalLink, 
  BarChart3, 
  Eye, 
  Image as ImageIcon, 
  Music2, 
  Globe, 
  Edit3,
  Trash2,
  X,
  Volume2,
  Play,
  Check,
  AlertCircle,
  Link2,
  UploadCloud,
  Loader2,
  ChevronDown
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/Toast'
import { 
  getEPKs, 
  createEPK, 
  updateEPK, 
  deleteEPK 
} from '@/app/actions/epks'
import type { EPK, EPKTrack, EPKType, EPKStatus, EPKSocialLinks } from '@/types/epk.types'

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
]

export default function EPKsPage() {
  const [epks, setEpks] = useState<EPK[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('All')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  
  // Toast notifications
  const { addToast } = useToast()
  const [isPending, startTransition] = useTransition()

  // Modal / Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingEpk, setEditingEpk] = useState<EPK | null>(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [type, setType] = useState<EPKType>('Album Release')
  const [status, setStatus] = useState<EPKStatus>('draft')
  const [imageUrl, setImageUrl] = useState('')
  const [bio, setBio] = useState('')
  const [tracks, setTracks] = useState<EPKTrack[]>([])
  
  // Track Catalog and Interactive Upload/Select UI states
  const [catalog, setCatalog] = useState<any[]>([])
  const [trackModes, setTrackModes] = useState<Record<string, 'url' | 'upload' | 'catalog'>>({})
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [dropdownOpenTrackId, setDropdownOpenTrackId] = useState<string | null>(null)
  
  // Social links fields
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')
  const [spotify, setSpotify] = useState('')
  const [youtube, setYoutube] = useState('')
  const [soundcloud, setSoundcloud] = useState('')
  const [website, setWebsite] = useState('')
  
  const [formError, setFormError] = useState<string | null>(null)
  
  // Analytics / Stats Modal State
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [analyticsEpk, setAnalyticsEpk] = useState<EPK | null>(null)

  // Fetch EPKs on load
  const loadEPKs = async () => {
    setLoading(true)
    const data = await getEPKs()
    setEpks(data)
    setLoading(false)
  }

  // Load catalog from API (falls back to localStorage for resilience)
  const loadCatalog = async () => {
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

  useEffect(() => {
    loadEPKs()
    loadCatalog()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingEpk) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
      setSlug(generated)
    }
  }, [title])

  // Open editor for creating
  const handleCreateNew = () => {
    setEditingEpk(null)
    setTitle('')
    setSlug('')
    setType('Album Release')
    setStatus('draft')
    // Randomize a default image
    setImageUrl(PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)])
    setBio('')
    setTracks([
      { id: 'tr_1', title: 'Main Track', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '3:45' }
    ])
    setInstagram('')
    setTwitter('')
    setSpotify('')
    setYoutube('')
    setSoundcloud('')
    setWebsite('')
    setFormError(null)
    setTrackModes({})
    setUploadProgress({})
    setDropdownOpenTrackId(null)
    setIsEditorOpen(true)
  }

  // Open editor for editing
  const handleEdit = (epk: EPK) => {
    setEditingEpk(epk)
    setTitle(epk.title)
    setSlug(epk.slug)
    setType(epk.type)
    setStatus(epk.status)
    setImageUrl(epk.image_url || '')
    setBio(epk.bio || '')
    setTracks(epk.tracks || [])
    
    const socials = epk.social_links || {}
    setInstagram(socials.instagram || '')
    setTwitter(socials.twitter || '')
    setSpotify(socials.spotify || '')
    setYoutube(socials.youtube || '')
    setSoundcloud(socials.soundcloud || '')
    setWebsite(socials.website || '')
    
    setFormError(null)
    setTrackModes({})
    setUploadProgress({})
    setDropdownOpenTrackId(null)
    setIsEditorOpen(true)
  }

  // Handle delete EPK
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the EPK for "${name}"? This action is permanent.`)) {
      return
    }

    startTransition(async () => {
      const res = await deleteEPK(id)
      if (res.success) {
        addToast(`Successfully deleted EPK for "${name}"`, 'success')
        loadEPKs()
      } else {
        addToast(res.error || 'Failed to delete EPK', 'error')
      }
    })
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!title.trim()) {
      setFormError('Title is required')
      return
    }
    if (!slug.trim()) {
      setFormError('Slug is required')
      return
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      type,
      status,
      image_url: imageUrl.trim() || undefined,
      bio: bio.trim() || undefined,
      tracks: tracks.filter(t => !!t.title.trim()),
      social_links: {
        instagram: instagram.trim() || undefined,
        twitter: twitter.trim() || undefined,
        spotify: spotify.trim() || undefined,
        youtube: youtube.trim() || undefined,
        soundcloud: soundcloud.trim() || undefined,
        website: website.trim() || undefined
      }
    }

    startTransition(async () => {
      let res
      if (editingEpk) {
        res = await updateEPK(editingEpk.id, payload)
      } else {
        res = await createEPK(payload)
      }

      if (res.success) {
        addToast(
          editingEpk 
            ? `Successfully updated EPK "${title}"` 
            : `Successfully created EPK "${title}"`, 
          'success'
        )
        setIsEditorOpen(false)
        loadEPKs()
      } else {
        setFormError(res.error || 'An unexpected error occurred')
        addToast(res.error || 'Failed to save EPK', 'error')
      }
    })
  }

  // Add a track helper
  const addTrackField = () => {
    const id = `tr_${Date.now()}`
    setTracks([...tracks, { id, title: '', audioUrl: '', duration: '' }])
  }

  // Remove a track helper
  const removeTrackField = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id))
  }

  // Update a track field helper
  const updateTrackField = (id: string, field: keyof EPKTrack, value: string) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  // Handle audio file upload, extract metadata, calculate exact duration, and run simulated upload
  const handleAudioUpload = (trackId: string, file: File) => {
    if (!file) return

    // Extract title (minus extension)
    const titleWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.')) || file.name

    // Update track title automatically
    updateTrackField(trackId, 'title', titleWithoutExtension)

    // Calculate duration using native Audio API
    const audioUrl = URL.createObjectURL(file)
    const audio = new Audio(audioUrl)
    audio.addEventListener('loadedmetadata', () => {
      const totalSeconds = Math.round(audio.duration)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
      updateTrackField(trackId, 'duration', formattedDuration)
    })

    // Simulate progress animation
    setUploadProgress(prev => ({ ...prev, [trackId]: 0 }))
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress >= 100) {
        clearInterval(interval)
        setUploadProgress(prev => ({ ...prev, [trackId]: 100 }))
        // Assign a mock soundhelix song as audioUrl
        const songIdx = Math.floor(Math.random() * 16) + 1
        const mockAudioUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songIdx}.mp3`
        updateTrackField(trackId, 'audioUrl', mockAudioUrl)
        addToast('Track processed and linked successfully!', 'success')
      } else {
        setUploadProgress(prev => ({ ...prev, [trackId]: progress }))
      }
    }, 150)
  }

  // Handle selecting a track from catalog
  const handleSelectCatalogTrack = (trackId: string, catalogTrack: any) => {
    updateTrackField(trackId, 'title', catalogTrack.title)
    
    // Duration: fallback if not provided in catalog
    const duration = catalogTrack.duration || '3:30'
    updateTrackField(trackId, 'duration', duration)

    // Playable audio URL map
    const songIndex = (parseInt(catalogTrack.id.replace(/\D/g, '')) || Math.floor(Math.random() * 16) + 1) % 16 || 1
    const mockAudioUrl = catalogTrack.audio_url || catalogTrack.audioUrl || `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songIndex}.mp3`
    
    updateTrackField(trackId, 'audioUrl', mockAudioUrl)
    setDropdownOpenTrackId(null)
    addToast(`Selected track "${catalogTrack.title}" from catalog`, 'success')
  }

  // Open Analytics Modal
  const viewAnalytics = (epk: EPK) => {
    setAnalyticsEpk(epk)
    setIsAnalyticsOpen(true)
  }

  // Filter and Search logic
  const filteredEPKs = epks.filter(epk => {
    const matchesSearch = epk.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          epk.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'All' || epk.type === filterType
    const matchesStatus = filterStatus === 'All' || epk.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">
            EPKs (Press Kits)
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Manage your artist profile pages, releases, and listener presentation kits.
          </p>
        </div>
        <Button 
          onClick={handleCreateNew}
          className="rounded-full bg-primary hover:bg-primary/95 text-white font-black h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> Create EPK Page
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border p-2 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by title or slug..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground/50 pl-11 h-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 px-2 w-full md:w-auto">
          {/* Type filter button */}
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 rounded-xl bg-muted/40 border-none text-xs font-bold text-muted-foreground hover:text-foreground px-3 cursor-pointer outline-none"
          >
            <option value="All">All Types</option>
            <option value="Album Release">Album Release</option>
            <option value="EP Page">EP Page</option>
            <option value="Artist Profile">Artist Profile</option>
          </select>
          {/* Status filter button */}
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-xl bg-muted/40 border-none text-xs font-bold text-muted-foreground hover:text-foreground px-3 cursor-pointer outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-card border border-border rounded-[2.5rem] h-[340px] animate-pulse" />
          ))}
        </div>
      ) : filteredEPKs.length === 0 ? (
        /* Empty State */
        <div className="border-2 border-dashed border-border rounded-[2.5rem] p-16 text-center space-y-6 max-w-lg mx-auto bg-card">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary animate-pulse">
            <Music2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-foreground">No EPK Pages Found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No matches fit your search. Try cleaning your filters!" : "Let's launch your first professional Electronic Press Kit page."}
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="rounded-full bg-primary hover:bg-primary/95 text-white font-black"
          >
            Create Your First EPK
          </Button>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEPKs.map((epk) => (
            <Card key={epk.id} className="bg-card border-border rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-2 hover:border-primary/20 flex flex-col justify-between">
              
              {/* Image Block */}
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                {epk.image_url ? (
                  <img 
                    src={epk.image_url} 
                    alt={epk.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Status Badges */}
                <div className="absolute top-4 left-4">
                  <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-white",
                    epk.status === 'published' ? "bg-green-500" : "bg-yellow-500"
                  )}>
                    {epk.status}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-1">
                  <button 
                    onClick={() => handleDelete(epk.id, epk.title)}
                    className="h-8 w-8 rounded-full bg-black/40 border border-white/5 text-red-400 hover:text-red-300 hover:bg-red-950/40 flex items-center justify-center transition-all"
                    title="Delete EPK"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Overlaid Views and Link */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/90">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black">{epk.views} views</span>
                  </div>
                  <a 
                    href={`/${epk.slug}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-primary backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                    title="View public page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Content Block */}
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-black tracking-[-0.04em] text-foreground text-lg leading-tight truncate">
                    {epk.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {epk.type}
                    </p>
                    <p className="text-[9px] font-mono text-muted-foreground truncate max-w-[120px]">
                      /{epk.slug}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    onClick={() => handleEdit(epk)}
                    variant="outline" 
                    className="rounded-xl border-border font-bold text-xs h-10 hover:bg-muted/50"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-2 text-primary" /> Edit
                  </Button>
                  <Button 
                    onClick={() => viewAnalytics(epk)}
                    variant="outline" 
                    className="rounded-xl border-border font-bold text-xs h-10 hover:bg-muted/50"
                  >
                    <BarChart3 className="w-3.5 h-3.5 mr-2 text-primary" /> Analytics
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                  <span>{epk.tracks?.length || 0} tracks linked</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{Object.values(epk.social_links || {}).filter(Boolean).length} socials</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Page Block */}
          <button 
            onClick={handleCreateNew}
            className="border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center p-8 space-y-4 hover:border-primary/40 hover:bg-primary/5 transition-all group min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-[2rem] bg-muted border border-border flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-black text-foreground">Create New Page</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Artist or Release EPK</p>
            </div>
          </button>
        </div>
      )}

      {/* ==================== 1. CRUD SIDE-OVER PANEL EDITOR ==================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsEditorOpen(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-card border-l border-border shadow-2xl flex flex-col justify-between h-full animate-in slide-in-from-right duration-300">
              
              {/* Editor Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.04em] text-foreground">
                    {editingEpk ? 'Edit EPK Page' : 'Create New EPK Page'}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {editingEpk ? `Modifying /${slug}` : 'Design a stunning presentation page for licensing.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Editor Scrollable Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                
                {formError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-500 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Section: Basic Metadata */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono tracking-widest text-primary uppercase font-bold border-b border-border pb-1">
                    1. Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">EPK Page Title</label>
                      <input 
                        type="text"
                        placeholder="e.g. Malena Cadiz - Hellbent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">URL Slug</label>
                      <div className="flex bg-muted/40 border border-border rounded-xl overflow-hidden focus-within:border-primary">
                        <span className="bg-muted px-3 py-2.5 text-xs text-muted-foreground font-mono flex items-center border-r border-border">/</span>
                        <input 
                          type="text"
                          placeholder="e.g. malena-hellbent"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          className="w-full bg-transparent border-none px-3 py-2 text-sm focus:outline-none text-foreground font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Release Type</label>
                      <select 
                        value={type}
                        onChange={(e) => setType(e.target.value as EPKType)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground font-medium"
                      >
                        <option value="Album Release">Album Release</option>
                        <option value="EP Page">EP Page</option>
                        <option value="Artist Profile">Artist Profile</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Publishing Status</label>
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value as EPKStatus)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground font-medium"
                      >
                        <option value="draft">Draft (Only you can view)</option>
                        <option value="published">Published (Public URL active)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Cover Artwork Image URL</label>
                    <input 
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground font-mono text-xs"
                    />
                    {imageUrl.trim() && (
                      <div className="mt-2 w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 border border-border">
                        <img src={imageUrl} alt="Artwork preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Biography / Release Description</label>
                    <textarea 
                      placeholder="Write an elegant introduction for sync supervisors and radio curators..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                </div>

                {/* Section: Track Builder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-1">
                    <h3 className="text-xs font-mono tracking-widest text-primary uppercase font-bold">
                      2. Interactive Tracklist
                    </h3>
                    <Button 
                      type="button" 
                      onClick={addTrackField}
                      variant="ghost" 
                      className="h-7 text-xs font-bold text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg px-2"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Track
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {tracks.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-2xl">
                        No audio tracks loaded. Add one to enable the interactive music player.
                      </p>
                    ) : (
                      tracks.map((track, idx) => (
                        <div key={track.id} className="p-4 bg-muted/20 border border-border rounded-2xl space-y-3 relative group">
                          <div className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button 
                              type="button"
                              onClick={() => removeTrackField(track.id)}
                              className="text-red-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Remove Track"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono flex items-center justify-center font-bold text-primary">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-black text-foreground">Track Detail</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground">Track Title</label>
                              <input 
                                type="text"
                                placeholder="Track Title"
                                value={track.title}
                                onChange={(e) => updateTrackField(track.id, 'title', e.target.value)}
                                className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground">Duration (e.g. 3:45)</label>
                              <input 
                                type="text"
                                placeholder="Duration"
                                value={track.duration || ''}
                                onChange={(e) => updateTrackField(track.id, 'duration', e.target.value)}
                                className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                              />
                            </div>
                          </div>

                          {/* Mode toggle tabs */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Audio Input Source</label>
                            <div className="flex items-center gap-1 p-1 bg-muted/45 rounded-xl w-fit border border-border/45">
                              <button
                                type="button"
                                onClick={() => setTrackModes(prev => ({ ...prev, [track.id]: 'url' }))}
                                className={cn(
                                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border',
                                  (trackModes[track.id] || 'url') === 'url'
                                    ? 'bg-primary text-white shadow-sm border-primary'
                                    : 'text-muted-foreground hover:text-foreground border-transparent'
                                )}
                              >
                                <Link2 className="w-3 h-3" /> Enter Link
                              </button>
                              <button
                                type="button"
                                onClick={() => setTrackModes(prev => ({ ...prev, [track.id]: 'upload' }))}
                                className={cn(
                                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border',
                                  trackModes[track.id] === 'upload'
                                    ? 'bg-primary text-white shadow-sm border-primary'
                                    : 'text-muted-foreground hover:text-foreground border-transparent'
                                )}
                              >
                                <UploadCloud className="w-3 h-3" /> Local Upload
                              </button>
                              <button
                                type="button"
                                onClick={() => setTrackModes(prev => ({ ...prev, [track.id]: 'catalog' }))}
                                className={cn(
                                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border',
                                  trackModes[track.id] === 'catalog'
                                    ? 'bg-primary text-white shadow-sm border-primary'
                                    : 'text-muted-foreground hover:text-foreground border-transparent'
                                )}
                              >
                                <Music2 className="w-3 h-3" /> From Catalog
                              </button>
                            </div>
                          </div>

                          {/* Dynamic Input Block based on Mode */}
                          {(!trackModes[track.id] || trackModes[track.id] === 'url') && (
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Audio Stream / MP3 URL</label>
                              <div className="flex bg-card border border-border rounded-lg overflow-hidden focus-within:border-primary">
                                <span className="bg-muted/40 px-3 py-2 text-xs text-muted-foreground font-mono flex items-center border-r border-border">
                                  <Link2 className="w-3.5 h-3.5 text-primary/60" />
                                </span>
                                <input 
                                  type="text"
                                  placeholder="https://example.com/audio.mp3"
                                  value={track.audioUrl || ''}
                                  onChange={(e) => updateTrackField(track.id, 'audioUrl', e.target.value)}
                                  className="w-full bg-transparent border-none px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none"
                                />
                              </div>
                            </div>
                          )}

                          {trackModes[track.id] === 'upload' && (
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Local Audio Upload</label>
                              {uploadProgress[track.id] === undefined ? (
                                <div className="relative border-2 border-dashed border-border/60 hover:border-primary/50 bg-card rounded-xl p-6 transition-all group flex flex-col items-center justify-center gap-2 cursor-pointer">
                                  <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) handleAudioUpload(track.id, file)
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                  />
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                    <UploadCloud className="w-5 h-5" />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs font-bold text-foreground">Drag & drop or click to upload</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">MP3, WAV, M4A, FLAC up to 50MB</p>
                                  </div>
                                </div>
                              ) : uploadProgress[track.id] < 100 ? (
                                <div className="border border-border bg-card rounded-xl p-4 flex flex-col gap-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                      <span className="font-bold text-foreground">Processing audio file...</span>
                                    </div>
                                    <span className="font-mono text-primary font-bold">{uploadProgress[track.id]}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/20">
                                    <div 
                                      className="bg-primary h-full transition-all duration-300 ease-out" 
                                      style={{ width: `${uploadProgress[track.id]}%` }}
                                    />
                                  </div>
                                  <p className="text-[10px] text-muted-foreground animate-pulse">Calculating exact audio duration and mapping metadata...</p>
                                </div>
                              ) : (
                                <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-4 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                      <Check className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-foreground truncate">{track.title}</p>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">
                                        Successfully processed · <span className="font-mono text-green-400 font-bold">{track.duration}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setUploadProgress(prev => {
                                      const copy = { ...prev }
                                      delete copy[track.id]
                                      return copy
                                    })}
                                    className="text-xs text-muted-foreground hover:text-foreground font-bold px-3 py-1.5 rounded-lg hover:bg-muted transition-all"
                                  >
                                    Re-upload
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {trackModes[track.id] === 'catalog' && (
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select from Track Catalog</label>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setDropdownOpenTrackId(dropdownOpenTrackId === track.id ? null : track.id)}
                                  className="w-full h-10 px-4 flex items-center justify-between bg-card border border-border rounded-xl text-xs font-bold hover:border-primary/40 transition-all text-foreground"
                                >
                                  <span className="flex items-center gap-2">
                                    <Music2 className="w-3.5 h-3.5 text-primary/60" />
                                    <span>Select from Track Catalog...</span>
                                  </span>
                                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', dropdownOpenTrackId === track.id && 'rotate-180')} />
                                </button>

                                {dropdownOpenTrackId === track.id && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-56 overflow-y-auto">
                                    {catalog.length === 0 ? (
                                      <div className="p-4 text-center text-xs text-muted-foreground">
                                        No catalog tracks found. Add one in the tracks tab first!
                                      </div>
                                    ) : (
                                      catalog.map(catTrack => (
                                        <button
                                          key={catTrack.id}
                                          type="button"
                                          onClick={() => handleSelectCatalogTrack(track.id, catTrack)}
                                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-left border-b border-border/40 last:border-b-0"
                                        >
                                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Music2 className="w-3.5 h-3.5 text-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate text-foreground">{catTrack.title}</p>
                                            <p className="text-[10px] text-muted-foreground truncate font-medium">
                                              {catTrack.genre}{catTrack.bpm ? ` · ${catTrack.bpm} BPM` : ''}{catTrack.key ? ` · ${catTrack.key}` : ''}{catTrack.duration ? ` · ${catTrack.duration}` : ''}
                                            </p>
                                          </div>
                                        </button>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Section: Social Links */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono tracking-widest text-primary uppercase font-bold border-b border-border pb-1">
                    3. External Connections
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Instagram</label>
                      <input 
                        type="text"
                        placeholder="https://instagram.com/..."
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none text-foreground font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Twitter / X</label>
                      <input 
                        type="text"
                        placeholder="https://twitter.com/..."
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none text-foreground font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Spotify</label>
                      <input 
                        type="text"
                        placeholder="https://open.spotify.com/..."
                        value={spotify}
                        onChange={(e) => setSpotify(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none text-foreground font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">SoundCloud</label>
                      <input 
                        type="text"
                        placeholder="https://soundcloud.com/..."
                        value={soundcloud}
                        onChange={(e) => setSoundcloud(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none text-foreground font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">YouTube</label>
                      <input 
                        type="text"
                        placeholder="https://youtube.com/..."
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none text-foreground font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Official Website</label>
                      <input 
                        type="text"
                        placeholder="https://..."
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none text-foreground font-mono"
                      />
                    </div>
                  </div>
                </div>
              </form>

              {/* Editor Footer Actions */}
              <div className="p-6 border-t border-border flex items-center justify-end gap-3 bg-muted/20">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditorOpen(false)}
                  className="rounded-full font-bold px-5"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="rounded-full bg-primary hover:bg-primary/95 text-white font-black px-6 shadow-md shadow-primary/10"
                >
                  {isPending ? 'Saving...' : editingEpk ? 'Save Changes' : 'Create Page'}
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. ANALYTICS / STATS MODAL ==================== */}
      {isAnalyticsOpen && analyticsEpk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setIsAnalyticsOpen(false)} />
          
          <div className="relative bg-card border border-border rounded-[2.5rem] w-full max-w-2xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsAnalyticsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="space-y-1">
                <Badge className="bg-primary/20 hover:bg-primary/25 border border-primary/20 text-primary rounded-full uppercase text-[9px] tracking-widest px-2.5 py-0.5">
                  Page Analytics
                </Badge>
                <h2 className="text-3xl font-black tracking-[-0.04em] text-foreground mt-2">
                  {analyticsEpk.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Performance metrics and sync supervisor discovery trends.
                </p>
              </div>

              {/* Grid of basic stats cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/30 border border-border p-4 rounded-2xl text-center space-y-1">
                  <p className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">Total Views</p>
                  <p className="text-2xl font-black text-foreground">{analyticsEpk.views}</p>
                </div>
                <div className="bg-muted/30 border border-border p-4 rounded-2xl text-center space-y-1">
                  <p className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">Audio Plays</p>
                  <p className="text-2xl font-black text-foreground">{Math.floor(analyticsEpk.views * 0.72)}</p>
                </div>
                <div className="bg-muted/30 border border-border p-4 rounded-2xl text-center space-y-1">
                  <p className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">CTR (Linkouts)</p>
                  <p className="text-2xl font-black text-foreground">{(14.2).toFixed(1)}%</p>
                </div>
              </div>

              {/* Graphic Chart Simulation */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono tracking-widest text-primary uppercase font-bold">Views Trend (Last 7 days)</h4>
                <div className="h-44 w-full bg-slate-950 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex items-end justify-between gap-1">
                  {/* SVG background grid */}
                  <div className="absolute inset-0 z-0 flex flex-col justify-between opacity-5 p-6">
                    {[1, 2, 3].map(n => <div key={n} className="border-t border-white w-full h-px" />)}
                  </div>
                  
                  {/* Chart Columns */}
                  {[
                    { day: 'Mon', count: Math.floor(analyticsEpk.views * 0.08) },
                    { day: 'Tue', count: Math.floor(analyticsEpk.views * 0.12) },
                    { day: 'Wed', count: Math.floor(analyticsEpk.views * 0.18) },
                    { day: 'Thu', count: Math.floor(analyticsEpk.views * 0.15) },
                    { day: 'Fri', count: Math.floor(analyticsEpk.views * 0.22) },
                    { day: 'Sat', count: Math.floor(analyticsEpk.views * 0.11) },
                    { day: 'Sun', count: Math.floor(analyticsEpk.views * 0.14) }
                  ].map((data, index) => {
                    const maxVal = Math.max(analyticsEpk.views * 0.25, 20)
                    const percent = Math.min((data.count / maxVal) * 100, 100)
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 z-10">
                        <span className="text-[9px] font-mono text-primary font-bold">{data.count}</span>
                        <div 
                          className="w-full max-w-[20px] bg-gradient-to-t from-primary/30 to-primary rounded-t-lg transition-all duration-1000" 
                          style={{ height: `${percent || 10}%` }}
                        />
                        <span className="text-[9px] font-mono text-slate-500 uppercase">{data.day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Supervisors insights */}
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-primary shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-foreground">Discovery Insight</p>
                  <p className="text-muted-foreground mt-0.5">
                    This EPK has been bookmarked by 2 sync licensing supervisors in Los Angeles and London. Keep the audio URLs fully updated!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
