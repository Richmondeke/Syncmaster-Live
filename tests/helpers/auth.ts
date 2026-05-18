import { Page } from '@playwright/test'

export async function loginAs(page: Page, role: 'admin' | 'producer' | 'composer') {
  const email =
    role === 'admin'
      ? process.env.TEST_ADMIN_EMAIL || 'admin@test.com'
      : role === 'producer'
        ? process.env.TEST_PRODUCER_EMAIL || 'producer@test.com'
        : process.env.TEST_COMPOSER_EMAIL || 'composer@test.com'
  const password =
    role === 'admin'
      ? process.env.TEST_ADMIN_PASSWORD || 'password'
      : role === 'producer'
        ? process.env.TEST_PRODUCER_PASSWORD || 'password'
        : process.env.TEST_COMPOSER_PASSWORD || 'password'

  await page.goto('/login')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /sign in|log in/i }).click()
  await page.waitForURL('**/dashboard**')
}
