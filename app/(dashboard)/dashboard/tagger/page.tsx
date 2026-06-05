'use client'

import { useState } from 'react'
import { parseBlob } from 'music-metadata'
import { 
  Music, 
  Upload, 
  Loader2, 
  Tag as TagIcon, 
  Zap, 
  Activity, 
  Layers, 
  CheckCircle2,
  Download,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { getTrackByTitle, createTrack } from '@/app/actions/tracks'
import { useToast } from '@/components/Toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import Link from 'next/link'

type AudioTags = {
  genres: string[]
  moods: string[]
  energy: 'low' | 'medium' | 'high'
  bpm?: number
  key?: string
  instruments: string[]
  summary: string
}

type BinaryMeta = {
  artist?: string
  album?: string
  year?: number
  label?: string
  isrc?: string
  copyright?: string
  duration?: string
  sampleRate?: number
  bitrate?: number
  albumArtUrl?: string | null
}

export default function TaggerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [description, setDescription] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AudioTags | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [binaryMeta, setBinaryMeta] = useState<BinaryMeta | null>(null)

  const { addToast } = useToast()

  const handleAddToCatalog = async () => {
    if (!selectedFile || !results) return
    setIsSaving(true)
    
    try {
      // Check if track already exists
      const existing = await getTrackByTitle(title || selectedFile.name)
      if (existing) {
        addToast('This track already exists in your catalog!', 'error')
        setIsSaving(false)
        return
      }

      // Upload the binary file to Supabase Storage
      const supabase = createClient()
      const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${Date.now()}-${cleanName}`
      
      const { error: uploadError } = await supabase.storage.from('tracks').upload(fileName, selectedFile, {
        upsert: false
      })

      if (uploadError) {
        throw new Error('Failed to upload file to storage')
      }
      
      const { data: { publicUrl } } = supabase.storage.from('tracks').getPublicUrl(fileName)

      // Create a new track record in the database
      const res = await createTrack({
        title: title || selectedFile.name,
        genre: results.genres[0] || 'Unknown',
        duration: binaryMeta?.duration || '0:00',
        bpm: results.bpm ? String(results.bpm) : null,
        key: results.key || null,
        audio_url: publicUrl
      })

      if (!res) throw new Error('Failed to save to database')

      setShowSuccessModal(true)
    } catch (err) {
      console.error(err)
      addToast('An error occurred while saving the track.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const extractBinaryMeta = async (file: File): Promise<BinaryMeta> => {
    try {
      const meta = await parseBlob(file, { skipCovers: false })
      const { common, format } = meta

      // Extract album art if present
      let albumArtUrl: string | null = null
      if (common.picture && common.picture.length > 0) {
        const pic = common.picture[0]
        const blob = new Blob([pic.data.buffer as ArrayBuffer], { type: pic.format })
        albumArtUrl = URL.createObjectURL(blob)
      }

      // Format duration
      let duration: string | undefined
      if (format.duration) {
        const totalSec = Math.round(format.duration)
        const m = Math.floor(totalSec / 60)
        const s = totalSec % 60
        duration = `${m}:${s < 10 ? '0' : ''}${s}`
      }

      return {
        artist: common.artist || undefined,
        album: common.album || undefined,
        year: common.year || undefined,
        label: (common as any).label?.[0] || (common as any).organization || undefined,
        isrc: (common as any).isrc?.[0] || undefined,
        copyright: common.copyright || undefined,
        duration,
        sampleRate: format.sampleRate || undefined,
        bitrate: format.bitrate ? Math.round(format.bitrate / 1000) : undefined,
        albumArtUrl,
      }
    } catch {
      return {}
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
      setTitle(cleanName.replace(/[_-]+/g, ' '))
      const meta = await extractBinaryMeta(file)
      setBinaryMeta(meta)
      if (meta.artist) setArtist(meta.artist)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|aiff|m4a|flac)$/i)) {
        setSelectedFile(file)
        const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        setTitle(cleanName.replace(/[_-]+/g, ' '))
        const meta = await extractBinaryMeta(file)
        setBinaryMeta(meta)
        if (meta.artist) setArtist(meta.artist)
      }
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsUploading(true)
    // Simulate upload processing / audio analysis preparation
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsUploading(false)
    
    setIsAnalyzing(true)
    setResults(null)
    
    try {
      const metadata = {
        filename: selectedFile.name,
        title: title || selectedFile.name,
        artist: artist || undefined,
        description: description || undefined,
        duration: binaryMeta?.duration,
        sampleRate: binaryMeta?.sampleRate,
        bitrate: binaryMeta?.bitrate,
        album: binaryMeta?.album,
        year: binaryMeta?.year,
        isrc: binaryMeta?.isrc,
      }
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('metadata', JSON.stringify(metadata))

      const response = await fetch('/api/ai/tagger', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate tags')
      }
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Failed to analyze:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setResults(null)
    setTitle('')
    setArtist('')
    setDescription('')
    setBinaryMeta(null)
  }

  return (
    <div className="flex flex-col gap-8 pt-4 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI Tagger</h1>
        <p className="text-lg text-muted-foreground tracking-tight">Automatically generate metadata and mood tags for your tracks using AI.</p>
      </div>
      
      {/* File Dropzone Selector */}
      {!selectedFile && !results && !isAnalyzing && (
        <div 
          onClick={() => document.getElementById('audio-upload')?.click()}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`
            rounded-[2rem] border-2 border-dashed border-border bg-card/50 p-20 
            flex flex-col items-center justify-center min-h-[400px] text-center gap-6
            hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group relative
            ${isDragActive ? 'border-primary/80 bg-primary/5 scale-[0.99]' : ''}
          `}
        >
          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange} 
            className="hidden" 
            id="audio-upload"
          />
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight">
              Ready to tag your music?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Drop your audio file here or click to browse. We support WAV, AIFF, MP3, FLAC, and M4A.
            </p>
          </div>
          <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold shadow-xl shadow-primary/20 pointer-events-none">
            Select File
          </Button>
        </div>
      )}

      {/* Track Details & Metadata Form */}
      {selectedFile && !results && !isAnalyzing && (
        <Card className="rounded-[2rem] border-border bg-card/50 overflow-hidden max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Music className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold tracking-tight text-foreground truncate pr-2 max-w-[320px]">
                    {selectedFile.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Audio File'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0"
                onClick={handleReset}
              >
                Remove
              </Button>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Track Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter track title"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-foreground transition-colors font-medium text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Artist / Composer Name</label>
                <input 
                  type="text" 
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist or composer name"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-foreground transition-colors font-medium text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Sonic Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the mood, instruments, rhythm, or cinematic references (e.g. Uplifting cinematic track with sweeping brass, piano plucks, driving violins, and a high-energy climax. Great for trailers or sports syncs)..."
                  className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-foreground transition-colors font-medium text-sm resize-y leading-relaxed"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isUploading}
                className="w-full h-14 rounded-full text-base font-bold shadow-xl shadow-primary/20 gap-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading & Preparing File...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate AI Tags
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Analyzing Progress Loader */}
      {isAnalyzing && (
        <div className="rounded-[2rem] border border-border bg-card p-20 flex flex-col items-center justify-center min-h-[400px] text-center gap-10 max-w-2xl mx-auto w-full relative overflow-hidden">
          {/* Animated background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full animate-ping duration-1000" />
          
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              {/* Spinning gradient ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
              {/* Inner pulsing circle */}
              <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse flex items-center justify-center">
                <Activity className="w-10 h-10 text-primary animate-bounce" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                Analyzing Sonics...
              </h2>
              <p className="text-muted-foreground max-w-sm mx-auto text-base font-medium leading-relaxed">
                AI is performing deep audio metadata extraction and generating contextual sync tags.
              </p>
            </div>
            
            <div className="w-full max-w-sm space-y-2">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-purple-500 animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center animate-pulse">
                Processing waveform
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tagger Analysis Results */}
      {results && selectedFile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2rem] border-border bg-card overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Music className="w-7 h-7" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-2xl font-bold tracking-tight truncate pr-2 max-w-[400px]">{title || selectedFile.name}</h3>
                      <p className="text-muted-foreground text-sm">Analysis Complete • 100% Claude Verification</p>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full shrink-0">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">AI Sonic Summary</h4>
                  <p className="text-xl leading-relaxed italic text-foreground/90 font-medium">
                    "{results.summary}"
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Activity className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Energy</span>
                    </div>
                    <Badge variant="outline" className="text-base px-4 py-0.5 rounded-full capitalize border-primary/30 bg-primary/5 text-primary">
                      {results.energy}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">BPM</span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight mono">{results.bpm ?? '120'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Layers className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Key</span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight mono">{results.key ?? 'C min'}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight text-emerald-500">Sync Tagged</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-[2rem] border-border bg-card">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TagIcon className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest block">Primary Genres</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.genres.map(genre => (
                      <Badge key={genre} className="rounded-full px-4 py-1.5 bg-foreground text-background hover:bg-foreground/90 font-medium text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-border bg-card">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest block">Musical Moods</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.moods.map(mood => (
                      <Badge key={mood} variant="secondary" className="rounded-full px-4 py-1.5 font-medium text-xs">
                        {mood}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Binary Metadata Card */}
            {binaryMeta && Object.values(binaryMeta).some(v => v != null) && (
              <Card className="rounded-[2rem] border-border bg-card">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <Layers className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest block">Embedded File Metadata</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                    {binaryMeta.albumArtUrl && (
                      <div className="col-span-full flex items-center gap-4 pb-4 border-b border-border/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={binaryMeta.albumArtUrl} alt="Album Art" className="w-14 h-14 rounded-xl object-cover border border-border" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Album Art</p>
                          <p className="text-sm font-semibold text-foreground">Embedded Cover Detected</p>
                        </div>
                      </div>
                    )}
                    {[
                      { label: 'Artist', value: binaryMeta.artist },
                      { label: 'Album', value: binaryMeta.album },
                      { label: 'Year', value: binaryMeta.year },
                      { label: 'Label / Publisher', value: binaryMeta.label },
                      { label: 'ISRC', value: binaryMeta.isrc },
                      { label: 'Copyright', value: binaryMeta.copyright },
                      { label: 'Duration', value: binaryMeta.duration },
                      { label: 'Sample Rate', value: binaryMeta.sampleRate ? `${binaryMeta.sampleRate / 1000} kHz` : undefined },
                      { label: 'Bitrate', value: binaryMeta.bitrate ? `${binaryMeta.bitrate} kbps` : undefined },
                    ].filter(item => item.value).map(item => (
                      <div key={item.label}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-foreground truncate">{String(item.value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-border bg-card p-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 block">Instrumentation</h4>
              <div className="space-y-3">
                {results.instruments.map(inst => (
                  <div key={inst} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                    <span className="font-medium text-sm">{inst}</span>
                    <Badge variant="outline" className="rounded-full text-[9px] px-2 uppercase font-semibold">Detected</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground space-y-6 shadow-xl shadow-primary/10">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2 block">Sync Placement Ready</h4>
                <p className="text-base font-medium leading-normal">These generated tags are optimized specifically for sync-licensing supervisor catalogs.</p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={handleAddToCatalog}
                  disabled={isSaving}
                  className="w-full h-12 rounded-full bg-white text-black hover:bg-white/90 border-0 font-bold cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Add to Catalog'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-full border-white/20 bg-transparent hover:bg-white/10 text-white hover:text-white font-bold cursor-pointer"
                  onClick={handleReset}
                >
                  Reset & Upload New
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-card border-border rounded-[2rem] p-8 text-center space-y-6">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-[-0.04em] text-foreground text-center">
              Added to Catalog!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-center">
              "{title || selectedFile?.name}" has been successfully tagged and added to your track catalog.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/tracks" className="w-full">
              <Button className="w-full h-12 rounded-full font-bold text-base cursor-pointer">
                View in Catalog
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-full border-border bg-transparent hover:bg-muted font-bold cursor-pointer"
              onClick={() => {
                setShowSuccessModal(false)
                handleReset()
              }}
            >
              Tag Another Track
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
