'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  CloudUpload, 
  X, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  FileAudio,
  FileVideo,
  FileImage,
  FileText,
  Loader2,
  Mic2,
  Languages,
  Download,
  Settings2,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion'
import { createClient } from '@/lib/supabase/client'
import { parseBlob } from 'music-metadata'

interface UploadFile {
  id: string
  name: string
  size: string
  type: 'audio' | 'video' | 'image' | 'pdf'
  progress: number
  status: 'uploading' | 'paused' | 'completed' | 'error' | 'transcoding'
}

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: (trackData: any) => void
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([])

  const togglePause = (id: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: f.status === 'uploading' ? 'paused' : 'uploading'
        }
      }
      return f
    }))
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'audio': return <FileAudio className="w-5 h-5" />
      case 'video': return <FileVideo className="w-5 h-5" />
      case 'image': return <FileImage className="w-5 h-5" />
      case 'pdf': return <FileText className="w-5 h-5" />
      default: return <CloudUpload className="w-5 h-5" />
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    for (const file of Array.from(fileList)) {
      const id = Date.now().toString() + Math.random().toString()
      const newFile: UploadFile = {
        id,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.startsWith('audio') ? 'audio' : 'video',
        progress: 0,
        status: 'uploading'
      }
      setFiles(prev => [newFile, ...prev])

      // Animate progress smoothly up to 85% while uploading
      let currentProgress = 0
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + Math.floor(Math.random() * 12) + 3, 85)
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: currentProgress } : f))
      }, 400)

      try {
        const supabase = createClient()
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const fileName = `${Date.now()}-${cleanName}`

        // Extract real metadata from the audio file
        let title = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        let genre: string | null = null
        let bpm: string | null = null
        let key: string | null = null
        let duration = '0:00'

        try {
          const metadata = await parseBlob(file, { skipCovers: true })
          const { common, format } = metadata

          if (common.title) title = common.title
          if (common.genre?.[0]) genre = common.genre[0]
          if (common.bpm) bpm = String(Math.round(common.bpm))
          if (format.duration) {
            const totalSec = Math.round(format.duration)
            const m = Math.floor(totalSec / 60)
            const s = totalSec % 60
            duration = `${m}:${s < 10 ? '0' : ''}${s}`
          }
        } catch (metaErr) {
          console.warn('Could not parse audio metadata, using defaults:', metaErr)
        }

        const { data, error } = await supabase.storage.from('tracks').upload(fileName, file, {
          upsert: false
        })

        clearInterval(progressInterval)

        if (error) {
          console.error('Upload error:', error)
          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', progress: 0 } : f))
          continue
        }

        const { data: { publicUrl } } = supabase.storage.from('tracks').getPublicUrl(fileName)
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'completed', progress: 100 } : f))

        if (onUploadComplete) {
          onUploadComplete({
            title,
            audio_url: publicUrl,
            duration,
            genre: genre || 'Uploaded',
            bpm: bpm || null,
            key: key || null
          })
        }
      } catch (err: any) {
        clearInterval(progressInterval)
        console.error('Unexpected upload error:', err)
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', progress: 0 } : f))
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border rounded-[2rem] overflow-hidden p-0 gap-0">
        <div className="p-8 space-y-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black tracking-[-0.04em] text-foreground">
                  Upload Songs
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  Upload audio files to add them to your music catalog.
                </DialogDescription>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <CloudUpload className="w-6 h-6" />
              </div>
            </div>
          </DialogHeader>

          {/* Dropzone Area */}
          <label className="border-2 border-dashed border-muted bg-muted/20 rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
            <input type="file" multiple accept="audio/*" onChange={handleFileUpload} className="hidden" />
            <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">Click or drag to upload</p>
              <p className="text-xs text-muted-foreground mt-1">WAV, AIFF, MP3, PNG, JPG, PDF, MP4 (Max 2GB)</p>
            </div>
          </label>

          {/* Files List */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {files.map((file) => (
              <div key={file.id} className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      file.status === 'completed' ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                    )}>
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground truncate max-w-[200px]">
                        {file.name}
                      </h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {file.size} • {file.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                        onClick={() => togglePause(file.id)}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    {file.status === 'paused' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-primary hover:bg-primary/10"
                        onClick={() => togglePause(file.id)}
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    )}
                    {file.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-muted-foreground/40 hover:text-destructive"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest px-0.5">
                    <span className="text-muted-foreground">
                      {file.status === 'transcoding' ? 'Optimizing for streaming...' : 'Progress'}
                    </span>
                    <span className={cn(
                      file.status === 'completed' ? "text-green-500" : "text-primary"
                    )}>
                      {file.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={file.progress} 
                    className="h-1.5 rounded-full bg-muted"
                    indicatorClassName={cn(
                      file.status === 'completed' ? "bg-green-500" : "bg-primary",
                      file.status === 'paused' && "bg-muted-foreground"
                    )}
                  />
                </div>

                {file.status === 'transcoding' && (
                  <div className="flex items-center gap-2 bg-primary/5 p-2 rounded-xl border border-primary/10">
                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                    <p className="text-[10px] font-medium text-primary">Generating high-res MP3 preview...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/30 p-6 flex items-center justify-between border-t border-border">
          <p className="text-xs text-muted-foreground font-medium">
            {files.length > 0 ? (
              <><span className="text-foreground font-black">{files.length} files</span> uploading</>
            ) : (
              "Ready to upload"
            )}
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="rounded-full font-bold text-sm" onClick={onClose}>
              Minimize
            </Button>
            <Button className="rounded-full bg-primary text-white font-black px-6 shadow-lg shadow-primary/20 hover:bg-primary/90" onClick={onClose}>
              Complete Uploads
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
