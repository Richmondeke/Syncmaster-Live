'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Music2, X, ChevronLeft, ChevronRight, Save, Copy } from 'lucide-react'

interface TrackMetadataModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (track: any) => void
  track?: any
}

export function TrackMetadataModal({ isOpen, onClose, onSave, track }: TrackMetadataModalProps) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title || '',
        artist: track.artist || 'Malena Cadiz',
        album: track.album || 'Hellbent & Moonbound',
        composer: track.composer || 'Malena Cadiz',
        grouping: track.grouping || '',
        genre: track.genre || 'Folk / Americana',
        year: track.year || '2023',
        bpm: track.bpm || '118',
        isrc: track.isrc || '',
        comments: track.comments || '',
        lyrics: track.lyrics || ''
      })
    }
  }, [track])

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave({ ...track, ...formData })
    }
    onClose()
  }

  const copyToClipboard = () => {
    const info = `Title: ${formData.title}\nArtist: ${formData.artist}\nAlbum: ${formData.album}\nGenre: ${formData.genre}\nBPM: ${formData.bpm}`
    navigator.clipboard.writeText(info)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl lg:max-w-6xl bg-background/95 backdrop-blur-xl border-border/50 rounded-[2rem] sm:rounded-[2.5rem] p-0 overflow-hidden shadow-2xl transition-all duration-500 ring-1 ring-white/10">
        <DialogHeader className="p-4 sm:p-8 border-b border-border/50 bg-muted/30 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
              <Music2 className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground/90">{formData.title || 'Edit Track'}</DialogTitle>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Metadata Editor</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted/30 rounded-full p-1 mr-2 border border-border/50">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/50">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="metadata" className="w-full">
          <div className="p-4 sm:p-8 border-b border-border/50 bg-muted/30">
            <TabsList className="flex items-center justify-start gap-4 sm:gap-8 bg-transparent border-none p-0 h-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
              {['Metadata', 'Lyrics', 'Writers', 'Tags', 'Notes'].map((tab) => (
                <TabsTrigger
                  key={tab.toLowerCase()}
                  value={tab.toLowerCase()}
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-muted-foreground/80 data-[state=active]:opacity-100 transition-all border-b-2 border-transparent"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-4 sm:p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
            <TabsContent value="metadata" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Track Artwork */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                  <div className="aspect-square rounded-2xl sm:rounded-[2rem] overflow-hidden bg-muted border-2 border-border/50 shadow-inner group relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/10">
                      <Music2 className="w-24 h-24" />
                    </div>
                    <img 
                      src={track?.artwork || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&auto=format&fit=crop'} 
                      className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
                      <Button variant="secondary" size="sm" className="rounded-full text-[10px] font-black h-9 px-6 bg-white text-black hover:bg-white/90">Change Artwork</Button>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 flex items-center justify-between group cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="update-all" className="rounded-md border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                      <label htmlFor="update-all" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none cursor-pointer group-hover:text-foreground/80 transition-colors">
                        Apply art to all tracks
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">Title</Label>
                      <Input 
                        value={formData.title} 
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all px-4" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">Artist</Label>
                      <Input 
                        value={formData.artist} 
                        onChange={(e) => handleChange('artist', e.target.value)}
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all px-4" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">Album</Label>
                      <Input 
                        value={formData.album} 
                        onChange={(e) => handleChange('album', e.target.value)}
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all px-4" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">Composer</Label>
                      <Input 
                        value={formData.composer} 
                        onChange={(e) => handleChange('composer', e.target.value)}
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all px-4" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">Grouping</Label>
                      <Input 
                        value={formData.grouping} 
                        onChange={(e) => handleChange('grouping', e.target.value)}
                        placeholder="Enter grouping..." 
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all px-4" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">Genre</Label>
                      <Input 
                        value={formData.genre} 
                        onChange={(e) => handleChange('genre', e.target.value)}
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all px-4" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">Year</Label>
                      <Input 
                        value={formData.year} 
                        onChange={(e) => handleChange('year', e.target.value)}
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all text-center" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">BPM</Label>
                      <Input 
                        value={formData.bpm} 
                        onChange={(e) => handleChange('bpm', e.target.value)}
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all text-center" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">ISRC</Label>
                      <Input 
                        value={formData.isrc} 
                        onChange={(e) => handleChange('isrc', e.target.value)}
                        placeholder="Optional" 
                        className="rounded-2xl bg-muted/20 border-border/50 font-bold h-12 focus:ring-primary/20 focus:border-primary transition-all px-4" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-border/5">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">Internal Comments</Label>
                <Textarea 
                  value={formData.comments} 
                  onChange={(e) => handleChange('comments', e.target.value)}
                  placeholder="Add internal notes or metadata comments..." 
                  className="rounded-[1.5rem] bg-muted/20 border-border/50 font-medium resize-none min-h-[120px] focus:ring-primary/20 focus:border-primary transition-all p-5 leading-relaxed" 
                />
              </div>
            </TabsContent>

            <TabsContent value="lyrics" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary rounded-full" />
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Track Lyrics</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full h-9 px-6 text-[10px] font-black uppercase border-primary/20 text-primary hover:bg-primary/5">Auto-transcribe</Button>
                </div>
                <Textarea 
                  value={formData.lyrics} 
                  onChange={(e) => handleChange('lyrics', e.target.value)}
                  placeholder="Paste lyrics here for indexing and searchability..." 
                  className="min-h-[350px] rounded-[1.5rem] bg-muted/20 border-border/50 font-medium leading-relaxed p-6 text-lg tracking-tight" 
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 sm:p-8 bg-muted/30 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="px-4 py-2 bg-background/50 rounded-full border border-border/50 shadow-sm">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">ID: <span className="text-foreground/60">{track?.id || 'NEW'}</span></span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button variant="ghost" onClick={copyToClipboard} className="flex-1 sm:flex-none rounded-full h-12 px-8 text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">
              <Copy className="w-4 h-4 mr-2" /> Copy Info
            </Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-none rounded-full h-12 px-10 text-[11px] font-black bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest">
              <Save className="w-4 h-4 mr-2" /> Save Metadata
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
