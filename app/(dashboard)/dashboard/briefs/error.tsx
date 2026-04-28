'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function BriefsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-sm font-semibold">Failed to load briefs</p>
      <p className="text-sm text-muted-foreground max-w-sm">
        {error.message ?? 'An unexpected error occurred. Please try again.'}
      </p>
      <Button variant="outline" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
