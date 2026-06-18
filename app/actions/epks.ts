'use server'

import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from '@/lib/supabase/session'
import { revalidatePath } from 'next/cache'
import type { EPK, EPKTrack, EPKSocialLinks, EPKType, EPKStatus } from '@/types/epk.types'

export async function getEPKs(): Promise<EPK[]> {
  try {
    const user = await getSessionUser()
    if (!user) return []

    const supabase = await createClient() as any
    const { data, error } = await supabase
      .from('epks' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[EPK Action] Failed to fetch EPKs:', error.message)
      return []
    }

    return (data || []) as EPK[]
  } catch (err) {
    console.error('[EPK Action] Unexpected error fetching EPKs:', err)
    return []
  }
}

export async function getEPKBySlug(slug: string): Promise<{ success: boolean; data?: EPK; error?: string }> {
  try {
    const supabase = await createClient() as any
    const user = await getSessionUser()

    const { data, error } = await supabase
      .from('epks' as any)
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return { success: false, error: 'EPK not found' }
    }

    const epk = data as EPK

    // If draft, only the owner can access it
    if (epk.status === 'draft') {
      if (!user || user.id !== epk.user_id) {
        return { success: false, error: 'EPK not published' }
      }
    }

    // Increment views asynchronously if viewed by someone other than owner, or anonymously
    if (epk.status === 'published' && (!user || user.id !== epk.user_id)) {
      try {
        await supabase
          .from('epks' as any)
          .update({ views: epk.views + 1 })
          .eq('id', epk.id)
      } catch (viewErr) {
        console.warn('[EPK Action] Failed to increment views:', viewErr)
      }
    }

    return { success: true, data: epk }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' }
  }
}

export async function createEPK(data: {
  title: string
  slug: string
  type: EPKType
  status: EPKStatus
  image_url?: string
  bio?: string
  tracks?: EPKTrack[]
  social_links?: EPKSocialLinks
}): Promise<{ success: boolean; data?: EPK; error?: string }> {
  try {
    const user = await getSessionUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    if (!data.title?.trim()) return { success: false, error: 'Title is required' }
    if (!data.slug?.trim()) return { success: false, error: 'Slug is required' }

    // Normalize slug: lowercase and hyphenated
    const cleanSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')

    const supabase = await createClient() as any

    // Slug uniqueness check
    const { data: existing } = await supabase
      .from('epks' as any)
      .select('id')
      .eq('slug', cleanSlug)
      .maybeSingle()

    if (existing) {
      return { success: false, error: 'An EPK with this URL slug already exists.' }
    }

    const { data: inserted, error } = await supabase
      .from('epks' as any)
      .insert({
        user_id: user.id,
        title: data.title.trim(),
        slug: cleanSlug,
        type: data.type,
        status: data.status,
        image_url: data.image_url || null,
        bio: data.bio || null,
        tracks: data.tracks || [],
        social_links: data.social_links || {},
        views: 0
      })
      .select()
      .single()

    if (error) {
      // Catch mock interceptor duplicate_slug response
      if (error.message?.includes('duplicate_slug') || (error as any).code === '409') {
        return { success: false, error: 'An EPK with this URL slug already exists.' }
      }
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/epks')
    revalidatePath(`/epk/${cleanSlug}`)

    return { success: true, data: inserted as EPK }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' }
  }
}

export async function updateEPK(
  id: string,
  data: {
    title: string
    slug: string
    type: EPKType
    status: EPKStatus
    image_url?: string
    bio?: string
    tracks?: EPKTrack[]
    social_links?: EPKSocialLinks
  }
): Promise<{ success: boolean; data?: EPK; error?: string }> {
  try {
    const user = await getSessionUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    if (!data.title?.trim()) return { success: false, error: 'Title is required' }
    if (!data.slug?.trim()) return { success: false, error: 'Slug is required' }

    const cleanSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')

    const supabase = await createClient() as any

    // Security check: must own the EPK
    const { data: currentEPK, error: fetchError } = await supabase
      .from('epks' as any)
      .select('user_id, slug')
      .eq('id', id)
      .single()

    if (fetchError || !currentEPK) {
      return { success: false, error: 'EPK not found' }
    }

    if (currentEPK.user_id !== user.id) {
      return { success: false, error: 'Forbidden: You do not own this EPK' }
    }

    // Check slug uniqueness if changed
    if (cleanSlug !== currentEPK.slug) {
      const { data: existing } = await supabase
        .from('epks' as any)
        .select('id')
        .eq('slug', cleanSlug)
        .maybeSingle()

      if (existing) {
        return { success: false, error: 'An EPK with this URL slug already exists.' }
      }
    }

    const { data: updated, error } = await supabase
      .from('epks' as any)
      .update({
        title: data.title.trim(),
        slug: cleanSlug,
        type: data.type,
        status: data.status,
        image_url: data.image_url || null,
        bio: data.bio || null,
        tracks: data.tracks || [],
        social_links: data.social_links || {}
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.message?.includes('duplicate_slug') || (error as any).code === '409') {
        return { success: false, error: 'An EPK with this URL slug already exists.' }
      }
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/epks')
    revalidatePath(`/epk/${cleanSlug}`)
    if (currentEPK.slug !== cleanSlug) {
      revalidatePath(`/epk/${currentEPK.slug}`)
    }

    return { success: true, data: updated as EPK }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' }
  }
}

export async function deleteEPK(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getSessionUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const supabase = await createClient() as any

    // Security check: must own the EPK
    const { data: currentEPK, error: fetchError } = await supabase
      .from('epks' as any)
      .select('user_id, slug')
      .eq('id', id)
      .single()

    if (fetchError || !currentEPK) {
      return { success: false, error: 'EPK not found' }
    }

    if (currentEPK.user_id !== user.id) {
      return { success: false, error: 'Forbidden: You do not own this EPK' }
    }

    const { error } = await supabase
      .from('epks' as any)
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/epks')
    revalidatePath(`/epk/${currentEPK.slug}`)

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' }
  }
}
