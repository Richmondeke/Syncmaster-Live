'use server'

import { headers } from 'next/headers'

export async function detectCurrency(): Promise<'NGN' | 'USD'> {
  try {
    const headersList = await headers()
    const country = headersList.get('x-vercel-ip-country')
    if (country && (country.toUpperCase() === 'NG' || country.toUpperCase() === 'NGA')) {
      return 'NGN'
    }
  } catch (e) {
    console.error('[detectCurrency] Failed to read headers:', e)
  }
  return 'USD'
}
