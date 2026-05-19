'use client'

import React, { useState } from 'react'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import { cn } from '@/lib/utils'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music2, ChevronDown
} from 'lucide-react'

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec < 10 ? '0' : ''}${sec}`
}

export function MusicPlayer() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    togglePlay, seek, skipNext, skipPrev, setVolume, closePlayer
  } = useMusicPlayer()

  const [isMuted, setIsMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(0.8)

  if (!currentTrack) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleMute = () => {
    if (isMuted) {
      setVolume(prevVolume)
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      setVolume(0)
      setIsMuted(true)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
      {/* Scrub bar — full width, above the player bar */}
      <div className="relative w-full h-1 bg-muted group cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const pct = (e.clientX - rect.left) / rect.width
          seek(pct * duration)
        }}
      >
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <div className="bg-card/95 backdrop-blur-xl border-t border-border px-4 py-3 lg:pl-72">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-4">

          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Music2 className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-foreground truncate">{currentTrack.title}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
                {currentTrack.composer || currentTrack.genre || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={skipPrev}
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              {isPlaying
                ? <Pause className="w-4 h-4 fill-current" />
                : <Play className="w-4 h-4 fill-current translate-x-0.5" />
              }
            </button>
            <button
              onClick={skipNext}
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Time */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-muted-foreground flex-shrink-0">
            <span className="text-foreground">{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <button onClick={handleMute} className="text-muted-foreground hover:text-foreground transition-colors">
              {isMuted || volume === 0
                ? <VolumeX className="w-4 h-4" />
                : <Volume2 className="w-4 h-4" />
              }
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setIsMuted(false)
                setVolume(parseFloat(e.target.value))
              }}
              className="w-20 accent-primary cursor-pointer"
            />
          </div>

          {/* Close */}
          <button
            onClick={closePlayer}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
