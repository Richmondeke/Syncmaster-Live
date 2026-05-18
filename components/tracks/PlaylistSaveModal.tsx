'use client'

import { useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { 
  X, 
  Save, 
  ChevronDown, 
  Tag, 
  FolderPlus, 
  Eye, 
  EyeOff, 
  Lock,
  Shield,
  Sparkles,
  Star,
  Disc,
  Mic2,
  Languages,
  Download,
  Settings2,
  Info
} from 'lucide-react'

interface PlaylistSaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (name: string) => void
}

export function PlaylistSaveModal({ isOpen, onClose, onSave }: PlaylistSaveModalProps) {
  const [name, setName] = useState('Malena Cadiz')

  const handleSave = () => {
    if (onSave) onSave(name)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-8 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-black tracking-[-0.04em]">Save Playlist</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <div className="px-8 border-b border-border/50">
            <TabsList className="bg-transparent h-14 gap-8 p-0">
              <TabsTrigger value="info" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-sm font-black transition-all border-b-2 border-transparent">Playlist Info</TabsTrigger>
              <TabsTrigger value="presentation" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-sm font-black transition-all border-b-2 border-transparent flex items-center gap-2">
                Presentation <span className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">New</span>
              </TabsTrigger>
              <TabsTrigger value="formats" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-sm font-black transition-all border-b-2 border-transparent">Formats</TabsTrigger>
              <TabsTrigger value="metadata" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-sm font-black transition-all border-b-2 border-transparent">Alias Metadata</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-8 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
            <TabsContent value="info" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Playlist Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm" />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between pl-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Playlist tags</Label>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                  <Input placeholder="Select tags, or type to create new tags" className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm pl-10" />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between pl-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add to channel</Label>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
                <div className="relative">
                  <FolderPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                  <Input placeholder="Search channel..." className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm pl-10" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <Label className="text-xs font-black tracking-[-0.02em] text-foreground">Playlist options</Label>
                  <ChevronDown className="w-4 h-4 text-muted-foreground/30" />
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Watermark playlist', desc: 'Secure audio with audible or inaudible watermarks', icon: Shield, enabled: false },
                    { label: 'Streaming only', desc: 'Prevent downloading of high-res files', icon: Lock, enabled: true },
                    { label: 'Client Version', desc: 'Hidden internal reference data', icon: EyeOff, enabled: false },
                    { label: 'Album Mode', desc: 'Display tracks as a unified album project', icon: Disc, enabled: true },
                    { label: 'Add to my starred lists', desc: 'Pin to your dashboard for quick access', icon: Star, enabled: true },
                    { label: 'Viewable only by me', desc: 'Private playlist by default', icon: Lock, enabled: false },
                    { label: 'Show lyrics', desc: 'Embed scrolling lyrics in public view', icon: Mic2, enabled: true },
                  ].map((option) => (
                    <div key={option.label} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/40 group-hover:bg-primary/5 group-hover:text-primary/60 transition-all">
                          <option.icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[13px] font-black tracking-tight leading-none">{option.label}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">{option.desc}</p>
                        </div>
                      </div>
                      <Switch defaultChecked={option.enabled} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presentation" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Theme Selection</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border-2 border-primary bg-primary/5 cursor-pointer">
                    <div className="aspect-video rounded-xl bg-white/50 border border-border mb-3"></div>
                    <p className="text-sm font-black">Modern Dark</p>
                    <p className="text-[10px] text-muted-foreground font-bold">Standard DISCO theme</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="aspect-video rounded-xl bg-muted border border-border mb-3"></div>
                    <p className="text-sm font-black">Minimal Light</p>
                    <p className="text-[10px] text-muted-foreground font-bold">Clean, white aesthetic</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Custom Branding</Label>
                  <Switch defaultChecked />
                </div>
                <div className="p-6 rounded-3xl bg-muted/30 border border-dashed border-border flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-muted-foreground mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold">Drop your logo here</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">PNG, SVG or JPG (Max 2MB)</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="formats" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary font-black text-xs">MP3</div>
                    <div>
                      <p className="text-sm font-black">Generate Preview MP3s</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">320kbps Standard</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-amber-500 font-black text-xs">WAV</div>
                    <div>
                      <p className="text-sm font-black">Include High-Res Masters</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Original Quality</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-4 pt-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Advanced Transcoding</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/40">
                          <Settings2 className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[13px] font-black tracking-tight">Normalize Audio Levels</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/40">
                          <Download className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[13px] font-black tracking-tight">Enable Batch Downloading</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4">
                  <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-amber-600">Alias Metadata Enabled</p>
                    <p className="text-[10px] text-amber-600/80 font-bold leading-relaxed mt-1">
                      This will replace original track metadata with the values provided below when the playlist is shared or downloaded.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Global Artist Alias</Label>
                    <Input placeholder="Leave blank to use original" className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm" />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Global Album Alias</Label>
                    <Input placeholder="Leave blank to use original" className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black">Clean Title Filter</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Remove (Mastered), [V1], etc.</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="p-8 bg-muted/20 border-t border-border/50 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose} className="rounded-full h-11 px-8 text-sm font-black text-muted-foreground hover:text-foreground">Cancel</Button>
            <Button onClick={handleSave} className="rounded-full h-11 px-10 text-sm font-black bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
              <Save className="w-4 h-4 mr-2" /> Save Playlist
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
