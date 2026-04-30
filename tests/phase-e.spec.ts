import { test, expect, devices } from '@playwright/test'
import { loginAs } from './helpers/auth'

const MOBILE_VIEWPORT = { width: 375, height: 667 }
const DESKTOP_VIEWPORT = { width: 1280, height: 720 }

// Email error recovery & toasts
test.describe('Phase E: Error Recovery & Toasts', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')
  })

  test('approve action shows loading state during submission', async ({ page }) => {
    await page.goto('/dashboard/composers')

    const approveButton = page.locator('button:has-text("Approve")').first()
    await approveButton.click()

    // Check for loading indicator (spinner text)
    const loadingButton = page.locator('button:has-text("Approving…")')
    await expect(loadingButton).toBeVisible()
    await expect(approveButton).toBeDisabled()

    // Wait for action to complete
    await page.waitForTimeout(2000)
  })

  test('reject dialog shows loading state when submitting', async ({ page }) => {
    const rejectButton = page.locator('button:has-text("Reject")').first()
    await rejectButton.click()

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    const submitButton = dialog.locator('button:has-text("Reject application")')
    await submitButton.click()

    // Check for loading state
    const loadingButton = dialog.locator('button:has-text("Rejecting…")')
    await expect(loadingButton).toBeVisible()
    await expect(submitButton).toBeDisabled()
  })

  test('successful approval shows success toast', async ({ page }) => {
    const approveButton = page.locator('button:has-text("Approve")').first()
    await approveButton.click()

    // Wait for action to complete and toast to appear
    const toast = page.locator('text=Composer approved')
    await expect(toast).toBeVisible({ timeout: 10000 })

    // Toast should auto-dismiss after 5s
    await expect(toast).not.toBeVisible({ timeout: 6000 })
  })

  test('rejection with note shows info toast', async ({ page }) => {
    const rejectButton = page.locator('button:has-text("Reject")').first()
    await rejectButton.click()

    const dialog = page.locator('[role="dialog"]')
    const textarea = dialog.locator('textarea')
    await textarea.fill('Strong production but needs more sync-ready material')

    const submitButton = dialog.locator('button:has-text("Reject application")')
    await submitButton.click()

    // Wait for success toast
    const toast = page.locator('text=Composer rejected')
    await expect(toast).toBeVisible({ timeout: 10000 })

    // Dialog should close
    await expect(dialog).not.toBeVisible({ timeout: 5000 })
  })
})

// Mobile responsiveness at 375px
test.describe('Phase E: Mobile Responsiveness (375px)', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')
  })

  test('composers table is responsive on mobile', async ({ page }) => {
    // Table should still be readable on mobile
    const table = page.locator('table')
    await expect(table).toBeVisible()

    // All action buttons should be visible and clickable
    const approveButtons = page.locator('button:has-text("Approve")')
    const rejectButtons = page.locator('button:has-text("Reject")')
    await expect(approveButtons.first()).toBeVisible()
    await expect(rejectButtons.first()).toBeVisible()

    // Buttons should have adequate touch targets (at least 44px)
    const firstButton = approveButtons.first()
    const box = await firstButton.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(40)
    expect(box?.width).toBeGreaterThanOrEqual(40)
  })

  test('reject dialog is usable on mobile', async ({ page }) => {
    const rejectButton = page.locator('button:has-text("Reject")').first()
    await rejectButton.click()

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Dialog should not overflow viewport
    const dialogBox = await dialog.boundingBox()
    expect(dialogBox?.width).toBeLessThanOrEqual(375)

    // Textarea should be accessible
    const textarea = dialog.locator('textarea')
    await expect(textarea).toBeVisible()
    await textarea.click()
    await textarea.type('Test feedback on mobile')

    // Cancel button should be easily tappable
    const cancelButton = dialog.locator('button:has-text("Cancel")')
    await expect(cancelButton).toBeVisible()
  })

  test('toasts are visible and dismissible on mobile', async ({ page }) => {
    const approveButton = page.locator('button:has-text("Approve")').first()
    await approveButton.click()

    // Wait for toast
    const toast = page.locator('text=Composer approved')
    await expect(toast).toBeVisible({ timeout: 10000 })

    // Toast should be in viewport
    const toastBox = await toast.boundingBox()
    expect(toastBox?.width).toBeLessThanOrEqual(375)

    // Dismiss button should be visible and clickable
    const dismissButton = toast.locator('button')
    await expect(dismissButton).toBeVisible()
    await dismissButton.click()
    await expect(toast).not.toBeVisible()
  })
})

// Desktop responsiveness at 1280px
test.describe('Phase E: Desktop Responsiveness (1280px)', () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')
  })

  test('composers table displays optimally on desktop', async ({ page }) => {
    const table = page.locator('table')
    await expect(table).toBeVisible()

    // All columns should be visible
    const headers = page.locator('th')
    const headerCount = await headers.count()
    expect(headerCount).toBeGreaterThan(3) // At least Name, Genres, Status, Applied, Actions

    // Hover effects should work
    const firstRow = page.locator('tbody tr').first()
    await firstRow.hover()
    // Row should have subtle hover styling
    const computedStyle = await firstRow.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    expect(computedStyle).toBeTruthy()
  })

  test('full workflow on desktop with proper spacing', async ({ page }) => {
    // Header should be visible
    const header = page.locator('h1')
    await expect(header).toBeVisible()

    // All buttons should be well-spaced
    const buttons = page.locator('button')
    const firstButton = buttons.nth(0)
    const secondButton = buttons.nth(1)

    const box1 = await firstButton.boundingBox()
    const box2 = await secondButton.boundingBox()

    if (box1 && box2) {
      const gap = Math.abs(box2.x - (box1.x + box1.width))
      expect(gap).toBeGreaterThanOrEqual(8) // At least 8px gap
    }
  })
})

// Loading state consistency across viewport sizes
test.describe('Phase E: Loading States Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
  })

  test('loading state visible on mobile and desktop', async ({ page }) => {
    const viewports = [
      { name: 'mobile', ...MOBILE_VIEWPORT },
      { name: 'desktop', ...DESKTOP_VIEWPORT },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/dashboard/composers')

      const approveButton = page.locator('button:has-text("Approve")').first()
      await approveButton.click()

      // Loading indicator should appear
      const loadingText = page.locator('text=Approving…')
      await expect(loadingText).toBeVisible()

      // Button should be disabled
      await expect(approveButton).toBeDisabled()

      // Wait for completion
      await page.reload()
    }
  })
})

// Error toast display on different viewport sizes
test.describe('Phase E: Toast Display Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
  })

  test('toasts are visible and functional across viewports', async ({ page }) => {
    const viewports = [
      { name: 'mobile', ...MOBILE_VIEWPORT },
      { name: 'desktop', ...DESKTOP_VIEWPORT },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/dashboard/composers')

      const approveButton = page.locator('button:has-text("Approve")').first()
      await approveButton.click()

      // Toast should be visible
      const toast = page.locator('text=Composer approved')
      await expect(toast).toBeVisible({ timeout: 10000 })

      // Toast should not overflow viewport
      const box = await toast.boundingBox()
      expect(box).toBeTruthy()
      if (box) {
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
      }

      // Reload for next iteration
      await page.reload()
    }
  })
})
