import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  if (profile.role === 'composer') {
    const { data: composer } = await supabase
      .from('composers')
      .select('status')
      .eq('profile_id', user.id)
      .single()

    if (composer?.status === 'pending') {
      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Application under review
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
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
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
            <p className="font-semibold text-destructive">Application not approved</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Unfortunately your application wasn&apos;t approved at this time. Please contact us if
              you have any questions.
            </p>
          </div>
        </div>
      )
    }
  }

  const firstName = profile.full_name?.split(' ')[0] ?? 'there'
  const accountAgeMs = Date.now() - new Date(user.created_at).getTime()
  const isNewUser = accountAgeMs < 2 * 60 * 1000

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        {isNewUser
          ? `Welcome to SyncMaster, ${firstName}!`
          : `Welcome back, ${firstName}.`}
      </p>
    </div>
  )
}
