import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.warn('[Supabase Server] Missing env vars — returning no-op client')
    const handler: ProxyHandler<object> = {
      get: (_target, prop) => {
        if (prop === 'from') return () => new Proxy({}, handler)
        if (prop === 'then') return undefined
        if (prop === 'single' || prop === 'maybeSingle') return () => Promise.resolve({ data: null, error: null })
        if (prop === 'auth') return new Proxy({}, handler)
        if (prop === 'getUser' || prop === 'getSession') return () => Promise.resolve({ data: { user: null, session: null }, error: null })
        return (..._args: unknown[]) => new Proxy({}, handler)
      }
    }
    return new Proxy({}, handler) as any
  }

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — session refresh is handled by middleware.
          }
        },
      },
    }
  )
}
