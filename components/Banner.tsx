type BannerProps = {
  children: React.ReactNode
}

export function Banner({ children }: BannerProps) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderLeft: '2px solid var(--primary)',
        padding: 16,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      {children}
    </div>
  )
}
