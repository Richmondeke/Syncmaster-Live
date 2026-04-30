import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Phase E: Core Functionality', () => {
  test('composers page loads with action buttons', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')

    // Page should load
    await expect(page.locator('h1:has-text("Composers")')).toBeVisible()

    // Approve and Reject buttons should be visible
    const approveButton = page.locator('button:has-text("Approve")').first()
    const rejectButton = page.locator('button:has-text("Reject")').first()

    await expect(approveButton).toBeVisible()
    await expect(rejectButton).toBeVisible()
  })

  test('loading state appears when approving', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')

    const approveButton = page.locator('button:has-text("Approve")').first()

    // Click approve
    await approveButton.click()

    // Button should become disabled
    await expect(approveButton).toBeDisabled()

    // Loading text or spinner should appear
    const loadingIndicator = page.locator('button:has-text("Approving…")')
    await expect(loadingIndicator).toBeVisible()
  })

  test('reject dialog opens and closes properly', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')

    const rejectButton = page.locator('button:has-text("Reject")').first()
    await rejectButton.click()

    // Dialog should appear
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Dialog should contain textarea
    const textarea = dialog.locator('textarea')
    await expect(textarea).toBeVisible()

    // Cancel button should work
    const cancelButton = dialog.locator('button:has-text("Cancel")')
    await cancelButton.click()

    // Dialog should close
    await expect(dialog).not.toBeVisible()
  })

  test('page responds to mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')

    // Page should still be usable on mobile
    const header = page.locator('h1')
    await expect(header).toBeVisible()

    // Table should still exist but might scroll
    const table = page.locator('table')
    await expect(table).toBeVisible()

    // Buttons should still be clickable
    const button = page.locator('button').first()
    await expect(button).toBeEnabled()
  })

  test('page displays properly on desktop (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')

    // All elements should be visible on desktop
    const header = page.locator('h1')
    await expect(header).toBeVisible()

    const table = page.locator('table')
    await expect(table).toBeVisible()

    // Table headers should all be visible
    const headers = page.locator('th')
    const headerCount = await headers.count()
    expect(headerCount).toBeGreaterThan(3)
  })
})
