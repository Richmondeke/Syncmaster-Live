'use client'

import { useTransition } from 'react'
import { LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/actions/auth'
import type { Role } from '@/types/database.types'

type Props = {
  user: {
    email: string
    fullName: string | null
    role: Role
  }
}

const ROLE_LABEL: Record<Role, string> = {
  composer: 'Composer',
  producer: 'Producer',
  admin: 'Admin',
}

const CRUMB_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/tracks': 'My Tracks',
  '/dashboard/submissions': 'Submissions',
  '/dashboard/briefs': 'Briefs',
  '/dashboard/placements': 'Placements',
  '/dashboard/composers': 'Composers',
  '/dashboard/producers': 'Producers',
  '/dashboard/tasks': 'Tasks',
  '/dashboard/settings': 'Settings',
}

function getCrumb(pathname: string): string {
  const matchedPath = Object.keys(CRUMB_LABELS)
    .sort((a, b) => b.length - a.length)
    .find((path) => pathname === path || pathname.startsWith(`${path}/`))

  return matchedPath ? CRUMB_LABELS[matchedPath] : 'Dashboard'
}

function getInitials(fullName: string | null, email: string): string {
  if (fullName) {
    return fullName
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }
  return email[0].toUpperCase()
}

export function Header({ user }: Props) {
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const crumb = getCrumb(pathname)

  function handleSignOut() {
    startTransition(() => signOut())
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Spacer keeps content right-aligned on mobile when hamburger is visible */}
      <div className="w-8 lg:hidden" aria-hidden="true" />

      <div className="min-w-0 flex-1">
        {crumb && <div className="label truncate">{crumb}</div>}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Badge variant="outline" className="hidden sm:flex">
          {ROLE_LABEL[user.role]}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(user.fullName, user.email)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  {user.fullName && (
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                  )}
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={pending}
              className="cursor-pointer gap-2"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {pending ? 'Signing out…' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
