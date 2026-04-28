import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

const COMPOSER_ID = 'a2308014-7225-474f-a2e1-04a02111e348'
const BRIEF_ID = '6bfe3fa6-7c8b-452a-9903-d94c6f71b7dc'

async function resetOutreach(status: 'invited' | 'accepted') {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/outreach?composer_id=eq.${COMPOSER_ID}&brief_id=eq.${BRIEF_ID}`,
    {
      method: 'PATCH',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    },
  )
  if (!res.ok) throw new Error(`Failed to reset outreach: ${res.status}`)
}

async function deleteSubmissions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/submissions?composer_id=eq.${COMPOSER_ID}&brief_id=eq.${BRIEF_ID}`,
    {
      method: 'DELETE',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
    },
  )
  if (!res.ok) throw new Error(`Failed to delete submissions: ${res.status}`)
}

test.describe('Submissions — composer', () => {
  test.beforeEach(async () => {
    await resetOutreach('accepted')
    await deleteSubmissions()
  })

  test.afterEach(async () => {
    await deleteSubmissions()
    await resetOutreach('invited')
  })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'composer')
  })

  test('submit track form is visible when outreach is accepted', async ({ page }) => {
    await page.goto(`/dashboard/briefs/${BRIEF_ID}`)
    await expect(page.getByText('Submit tracks')).toBeVisible()
    await expect(page.getByText('3 of 3 submissions remaining')).toBeVisible()
  })

  test('composer can submit a track', async ({ page }) => {
    await page.goto(`/dashboard/briefs/${BRIEF_ID}`)
    await page.getByLabel(/track url/i).fill('https://soundcloud.com/test/track-1')
    await page.getByLabel(/creative note/i).fill('This track fits the brief perfectly.')
    await page.getByRole('button', { name: 'Submit track' }).click()
    await expect(page.getByText('2 of 3 submissions remaining')).toBeVisible()
    await expect(page.getByText('https://soundcloud.com/test/track-1')).toBeVisible()
  })

  test('submit count decrements with each submission', async ({ page }) => {
    await page.goto(`/dashboard/briefs/${BRIEF_ID}`)

    await page.getByLabel(/track url/i).fill('https://soundcloud.com/test/track-a')
    await page.getByRole('button', { name: 'Submit track' }).click()
    await expect(page.getByText('2 of 3 submissions remaining')).toBeVisible()
    await page.waitForLoadState('networkidle')

    await page.getByLabel(/track url/i).fill('https://soundcloud.com/test/track-b')
    await page.getByRole('button', { name: 'Submit track' }).click()
    await expect(page.getByText('1 of 3 submission remaining')).toBeVisible()
    await page.waitForLoadState('networkidle')

    await page.getByLabel(/track url/i).fill('https://soundcloud.com/test/track-c')
    await page.getByRole('button', { name: 'Submit track' }).click()
    await expect(page.getByText("You've submitted the maximum number of tracks")).toBeVisible()
  })
})

test.describe('Workflow guard — matched transition', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
  })

  test('admin cannot mark brief as matched with no submissions', async ({ page }) => {
    await page.goto('/dashboard/briefs')

    // Find an active brief that has no submissions — use the known test brief
    await page.goto(`/dashboard/briefs/${BRIEF_ID}`)

    // Delete any existing submissions so the guard fires
    await deleteSubmissions()
    await page.reload()

    const matchedBtn = page.getByRole('button', { name: /mark as matched/i })
    const hasMatchedBtn = await matchedBtn.isVisible().catch(() => false)

    if (!hasMatchedBtn) {
      test.skip(true, 'Brief is not in active state — cannot test matched guard')
      return
    }

    await matchedBtn.click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByText(/cannot mark as matched/i)).toBeVisible()
  })
})
