import { ShoppingCart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function MarketplacePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Marketplace</h1>
        <p className="text-muted-foreground">Browse and acquire tracks directly from composers and producers.</p>
      </div>

      <Card className="bg-card border-dashed border-border rounded-3xl p-20 text-center">
        <div className="max-w-xs mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-[-0.04em] text-foreground">Coming Soon</h3>
            <p className="text-sm text-muted-foreground">The marketplace feature is currently under development.</p>
          </div>
          <Link 
            href="/dashboard"
            className={buttonVariants({ variant: "default" }) + " rounded-full bg-primary text-white hover:bg-primary/90"}
          >
            Back to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  )
}
