'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { analyzeBrief } from '@/agents/brief-analyzer'
import type { BriefStatus } from '@/types/database.types'

export type BriefFormState = { error: string | null }

export async function createBrief(
  prevState: BriefFormState,
  formData: FormData,
): Promise<BriefFormState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: producer } = await supabase
    .from('producers')
    .select('id')
    .eq('profile_id', user.id)
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

export async function updateBriefStatus(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')

  const briefId = formData.get('briefId') as string
  const status = formData.get('status') as BriefStatus

  if (!briefId || !['draft', 'active', 'matched', 'closed'].includes(status)) {
    throw new Error('Invalid input')
  }

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
}
