import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import type { Database, Role } from '@/types/database.types'
import { cookies } from 'next/headers'
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext'
import { MusicPlayer } from '@/components/player/MusicPlayer'

type ProfileRow = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'role' | 'full_name' | 'avatar_url'
>

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

  const user = { id: 'dummy-id', email: sessionEmail || 'admin@test.com' }
  const profile: ProfileRow = {
    role: roleOverride,
    full_name: fullNameOverride,
    avatar_url: null,
  }

  return (
    <MusicPlayerProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar role={profile.role as Role} fullName={profile.full_name ?? undefined} />

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
