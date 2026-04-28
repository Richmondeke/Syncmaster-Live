import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Outreach — admin invites composer', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
  })

  test('outreach panel visible on active brief', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    // Find a brief with Active status and open it
    const activeBriefRow = page.locator('.rounded-lg.border').filter({ hasText: 'Active' }).first()
    const hasActive = await activeBriefRow.isVisible().catch(() => false)

    if (!hasActive) {
      test.skip(true, 'No active briefs in database — activate one first')
      return
    }

    await activeBriefRow.getByRole('link', { name: 'View' }).click()
    await expect(page).toHaveURL(/dashboard\/briefs\/.+/)
    await expect(page.getByText('Outreach')).toBeVisible()
  })

  test('admin can invite a composer on active brief', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    const activeBriefRow = page.locator('.rounded-lg.border').filter({ hasText: 'Active' }).first()
    const hasActive = await activeBriefRow.isVisible().catch(() => false)

    if (!hasActive) {
      test.skip(true, 'No active briefs in database — activate one first')
      return
    }

    await activeBriefRow.getByRole('link', { name: 'View' }).click()
    await expect(page).toHaveURL(/dashboard\/briefs\/.+/)

    const inviteBtn = page.getByRole('button', { name: 'Invite' }).first()
    const hasInviteBtn = await inviteBtn.isVisible().catch(() => false)

    if (!hasInviteBtn) {
      test.skip(true, 'All composers already invited on this brief')
      return
    }

    await inviteBtn.click()
    await expect(page.getByText('Invited')).toBeVisible()
  })
})

test.describe('Outreach — composer responds', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'composer')
  })

  test('composer briefs page shows invited status or empty state', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    await expect(
      page.getByText('Invited')
        .or(page.getByText('Accepted'))
        .or(page.getByText('Declined'))
        .or(page.getByText('No invites yet'))
        .first()
    ).toBeVisible()
  })

  test.beforeEach(async () => {
    // Reset the test composer's outreach to 'invited' before each respond test
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/outreach?composer_id=eq.a2308014-7225-474f-a2e1-04a02111e348&brief_id=eq.6bfe3fa6-7c8b-452a-9903-d94c6f71b7dc`,
      {
        method: 'PATCH',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'invited' }),
      }
    )
    if (!res.ok) throw new Error(`Failed to reset outreach: ${res.status}`)
  })

  test('composer can accept an invitation', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    const respondBtn = page.getByRole('link', { name: 'Respond' }).first()
    await expect(respondBtn).toBeVisible()
    await respondBtn.click()
    await expect(page).toHaveURL(/dashboard\/briefs\/.+/)
    await page.getByRole('button', { name: 'Accept brief' }).click()
    await expect(page.getByText('Submit tracks')).toBeVisible()
  })

  test('composer can decline an invitation', async ({ page }) => {
    await page.goto('/dashboard/briefs')
    const respondBtn = page.getByRole('link', { name: 'Respond' }).first()
    await expect(respondBtn).toBeVisible()
    await respondBtn.click()
    await expect(page).toHaveURL(/dashboard\/briefs\/.+/)
    await page.getByRole('button', { name: 'Decline' }).click()
    await expect(page.getByText('You declined this brief')).toBeVisible()
  })
})
