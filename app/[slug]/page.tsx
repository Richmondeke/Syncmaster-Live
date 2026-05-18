import { notFound } from 'next/navigation'
import { getEPKBySlug } from '@/app/actions/epks'
import { getSessionUser } from '@/lib/supabase/session'
import { EPKPublicView } from '@/components/epk/EPKPublicView'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getEPKBySlug(slug)

  if (!result.success || !result.data) {
    return {
      title: 'Page Not Found | SyncMaster',
      description: 'The requested presentation page could not be found.'
    }
  }

  const epk = result.data
  return {
    title: `${epk.title} | Electronic Press Kit | SyncMaster`,
    description: epk.bio || `View the official Electronic Press Kit for ${epk.title} on SyncMaster.`,
    openGraph: {
      title: `${epk.title} | EPK | SyncMaster`,
      description: epk.bio || `View the official Electronic Press Kit for ${epk.title} on SyncMaster.`,
      images: epk.image_url ? [{ url: epk.image_url }] : [],
      type: 'music.playlist'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${epk.title} | EPK | SyncMaster`,
      description: epk.bio || `View the official Electronic Press Kit for ${epk.title} on SyncMaster.`,
      images: epk.image_url ? [epk.image_url] : []
    }
  }
}

export default async function PublicEPKPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getEPKBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  const epk = result.data
  const user = await getSessionUser()
  const isOwner = !!(user && user.id === epk.user_id)

  return (
    <div className="min-h-screen bg-slate-950">
      <EPKPublicView epk={epk} isOwner={isOwner} />
    </div>
  )
}
