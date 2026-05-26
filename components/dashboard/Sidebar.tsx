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
  Headphones,
  FileText,
  CheckSquare,
  Mail,
  MonitorPlay,
  Radio
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Role } from '@/types/database.types'
import { signOut } from '@/app/actions/auth'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  roles: Role[]
}

const NAV_GROUPS: Record<string, NavItem[]> = {
  workspace: [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['composer', 'producer', 'admin'],
    },
    { 
      label: 'Catalog', 
      href: '/dashboard/tracks', 
      icon: Layers, 
      roles: ['composer', 'admin'] 
    },
    {
      label: 'Briefs',
      href: '/dashboard/briefs',
      icon: Briefcase,
      roles: ['composer', 'producer', 'admin'],
    },
    {
      label: 'Placements',
      href: '/dashboard/placements',
      icon: TrendingUp,
      roles: ['composer', 'producer', 'admin'],
    },
  ],
  distribution: [
    {
      label: 'Pages (EPK)',
      href: '/dashboard/epks',
      icon: MonitorPlay,
      roles: ['admin', 'composer'],
    },
    {
      label: 'Campaigns',
      href: '/dashboard/campaigns',
      icon: Mail,
      roles: ['admin', 'composer'],
    },
    {
      label: 'Radio Directory',
      href: '/dashboard/radio-directory',
      icon: Radio,
      roles: ['admin', 'composer'],
    }
  ],
  network: [
    { label: 'Composers', href: '/dashboard/composers', icon: Users, roles: ['admin', 'sync_supervisor' as Role] },
    { label: 'Producers', href: '/dashboard/producers', icon: Headphones, roles: ['admin', 'sync_supervisor' as Role] },
  ],
  operations: [
    { 
      label: 'Marketplace', 
      href: '/dashboard/marketplace', 
      icon: Building2, 
      roles: ['admin'] 
    },
  ]
}

const BOTTOM_ITEMS: NavItem[] = [
  {
    label: 'Profile & Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['composer', 'producer', 'admin'],
  },
]

type Props = { 
  role: Role
  fullName?: string
}

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem
  pathname: string
  onClick?: () => void
}) {
  // Robust isActive logic: exact match for root dashboard, specific prefix for others
  const normalizedPath = pathname.split('?')[0].split('#')[0].replace(/\/$/, '')
  const normalizedItemHref = item.href.replace(/\/$/, '')
  
  const isActive = normalizedItemHref === '/dashboard' 
    ? normalizedPath === '/dashboard' 
    : normalizedPath === normalizedItemHref || normalizedPath.startsWith(`${normalizedItemHref}/`)
  
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-black tracking-[-0.068em] transition-all duration-200 group',
        isActive
          ? 'bg-white text-primary shadow-xl scale-[1.02] border-r-4 border-primary/20'
          : 'text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-1'
      )}
    >
      <item.icon className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        isActive ? "scale-110" : "group-hover:scale-110"
      )} aria-hidden="true" />
      {item.label}
    </Link>
  )
}

function SidebarContent({
  role,
  fullName,
  pathname,
  onNavigate,
}: {
  role: Role
  fullName?: string
  pathname: string
  onNavigate?: () => void
}) {
  const isAdmin = role === 'admin'
  const profile = { role, full_name: fullName || 'Godliverse' }
  const bottom = BOTTOM_ITEMS.filter((item) => item.roles.includes(role))

  const renderGroup = (title: string, items: any[]) => {
    const filteredItems = items.filter((item) => item.roles.includes(role))
    if (filteredItems.length === 0) return null

    return (
      <div className="flex flex-col gap-1 mb-7">
        <div className="px-4 mb-2.5 text-[10px] font-black text-sidebar-foreground/40 tracking-[0.05em] flex items-center gap-2">
          <span className="w-1.5 h-[1px] bg-white/20" />
          {title}
        </div>
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavigate}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4 pt-6 scrollbar-none">
      <nav className="flex flex-col" aria-label="Main navigation">
        {isAdmin ? (
          <>
            {renderGroup('Workspace', NAV_GROUPS.workspace)}
            {renderGroup('Distribution', NAV_GROUPS.distribution)}
            {renderGroup('Network', NAV_GROUPS.network)}
            {renderGroup('Operations', NAV_GROUPS.operations)}
          </>
        ) : (
          <div className="flex flex-col gap-1">
            {NAV_GROUPS.workspace
              .filter(item => item.roles.includes(role))
              .map(item => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={onNavigate}
                />
              ))}
            {NAV_GROUPS.distribution
              .filter(item => item.roles.includes(role))
              .map(item => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={onNavigate}
                />
              ))}
          </div>
        )}
      </nav>


      <div className="flex flex-col gap-2 mt-auto pt-6">
        <Separator className="mb-4 bg-white/10" />
        {bottom.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavigate}
          />
        ))}
        
        {/* User Profile Section */}
        <div className="mt-4 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white/10 border border-white/20 p-0.5 shadow-xl transition-transform duration-300 group-hover:scale-110">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=4b4bc0&color=fff&bold=true`} 
                className="w-full h-full rounded-[14px] object-cover" 
                alt={profile.full_name} 
              />
            </div>
            <div className="overflow-hidden text-left">
              <div className="font-black text-white text-sm tracking-[-0.04em] truncate">{profile.full_name}</div>
              <div className="text-[10px] text-white/50 font-bold tracking-tight mt-0.5 capitalize">{profile.role} access</div>
            </div>
          </div>
          <form action={signOut} className="relative z-10 w-full">
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-black text-white/60 hover:text-white hover:bg-white/10 rounded-2xl tracking-tight transition-all border border-transparent hover:border-white/10 shadow-lg"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ role, fullName }: Props) {
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
        <SidebarContent role={role} fullName={fullName} pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>
    </>
  )
}
