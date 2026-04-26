'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Menu,
  Music2,
  Send,
  Settings,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Role } from '@/types/database.types'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  roles: Role[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['composer', 'producer', 'admin'],
  },
  { label: 'My Tracks', href: '/dashboard/tracks', icon: Music2, roles: ['composer'] },
  { label: 'Submissions', href: '/dashboard/submissions', icon: Send, roles: ['composer'] },
  {
    label: 'Briefs',
    href: '/dashboard/briefs',
    icon: FileText,
    roles: ['producer', 'admin'],
  },
  {
    label: 'Placements',
    href: '/dashboard/placements',
    icon: TrendingUp,
    roles: ['composer', 'producer', 'admin'],
  },
  { label: 'Composers', href: '/dashboard/composers', icon: Users, roles: ['admin'] },
  { label: 'Producers', href: '/dashboard/producers', icon: Users, roles: ['admin'] },
  { label: 'Tasks', href: '/dashboard/tasks', icon: ClipboardList, roles: ['admin'] },
]

const BOTTOM_ITEMS: NavItem[] = [
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['composer', 'producer', 'admin'],
  },
]

type Props = { role: Role }

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem
  pathname: string
  onClick?: () => void
}) {
  const isActive = pathname === item.href
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {item.label}
    </Link>
  )
}

function SidebarContent({
  role,
  pathname,
  onNavigate,
}: {
  role: Role
  pathname: string
  onNavigate?: () => void
}) {
  const main = NAV_ITEMS.filter((item) => item.roles.includes(role))
  const bottom = BOTTOM_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
      <nav className="flex flex-col gap-1" aria-label="Main navigation">
        {main.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavigate} />
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        <Separator className="mb-2" />
        {bottom.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavigate} />
        ))}
      </div>
    </div>
  )
}

export function Sidebar({ role }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        className="fixed left-3 top-3 z-50 lg:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-200 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-14 shrink-0 items-center border-b px-4">
          <span className="text-lg font-bold">SyncMaster</span>
        </div>
        <SidebarContent role={role} pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-background lg:flex"
        aria-label="Sidebar"
      >
        <div className="flex h-14 shrink-0 items-center border-b px-4">
          <span className="text-lg font-bold">SyncMaster</span>
        </div>
        <SidebarContent role={role} pathname={pathname} />
      </aside>
    </>
  )
}
