import { getRadioStations } from '@/app/actions/radio-stations'
import DirectoryClient from './DirectoryClient'
import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from '@/lib/supabase/session'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Directory - SyncMaster',
  description: 'Connect with sync agencies, music supervisors, and college radio stations — all in one place.',
}

export default async function DirectoryPage() {
  const stations = await getRadioStations()
  
  const supabase = await createClient()
  const userSession = await getSessionUser()
  let isPro = false
  if (userSession) {
    const { data } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', userSession.id)
      .single()
    isPro = !!data?.is_pro
  }

  return <DirectoryClient initialStations={stations} isPro={isPro} />
}
