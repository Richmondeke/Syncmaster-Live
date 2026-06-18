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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const amount = currency === 'NGN' ? 10000 : 10
    const txRef = `syncmaster-pro-${user.id}-${Date.now()}`

    // Try V4 OAuth flow first (client_id + client_secret → token → API)
    const clientId = process.env.FLW_CLIENT_ID
    const clientSecret = process.env.FLW_CLIENT_SECRET || process.env.FLW_SECRET_KEY

    if (clientId && clientSecret) {
      try {
        // Step 1: Get OAuth access token
        const tokenRes = await fetch('https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
          }),
        })
        
        const tokenData = await tokenRes.json()
        
        if (tokenData.access_token) {
          // Step 2: Use Flutterwave Standard redirect URL with the public key
          // V4 OAuth tokens don't work with V3 /payments endpoint
          // Use the Flutterwave Standard (inline/redirect) checkout instead
          const publicKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || 'FLWPUBK-9ab51c135662a892a985f505959ca8a8-X'
          
          const checkoutUrl = `https://checkout.flutterwave.com/v3/hosted/pay?` + new URLSearchParams({
            public_key: publicKey,
            tx_ref: txRef,
            amount: amount.toString(),
            currency: currency,
            redirect_url: `${appUrl}/dashboard/settings?payment_ref=${txRef}`,
            'customer[email]': user.email,
            'customer[name]': profile.full_name || user.email.split('@')[0],
            'meta[user_id]': user.id,
            'customizations[title]': 'SyncMaster Pro Upgrade',
            'customizations[description]': 'Unlock infinite submissions, full radio directory, and agency directory',
            'customizations[logo]': `${appUrl}/logo.png`,
          }).toString()

          return { ok: true, url: checkoutUrl }
        }
      } catch (oauthErr) {
        console.warn('[initiateProUpgrade] V4 OAuth failed, trying V3 fallback:', oauthErr)
      }
    }

    // Fallback: Try V3 secret key directly
    const flwSecretKey = process.env.FLW_SECRET_KEY || process.env.FLW_CLIENT_SECRET
    if (flwSecretKey) {
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
          meta: { user_id: user.id },
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
      if (response.ok && data.status === 'success') {
        return { ok: true, url: data.data.link }
      }
      console.warn('[initiateProUpgrade] V3 API failed:', data)
    }

    // Final fallback: Use Flutterwave Standard hosted checkout (public key only)
    const publicKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || 'FLWPUBK-9ab51c135662a892a985f505959ca8a8-X'
    const checkoutUrl = `https://checkout.flutterwave.com/v3/hosted/pay?` + new URLSearchParams({
      public_key: publicKey,
      tx_ref: txRef,
      amount: amount.toString(),
      currency: currency,
      redirect_url: `${appUrl}/dashboard/settings?payment_ref=${txRef}`,
      'customer[email]': user.email,
      'customer[name]': profile.full_name || user.email.split('@')[0],
      'meta[user_id]': user.id,
      'customizations[title]': 'SyncMaster Pro Upgrade',
      'customizations[description]': 'Unlock unlimited submissions and full directory access',
    }).toString()

    return { ok: true, url: checkoutUrl }
  } catch (error: any) {
    console.error('[initiateProUpgrade] Error:', error)
    return { ok: false, error: error.message || 'An unexpected error occurred' }
  }
}
