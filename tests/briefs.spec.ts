import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Briefs — admin', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
  })

  test('briefs list page loads', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    await expect(page.getByRole('heading', { name: /briefs/i })).toBeVisible()
  })

  test('admin can view brief detail', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    await page.getByRole('link', { name: 'View' }).first().click()
    await expect(page).toHaveURL(/dashboard\/briefs\/.+/)
  })

  test('admin can see status controls on brief detail', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    await page.getByRole('link', { name: 'View' }).first().click()
    await expect(page).toHaveURL(/dashboard\/briefs\/.+/)
    // Status controls panel is always visible for non-closed briefs
    await expect(page.getByText('Status controls')).toBeVisible()
    const statusBtn = page.getByRole('button', {
      name: /activate brief|mark as matched|revert to draft|close brief/i,
    }).first()
    await expect(statusBtn).toBeVisible()
  })

  test('admin status change opens confirmation modal', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    await page.getByRole('link', { name: 'View' }).first().click()
    await expect(page).toHaveURL(/dashboard\/briefs\/.+/)
    const statusBtn = page.getByRole('button', {
      name: /activate brief|mark as matched|revert to draft|close brief/i,
    }).first()
    await statusBtn.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible()
    // Cancel without confirming
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})

test.describe('Briefs — producer', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'producer')
  })

  test('producer sees their briefs list', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    await expect(page.getByRole('heading', { name: /briefs/i })).toBeVisible()
    await expect(page.getByRole('link', { name: 'New brief' }).first()).toBeVisible()
  })

  test('producer can create a new brief', async ({ page }) => {
    await page.goto('/dashboard/briefs/new')
    await page.getByLabel(/brief title/i).fill('Test Brief ' + Date.now())
    await page.getByLabel(/description/i).fill('Playwright test brief')
    await page.getByRole('button', { name: 'Submit brief' }).click()
    await expect(page).toHaveURL(/dashboard\/briefs$/)
  })
})

test.describe('Briefs — composer', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'composer')
  })

  test('composer cannot access new brief page', async ({ page }) => {
    await page.goto('/dashboard/briefs/new')
    await expect(page).toHaveURL(/dashboard\/briefs$/)
  })
})
