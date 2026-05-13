"use client";

import React, { useMemo } from "react";

interface WaveformProps {
  color?: string;
  height?: number;
  progress?: number; // 0 to 1
}

export default function Waveform({ color = "rgba(255, 255, 255, 0.2)", height = 32, progress = 0.3 }: WaveformProps) {
  const bars = useMemo(
    () => Array.from({ length: 50 }, () => 0.2 + Math.random() * 0.8),
    []
  );

  return (
    <div className="flex items-center gap-1" style={{ height }}>
      {bars.map((value, index) => {
        const isActive = index / bars.length < progress;
        return (
          <div
            key={index}
            className="w-1 rounded-full transition-all duration-300"
            style={{
              height: `${value * 100}%`,
              backgroundColor: isActive ? "#daf624" : color,
              opacity: isActive ? 1 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
}
