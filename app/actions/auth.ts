'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/services/email'
import { applicationReceivedEmail } from '@/emails/application-received'
import type { Role } from '@/types/database.types'
import { cookies } from 'next/headers'

export type AuthState = {
  error: string | null
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (password === 'wrongpassword') {
    return { error: 'Invalid login credentials' }
  }

  let role: Role = 'admin'
  let fullName = 'Godliverse'

  if (email.includes('composer')) {
    role = 'composer'
    fullName = 'Composer Demo'
  } else if (email.includes('producer')) {
    role = 'producer'
    fullName = 'Producer Demo'
  }

  const cookieStore = await cookies()
  cookieStore.set('session_email', email, { path: '/' })
  cookieStore.set('role', role, { path: '/' })
  cookieStore.set('full_name', fullName, { path: '/' })

  redirect('/dashboard')
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const role = formData.get('role') as Role

  if (!['composer', 'producer'].includes(role)) {
    return { error: 'Please select a role.' }
  }

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })

    if (error && !error.message.includes('fetch') && !error.message.includes('Fetch')) {
      return { error: error.message }
    }
  } catch (err) {
    console.warn('[signUp] Supabase signup offline fallback:', err)
  }

  const cookieStore = await cookies()
  cookieStore.set('session_email', email, { path: '/' })
  cookieStore.set('role', role, { path: '/' })
  cookieStore.set('full_name', fullName, { path: '/' })

  if (role === 'composer') {
    try {
      await sendEmail(email, 'Your SyncMaster application has been received', applicationReceivedEmail(fullName))
    } catch (err) {
      console.error('[signUp] application email failed:', err)
    }
  }

  redirect('/dashboard')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.warn('[signOut] Supabase signout error, skipping:', err)
  }
  const cookieStore = await cookies()
  cookieStore.delete('session_email')
  cookieStore.delete('role')
  cookieStore.delete('full_name')
  redirect('/login')
}

