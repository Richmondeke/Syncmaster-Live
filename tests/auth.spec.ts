import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test('admin can log in and reach dashboard', async ({ page }) => {
  await loginAs(page, 'admin')
  await expect(page).toHaveURL(/dashboard/)
})

test('composer can log in and reach dashboard', async ({ page }) => {
  await loginAs(page, 'composer')
  await expect(page).toHaveURL(/dashboard/)
})

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/login/)
})

test('invalid credentials show error', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('nobody@example.com')
  await page.getByLabel(/password/i).fill('wrongpassword')
  await page.getByRole('button', { name: /sign in|log in/i }).click()
  await expect(page.getByRole('alert')).toBeVisible()
})
