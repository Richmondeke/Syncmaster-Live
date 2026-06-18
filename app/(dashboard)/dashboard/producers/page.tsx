import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { Building2, Plus, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'


import { Button } from '@/components/ui/button'

export default async function ProducersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // For demo purposes, we allow the Godliverse admin access even without a real session
  const isDemo = true
  
  if (!user && !isDemo) redirect('/login')

  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() : { data: null }

  if (!isDemo && profile?.role !== 'admin') redirect('/dashboard')

  // Mock producers for demo
  const mockProducers = [
    {
      id: 'prod-1',
      company: 'Global Sound Collective',
      tracks_count: 42,
      status: 'active',
      representative: 'Alex Rivera'
    },
    {
      id: 'prod-2',
      company: 'Sync Pulse Media',
      tracks_count: 15,
      status: 'active',
      representative: 'Sarah Jenkins'
    },
    {
      id: 'prod-3',
      company: 'Vibrant Audio',
      tracks_count: 8,
      status: 'pending',
      representative: 'Michael Chen'
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Producers</h1>
          <p className="text-lg text-muted-foreground tracking-tight mt-2">
            Manage approved production companies and their catalog contributions.
          </p>
        </div>
        <Button className="h-9 px-4 rounded-xl font-bold text-sm gap-1.5 transition-all">
          <Plus className="w-4 h-4" />
          Add Producer
        </Button>
      </div>

      <div className="rounded-xl ring-1 ring-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Representative</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tracks</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockProducers.map((producer) => (
                <tr key={producer.id} className="border-b border-border bg-card last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span>{producer.company}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{producer.representative}</td>
                  <td className="px-4 py-3 font-medium">{producer.tracks_count}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        producer.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {producer.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link 
                      href={`/dashboard/producers/${producer.id}`}
                      className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                    >
                      Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
