'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

type NavItem = {
  label: string
  href: string
  description?: string
}

type NavGroup = {
  trigger: string
  items: NavItem[]
  paths: string[]
}

const navGroups: NavGroup[] = [
  {
    trigger: 'Solutions',
    paths: ['/composers', '/supervisors', '/how-it-works'],
    items: [
      { label: 'For Composers', href: '/composers', description: 'Apply, get vetted, receive briefs' },
      { label: 'For Supervisors', href: '/supervisors', description: 'Post a brief, get 3–5 curated matches' },
      { label: 'How It Works', href: '/how-it-works', description: 'The full curation loop explained' },
    ],
  },
  {
    trigger: 'Platform',
    paths: ['/platform'],
    items: [
      { label: 'The Platform', href: '/platform', description: 'Features for composers and supervisors' },
      { label: 'Milestones & Rank', href: '/platform#milestones', description: 'Track progress, earn badges' },
      { label: 'Pricing', href: '/pricing', description: 'Commission-only — no subscription' },
    ],
  },
  {
    trigger: 'Resources',
    paths: ['/blog', '/about', '/brand'],
    items: [
      { label: 'Blog', href: '/blog', description: 'Sync knowledge. African perspective.' },
      { label: 'About Us', href: '/about', description: 'The mission and the team' },
      { label: 'Brand Assets', href: '/brand', description: 'Logos, colours, guidelines' },
    ],
  },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isGroupActive(group: NavGroup): boolean {
    return group.paths.some((p) => pathname === p || pathname.startsWith(p + '/'))
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-screen-2xl w-full mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-40 h-10 transition-transform group-hover:scale-105">
              <Image src="/syncmaster-logo-light.svg" alt="SyncMaster Logo" fill className="object-contain dark:hidden" priority />
              <Image src="/syncmaster-logo-dark.svg" alt="SyncMaster Logo" fill className="object-contain hidden dark:block" priority />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navGroups.map((group) => {
              const active = isGroupActive(group)
              return (
                <DropdownMenu key={group.trigger}>
                  <DropdownMenuTrigger className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-colors outline-none ${
                    active ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}>
                    {group.trigger}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 bg-popover border border-border rounded-2xl shadow-lg mt-1">
                    {group.items.map((item) => (
                      <DropdownMenuItem key={item.href} className="p-0 focus:bg-transparent">
                        <Link
                          href={item.href}
                          className="flex flex-col gap-0.5 w-full px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer outline-none"
                        >
                          <span className="text-sm font-black text-foreground">{item.label}</span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground leading-snug">{item.description}</span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <ThemeToggle />
            <Link
              href="/signup"
              className={buttonVariants({ variant: 'default', size: 'sm' }) + ' hidden md:inline-flex rounded-full px-6 font-bold'}
            >
              Get early access
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-full bg-background border-l border-border flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-border shrink-0">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <div className="relative w-32 h-8">
                  <Image src="/syncmaster-logo-light.svg" alt="SyncMaster Logo" fill className="object-contain dark:hidden" />
                  <Image src="/syncmaster-logo-dark.svg" alt="SyncMaster Logo" fill className="object-contain hidden dark:block" />
                </div>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel links */}
            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
              {navGroups.map((group) => (
                <div key={group.trigger} className="flex flex-col gap-1">
                  <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {group.trigger}
                  </p>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-black text-foreground">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      )}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Panel footer CTAs */}
            <div className="shrink-0 px-4 pb-8 pt-4 border-t border-border flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className={buttonVariants({ variant: 'default' }) + ' w-full rounded-full font-bold text-center'}
              >
                Get early access
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
