import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BriefForm } from '@/components/briefs/BriefForm'
import { buttonVariants } from '@/components/ui/button'
import { cookies } from 'next/headers'

export default async function NewBriefPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('role')?.value || 'admin'

  if (role !== 'producer') redirect('/dashboard/briefs')

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/briefs"
          aria-label="Back to briefs"
          className={buttonVariants({ variant: 'ghost', size: 'icon' }) + ' shrink-0'}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New brief</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Describe what you need. Our team will curate the right composers and follow up directly.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <BriefForm />
      </div>
    </div>
  )
}
