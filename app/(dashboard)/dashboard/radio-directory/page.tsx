import { getRadioStations } from '@/app/actions/radio-stations'
import RadioDirectoryClient from './RadioDirectoryClient'
import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from '@/lib/supabase/session'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Radio Directory - SyncMaster',
  description: 'Search, filter, and connect with over 400 college radio stations across the country.',
}

export default async function RadioDirectoryPage() {
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

  return <RadioDirectoryClient initialStations={stations} isPro={isPro} />
}
