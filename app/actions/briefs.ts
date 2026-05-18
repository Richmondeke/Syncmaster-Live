'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { analyzeBrief } from '@/agents/brief-analyzer'
import { assertValidBriefTransition } from '@/core/workflows/brief-workflow'
import type { BriefStatus } from '@/types/database.types'
import { cookies } from 'next/headers'

export type BriefFormState = { error: string | null }

export async function createBrief(
  prevState: BriefFormState,
  formData: FormData,
): Promise<BriefFormState> {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const role = cookieStore.get('role')?.value
  const sessionEmail = cookieStore.get('session_email')?.value

  if (!sessionEmail) return { error: 'Unauthorized' }
  if (role !== 'producer') return { error: 'Only producers can create briefs' }

  const userId = 'mock-producer-id'

  const { data: producer } = await supabase
    .from('producers')
    .select('id')
    .eq('profile_id', userId)
    .single()

  if (!producer) return { error: 'Producer profile not found. Please contact support.' }

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const genresRaw = (formData.get('genres') as string)?.trim()
  const budgetMin = formData.get('budget_min') as string
  const budgetMax = formData.get('budget_max') as string
  const deadline = formData.get('deadline') as string

  if (!title) return { error: 'Title is required' }
  if (title.length > 200) return { error: 'Title must be under 200 characters' }
  if (description && description.length > 2000) return { error: 'Description must be under 2000 characters' }

  const genres = genresRaw
    ? genresRaw
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)
    : null

  const budgetMinNum = budgetMin ? Number(budgetMin) : null
  const budgetMaxNum = budgetMax ? Number(budgetMax) : null

  if (budgetMinNum !== null && budgetMaxNum !== null && budgetMinNum > budgetMaxNum) {
    return { error: 'Budget minimum cannot exceed budget maximum' }
  }

  const { error } = await supabase.from('briefs').insert({
    producer_id: producer.id,
    title,
    description: description || null,
    genres,
    budget_min: budgetMinNum,
    budget_max: budgetMaxNum,
    deadline: deadline || null,
    status: 'draft',
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/briefs')
  redirect('/dashboard/briefs')
}

export async function updateBriefStatus(briefId: string, status: BriefStatus): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const cookieStore = await cookies()
    const role = cookieStore.get('role')?.value
    const sessionEmail = cookieStore.get('session_email')?.value

    if (!sessionEmail) return { error: 'Unauthorized' }
    if (role !== 'admin') return { error: 'Forbidden: Only admins can update brief status' }

    if (!briefId || !['draft', 'active', 'matched', 'closed'].includes(status)) {
      return { error: 'Invalid input' }
    }

    await assertValidBriefTransition(supabase, briefId, status)

    const { error } = await supabase.from('briefs').update({ status }).eq('id', briefId)
    if (error) throw error

    if (status === 'active') {
      try {
        await analyzeBrief(briefId)
      } catch {
        // AI analysis is best-effort — status update succeeds regardless
      }
    }

    revalidatePath('/dashboard/briefs')
    revalidatePath(`/dashboard/briefs/${briefId}`)
    
    return {}
  } catch (err: any) {
    console.error('Error in updateBriefStatus:', err)
    return { error: err.message || 'Failed to update brief status' }
  }
}
