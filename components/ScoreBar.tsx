type ScoreBarProps = {
  score: number
}

export function ScoreBar({ score }: ScoreBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 64,
          height: 4,
          background: 'var(--muted)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            background:
              score >= 85
                ? 'var(--primary)'
                : score >= 70
                  ? 'var(--foreground)'
                  : 'var(--muted-foreground)',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 600,
          minWidth: 32,
        }}
      >
        {score}
      </span>
    </div>
  )
}
