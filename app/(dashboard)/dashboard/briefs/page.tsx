import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BriefList, type BriefWithProducer } from '@/components/briefs/BriefList'
import { buttonVariants } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function BriefsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  // ── Admin: see all briefs ───────────────────────────────────────────────────
  if (profile.role === 'admin') {
    const { data, error } = await supabase
      .from('briefs')
      .select(
        `id, producer_id, title, description, genres, budget_min, budget_max, deadline, status, created_at, updated_at,
        producers!inner ( company, profiles!inner ( full_name ) )`,
      )
      .order('created_at', { ascending: false })

    if (error) throw error

    const briefs = (data ?? []) as BriefWithProducer[]
    const draftCount = briefs.filter((b) => b.status === 'draft').length
    const sorted = [
      ...briefs.filter((b) => b.status === 'draft'),
      ...briefs.filter((b) => b.status !== 'draft'),
    ]

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Briefs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review producer briefs and manage status transitions.
          </p>
        </div>

        {draftCount > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {draftCount} brief{draftCount > 1 ? 's' : ''} awaiting review — open to activate
          </div>
        )}

        <BriefList briefs={sorted} showProducer />
      </div>
    )
  }

  // ── Producer: see own briefs ────────────────────────────────────────────────
  if (profile.role === 'producer') {
    const { data: producer } = await supabase
      .from('producers')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    let briefs: BriefWithProducer[] = []

    if (producer) {
      const { data, error } = await supabase
        .from('briefs')
        .select(
          'id, producer_id, title, description, genres, budget_min, budget_max, deadline, status, created_at, updated_at',
        )
        .eq('producer_id', producer.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      briefs = data ?? []
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Briefs</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Submit a brief and we'll hand-pick 3–5 vetted composers for you.
            </p>
          </div>
          <Link
            href="/dashboard/briefs/new"
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            <Plus className="h-4 w-4" />
            New brief
          </Link>
        </div>

        <BriefList briefs={briefs} />
      </div>
    )
  }

  redirect('/dashboard')
}
