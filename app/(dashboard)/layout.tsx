import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import type { Database, Role } from '@/types/database.types'

type ProfileRow = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'role' | 'full_name' | 'avatar_url'
>

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = { id: 'dummy-id', email: 'admin@example.com' }
  const profile: ProfileRow = {
    role: 'admin',
    full_name: 'Test Admin',
    avatar_url: null,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={profile.role as Role} />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Header
          user={{
            email: user.email ?? '',
            fullName: profile.full_name,
            role: profile.role as Role,
          }}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
