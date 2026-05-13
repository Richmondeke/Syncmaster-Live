import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ComposerList, type ComposerWithProfile } from '@/components/composers/ComposerList'

export default async function ComposersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: composers, error } = await supabase
    .from('composers')
    .select(`
      id,
      profile_id,
      status,
      bio,
      genres,
      portfolio_url,
      created_at,
      profiles!inner (
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  const pending = (composers ?? []).filter((c) => c.status === 'pending')
  const others = (composers ?? []).filter((c) => c.status !== 'pending')
  const sorted = [...pending, ...others] as ComposerWithProfile[]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-white">Composers</h1>
        <p className="text-lg text-muted-foreground tracking-tight mt-2">
          Review applications and manage composer status.
        </p>
      </div>

      {pending.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          {pending.length} application{pending.length > 1 ? 's' : ''} pending review
        </div>
      )}

      <ComposerList composers={sorted} />
    </div>
  )
}
