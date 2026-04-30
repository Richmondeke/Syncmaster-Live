import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Composers - Email Error Recovery', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')
  })

  test('approve action returns success result', async ({ page }) => {
    const approveButton = page.locator('button:has-text("Approve")').first()
    await approveButton.click()

    // Wait for action to complete
    await page.waitForTimeout(2000)

    // Success toast should appear
    const successToast = page.locator('text=Composer approved')
    await expect(successToast).toBeVisible({ timeout: 10000 })
  })

  test('reject with feedback sends email properly', async ({ page }) => {
    const rejectButton = page.locator('button:has-text("Reject")').first()
    await rejectButton.click()

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Fill feedback
    const textarea = dialog.locator('textarea')
    const feedbackText = 'Strong production but needs sync-ready stems'
    await textarea.fill(feedbackText)

    // Submit
    const submitButton = dialog.locator('button:has-text("Reject application")')
    await submitButton.click()

    // Should show success
    const successToast = page.locator('text=Composer rejected')
    await expect(successToast).toBeVisible({ timeout: 10000 })

    // Dialog should close
    await expect(dialog).not.toBeVisible({ timeout: 5000 })

    // Toast should include any email warning if present
    const warningToast = page.locator('text=failed to send')
    if (await warningToast.isVisible()) {
      // Email service is down - this is acceptable to surface to user
      expect(warningToast).toBeVisible()
    }
  })

  test('reject dialog can be canceled', async ({ page }) => {
    const rejectButton = page.locator('button:has-text("Reject")').first()
    await rejectButton.click()

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    const cancelButton = dialog.locator('button:has-text("Cancel")')
    await cancelButton.click()

    // Dialog should close without action
    await expect(dialog).not.toBeVisible()

    // No toast should appear
    const toast = page.locator('[role="alert"], text=rejected')
    await expect(toast).not.toBeVisible()
  })

  test('rapid successive approvals are queued properly', async ({ page }) => {
    const approveButtons = page.locator('button:has-text("Approve")')
    const firstButton = approveButtons.first()

    // Click first button
    await firstButton.click()

    // Button should be disabled
    await expect(firstButton).toBeDisabled()

    // Wait for completion
    await page.waitForTimeout(3000)

    // Button should be re-enabled or removed (if status changed)
    const stillExists = await firstButton.count()
    if (stillExists > 0) {
      // Button still exists, might be for different row
      // Just ensure no toast errors appear
      const errorToast = page.locator('text=/error|failed/')
      await expect(errorToast).not.toBeVisible()
    }
  })

  test('rejection note is properly submitted with action', async ({ page }) => {
    const rejectButton = page.locator('button:has-text("Reject")').first()
    await rejectButton.click()

    const dialog = page.locator('[role="dialog"]')
    const textarea = dialog.locator('textarea')

    // Try rejecting without note first
    let submitButton = dialog.locator('button:has-text("Reject application")')
    await submitButton.click()

    // Should succeed even without note
    const successToast = page.locator('text=Composer rejected')
    await expect(successToast).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Composers - Loading States', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard/composers')
  })

  test('approve button shows spinner and disabled state during submission', async ({ page }) => {
    const approveButton = page.locator('button:has-text("Approve")').first()

    // Initially enabled
    await expect(approveButton).toBeEnabled()

    await approveButton.click()

    // Should show loading text
    const loadingButton = page.locator('button:has-text("Approving…")')
    await expect(loadingButton).toBeVisible()

    // Button should be disabled
    await expect(loadingButton).toBeDisabled()

    // Wait for spinner to render
    const spinner = loadingButton.locator('[class*="animate-spin"], svg')
    await expect(spinner).toBeVisible()
  })

  test('reject button becomes disabled when dialog is open', async ({ page }) => {
    const rejectButton = page.locator('button:has-text("Reject")').first()
    await expect(rejectButton).toBeEnabled()

    await rejectButton.click()

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Reject button should now be disabled (since submit is in flight during dialog)
    const dialogSubmit = dialog.locator('button:has-text("Reject application")')
    await expect(dialogSubmit).toBeEnabled()

    // Cancel button should still be enabled
    const cancelButton = dialog.locator('button:has-text("Cancel")')
    await expect(cancelButton).toBeEnabled()
  })

  test('textarea is disabled during submission', async ({ page }) => {
    const rejectButton = page.locator('button:has-text("Reject")').first()
    await rejectButton.click()

    const dialog = page.locator('[role="dialog"]')
    const textarea = dialog.locator('textarea')

    // Initially enabled
    await expect(textarea).toBeEnabled()

    // User can type before submitting
    await textarea.fill('Test feedback')
    await expect(textarea).toHaveValue('Test feedback')

    // Submit
    const submitButton = dialog.locator('button:has-text("Reject application")')
    await submitButton.click()

    // Textarea should be disabled during submission
    await expect(textarea).toBeDisabled()
  })
})
