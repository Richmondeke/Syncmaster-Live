'use client'

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

export interface PlayerTrack {
  id: string
  title: string
  audio_url: string
  composer?: string
  genre?: string
  duration?: string
}

interface MusicPlayerContextValue {
  currentTrack: PlayerTrack | null
  queue: PlayerTrack[]
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playTrack: (track: PlayerTrack, queue?: PlayerTrack[]) => void
  togglePlay: () => void
  seek: (time: number) => void
  skipNext: () => void
  skipPrev: () => void
  setVolume: (v: number) => void
  closePlayer: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null)
  const [queue, setQueue] = useState<PlayerTrack[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
    audio.addEventListener('ended', () => {
      setQueue(prev => {
        const idx = prev.findIndex(t => t.id === (audioRef.current as any)._trackId)
        if (idx >= 0 && idx < prev.length - 1) {
          const next = prev[idx + 1]
          loadTrack(next, audio)
          return prev
        }
        setIsPlaying(false)
        return prev
      })
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const loadTrack = (track: PlayerTrack, audio: HTMLAudioElement) => {
    audio.src = track.audio_url
    ;(audio as any)._trackId = track.id
    audio.load()
    audio.play().then(() => setIsPlaying(true)).catch(console.error)
    setCurrentTrack(track)
    setCurrentTime(0)
  }

  const playTrack = useCallback((track: PlayerTrack, newQueue?: PlayerTrack[]) => {
    if (newQueue) setQueue(newQueue)
    if (!audioRef.current) return
    loadTrack(track, audioRef.current)
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error)
    }
  }, [isPlaying, currentTrack])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const skipNext = useCallback(() => {
    if (!audioRef.current || !currentTrack) return
    const idx = queue.findIndex(t => t.id === currentTrack.id)
    if (idx >= 0 && idx < queue.length - 1) {
      loadTrack(queue[idx + 1], audioRef.current)
    }
  }, [currentTrack, queue])

  const skipPrev = useCallback(() => {
    if (!audioRef.current || !currentTrack) return
    // If more than 3s in, restart current track
    if (currentTime > 3) {
      seek(0)
      return
    }
    const idx = queue.findIndex(t => t.id === currentTrack.id)
    if (idx > 0) {
      loadTrack(queue[idx - 1], audioRef.current)
    }
  }, [currentTrack, queue, currentTime, seek])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setCurrentTrack(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  return (
    <MusicPlayerContext.Provider value={{
      currentTrack, queue, isPlaying, currentTime, duration, volume,
      playTrack, togglePlay, seek, skipNext, skipPrev, setVolume, closePlayer
    }}>
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  return ctx
}
