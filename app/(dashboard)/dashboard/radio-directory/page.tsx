import { getRadioStations } from '@/app/actions/radio-stations'
import RadioDirectoryClient from './RadioDirectoryClient'

export const metadata = {
  title: 'Radio Directory - SyncMaster',
  description: 'Search, filter, and connect with over 400 college radio stations across the country.',
}

export default async function RadioDirectoryPage() {
  const stations = await getRadioStations()
  return <RadioDirectoryClient initialStations={stations} />
}
