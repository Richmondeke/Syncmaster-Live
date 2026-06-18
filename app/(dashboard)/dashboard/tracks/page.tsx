'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { 
  Music2, 
  Plus as PlusIcon, 
  Search, 
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  ChevronRight,
  ChevronDown,
  Layers,
  Share2,
  Trash2,
  Edit3,
  Check,
  X,
  ListPlus,
  ArrowRight,
  GripVertical,
  Download,
  Upload,
  Loader2
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster, type Toast, type ToastType } from '@/components/ui/toast'

// Modals
import { UploadModal } from '@/components/tracks/UploadModal'
import { TrackMetadataModal } from '@/components/tracks/TrackMetadataModal'
import { PlaylistSaveModal } from '@/components/tracks/PlaylistSaveModal'
import { SharePlaylistModal } from '@/components/tracks/SharePlaylistModal'

import { getTracks, createTrack, updateTrack, deleteTrack, deleteTracks, type TrackData } from '@/app/actions/tracks'
import { useMusicPlayer, type PlayerTrack } from '@/contexts/MusicPlayerContext'

export default function TracksPage() {
  const [tracks, setTracks] = useState<any[]>([])
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [isPlaylistPanelOpen, setIsPlaylistPanelOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [playlistTracks, setPlaylistTracks] = useState<any[]>([])
  const [playlistName, setPlaylistName] = useState('')
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const { playTrack, currentTrack: playerTrack, isPlaying } = useMusicPlayer()

  // Playlist direct-add state variables
  const [playlistAddMode, setPlaylistAddMode] = useState<'none' | 'catalog' | 'upload'>('none')
  const [playlistCatalogSearch, setPlaylistCatalogSearch] = useState('')
  const [playlistCatalogDropdownOpen, setPlaylistCatalogDropdownOpen] = useState(false)
  const [playlistUploadProgress, setPlaylistUploadProgress] = useState(0)
  const [isPlaylistUploading, setIsPlaylistUploading] = useState(false)

  // Load from Supabase on mount
  useEffect(() => {
    setIsLoading(true)
    getTracks().then(data => { if (Array.isArray(data)) setTracks(data) }).finally(() => setIsLoading(false))
    const savedPlaylist = localStorage.getItem('syncmaster_playlist')
    const savedPlaylistName = localStorage.getItem('syncmaster_playlist_name')
    if (savedPlaylist) setPlaylistTracks(JSON.parse(savedPlaylist))
    if (savedPlaylistName) setPlaylistName(savedPlaylistName)
  }, [])

  // Filter tracks based on search query
  const filteredTracks = tracks.filter(track => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (track.title || '').toLowerCase().includes(q) ||
      (track.genre || '').toLowerCase().includes(q) ||
      (track.bpm || '').toString().includes(q) ||
      (track.key || '').toLowerCase().includes(q)
    )
  })

  useEffect(() => { localStorage.setItem('syncmaster_playlist', JSON.stringify(playlistTracks)) }, [playlistTracks])
  useEffect(() => { localStorage.setItem('syncmaster_playlist_name', playlistName) }, [playlistName])

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const toggleTrackSelection = (id: string) => {
    setSelectedTracks(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const addToPlaylist = (track: any) => {
    if (!playlistTracks.find(t => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track])
      setIsPlaylistPanelOpen(true)
    }
  }

  const removeFromPlaylist = (id: string) => {
    setPlaylistTracks(prev => prev.filter(t => t.id !== id))
  }

  const handleDeleteTrack = async (id: string) => {
    const track = tracks.find(t => t.id === id)
    await deleteTrack(id)
    setTracks(prev => prev.filter(t => t.id !== id))
    setSelectedTracks(prev => prev.filter(t => t !== id))
    setPlaylistTracks(prev => prev.filter(t => t.id !== id))
    showToast(`Deleted track: ${track?.title || 'Unknown'}`, 'info')
  }

  const handleEditTrack = (track: any) => {
    setCurrentTrack(track)
    setActiveModal('metadata')
  }

  const handleBulkDelete = async () => {
    await deleteTracks(selectedTracks)
    setTracks(prev => prev.filter(t => !selectedTracks.includes(t.id)))
    setSelectedTracks([])
  }

  const handleBulkAddToPlaylist = () => {
    const selected = tracks.filter(t => selectedTracks.includes(t.id))
    const newTracks = selected.filter(st => !playlistTracks.find(pt => pt.id === st.id))
    if (newTracks.length > 0) {
      setPlaylistTracks([...playlistTracks, ...newTracks])
      showToast(`Added ${newTracks.length} tracks to playlist`)
    } else {
      showToast('Selected tracks are already in playlist', 'info')
    }
    setIsPlaylistPanelOpen(true)
    setSelectedTracks([])
  }

  const handleBulkShare = () => {
    setActiveModal('share')
  }

  const handleBulkEdit = () => {
    if (selectedTracks.length > 0) {
      const firstTrack = tracks.find(t => t.id === selectedTracks[0])
      setCurrentTrack(firstTrack)
      setActiveModal('metadata')
    }
  }

  const handleBulkDownload = () => {
    showToast(`Preparing ZIP for ${selectedTracks.length} tracks...`, 'info')
    setTimeout(() => {
      showToast(`Download started: SyncMaster_Export_${new Date().getTime()}.zip`)
    }, 1500)
  }

  const handleMerge = () => {
    const selected = tracks.filter(t => selectedTracks.includes(t.id))
    if (selected.length < 2) {
      showToast('Select at least 2 tracks to merge', 'error')
      return
    }

    const newTrack = {
      id: `tr_merge_${Date.now()}`,
      title: `Merge: ${selected.map(t => t.title).join(' + ')}`,
      genre: selected[0].genre,
      duration: selected[0].duration,
      bpm: selected[0].bpm,
      key: selected[0].key,
      plays: '0',
      versions: []
    }

    setTracks([newTrack, ...tracks])
    setSelectedTracks([])
    showToast('Created new composite track from merge')
  }

  const handlePlayTrack = (track: any) => {
    if (!track.audio_url) {
      showToast('No audio URL for this track', 'error')
      return
    }
    const playerTracks: PlayerTrack[] = tracks
      .filter(t => t.audio_url)
      .map(t => ({ id: t.id, title: t.title, audio_url: t.audio_url, genre: t.genre }))
    playTrack(
      { id: track.id, title: track.title, audio_url: track.audio_url, genre: track.genre },
      playerTracks
    )
    setPlayingTrackId(track.id)
  }

  const handleSaveTrack = async (updatedTrack: any) => {
    const { id, created_at, updated_at, ...rest } = updatedTrack
    await updateTrack(id, rest)
    setTracks(prev => prev.map(t => t.id === id ? updatedTrack : t))
    showToast(`Updated metadata for: ${updatedTrack.title}`)
  }

  const handleAddTrack = async (newTrack: any) => {
    const created = await createTrack({ ...newTrack, plays: 0, versions: [] } as Omit<TrackData, 'id'>)
    if (created) setTracks(prev => [created, ...prev])
  }

  const handlePlaylistSelectCatalogTrack = (track: any) => {
    if (playlistTracks.some(t => t.id === track.id)) {
      showToast('This track is already in the playlist', 'info')
      return
    }
    setPlaylistTracks(prev => [...prev, track])
    setPlaylistCatalogSearch('')
    setPlaylistCatalogDropdownOpen(false)
    showToast(`Added track: ${track.title}`)
  }

  const handlePlaylistAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const titleWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.')) || file.name

    // Get duration from the file
    const audioUrl = URL.createObjectURL(file)
    const audio = new Audio(audioUrl)
    
    let duration = '3:00'
    await new Promise<void>((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        const totalSeconds = Math.round(audio.duration)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        resolve()
      })
      audio.addEventListener('error', () => resolve())
      setTimeout(() => resolve(), 3000) // fallback timeout
    })

    setIsPlaylistUploading(true)
    setPlaylistUploadProgress(0)

    try {
      // Upload to Supabase Storage
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const fileName = `playlist_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      
      setPlaylistUploadProgress(20)
      
      const { error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(fileName, file)

      if (uploadError) {
        showToast(`Upload failed: ${uploadError.message}`, 'error')
        setIsPlaylistUploading(false)
        setPlaylistUploadProgress(0)
        return
      }

      setPlaylistUploadProgress(70)

      const { data: urlData } = supabase.storage
        .from('tracks')
        .getPublicUrl(fileName)

      const realAudioUrl = urlData?.publicUrl || audioUrl

      setPlaylistUploadProgress(90)

      const newTrackData = {
        title: titleWithoutExtension,
        genre: 'Uploaded',
        duration: duration,
        bpm: '120',
        key: 'Cmin',
        audio_url: realAudioUrl,
        plays: 0,
        versions: []
      }
      
      const createdTrack = await createTrack(newTrackData as Omit<TrackData, 'id'>)
      
      setPlaylistUploadProgress(100)

      if (createdTrack) {
        setTracks(prev => [createdTrack, ...prev])
        setPlaylistTracks(prev => [...prev, createdTrack])
        showToast(`Successfully uploaded "${titleWithoutExtension}" and added to playlist!`)
      } else {
        const localTrack = { id: `tr_uploaded_${Date.now()}`, ...newTrackData }
        setTracks(prev => [localTrack, ...prev])
        setPlaylistTracks(prev => [...prev, localTrack])
        showToast(`Uploaded "${titleWithoutExtension}" (saved locally - check connection)`)
      }
    } catch (err: any) {
      showToast(`Upload error: ${err.message}`, 'error')
    } finally {
      setIsPlaylistUploading(false)
      setPlaylistUploadProgress(0)
      setPlaylistAddMode('none')
    }
  }

  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Section */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Music Catalog</h1>
              <p className="label text-muted-foreground uppercase">Manage your tracks and versions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="rounded-md h-12 px-6 font-bold text-xs uppercase tracking-widest border-2 border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
                onClick={() => setIsPlaylistPanelOpen(!isPlaylistPanelOpen)}
              >
                <ListPlus className="w-5 h-5 mr-2 text-primary" /> Playlist Creator
              </Button>
              <Button 
                className="rounded-md h-12 px-8 font-bold text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                onClick={() => setActiveModal('upload')}
              >
                <PlusIcon className="w-5 h-5 mr-2" /> Upload
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search catalog by title, genre, bpm..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-card border-2 border-border/50 rounded-md font-bold text-sm text-foreground focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
              />
            </div>
            <Button variant="outline" className="h-14 px-6 rounded-md border-2 border-border/50 font-bold text-xs uppercase tracking-widest hover:bg-muted/50 transition-all">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </Button>
          </div>

          {/* Selection Bar */}
          <div className={cn(
            "flex items-center justify-between p-4 bg-primary rounded-md mb-6 transition-all duration-300",
            selectedTracks.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none h-0 p-0 mb-0"
          )}>
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/20 p-2 rounded-xl">
                <Music2 className="w-5 h-5" />
              </div>
              <p className="font-black tracking-tight text-lg">{selectedTracks.length} tracks selected</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                className="rounded-md h-10 px-6 font-bold text-xs uppercase tracking-widest text-primary hover:bg-white shadow-lg"
                onClick={handleBulkEdit}
              >
                Bulk Edit
              </Button>
              <Button 
                variant="secondary" 
                className="rounded-md h-10 px-6 font-bold text-xs uppercase tracking-widest text-primary hover:bg-white shadow-lg"
                onClick={handleBulkAddToPlaylist}
              >
                Add to Playlist
              </Button>
              <Button 
                variant="secondary" 
                className="rounded-md h-10 px-6 font-bold text-xs uppercase tracking-widest text-primary hover:bg-white shadow-lg"
                onClick={handleBulkDownload}
              >
                Download
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-md" onClick={() => setSelectedTracks([])}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tracks List with Nesting */}
        <div className="grid gap-4 px-8 pb-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-bold text-muted-foreground">Loading your catalog...</p>
            </div>
          ) : filteredTracks.length === 0 && tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6 rounded-[2rem] border-2 border-dashed border-border/40 bg-muted/10">
              <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center shadow-lg">
                <Music2 className="w-12 h-12 text-primary/60" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-black tracking-[-0.04em] text-foreground">Your catalog is empty</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Upload your first track to start building your catalog. Supported formats: WAV, MP3, FLAC, AIFF.</p>
              </div>
              <Button className="rounded-full px-8 h-12 font-black" onClick={() => setActiveModal('upload')}>
                <PlusIcon className="w-5 h-5 mr-2" /> Upload Your First Track
              </Button>
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <Search className="w-10 h-10 text-muted-foreground/40" />
              <div className="space-y-1">
                <p className="font-bold text-foreground/70">No tracks match "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground">Try a different search term or clear the filter.</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSearchQuery('')}>Clear search</Button>
            </div>
          ) : filteredTracks.map((track) => (
            <div key={track.id} className="relative group">
              <Card className={cn(
                "bg-card border-2 rounded-md transition-all overflow-hidden",
                selectedTracks.includes(track.id) 
                  ? "border-primary shadow-xl shadow-primary/10 ring-4 ring-primary/5" 
                  : "border-border hover:border-primary/30 shadow-sm"
              )}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Checkbox 
                      checked={selectedTracks.includes(track.id)}
                      onCheckedChange={() => toggleTrackSelection(track.id)}
                      className="w-5 h-5 rounded-lg border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <button 
                      className={cn(
                        "w-12 h-12 rounded-md flex items-center justify-center transition-all shadow-sm",
                        playingTrackId === track.id 
                          ? "bg-primary text-white scale-110" 
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      )}
                      onClick={() => handlePlayTrack(track)}
                    >
                      {playingTrackId === track.id ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-bold tracking-tight text-foreground truncate">{track.title}</h4>
                      {track.versions.length > 0 && (
                        <span className="bg-acid-lime text-black px-2 py-0.5 rounded-full label uppercase">
                          {track.versions.length} versions
                        </span>
                      )}
                    </div>
                    <p className="label text-primary/60 uppercase">{track.genre}</p>
                  </div>

                  <div className="hidden lg:flex items-center gap-12 px-8 border-x border-border/30 mx-4">
                    <div className="text-center min-w-[60px]">
                      <p className="label text-muted-foreground/60 uppercase mb-1">Duration</p>
                      <p className="text-sm font-bold text-foreground">{track.duration}</p>
                    </div>
                    <div className="text-center min-w-[40px]">
                      <p className="label text-muted-foreground/60 uppercase mb-1">BPM</p>
                      <p className="text-sm font-bold text-foreground">{track.bpm}</p>
                    </div>
                    <div className="text-center min-w-[40px]">
                      <p className="label text-muted-foreground/60 uppercase mb-1">Key</p>
                      <p className="text-sm font-bold text-foreground">{track.key}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full text-muted-foreground/40 hover:text-primary hover:bg-primary/5"
                      onClick={() => addToPlaylist(track)}
                    >
                      <ListPlus className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full text-muted-foreground/40 hover:text-[#1a1a2e] hover:bg-muted"
                      onClick={() => handleEditTrack(track)}
                    >
                      <Edit3 className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full text-muted-foreground/40 hover:text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteTrack(track.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>

                {/* Nested Versions Accordion */}
                {track.versions.length > 0 && (
                  <Accordion type="single" className="w-full border-t border-border/50">
                    <AccordionItem value="versions" className="border-none">
                      <AccordionTrigger className="px-6 py-2.5 hover:no-underline label uppercase text-muted-foreground/40 hover:text-primary transition-all bg-muted/30">
                        View Versions & Stems
                      </AccordionTrigger>
                      <AccordionContent className="bg-card p-0">
                        {track.versions.map((version: any) => (
                          <div key={version.id} className="flex items-center gap-4 px-14 py-4 border-t border-border/30 hover:bg-primary/5 transition-all group/version">
                            <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground/40 group-hover/version:bg-primary group-hover/version:text-white transition-all">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground truncate">{version.title}</p>
                              <p className="label uppercase text-muted-foreground/60">{version.type}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="mono text-xs text-muted-foreground/40">3:45</span>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground/30 hover:text-primary hover:bg-primary/5">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground/30 hover:text-foreground hover:bg-muted">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side Panel: Playlist Creator */}
      {isPlaylistPanelOpen && (
        <div className="w-[350px] bg-card border border-border rounded-md flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-[-0.04em] text-foreground">Playlist Creator</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={() => setIsPlaylistPanelOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-2">
              <label className="label uppercase text-muted-foreground ml-1">Playlist Name</label>
              <input 
                type="text" 
                placeholder="Enter title..." 
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-md px-4 h-11 text-sm font-bold focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            {/* Direct track add options */}
            <div className="border border-border/60 bg-muted/20 rounded-md p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add Tracks</span>
                <div className="flex items-center gap-1">
                  <button 
                    type="button"
                    onClick={() => setPlaylistAddMode(playlistAddMode === 'catalog' ? 'none' : 'catalog')}
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-md transition-all border border-border/30",
                      playlistAddMode === 'catalog' 
                        ? "bg-primary text-white border-primary" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Catalog
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPlaylistAddMode(playlistAddMode === 'upload' ? 'none' : 'upload')}
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-md transition-all border border-border/30",
                      playlistAddMode === 'upload' 
                        ? "bg-primary text-white border-primary" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {playlistAddMode === 'catalog' && (
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search catalog by title..." 
                    value={playlistCatalogSearch}
                    onChange={(e) => {
                      setPlaylistCatalogSearch(e.target.value)
                      setPlaylistCatalogDropdownOpen(true)
                    }}
                    onFocus={() => setPlaylistCatalogDropdownOpen(true)}
                    className="w-full bg-background border border-border rounded-md pl-9 pr-8 h-10 text-xs font-bold focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                  />
                  {playlistCatalogSearch && (
                    <button 
                      type="button"
                      onClick={() => { setPlaylistCatalogSearch(''); setPlaylistCatalogDropdownOpen(false); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Dropdown for search results */}
                  {playlistCatalogDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-2xl z-50 max-h-48 overflow-y-auto animate-in fade-in duration-200">
                      {tracks
                        .filter(track => 
                          !playlistTracks.some(pt => pt.id === track.id) &&
                          (track.title.toLowerCase().includes(playlistCatalogSearch.toLowerCase()) ||
                           track.genre.toLowerCase().includes(playlistCatalogSearch.toLowerCase()))
                        )
                        .map(track => (
                          <button
                            key={track.id}
                            type="button"
                            onClick={() => handlePlaylistSelectCatalogTrack(track)}
                            className="w-full text-left px-3 py-2.5 text-xs font-bold hover:bg-primary/5 border-b border-border/50 last:border-0 flex items-center justify-between transition-colors"
                          >
                            <span className="truncate pr-2">{track.title}</span>
                            <span className="text-[9px] uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0 font-extrabold">{track.genre}</span>
                          </button>
                        ))}
                      {tracks.filter(track => 
                        !playlistTracks.some(pt => pt.id === track.id) &&
                        (track.title.toLowerCase().includes(playlistCatalogSearch.toLowerCase()) ||
                         track.genre.toLowerCase().includes(playlistCatalogSearch.toLowerCase()))
                      ).length === 0 && (
                        <div className="p-3.5 text-center text-xs text-muted-foreground">
                          No matching catalog tracks
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {playlistAddMode === 'upload' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="relative border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-md p-4 text-center transition-all bg-background hover:bg-primary/[0.01] cursor-pointer">
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={handlePlaylistAudioUpload}
                      disabled={isPlaylistUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <Upload className="w-5 h-5 mx-auto text-primary/40 mb-1.5" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Upload Song File</p>
                    <p className="text-[8px] text-muted-foreground/60">MP3, WAV, M4A up to 20MB</p>
                  </div>
                  {isPlaylistUploading && (
                    <div className="space-y-1.5 p-1">
                      <div className="flex items-center justify-between text-[8px] font-black uppercase text-primary">
                        <span className="flex items-center gap-1">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" /> Uploading & Parsing...
                        </span>
                        <span>{playlistUploadProgress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                        <div className="bg-primary h-1 rounded-full transition-all duration-300" style={{ width: `${playlistUploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-3">
              {playlistTracks.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-md bg-muted border border-border flex items-center justify-center rotate-3 opacity-40">
                    <ListPlus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="label text-muted-foreground max-w-[150px]">Drag tracks here or click <ListPlus className="inline w-3 h-3" /> to add.</p>
                </div>
              ) : (
                playlistTracks.map((track, index) => (
                  <div key={track.id} className="bg-muted/30 border border-border rounded-md p-3 flex items-center gap-3 group/item transition-all hover:bg-muted/50">
                    <div className="text-muted-foreground/30 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{track.title}</p>
                      <p className="label uppercase text-muted-foreground">{track.genre}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-md text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      onClick={() => removeFromPlaylist(track.id)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-6 bg-muted/20 border-t border-border space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Tracks</span>
              <span className="text-sm font-black text-foreground">{playlistTracks.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="rounded-md font-bold text-xs border-border bg-card shadow-sm h-11"
                onClick={() => setActiveModal('playlist-save')}
              >
                Save
              </Button>
              <Button 
                className="rounded-md bg-primary text-white font-bold text-xs shadow-lg shadow-primary/20 h-11 hover:bg-primary/90"
                onClick={() => setActiveModal('share')}
              >
                Share <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedTracks.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-foreground text-background rounded-md px-6 py-4 flex items-center gap-8 shadow-2xl z-50 animate-in slide-in-from-bottom-10 duration-500 border border-white/10 ring-8 ring-black/5">
          <div className="flex items-center gap-3 border-r border-white/10 pr-6">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black">
              {selectedTracks.length}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">Selected</p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="rounded-md h-10 px-4 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
              onClick={handleBulkEdit}
            >
              <Edit3 className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-md h-10 px-4 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
              onClick={handleMerge}
            >
              <Layers className="w-4 h-4 mr-2" /> Merge
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-md h-10 px-4 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
              onClick={handleBulkShare}
            >
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-md h-10 px-4 hover:text-red-400 hover:bg-red-400/10 text-xs font-bold uppercase tracking-widest transition-all"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-md h-10 w-10 hover:bg-white/10 ml-4 border border-white/5"
            onClick={() => setSelectedTracks([])}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Modals */}
      <UploadModal 
        isOpen={activeModal === 'upload'} 
        onClose={() => setActiveModal(null)}
        onUploadComplete={handleAddTrack} 
      />
      {activeModal === 'metadata' && (
        <TrackMetadataModal 
          onClose={() => setActiveModal(null)}
          onSave={handleSaveTrack}
          track={currentTrack}
        />
      )}
      <PlaylistSaveModal 
        isOpen={activeModal === 'playlist-save'} 
        onClose={() => setActiveModal(null)}
      />
      <SharePlaylistModal 
        isOpen={activeModal === 'share'} 
        onClose={() => setActiveModal(null)}
        playlistName={playlistName}
        tracks={playlistTracks}
      />
      <Toaster toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
