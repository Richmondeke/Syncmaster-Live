import { useEffect, useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { X, Send, Link as LinkIcon, ExternalLink, Shield, Info, Copy, Check, Lock, Globe, Clock } from 'lucide-react'

interface SharePlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  playlistName?: string
  tracks?: any[]
}

export function SharePlaylistModal({ isOpen, onClose, playlistName, tracks = [] }: SharePlaylistModalProps) {
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  // Security settings
  const [isPublic, setIsPublic] = useState(true)
  const [passwordProtect, setPasswordProtect] = useState(false)
  const [password, setPassword] = useState('')
  const [expiresIn, setExpiresIn] = useState('7') // days

  useEffect(() => {
    if (isOpen) {
      const name = playlistName || 'New Playlist'
      setSubject(`Tim Bern from SyncMaster has sent you ${name}`)
      setMessage(`Hi,\n\nI've shared a new playlist with you: ${name}.\n\nIt contains ${tracks.length} track${tracks.length === 1 ? '' : 's'}.\n\nYou can listen to it here: https://sync.disco.ac/wlozgskndpli\n\nBest,\nTim`)
    }
  }, [isOpen, playlistName, tracks.length])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedLink(type)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const handleSend = () => {
    if (!recipient) return
    setIsSending(true)
    // Simulate API call
    setTimeout(() => {
      setIsSending(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    }, 1500)
  }

  const getPlaylistListText = () => {
    if (!tracks.length) return 'No tracks in playlist'
    return tracks.map((t, i) => `${i + 1}. ${t.title} - ${t.genre} (${t.duration})`).join('\n')
  }

  const getEmbedCode = () => {
    return `<iframe src="https://sync.disco.ac/embed/wlozgskndpli" width="100%" height="450" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
  }

  const getPlaylistSlug = () => {
    return (playlistName || 'new-playlist').toLowerCase().replace(/[^a-z0-9]/g, '-')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-8 pb-4 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-black tracking-[-0.04em]">Share Playlist</DialogTitle>
            <p className="text-sm font-bold text-muted-foreground mt-1">
              {playlistName || 'Untitled Playlist'} <span className="mx-2 opacity-30">|</span> {tracks.length} track{tracks.length === 1 ? '' : 's'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full">
          <div className="px-8 border-b border-border/50">
            <TabsList className="bg-transparent h-14 gap-8 p-0">
              {['Share', 'Copy URL', 'Copy List', 'Embed', 'Security'].map((tab) => (
                <TabsTrigger
                  key={tab.toLowerCase().replace(' ', '-')}
                  value={tab.toLowerCase().replace(' ', '-')}
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-sm font-black transition-all border-b-2 border-transparent"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-8 h-[500px] overflow-y-auto custom-scrollbar">
            <TabsContent value="share" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex bg-muted/40 p-1 rounded-2xl border border-border">
                <Button className="flex-1 rounded-xl h-11 bg-[#4b4bc0] hover:bg-[#4b4bc0]/90 text-white font-black text-xs shadow-md">Email playlist directly</Button>
                <Button variant="ghost" className="flex-1 rounded-xl h-11 text-muted-foreground font-black text-xs">Assign a URL to a contact <Info className="w-3.5 h-3.5 ml-2 text-amber-500" /></Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Recipient</Label>
                  <Input 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Email address or search for a user or business" 
                    className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Subject</Label>
                  <Input 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Message</Label>
                  <Textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message" 
                    className="min-h-[160px] rounded-2xl bg-muted/30 border-border font-medium resize-none text-sm p-4 leading-relaxed" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={onClose} className="rounded-full h-11 px-8 text-sm font-black text-muted-foreground hover:text-foreground">Cancel</Button>
                <Button 
                  onClick={handleSend}
                  disabled={!recipient || isSending || isSuccess}
                  className="rounded-full h-11 px-10 text-sm font-black bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                >
                  {isSending ? 'Sending...' : isSuccess ? <><Check className="w-4 h-4 mr-2" /> Sent!</> : <><Send className="w-4 h-4 mr-2" /> Send Playlist</>}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="copy-url" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Public playlist URL</Label>
                    <Info className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="flex gap-2">
                    <Input readOnly value={`https://sync.disco.ac/${getPlaylistSlug()}`} className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm flex-1 text-primary" />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyToClipboard(`https://sync.disco.ac/${getPlaylistSlug()}`, 'public')}
                      className="h-12 w-12 rounded-2xl border-border hover:bg-muted"
                    >
                      {copiedLink === 'public' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => window.open(`https://sync.disco.ac/${getPlaylistSlug()}`, '_blank')}
                      className="h-12 w-12 rounded-2xl border-border hover:bg-muted"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal playlist URL</Label>
                    <Info className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="flex gap-2">
                    <Input readOnly value={`https://sync.disco.ac/internal/${getPlaylistSlug()}`} className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm flex-1 text-muted-foreground" />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyToClipboard(`https://sync.disco.ac/internal/${getPlaylistSlug()}`, 'internal')}
                      className="h-12 w-12 rounded-2xl border-border hover:bg-muted"
                    >
                      {copiedLink === 'internal' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => window.open(`https://sync.disco.ac/internal/${getPlaylistSlug()}`, '_blank')}
                      className="h-12 w-12 rounded-2xl border-border hover:bg-muted"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Direct Download URL</Label>
                    <Info className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="flex gap-2">
                    <Input readOnly value={`https://sync.disco.ac/download/${getPlaylistSlug()}`} className="h-12 rounded-2xl bg-muted/30 border-border font-bold text-sm flex-1 text-muted-foreground" />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyToClipboard(`https://sync.disco.ac/download/${getPlaylistSlug()}`, 'download')}
                      className="h-12 w-12 rounded-2xl border-border hover:bg-muted"
                    >
                      {copiedLink === 'download' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => window.open(`https://sync.disco.ac/download/${getPlaylistSlug()}`, '_blank')}
                      className="h-12 w-12 rounded-2xl border-border hover:bg-muted"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-8">
                <Button variant="ghost" onClick={onClose} className="rounded-full h-11 px-8 text-sm font-black text-muted-foreground hover:text-foreground">Done</Button>
              </div>
            </TabsContent>

            <TabsContent value="copy-list" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Playlist Track List</Label>
                <div className="relative group">
                  <pre className="p-6 rounded-2xl bg-muted/30 border border-border font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[300px] custom-scrollbar">
                    {getPlaylistListText()}
                  </pre>
                  <Button 
                    variant="outline" 
                    className="absolute top-4 right-4 h-10 px-4 rounded-xl border-border bg-background shadow-sm hover:bg-muted transition-all"
                    onClick={() => copyToClipboard(getPlaylistListText(), 'list')}
                  >
                    {copiedLink === 'list' ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copiedLink === 'list' ? 'Copied!' : 'Copy List'}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end pt-8">
                <Button variant="ghost" onClick={onClose} className="rounded-full h-11 px-8 text-sm font-black text-muted-foreground hover:text-foreground">Done</Button>
              </div>
            </TabsContent>

            <TabsContent value="embed" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Embed Code (iFrame)</Label>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Recommended for Websites</span>
                </div>
                <div className="relative group">
                  <Textarea 
                    readOnly 
                    value={getEmbedCode()}
                    className="min-h-[120px] p-6 rounded-2xl bg-muted/30 border border-border font-mono text-xs leading-relaxed resize-none" 
                  />
                  <Button 
                    variant="outline" 
                    className="absolute top-4 right-4 h-10 px-4 rounded-xl border-border bg-background shadow-sm hover:bg-muted transition-all"
                    onClick={() => copyToClipboard(getEmbedCode(), 'embed')}
                  >
                    {copiedLink === 'embed' ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copiedLink === 'embed' ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] font-medium text-amber-800 leading-normal">
                    This embed code will allow the playlist to be played directly on your website. 
                    You can customize the width and height parameters to fit your layout.
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-8">
                <Button variant="ghost" onClick={onClose} className="rounded-full h-11 px-8 text-sm font-black text-muted-foreground hover:text-foreground">Done</Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 rounded-2xl border border-border bg-muted/10">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground">Public Access</h4>
                      <p className="text-xs font-bold text-muted-foreground">Anyone with the link can view this playlist</p>
                    </div>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>

                <div className="space-y-4 p-6 rounded-2xl border border-border bg-muted/10">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-foreground">Password Protection</h4>
                        <p className="text-xs font-bold text-muted-foreground">Require a password to access the playlist</p>
                      </div>
                    </div>
                    <Switch checked={passwordProtect} onCheckedChange={setPasswordProtect} />
                  </div>
                  {passwordProtect && (
                    <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                      <Input 
                        type="password"
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 rounded-xl bg-background border-border font-bold text-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="p-6 rounded-2xl border border-border bg-muted/10 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground">Link Expiry</h4>
                      <p className="text-xs font-bold text-muted-foreground">Link will automatically expire after a set time</p>
                    </div>
                  </div>
                  <select 
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    className="bg-background border border-border rounded-xl px-4 h-11 text-sm font-black focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="1">24 Hours</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-8">
                <Button variant="ghost" onClick={onClose} className="rounded-full h-11 px-8 text-sm font-black text-muted-foreground hover:text-foreground">Done</Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
