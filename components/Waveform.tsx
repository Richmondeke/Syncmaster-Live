'use client'

import { useMemo } from 'react'

type WaveformProps = {
  color?: string
  height?: number
}

export function Waveform({ color = 'var(--muted-foreground)', height = 32 }: WaveformProps) {
  const bars = useMemo(
    () => Array.from({ length: 60 }, () => 0.2 + Math.random() * 0.8),
    []
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height }}>
      {bars.map((value, index) => (
        <div
          key={index}
          style={{
            width: 2,
            height: `${value * 100}%`,
            background: index < 18 ? 'var(--primary)' : color,
            opacity: index < 18 ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  )
}
