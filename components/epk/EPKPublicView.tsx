'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { EPK, EPKTrack } from '@/types/epk.types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Music, 
  Calendar, 
  Eye, 
  ArrowLeft, 
  Edit3,
  Globe
} from 'lucide-react'
import Link from 'next/link'

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

interface EPKPublicViewProps {
  epk: EPK
  isOwner: boolean
}

export function EPKPublicView({ epk, isOwner }: EPKPublicViewProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0.8)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const tracks = epk.tracks || []
  const currentTrack = tracks[currentTrackIndex]

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('[Audio Player] Failed to play track:', err)
          setIsPlaying(false)
        })
      }
    }
  }, [currentTrackIndex])

  // Play/Pause handler
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (currentTrack?.audioUrl) {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((err) => {
          console.warn('[Audio Player] Play error:', err)
        })
      }
    }
  }

  // Next Track
  const handleNext = () => {
    if (tracks.length <= 1) return
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
  }

  // Prev Track
  const handlePrev = () => {
    if (tracks.length <= 1) return
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  // Audio events
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const onAudioEnded = () => {
    if (tracks.length > 1) {
      handleNext()
    } else {
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  // Volume & Mute handlers
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
      audioRef.current.muted = val === 0
    }
    setIsMuted(val === 0)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const nextMute = !isMuted
    setIsMuted(nextMute)
    audioRef.current.muted = nextMute
  }

  // Seek handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setCurrentTime(val)
    if (audioRef.current) {
      audioRef.current.currentTime = val
    }
  }

  // Time format helper (mm:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      {/* 1. Backdrop Blurred Cover Background */}
      {epk.image_url && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110 opacity-30 blur-3xl saturate-150 transition-all duration-1000"
            style={{ backgroundImage: `url(${epk.image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />
        </div>
      )}

      {/* Audio element */}
      {currentTrack?.audioUrl && (
        <audio
          ref={audioRef}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onAudioEnded}
          autoPlay={isPlaying}
        />
      )}

      {/* 2. Top Header Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-sm">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          SyncMaster
        </Link>
        <div className="flex items-center gap-4">
          <Badge className="bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full font-black uppercase text-[10px] tracking-widest px-3 py-1">
            {epk.type}
          </Badge>
          {isOwner && (
            <Link href="/dashboard/epks">
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/95 text-white font-black text-xs gap-2">
                <Edit3 className="w-3.5 h-3.5" /> Edit Page
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* 3. Main EPK Content Grid */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column - Card visualizer & audio player (Lanscape-oriented on mobile, sticky on desktop) */}
        <section className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="relative group rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 p-6 backdrop-blur-2xl shadow-2xl transition-all duration-500">
            {/* Image Cover container */}
            <div className="aspect-square relative rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl border border-white/5">
              {epk.image_url ? (
                <img 
                  src={epk.image_url} 
                  alt={epk.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                  <Music className="w-20 h-20 stroke-[1] text-primary/40 animate-pulse" />
                  <span className="text-xs font-mono tracking-wider mt-4">NO COVER ART</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Overlaid quick details */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase bg-primary/20 backdrop-blur-md rounded-full px-3 py-1 border border-primary/20">
                    {epk.type}
                  </span>
                  <h2 className="text-2xl font-black tracking-tight text-white mt-2 leading-none drop-shadow-md">
                    {epk.title}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span>{epk.views + (isPlaying ? 1 : 0)} views</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive Glass Audio Player */}
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md space-y-4">
              {currentTrack ? (
                <>
                  {/* Track information & Audio Wave visualizer simulation */}
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">Now Playing</p>
                      <h4 className="text-sm font-bold text-white truncate mt-0.5">{currentTrack.title}</h4>
                    </div>
                    {isPlaying && (
                      <div className="flex items-end gap-0.5 h-4 w-6">
                        <div className="w-1 bg-primary h-full animate-[bounce_0.8s_infinite] origin-bottom" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 bg-primary h-full animate-[bounce_0.6s_infinite] origin-bottom" style={{ animationDelay: '0.3s' }} />
                        <div className="w-1 bg-primary h-full animate-[bounce_0.9s_infinite] origin-bottom" style={{ animationDelay: '0.5s' }} />
                        <div className="w-1 bg-primary h-full animate-[bounce_0.7s_infinite] origin-bottom" style={{ animationDelay: '0.2s' }} />
                      </div>
                    )}
                  </div>

                  {/* Range timeline */}
                  <div className="space-y-1.5">
                    <input 
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary focus:outline-none transition-all hover:h-1.5"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Play controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handlePrev}
                        disabled={tracks.length <= 1}
                        className="p-2 rounded-full text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={togglePlay}
                        className="p-3.5 bg-primary hover:bg-primary/90 text-white rounded-full transition-transform active:scale-95 shadow-lg shadow-primary/20"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <button 
                        onClick={handleNext}
                        disabled={tracks.length <= 1}
                        className="p-2 rounded-full text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mute & volume slider */}
                    <div className="flex items-center gap-2 group/volume">
                      <button 
                        onClick={toggleMute}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input 
                        type="range" 
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary transition-all group-hover/volume:w-20"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-xs font-mono text-slate-500 border border-dashed border-white/5 rounded-xl">
                  No tracks available
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column - Artist Biography, Full Tracklist, Social linkups */}
        <section className="lg:col-span-7 space-y-8">
          
          {/* Release info & stats */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.05em] text-white leading-tight">
              {epk.title}
            </h1>
            <div className="flex flex-wrap gap-4 items-center font-mono text-xs text-slate-400 border-b border-white/5 pb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                Created {new Date(epk.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>{tracks.length} {tracks.length === 1 ? 'Track' : 'Tracks'}</span>
            </div>
          </div>

          {/* Biography panel */}
          {epk.bio && (
            <div className="space-y-3 bg-white/5 border border-white/5 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-xs font-mono tracking-widest text-primary uppercase font-bold">Biography</h3>
              <p className="text-slate-300 font-medium text-base leading-relaxed whitespace-pre-line">
                {epk.bio}
              </p>
            </div>
          )}

          {/* Tracklist selection list */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-widest text-primary uppercase font-bold">Tracklist</h3>
            <div className="space-y-2">
              {tracks.map((track, index) => {
                const isActive = index === currentTrackIndex
                return (
                  <button 
                    key={track.id}
                    onClick={() => {
                      setCurrentTrackIndex(index)
                      setIsPlaying(true)
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-left border transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary/20 border-primary text-white shadow-lg' 
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs ${
                        isActive ? 'bg-primary text-white' : 'bg-slate-900 border border-white/5 text-slate-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm leading-tight truncate group-hover:text-white transition-colors">
                          {track.title}
                        </p>
                        {track.duration && (
                          <span className="text-[10px] font-mono text-slate-500">{track.duration}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isActive && isPlaying ? (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        </div>
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isActive ? 'bg-primary text-white' : 'bg-slate-900/50 text-slate-400 group-hover:bg-primary group-hover:text-white opacity-0 group-hover:opacity-100'
                        }`}>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Social Links and Platforms section */}
          {epk.social_links && Object.values(epk.social_links).some(link => !!link) && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-mono tracking-widest text-primary uppercase font-bold">Connect & Listen</h3>
              <div className="flex flex-wrap gap-3">
                {epk.social_links.instagram && (
                  <a 
                    href={epk.social_links.instagram} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <Instagram className="w-4 h-4 text-[#E1306C]" />
                    Instagram
                  </a>
                )}
                {epk.social_links.spotify && (
                  <a 
                    href={epk.social_links.spotify} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <svg className="w-4 h-4 fill-[#1DB954]" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.129-10.561-1.171-.418.096-.838-.18-.935-.599-.096-.419.18-.839.6-.937 4.62-1.05 8.52-.6 11.699 1.379.36.24.48.66.218 1.028zm1.5-3.3c-.3.479-.9.63-1.379.33-3.24-1.979-8.159-2.58-11.939-1.379-.54.159-1.109-.15-1.26-.69-.159-.54.15-1.11.69-1.26 4.32-1.32 9.779-.659 13.559 1.679.48.3.63.9.33 1.38zM19.14 10.2c-.36.54-1.079.72-1.619.36-3.84-2.28-10.199-2.52-13.859-1.439-.6.18-1.259-.18-1.439-.78-.18-.6.18-1.259.78-1.439 4.38-1.32 11.4-1.02 15.84 1.62.54.3.72 1.079.36 1.619z"/>
                    </svg>
                    Spotify
                  </a>
                )}
                {epk.social_links.soundcloud && (
                  <a 
                    href={epk.social_links.soundcloud} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <svg className="w-4 h-4 fill-[#FF5500]" viewBox="0 0 24 24">
                      <path d="M12.28 11.53c0-.18.01-.36.03-.53l.03-.32.06-.32.08-.32.1-.32.13-.3.16-.31.18-.28.21-.28.23-.26.25-.25.26-.22.28-.2.29-.18.29-.14.3-.12.3-.08.31-.05.31-.03c.1-.01.2-.01.3-.01.11 0 .21 0 .32.01l.31.03.31.05.3.08.3.12.29.14.29.18.28.2.26.22.25.25.23.26.21.28.18.28.16.31.13.3.1.32.08.32.06.32.03.32c.02.17.03.35.03.53v3.7c0 .18-.01.36-.03.53l-.03.32-.06.32-.08.32-.1.32-.13.3-.16.31-.18.28-.21.28-.23.26-.25.25-.26.22-.28.2-.29.18-.29.14-.3.12-.3.08-.31.05-.31.03c-.1.01-.2.01-.3.01-.11 0-.21 0-.32-.01l-.31-.03-.31-.05-.3-.08-.3-.12-.29-.14-.29-.18-.28-.2-.26-.22-.25-.25-.23-.26-.21-.28-.18-.28-.16-.31-.13-.3-.1-.32-.08-.32-.06-.32-.03-.32a6.3 6.3 0 0 1-.03-.53zM10.84 12.36c0-.23.01-.45.03-.68l.04-.41.07-.4.11-.4.14-.4.18-.38.21-.37.25-.34.27-.33.3-.3.32-.28.34-.24.36-.21.37-.18.39-.14.39-.1.4-.07.41-.03h.82v6.62H15v.08l-.01.41-.03.4-.07.41-.1.39-.14.39-.18.37-.21.37-.25.34-.27.33-.3.3-.32.28-.34.24-.36.21-.37.18-.39.14-.39.1-.4.07-.41.03H11v-9.52zM9.4 13.2c0-.27.01-.54.03-.81l.05-.48.09-.47.13-.47.17-.46.21-.44.25-.42.29-.4.32-.38.35-.35.37-.32.4-.29.41-.25.43-.22.44-.18.45-.14.46-.1.47-.07.48-.03h.97v8.94H15v.08l-.01.48-.03.47-.07.47-.1.46-.14.45-.18.44-.22.43-.25.41-.29.4-.32.37-.35.35-.37.32-.4.29-.41.25-.43.22-.44.18-.45.14-.46.1-.47.07-.48.03H9.4v-8.94zm-1.44.83c0-.31.02-.63.04-.94l.06-.57.1-.55.15-.55.2-.53.25-.51.3-.49.34-.46.38-.44.41-.4.43-.37.46-.34.48-.3.5-.26.51-.21.53-.17.55-.13.55-.09.57-.05.58-.02h1.12v8.11H15v.08l-.01.57-.03.56-.07.55-.1.54-.15.53-.2.52-.24.5-.29.48-.33.45-.37.42-.4.4-.44.37-.47.33-.49.3-.51.26-.53.22-.55.17-.56.13-.57.09-.58.05-.59.01H7.96v-8.11zM6.52 14.88a10.96 10.96 0 0 1 .05-1.07l.08-.65.12-.63.17-.63.22-.61.27-.58.33-.56.38-.53.43-.5.48-.46.52-.42.56-.38.59-.34.63-.3.65-.25.68-.2.7-.16.71-.11.72-.07.74-.03h1.27v7.27H15v.08l-.01.74-.03.73-.07.72-.11.71-.16.7-.2.68-.25.65-.3.63-.34.59-.38.56-.42.52-.46.48-.5.43-.53.38-.56.33-.58.27-.61.22-.63.17-.63.12-.65.08-.66.05-.66.01H6.52v-7.27zM5.08 15.56c0-.43.02-.85.06-1.28l.09-.77.15-.75.2-.74.26-.71.32-.69.39-.66.45-.63.5-.59.56-.55.61-.5.66-.46.71-.41.76-.36.8-.32.84-.27.87-.22.9-.17.93-.12.95-.08.97-.03h1.43v6.43H15v.08l-.01.97-.03.95-.08.93-.12.91-.17.88-.22.85-.27.82-.32.78-.36.75-.41.71-.46.67-.5.63-.55.58-.59.54-.63.5-.66.45-.69.41-.71.36-.74.31-.75.26-.77.21-.79.16-.8.11-.8.06-.82.02H5.08v-6.43zm-1.44.84a14.28 14.28 0 0 1 .07-1.49l.11-.9.17-.87.24-.85.31-.83.37-.8.44-.76.5-.73.57-.69.62-.64.67-.6.72-.55.77-.5.81-.45.85-.4.89-.34.92-.29.95-.23.97-.18.99-.12 1.01-.06 1.02-.02H15v5.59h-.01v.08l-.01 1.02-.03 1.01-.07.99-.12.96-.18.94-.23.91-.29.87-.34.84-.4.8-.45.76-.5.72-.55.68-.6.64-.64.59-.69.54-.73.5-.76.45-.8.39-.83.34-.85.29-.87.24-.9.18-.91.13-.93.07-.94.02H3.64v-5.59zM2.2 17.24c0-.58.03-1.16.09-1.74l.13-1.04.2-1.01.27-.99.35-.95.42-.92.5-.88.57-.84.64-.8.7-.75.76-.7.82-.65.87-.6.92-.54.96-.49 1-.43 1.04-.37 1.07-.31 1.1-.25 1.12-.19 1.14-.13 1.16-.07 1.17-.02H15v3.91h-.01v.08l-.01 1.17-.03 1.16-.08 1.14-.13 1.13-.19 1.1-.25 1.07-.31 1.04-.37 1-.43.96-.49.92-.54.88-.6.84-.65.8-.7.76-.75.72-.8.68-.84.63-.88.58-.92.53-.95.48-.99.43-1.01.37-1.04.32-1.06.26-1.08.2-1.1.15-1.12.09-1.13.04-1.15.01H2.2v-3.91zm-1.44.84c0-.66.04-1.32.1-1.98l.15-1.19.22-1.16.3-1.13.39-1.09.47-1.05.56-1 .64-.96.72-.92.8-.87.87-.82.94-.76 1.01-.71 1.07-.65 1.13-.59 1.19-.53 1.24-.47 1.29-.41 1.34-.35 1.39-.29 1.43-.22 1.46-.16 1.49-.09 1.52-.03h1.22v2.24h-.01v.08l-.01 1.52-.03 1.49-.08 1.47-.13 1.44-.19 1.41-.25 1.38-.31 1.35-.37 1.32-.43 1.28-.49 1.25-.55 1.21-.6 1.17-.65 1.13-.71 1.09-.76 1.05-.81 1-.87.95-.92.9-.97.85-1.01.8-1.05.74-1.09.68-1.13.62-1.16.56-1.19.5-1.22.44-1.25.38-1.27.32-1.3.26-1.32.2-1.34.14-1.36.08-1.37.02H.76v-2.24z"/>
                    </svg>
                    SoundCloud
                  </a>
                )}
                {epk.social_links.youtube && (
                  <a 
                    href={epk.social_links.youtube} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <Youtube className="w-4 h-4 text-[#FF0000]" />
                    YouTube
                  </a>
                )}
                {epk.social_links.twitter && (
                  <a 
                    href={epk.social_links.twitter} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter / X
                  </a>
                )}
                {epk.social_links.website && (
                  <a 
                    href={epk.social_links.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <Globe className="w-4 h-4 text-[#00a8ff]" />
                    Official Website
                  </a>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 4. Footer platform badge */}
      <footer className="relative z-10 w-full text-center py-16 border-t border-white/5 text-slate-500 text-xs font-mono">
        <p className="flex items-center justify-center gap-2">
          <span>Curated and hosted via</span>
          <span className="font-sans font-black text-slate-300 uppercase tracking-widest text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md">SyncMaster</span>
        </p>
      </footer>
    </div>
  )
}
