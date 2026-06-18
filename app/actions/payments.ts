'use server'

import { getSessionUser } from '@/lib/supabase/session'
import { getProfile } from './profile'

export async function initiateProUpgrade(currency: 'NGN' | 'USD'): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    const user = await getSessionUser()
    if (!user) {
      return { ok: false, error: 'Unauthorized' }
    }

    const profile = await getProfile()
    if (!profile) {
      return { ok: false, error: 'User profile not found' }
    }

    const flwSecretKey = process.env.FLW_SECRET_KEY || process.env.FLW_CLIENT_SECRET
    if (!flwSecretKey) {
      console.error('FLW_SECRET_KEY (or FLW_CLIENT_SECRET) is not configured in the environment')
      return { ok: false, error: 'Payment gateway configuration error' }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const amount = currency === 'NGN' ? 10000 : 10 // 10,000 NGN or 10 USD
    const txRef = `syncmaster-pro-${user.id}-${Date.now()}`

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flwSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: amount.toString(),
        currency,
        redirect_url: `${appUrl}/dashboard/settings?payment_ref=${txRef}`,
        meta: {
          user_id: user.id,
        },
        customer: {
          email: user.email,
          name: profile.full_name || user.email.split('@')[0],
        },
        customizations: {
          title: 'SyncMaster Pro Upgrade',
          description: 'Unlock infinite submissions, full radio directory, and agency directory',
          logo: `${appUrl}/logo.png`,
        },
      }),
    })

    const data = await response.json()
    if (!response.ok || data.status !== 'success') {
      console.error('[initiateProUpgrade] Flutterwave API error:', data)
      return { ok: false, error: data.message || 'Failed to initiate payment' }
    }

    return { ok: true, url: data.data.link }
  } catch (error: any) {
    console.error('[initiateProUpgrade] Error:', error)
    return { ok: false, error: error.message || 'An unexpected error occurred' }
  }
}
