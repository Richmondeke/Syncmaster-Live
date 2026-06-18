'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import {
  User,
  Link as LinkIcon,
  Shield,
  Camera,
  Music4,
  Loader2,
  CheckCircle2,
  X,
  Sparkles,
  Star,
} from 'lucide-react'
import { getProfile, updateProfile } from '@/app/actions/profile'
import { useToast } from '@/components/Toast'
import { PricingCard } from '@/components/dashboard/PricingCard'

const ALL_GENRES = ['Cinematic', 'Electronic', 'Orchestral', 'Ambient', 'Rock', 'Hybrid', 'Hip Hop', 'Jazz', 'Folk', 'Pop', 'R&B', 'Classical']

export default function SettingsPage() {
  const { addToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [memberSince, setMemberSince] = useState('')
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    // Check URL query parameters for payment success redirect
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('payment_ref')) {
      addToast('Payment completed successfully! We are updating your account.', 'success')
      // Clean query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    getProfile().then((profile) => {
      if (profile) {
        setFullName(profile.full_name ?? '')
        setBio(profile.bio ?? '')
        setPortfolioUrl(profile.portfolio_url ?? '')
        setSelectedGenres(profile.genres ?? [])
        setEmail(profile.email ?? '')
        setIsPro(!!profile.is_pro)
        if (profile.created_at) {
          setMemberSince(new Date(profile.created_at).toLocaleDateString('en-GB', {
            month: 'long', year: 'numeric'
          }))
        }
      }
      setLoading(false)
    })
  }, [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await updateProfile({
      full_name: fullName || null,
      bio: bio || null,
      portfolio_url: portfolioUrl || null,
      genres: selectedGenres.length > 0 ? selectedGenres : null,
    })
    setSaving(false)

    if (result.ok) {
      addToast('Profile saved successfully!', 'success')
    } else {
      addToast(result.error ?? 'Failed to save profile.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Loading your profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Public Profile</h2>
          </div>

          <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="relative group shrink-0">
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
                      <Label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="bg-muted/30 border-border rounded-2xl h-12 px-4 focus:ring-primary/20 transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="portfolio" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">
                        Portfolio URL
                      </Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input
                          id="portfolio"
                          value={portfolioUrl}
                          onChange={e => setPortfolioUrl(e.target.value)}
                          placeholder="https://yourportfolio.com"
                          className="bg-muted/30 border-border rounded-2xl h-12 pl-11 pr-4 focus:ring-primary/20 transition-all text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">
                      Short Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell the world about your music style..."
                      className="bg-muted/30 border-border rounded-2xl min-h-[120px] p-4 focus:ring-primary/20 transition-all text-foreground"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border px-8 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-8 gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Genre Preferences */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <Music4 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Artist Preferences</h2>
          </div>

          <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">
                  Primary Genres <span className="normal-case text-muted-foreground/60">(tap to toggle)</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_GENRES.map(genre => {
                    const active = selectedGenres.includes(genre)
                    return (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          active
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-muted/30 text-foreground/70 hover:border-primary/50 hover:text-primary'
                        }`}
                      >
                        {active && <span className="mr-1.5 text-xs">✓</span>}
                        {genre}
                      </button>
                    )
                  })}
                </div>
                {selectedGenres.length > 0 && (
                  <button
                    onClick={() => setSelectedGenres([])}
                    className="text-xs text-muted-foreground/60 hover:text-destructive flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border px-8 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-8 gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Pro Membership / Upgrade */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Membership Status</h2>
          </div>

          {isPro ? (
            <Card className="relative bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-950 border border-emerald-500/30 rounded-[2rem] overflow-hidden shadow-2xl p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Star className="w-3.5 h-3.5 fill-current" /> Active Pro Member
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-2">SyncMaster Pro Active</h3>
                  <p className="text-slate-300 text-sm max-w-lg">
                    You have unlocked unlimited applications to briefs, and full access to the Agency and Radio directories. Thank you for supporting SyncMaster!
                  </p>
                </div>
                <div className="shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-6 py-3 rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Lifetime Access
                </div>
              </div>
            </Card>
          ) : (
            <PricingCard />
          )}
        </section>

        {/* Account & Security */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Account & Security</h2>
          </div>

          <Card className="bg-card border-border rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-foreground font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{email || '—'}</p>
                </div>
                <Button variant="outline" className="rounded-full border-border text-foreground hover:bg-muted/40 h-9 px-4 text-xs font-bold" disabled>
                  Managed by Auth
                </Button>
              </div>
              <div className="h-px bg-border w-full" />
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-foreground font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Reset via email link</p>
                </div>
                <Button variant="outline" className="rounded-full border-border text-foreground hover:bg-muted/40 h-9 px-4 text-xs font-bold">
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {memberSince && (
          <div className="pt-4 flex justify-center">
            <p className="text-xs text-muted-foreground/50 font-medium">
              Member since {memberSince}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
