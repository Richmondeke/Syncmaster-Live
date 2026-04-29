import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'SyncMaster <noreply@syncmaster.io>'

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping send to', to)
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) {
    console.error('[email] send failed:', error)
    throw new Error(`Email delivery failed: ${error.message}`)
  }
}
