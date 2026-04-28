import { Page } from '@playwright/test'

export async function loginAs(page: Page, role: 'admin' | 'producer' | 'composer') {
  const email =
    role === 'admin'
      ? process.env.TEST_ADMIN_EMAIL!
      : role === 'producer'
        ? process.env.TEST_PRODUCER_EMAIL!
        : process.env.TEST_COMPOSER_EMAIL!
  const password =
    role === 'admin'
      ? process.env.TEST_ADMIN_PASSWORD!
      : role === 'producer'
        ? process.env.TEST_PRODUCER_PASSWORD!
        : process.env.TEST_COMPOSER_PASSWORD!

  await page.goto('/login')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /sign in|log in/i }).click()
  await page.waitForURL('**/dashboard**')
}
