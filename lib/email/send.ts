import { Resend } from 'resend'

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'SyncMaster <noreply@syncmaster.io>',
    to,
    subject,
    html,
  })

  if (error) {
    console.error('[email] send failed:', error)
  }
}
