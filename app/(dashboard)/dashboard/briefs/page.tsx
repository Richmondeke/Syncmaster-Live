import Link from 'next/link'
import { Plus, Mail, FileText } from 'lucide-react'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function BriefsPage() {
  let role = 'admin'

  try {
    const cookieStore = await cookies()
    role = cookieStore.get('role')?.value || 'admin'
  } catch {
    // use defaults
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Briefs</h1>
          <p className="text-lg text-muted-foreground tracking-tight mt-2">
            {role === 'composer'
              ? 'Exclusive opportunities you\'ve been matched with. Review and submit your best tracks.'
              : role === 'producer'
              ? 'Submit a brief and we\'ll hand-pick 3–5 vetted composers for you.'
              : 'Review producer briefs and manage status transitions.'}
          </p>
        </div>
        {(role === 'producer' || role === 'admin') && (
          <Link
            href="/dashboard/briefs/new"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            New brief
          </Link>
        )}
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-24 text-center gap-6 rounded-[2.5rem] border-2 border-dashed border-border/40 bg-muted/10">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center shadow-lg">
            <FileText className="w-12 h-12 text-primary/60" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-black tracking-[-0.04em] text-foreground">No briefs yet</h3>
          <p className="text-muted-foreground font-medium leading-relaxed">
            {role === 'composer'
              ? 'You\'ll see briefs here once our team has matched you with opportunities.'
              : role === 'producer'
              ? 'Create your first brief and we\'ll match you with vetted composers.'
              : 'No briefs have been created yet. Producers can submit briefs for review.'}
          </p>
        </div>
        {(role === 'producer' || role === 'admin') && (
          <Link
            href="/dashboard/briefs/new"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-full mt-2 px-8 h-12"
          >
            <Plus className="w-5 h-5 mr-2" /> Create Your First Brief
          </Link>
        )}
      </div>
    </div>
  )
}
