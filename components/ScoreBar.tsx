type ScoreBarProps = {
  score: number
}

export function ScoreBar({ score }: ScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  
  const getStatusColor = (s: number) => {
    if (s >= 85) return "bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"
    if (s >= 70) return "bg-foreground/80"
    return "bg-muted-foreground/30"
  }

  const getTextColor = (s: number) => {
    if (s >= 85) return "text-primary"
    return "text-muted-foreground"
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-border/40 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out rounded-full ${getStatusColor(clampedScore)}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
      <span className={`text-xs font-black tracking-tight font-mono ${getTextColor(clampedScore)}`}>
        {clampedScore}%
      </span>
    </div>
  )
}
