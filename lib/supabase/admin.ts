import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

let _adminClient: SupabaseClient<Database> | null = null

export function getAdminClient(): SupabaseClient<Database> {
  if (_adminClient) return _adminClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn('[Admin Client] Missing SUPABASE env vars — returning a no-op client that always returns empty data.')
    // Return a proxy that mimics Supabase client but always returns empty results
    return new Proxy({} as SupabaseClient<Database>, {
      get: (_target, prop) => {
        if (prop === 'from') {
          return () => createEmptyQueryBuilder()
        }
        return () => ({})
      }
    })
  }

  _adminClient = createClient<Database>(url, key)
  return _adminClient
}

// Creates a chainable query builder that always resolves to empty data
function createEmptyQueryBuilder() {
  const handler: ProxyHandler<object> = {
    get: (_target, prop) => {
      if (prop === 'then') return undefined // Not a thenable
      // Terminal methods that return a result
      if (prop === 'single' || prop === 'maybeSingle') {
        return () => Promise.resolve({ data: null, error: null, count: null })
      }
      // Chainable methods (select, eq, order, limit, etc.)
      return (..._args: unknown[]) => new Proxy({}, handler)
    }
  }
  return new Proxy({}, handler)
}
