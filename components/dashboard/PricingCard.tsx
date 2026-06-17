'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Sparkles, Check, Loader2, AlertCircle } from 'lucide-react'
import { detectCurrency } from '@/lib/geo'
import { initiateProUpgrade } from '@/app/actions/payments'
import { useToast } from '@/components/Toast'

export function PricingCard() {
  const { addToast } = useToast()
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('USD')
  const [loadingCurrency, setLoadingCurrency] = useState(true)
  const [initiating, setInitiating] = useState(false)

  useEffect(() => {
    detectCurrency().then((detected) => {
      setCurrency(detected)
      setLoadingCurrency(false)
    }).catch((err) => {
      console.error('Error detecting currency:', err)
      setLoadingCurrency(false)
    })
  }, [])

  const handleUpgrade = async () => {
    setInitiating(true)
    try {
      const res = await initiateProUpgrade(currency)
      if (res.ok && res.url) {
        // Redirect to Flutterwave checkout page
        window.location.href = res.url
      } else {
        addToast(res.error || 'Failed to start payment process. Please try again.', 'error')
        setInitiating(false)
      }
    } catch (err: any) {
      console.error('Payment initiation error:', err)
      addToast(err.message || 'An unexpected error occurred.', 'error')
      setInitiating(false)
    }
  }

  const price = currency === 'NGN' ? '₦10,000' : '$10'

  const features = [
    'Unlimited submissions to briefs (Free is limited to 1 song submission)',
    'Reveal all contact info & social links in Agency Directory',
    'Reveal all DJ emails & phone numbers in Radio Directory',
    'Exclusive Pro badge next to your profile',
    'High priority matching recommendations',
    'Lifetime access, no monthly fees'
  ]

  if (loadingCurrency) {
    return (
      <Card className="bg-card border-border rounded-[2rem] overflow-hidden flex items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium text-sm">Loading pricing options...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-primary/30 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 transition-all duration-300 hover:border-primary/60">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      
      <div className="absolute top-6 right-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" /> Special Offer
        </span>
      </div>

      <CardHeader className="p-8 pb-4">
        <h3 className="text-lg font-bold uppercase tracking-wider text-primary/80">Pro Membership</h3>
        <p className="text-sm text-slate-400 mt-1">Supercharge your sync licensing career and unlock all connections.</p>
        
        <div className="flex items-baseline gap-2 mt-6">
          <span className="text-5xl font-black text-white tracking-tight">{price}</span>
          <span className="text-sm text-slate-400 font-semibold">one-time payment</span>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4 space-y-6">
        <div className="h-px bg-slate-800" />
        
        <ul className="space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <span className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-8 pt-0 flex flex-col gap-3">
        <Button
          onClick={handleUpgrade}
          disabled={initiating}
          className="w-full rounded-full h-14 bg-primary hover:bg-primary/95 text-white font-extrabold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          {initiating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Redirecting to Secure Checkout...
            </>
          ) : (
            `Upgrade to Pro Now — ${price}`
          )}
        </Button>
        <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" /> Payments secured by Flutterwave.
        </p>
      </CardFooter>
    </Card>
  )
}
