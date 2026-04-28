import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'SyncMaster <noreply@syncmaster.io>'

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  await resend.emails.send({ from: FROM, to, subject, html })
}
