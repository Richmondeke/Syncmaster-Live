import { Sparkles } from 'lucide-react'

type SuggestedComposer = {
  id: string
  genres: string[] | null
  profiles: { full_name: string | null } | null
}

type Props = {
  composers: SuggestedComposer[]
  invitedIds: Set<string>
}

export function AiSuggestionsPanel({ composers, invitedIds }: Props) {
  if (composers.length === 0) return null

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-semibold">AI Suggested Composers</p>
        <span className="ml-auto text-xs text-muted-foreground">Ranked by brief fit</span>
      </div>

      <ol className="flex flex-col gap-3">
        {composers.map((composer, index) => {
          const name = composer.profiles?.full_name ?? 'Unknown'
          const invited = invitedIds.has(composer.id)

          return (
            <li key={composer.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
                {composer.genres && composer.genres.length > 0 && (
                  <p className="text-xs text-muted-foreground truncate">
                    {composer.genres.join(', ')}
                  </p>
                )}
              </div>
              {invited && (
                <span className="ml-auto shrink-0 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Invited
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <p className="text-xs text-muted-foreground">
        Use the outreach panel below to send invitations.
      </p>
    </div>
  )
}
