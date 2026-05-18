import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, Plus, ArrowRight } from 'lucide-react'

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
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-[-0.068em] leading-[1.1] text-foreground">Producers</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium tracking-[-0.02em] max-w-2xl leading-relaxed">
            Manage approved production companies and their catalog contributions.
          </p>
        </div>
        <Button className="h-14 px-8 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
          <Plus className="w-5 h-5" />
          Add Producer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.1em] text-muted-foreground">Company</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.1em] text-muted-foreground">Representative</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.1em] text-muted-foreground">Tracks</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.1em] text-muted-foreground text-center">Status</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.1em] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {mockProducers.map((producer) => (
                  <tr key={producer.id} className="group hover:bg-muted/20 transition-all duration-300">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <span className="font-black text-lg tracking-tight text-foreground">{producer.company}</span>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <span className="font-bold text-muted-foreground">{producer.representative}</span>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xl text-foreground">{producer.tracks_count}</span>
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">Tracks</span>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                          producer.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {producer.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <Link 
                        href={`/dashboard/producers/${producer.id}`}
                        className="inline-flex items-center gap-2 text-primary font-black hover:gap-3 transition-all duration-300"
                      >
                        Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
