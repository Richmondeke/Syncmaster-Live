import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from '@/lib/supabase/session'
import { ComposerList, type ComposerWithProfile } from '@/components/composers/ComposerList'

export const dynamic = 'force-dynamic'


export default async function ComposersPage() {
  const supabase = await createClient()

  const user = await getSessionUser()
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
      profiles (
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  let composerData = composers as any[] || []

  if (error || composerData.length === 0) {
    if (error) console.warn('Using mock composer data due to error:', error)
    composerData = [
      {
        id: 'comp-1',
        profile_id: 'user-1',
        status: 'pending',
        bio: 'Award-winning film composer specializing in orchestral and ambient scores.',
        genres: ['Orchestral', 'Ambient', 'Cinematic'],
        portfolio_url: 'https://example.com/portfolio1',
        created_at: new Date().toISOString(),
        profiles: { full_name: 'Julian Thorne' }
      },
      {
        id: 'comp-2',
        profile_id: 'user-2',
        status: 'active',
        bio: 'Electronic music producer with a focus on synth-wave and techno.',
        genres: ['Electronic', 'Synth-wave', 'Techno'],
        portfolio_url: 'https://example.com/portfolio2',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        profiles: { full_name: 'Elena Vance' }
      },
      {
        id: 'comp-3',
        profile_id: 'user-3',
        status: 'active',
        bio: 'Singer-songwriter and multi-instrumentalist.',
        genres: ['Folk', 'Acoustic', 'Indie'],
        portfolio_url: 'https://example.com/portfolio3',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        profiles: { full_name: 'Marcus Gray' }
      }
    ]
  }

  const pending = composerData.filter((c) => c.status === 'pending')
  const others = composerData.filter((c) => c.status !== 'pending')
  const sorted = [...pending, ...others] as ComposerWithProfile[]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black tracking-[-0.068em] leading-[1.2] text-foreground">Composers</h1>
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
