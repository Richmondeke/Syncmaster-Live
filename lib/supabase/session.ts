/**
 * Mock session helper for the offline/test environment.
 *
 * Because we use plain cookies (session_email, role, full_name) rather than
 * Supabase JWT tokens, `supabase.auth.getUser()` always returns null.
 * This helper reads the same cookies our signIn action sets and returns a
 * user-like object that the rest of the app can use directly.
 */
import { cookies } from 'next/headers'

export type MockUser = {
  id: string
  email: string
  user_metadata: {
    full_name: string
    role: string
  }
}

export async function getSessionUser(): Promise<MockUser | null> {
  const cookieStore = await cookies()
  const sessionEmail = cookieStore.get('session_email')?.value
  if (!sessionEmail) return null

  let role = cookieStore.get('role')?.value || 'admin'
  let id = 'mock-admin-id'

  // Specific known admin emails take priority
  if (sessionEmail === 'richmond@guava.earth') {
    id = 'richmond-admin-id'
    role = 'admin'
  } else if (sessionEmail.includes('composer')) {
    id = 'a2308014-7225-474f-a2e1-04a02111e348'
    role = 'composer'
  } else if (sessionEmail.includes('producer')) {
    id = 'mock-producer-id'
    role = 'producer'
  }

  return {
    id,
    email: sessionEmail,
    user_metadata: {
      full_name: cookieStore.get('full_name')?.value || 'Godliverse',
      role,
    },
  }
}
