import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Clock } from 'lucide-react'

export default async function DashboardPage() {
  const user = { id: 'dummy-id', created_at: new Date().toISOString() }
  const profile = { role: 'admin', full_name: 'Test Admin' }
  const composer = { status: 'approved' }

  if (composer?.status === 'pending') {
      return (
        <div className="flex flex-col gap-8 pt-4">
          <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">Dashboard</h1>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-md">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div className="flex flex-col gap-2">
                <p className="text-xl font-medium tracking-tight text-foreground">
                  Application under review
                </p>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                  We&apos;ve received your application and our team is reviewing it. We manually vet every
                  composer to ensure rights clarity and quality standards. We&apos;ll notify you by email
                  once the review is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (composer?.status === 'rejected') {
      return (
        <div className="flex flex-col gap-8 pt-4">
          <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">Dashboard</h1>
          <div className="rounded-3xl border border-destructive/30 bg-card p-8">
            <p className="text-xl font-medium tracking-tight text-destructive">Application not approved</p>
            <p className="text-base text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              Unfortunately your application wasn&apos;t approved at this time. Please contact us if
              you have any questions.
            </p>
          </div>
        </div>
      )
    }
  const firstName = profile.full_name?.split(' ')[0] ?? 'there'
  const accountAgeMs = Date.now() - new Date(user.created_at).getTime()
  const isNewUser = accountAgeMs < 2 * 60 * 1000

  return (
    <div className="flex flex-col gap-8 pt-4">
      <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">Dashboard</h1>
      <p className="text-lg text-muted-foreground tracking-tight">
        {isNewUser
          ? `Welcome to SyncMaster, ${firstName}!`
          : `Welcome back, ${firstName}.`}
      </p>
    </div>
  )
}
