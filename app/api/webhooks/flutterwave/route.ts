import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('verif-hash')
    const webhookHash = process.env.FLW_WEBHOOK_HASH

    // If verification hash is configured, verify it
    if (webhookHash && signature !== webhookHash) {
      console.warn('[Flutterwave Webhook] Invalid signature hash')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const payload = await req.json()
    console.log('[Flutterwave Webhook] Received payload:', JSON.stringify(payload, null, 2))

    const event = payload.event
    const data = payload.data

    if (event === 'charge.completed' && data && data.status === 'successful') {
      const transactionId = data.id
      const flwSecretKey = process.env.FLW_SECRET_KEY || process.env.FLW_CLIENT_SECRET

      if (!flwSecretKey) {
        console.error('[Flutterwave Webhook] FLW_SECRET_KEY (or FLW_CLIENT_SECRET) is missing')
        return new NextResponse('Configuration Error', { status: 500 })
      }

      // Verify transaction with Flutterwave API
      const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${flwSecretKey}`,
          'Content-Type': 'application/json',
        },
      })

      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || verifyData.status !== 'success' || verifyData.data.status !== 'successful') {
        console.error('[Flutterwave Webhook] Transaction verification failed:', verifyData)
        return new NextResponse('Verification Failed', { status: 400 })
      }

      // Transaction is genuine!
      const verifiedTx = verifyData.data
      const userId = verifiedTx.meta?.user_id || verifiedTx.meta?.metadata?.user_id
      const amount = verifiedTx.amount
      const currency = verifiedTx.currency

      console.log(`[Flutterwave Webhook] Transaction verified! User: ${userId}, Amount: ${amount} ${currency}`)

      if (!userId) {
        console.error('[Flutterwave Webhook] User ID missing in transaction meta')
        return new NextResponse('User ID missing', { status: 400 })
      }

      // Upgrade user to Pro in database
      const supabase = getAdminClient()
      const { error } = await supabase
        .from('profiles')
        .update({ is_pro: true })
        .eq('id', userId)

      if (error) {
        console.error('[Flutterwave Webhook] Database update error:', error)
        return new NextResponse('Database error', { status: 500 })
      }

      console.log(`[Flutterwave Webhook] Successfully upgraded user ${userId} to Pro!`)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error: any) {
    console.error('[Flutterwave Webhook] Error processing webhook:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
