'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import {
  LayoutDashboard,
  Layers,
  Activity,
  Briefcase,
  Building2,
  Sparkles,
  Search,
  TrendingUp,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
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
  { 
    label: 'My Library', 
    href: '/dashboard/tracks', 
    icon: Layers, 
    roles: ['composer', 'admin'] 
  },
  { 
    label: 'Applications', 
    href: '/dashboard/submissions', 
    icon: Activity, 
    roles: ['composer', 'admin'] 
  },
  {
    label: 'Briefs',
    href: '/dashboard/briefs',
    icon: Briefcase,
    roles: ['composer', 'producer', 'admin'],
  },
  {
    label: 'Agency Directory',
    href: '/dashboard/directory',
    icon: Building2,
    roles: ['composer', 'producer', 'admin'],
  },
  {
    label: 'AI Tagger',
    href: '/dashboard/tagger',
    icon: Sparkles,
    roles: ['composer', 'producer', 'admin'],
  },
  {
    label: 'Sound Radar',
    href: '/dashboard/radar',
    icon: Search,
    roles: ['composer', 'producer', 'admin'],
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
    label: 'Profile & Settings',
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
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all',
        isActive
          ? 'bg-white text-primary shadow-[0_0_20px_rgba(255,255,255,0.15)]'
          : 'text-white/70 hover:text-white hover:bg-white/10'
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
      <nav className="flex flex-col gap-2" aria-label="Main navigation">
        {main.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-2">
        <Separator className="mb-4 bg-white/20" />
        {bottom.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavigate}
          />
        ))}
        
        {/* User Profile Section */}
        <div className="mt-4 p-4 rounded-2xl bg-black/15 border border-white/15">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/15 border border-white/20">
              <img src={`https://ui-avatars.com/api/?name=${role}&background=4b4bc0&color=fff`} className="w-full h-full object-cover" alt="User" />
            </div>
            <div className="overflow-hidden text-left">
              <div className="font-bold text-white text-xs truncate capitalize">{role}</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">Active Account</div>
            </div>
          </div>
          <button 
            className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold text-white/80 hover:bg-white/10 rounded-xl uppercase tracking-widest transition-colors"
            onClick={() => {/* Implement logout */}}
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
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
        className="fixed left-4 top-4 z-50 lg:hidden bg-primary border border-white/20 text-white hover:bg-primary/90"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar container (Shared for Mobile and Desktop) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-primary border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-20 shrink-0 items-center px-8">
          <Image
            src="/Syncdark.png"
            alt="SyncMaster Logo"
            width={120 * 1.5}
            height={40 * 1.5}
            className="h-auto w-auto opacity-90"
            priority
          />
        </div>
        <SidebarContent role={role} pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>
    </>
  )
}
