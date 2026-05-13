'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp, type AuthState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Music2, CheckCircle2 } from 'lucide-react'

const initialState: AuthState = { error: null }

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 font-sans selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,153,255,0.05),transparent_50%)] pointer-events-none" />

      <Card className="w-full max-w-sm bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardHeader className="text-center space-y-3 pt-10">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
            <Music2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tighter text-white">Join SyncMaster</CardTitle>
          <CardDescription className="text-white/50 font-medium">Create your gateway to the industry</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-5 px-8">
            {state.error && (
              <p className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                {state.error}
              </p>
            )}

            <div className="space-y-2.5">
              <Label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">Full name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Hans Zimmer"
                autoComplete="name"
                required
                className="bg-white/5 border-white/10 rounded-2xl h-12 px-4 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="bg-white/5 border-white/10 rounded-2xl h-12 px-4 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" title="At least 8 characters" className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="bg-white/5 border-white/10 rounded-2xl h-12 px-4 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-white/20"
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-xs font-semibold uppercase tracking-widest text-white/40 ml-1">I am a…</Label>
              <div className="grid grid-cols-2 gap-3">
                {(['composer', 'producer'] as const).map((role) => (
                  <label key={role} className="relative flex cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      className="peer sr-only"
                      defaultChecked={role === 'composer'}
                      required
                    />
                    <div className="w-full h-24 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 transition-all group-hover:bg-white/[0.08] peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:ring-1 peer-checked:ring-primary/30">
                      <div className="text-white font-bold capitalize text-sm">{role}</div>
                      <CheckCircle2 className="w-4 h-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-[10px] text-white/30 text-center leading-relaxed px-2">
                Composers apply to briefs. Producers post them.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pt-8 pb-10 px-8">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-black font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100" 
              disabled={pending}
            >
              {pending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Creating account…</span>
                </div>
              ) : 'Create account'}
            </Button>

            <p className="text-center text-sm text-white/40">
              Already a member?{' '}
              <Link
                href="/login"
                className="text-white font-semibold hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
