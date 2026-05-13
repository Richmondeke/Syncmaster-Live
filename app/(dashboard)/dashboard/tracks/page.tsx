import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { 
  Music2, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Play
} from 'lucide-react'

const mockTracks = [
  {
    id: 'tr_1',
    title: 'Midnight Horizon',
    genre: 'Ambient / Cinematic',
    duration: '3:45',
    bpm: '72',
    key: 'Am',
    plays: '1.2k'
  },
  {
    id: 'tr_2',
    title: 'Neon Pulse',
    genre: 'Cyberpunk / Electronic',
    duration: '2:30',
    bpm: '124',
    key: 'Fm',
    plays: '850'
  },
  {
    id: 'tr_3',
    title: 'Ethereal Echoes',
    genre: 'Atmospheric / Vocal',
    duration: '4:12',
    bpm: '65',
    key: 'C#m',
    plays: '2.4k'
  }
]

export default function TracksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Tracks</h1>
          <p className="text-white/50">Manage your music library and catalog.</p>
        </div>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-black font-bold h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus className="w-5 h-5 mr-2" /> Upload Track
        </Button>
      </div>

      {/* Filters/Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 border border-white/10 p-2 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search tracks by title, genre, key..." 
            className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 pl-11 h-10"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <Button variant="ghost" className="h-10 rounded-xl text-white/60 hover:text-white hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Tracks List */}
      <div className="grid gap-3">
        {mockTracks.map((track) => (
          <Card key={track.id} className="bg-white/5 border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all group border-l-2 border-l-transparent hover:border-l-primary">
            <CardContent className="p-4 flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-inner">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{track.title}</h4>
                <p className="text-xs text-white/40 uppercase tracking-wider font-bold">{track.genre}</p>
              </div>

              <div className="hidden md:flex items-center gap-12 px-8">
                <div className="text-center w-12">
                  <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-white/80">{track.duration}</p>
                </div>
                <div className="text-center w-12">
                  <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-0.5">BPM</p>
                  <p className="text-sm font-semibold text-white/80">{track.bpm}</p>
                </div>
                <div className="text-center w-12">
                  <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Key</p>
                  <p className="text-sm font-semibold text-white/80">{track.key}</p>
                </div>
                <div className="text-center w-12">
                  <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-0.5">Plays</p>
                  <p className="text-sm font-semibold text-primary/80">{track.plays}</p>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="rounded-full text-white/20 hover:text-white hover:bg-white/10">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockTracks.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center space-y-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
          <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center rotate-3">
            <Music2 className="w-10 h-10 text-white/20" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">Your library is silent</h3>
            <p className="text-white/40 max-w-xs mx-auto">Upload your first track to start your sync journey.</p>
          </div>
          <Button className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-8">
            Upload My First Track
          </Button>
        </div>
      )}
    </div>
  )
}
