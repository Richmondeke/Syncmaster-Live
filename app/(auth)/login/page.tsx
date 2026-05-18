'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn, type AuthState } from '@/app/actions/auth'
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
import Image from 'next/image'

const initialState: AuthState = { error: null }

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 font-sans selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,153,255,0.05),transparent_50%)] pointer-events-none" />
      
      <Card className="w-full max-w-sm bg-black/40 backdrop-blur-xl border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardHeader className="text-center space-y-3 pt-10">
          <div className="mx-auto relative w-48 h-12 mb-4">
            <Image 
              src="/syncmasterwhite.png" 
              alt="SyncMaster Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <CardDescription className="text-white/50 font-medium">Welcome back to the sync hub</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-5 px-8">
            {state.error && (
              <p role="alert" className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                {state.error}
              </p>
            )}

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
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-white/40">Password</Label>
                <Link href="#" className="text-xs font-medium text-primary/60 hover:text-primary transition-colors">Forgot?</Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="bg-white/5 border-white/10 rounded-2xl h-12 px-4 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-white/20"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pt-6 pb-10 px-8">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-black font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100" 
              disabled={pending}
            >
              {pending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Signing in…</span>
                </div>
              ) : 'Sign in'}
            </Button>

            <p className="text-center text-sm text-white/40">
              New here?{' '}
              <Link
                href="/signup"
                className="text-white font-semibold hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
