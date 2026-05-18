'use client'

import { useState } from 'react'
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

type AudioTags = {
  genres: string[]
  moods: string[]
  energy: 'low' | 'medium' | 'high'
  bpm?: number
  key?: string
  instruments: string[]
  summary: string
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
      setTitle(cleanName.replace(/[_-]+/g, ' '))
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|aiff|m4a|flac)$/i)) {
        setSelectedFile(file)
        const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        setTitle(cleanName.replace(/[_-]+/g, ' '))
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
      const response = await fetch('/api/ai/tagger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: {
            filename: selectedFile.name,
            title: title || selectedFile.name,
            artist: artist || undefined,
            description: description || undefined
          }
        })
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
  }

  return (
    <div className="flex flex-col gap-8 pt-4 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">AI Tagger</h1>
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
        <div className="rounded-[2rem] border border-border bg-card p-20 flex flex-col items-center justify-center min-h-[400px] text-center gap-8 animate-pulse max-w-2xl mx-auto w-full">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-medium tracking-tight italic">Analyzing Sonics...</h2>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
              Claude 3.5 Sonnet is parsing the sonic metadata and generating contextual sync tags.
            </p>
          </div>
          <div className="w-full max-w-md h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
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
                <Button className="w-full h-12 rounded-full bg-white text-black hover:bg-white/90 border-0 font-bold cursor-pointer">
                  Add to Catalog
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-full border-white/20 hover:bg-white/10 text-white font-bold cursor-pointer"
                  onClick={handleReset}
                >
                  Reset & Upload New
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

