import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'SyncMaster <noreply@syncmaster.io>'

export type EmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export async function sendEmail(to: string, subject: string, html: string): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    return {
      ok: false,
      error: 'Email service not configured (missing API key)',
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const response = await resend.emails.send({ from: FROM, to, subject, html })

  if (response.error) {
    console.error('[email] send failed:', response.error)
    return {
      ok: false,
      error: `Email delivery failed: ${response.error.message}`,
    }
  }

  return {
    ok: true,
    id: response.data?.id ?? 'unknown',
  }
}
