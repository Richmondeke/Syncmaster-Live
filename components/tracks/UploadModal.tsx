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
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([
    {
      id: '1',
      name: 'Midnight_Horizon_Main.wav',
      size: '42.5 MB',
      type: 'audio',
      progress: 65,
      status: 'uploading'
    },
    {
      id: '2',
      name: 'Neon_Pulse_Instrumental.aif',
      size: '38.2 MB',
      type: 'audio',
      progress: 100,
      status: 'transcoding'
    },
    {
      id: '3',
      name: 'Album_Artwork_Final.png',
      size: '12.4 MB',
      type: 'image',
      progress: 100,
      status: 'completed'
    }
  ])

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border rounded-[2rem] overflow-hidden p-0 gap-0">
        <div className="p-8 space-y-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black tracking-[-0.04em] text-foreground">
                  Activity Monitor
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  Manage your active uploads and background tasks.
                </DialogDescription>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <CloudUpload className="w-6 h-6" />
              </div>
            </div>
          </DialogHeader>

          {/* Dropzone Area */}
          <div className="border-2 border-dashed border-muted bg-muted/20 rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">Click or drag to upload</p>
              <p className="text-xs text-muted-foreground mt-1">WAV, AIFF, MP3, PNG, JPG, PDF, MP4 (Max 2GB)</p>
            </div>
          </div>

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
            <span className="text-foreground font-black">2 files</span> uploading • 1.2 MB/s
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="rounded-full font-bold text-sm" onClick={onClose}>
              Minimize
            </Button>
            <Button className="rounded-full bg-primary text-white font-black px-6 shadow-lg shadow-primary/20 hover:bg-primary/90">
              Complete Uploads
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
