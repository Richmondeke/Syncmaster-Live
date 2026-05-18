import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { 
  User, 
  Mail, 
  Link as LinkIcon, 
  Shield, 
  Camera,
  Music4
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Public Profile</h2>
          </div>
          
          <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden">
                    <User className="w-12 h-12 text-primary/40" />
                  </div>
                  <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl backdrop-blur-sm">
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                      <Input
                        id="full_name"
                        defaultValue="Test Admin"
                        className="bg-muted/30 border-border rounded-2xl h-12 px-4 focus:ring-primary/20 transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="portfolio" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">Portfolio URL</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input
                          id="portfolio"
                          placeholder="https://yourportfolio.com"
                          className="bg-muted/30 border-border rounded-2xl h-12 pl-11 pr-4 focus:ring-primary/20 transition-all text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">Short Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell the world about your music style..."
                      className="bg-muted/30 border-border rounded-2xl min-h-[120px] p-4 focus:ring-primary/20 transition-all text-foreground"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border px-8 py-4 flex justify-end">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-8">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Preferences Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <Music4 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Artist Preferences</h2>
          </div>
          
          <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">Primary Genres</Label>
                <div className="flex flex-wrap gap-2">
                  {['Cinematic', 'Electronic', 'Orchestral', 'Ambient', 'Rock', 'Hybrid'].map((genre) => (
                    <button 
                      key={genre}
                      className="px-4 py-2 rounded-full border border-border bg-muted/30 text-sm text-foreground/70 hover:border-primary/50 hover:text-primary transition-all"
                    >
                      {genre}
                    </button>
                  ))}
                  <button className="px-4 py-2 rounded-full border border-dashed border-border bg-transparent text-sm text-muted-foreground hover:border-foreground/30 transition-all">
                    + Add Genre
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Security Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Account & Security</h2>
          </div>
          
          <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-foreground font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">admin@example.com</p>
                </div>
                <Button variant="outline" className="rounded-full border-border text-foreground hover:bg-muted/40 h-9 px-4 text-xs font-bold">
                  Change Email
                </Button>
              </div>
              <div className="h-px bg-border w-full" />
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-foreground font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
                <Button variant="outline" className="rounded-full border-border text-foreground hover:bg-muted/40 h-9 px-4 text-xs font-bold">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="pt-4 flex justify-center">
          <p className="text-xs text-muted-foreground/50 font-medium">
            Member since March 2024 • ID: SM-98231-01
          </p>
        </div>
      </div>
    </div>
  )
}
