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

  const PROGRESS_THRESHOLD = 18; // 30% progress

  return (
    <div className="flex items-center gap-[2px]" style={{ height }}>
      {bars.map((value, index) => (
        <div
          key={index}
          className={`w-[2px] transition-all duration-300 ${
            index < PROGRESS_THRESHOLD ? 'bg-primary opacity-100' : 'opacity-50'
          }`}
          style={{
            height: `${value * 100}%`,
            ...(index >= PROGRESS_THRESHOLD ? { backgroundColor: color } : {}),
          }}
        />
      ))}
    </div>
  )
}
