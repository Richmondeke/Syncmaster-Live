import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import type { Database, Role } from '@/types/database.types'
import { cookies } from 'next/headers'
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext'
import { MusicPlayer } from '@/components/player/MusicPlayer'
import { getSessionUser } from '@/lib/supabase/session'

type ProfileRow = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'role' | 'full_name' | 'avatar_url'
> & { is_pro?: boolean }

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sessionEmail = cookieStore.get('session_email')?.value
  const roleOverride = (cookieStore.get('role')?.value || 'composer') as Role
  const fullNameOverride = cookieStore.get('full_name')?.value || 'Godliverse'

  if (!sessionEmail && process.env.NODE_ENV === 'production') {
    redirect('/login')
  }

  let isPro = false
  let fullName = fullNameOverride
  let userId = 'dummy-id'

  try {
    const supabase = await createClient()
    const userSession = await getSessionUser()

    if (userSession) {
      userId = userSession.id
      const { data } = await supabase
        .from('profiles')
        .select('full_name, is_pro')
        .eq('id', userSession.id)
        .single()
      
      if (data) {
        if (data.full_name) fullName = data.full_name
        isPro = !!data.is_pro
      }
    }
  } catch (err) {
    console.warn('[DashboardLayout] Failed to load profile, using defaults:', err)
  }

  const profile: ProfileRow = {
    role: roleOverride,
    full_name: fullName,
    avatar_url: null,
    is_pro: isPro,
  }

  const user = { id: userId, email: sessionEmail || 'admin@test.com' }

  return (
    <MusicPlayerProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar role={profile.role as Role} fullName={profile.full_name ?? undefined} isPro={profile.is_pro} />

        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <Header
            user={{
              email: user.email ?? '',
              fullName: profile.full_name,
              role: profile.role as Role,
            }}
          />
          <main className="flex-1 p-4 md:p-6 pb-20">{children}</main>
        </div>
      </div>
      <MusicPlayer />
    </MusicPlayerProvider>
  )
}
