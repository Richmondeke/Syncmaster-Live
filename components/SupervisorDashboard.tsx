
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User as UserIcon, LogOut, ChevronLeft, Music, Play, Pause, SkipBack, SkipForward, Volume2, Grid, Layers, Disc, Activity, Award, Briefcase, X, Link as LinkIcon, Globe, Ghost } from 'lucide-react';
import { User, Profile, Track, Application, SyncBrief } from '../types';
import { fetchArtists, fetchArtistTracks, fetchArtistApplications, getBriefs } from '../services/supabase';

interface SupervisorDashboardProps {
  user: User;
}

// --- Reusable Empty State ---
const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#1a1b3b]/40 border border-white/5 rounded-xl border-dashed col-span-full">
    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-white/20" />
    </div>
    <h3 className="text-lg font-bold font-heading text-white mb-2">{title}</h3>
    <p className="text-white/40 text-sm max-w-sm">{description}</p>
  </div>
);

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ user }) => {
  const [view, setView] = useState<'browse' | 'artist'>('browse');
  const [artists, setArtists] = useState<Profile[]>([]);
  const [briefs, setBriefs] = useState<SyncBrief[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Profile | null>(null);
  const [artistTracks, setArtistTracks] = useState<Track[]>([]);
  const [artistApps, setArtistApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAppsModal, setShowAppsModal] = useState(false);
  
  // Stats State
  const [artistStats, setArtistStats] = useState({
      totalTracks: 0,
      totalApps: 0,
      topGenre: '-'
  });
  
  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadArtists();
    loadBriefs();
  }, []);

  useEffect(() => {
    if (selectedArtist) {
      loadArtistData(selectedArtist.id);
    }
  }, [selectedArtist]);

  const loadArtists = async () => {
    setLoading(true);
    const data = await fetchArtists();
    setArtists(data);
    setLoading(false);
  };

  const loadBriefs = async () => {
    const data = await getBriefs();
    setBriefs(data);
  };

  const loadArtistData = async (artistId: string) => {
    // 1. Fetch Tracks
    const tracks = await fetchArtistTracks(artistId);
    setArtistTracks(tracks);

    // 2. Fetch Applications
    const apps = await fetchArtistApplications(artistId);
    setArtistApps(apps);

    // 3. Calculate Stats
    const genres = tracks.map(t => t.genre).filter(Boolean);
    const genreCounts: Record<string, number> = {};
    let topGenre = selectedArtist?.genre || '-';
    
    if (genres.length > 0) {
        genres.forEach(g => {
             const mainGenre = g.split('/')[0].trim(); // Handle "Pop / Rock"
             genreCounts[mainGenre] = (genreCounts[mainGenre] || 0) + 1;
        });
        // Find mode
        topGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
    }

    setArtistStats({
        totalTracks: tracks.length,
        totalApps: apps.length,
        topGenre
    });
  };

  // --- Helpers ---
  const getBriefTitle = (briefId: string) => briefs.find(b => b.id === briefId)?.title || 'Unknown Brief';
  const getTrackTitle = (trackId: string) => artistTracks.find(t => t.id === trackId)?.title || 'Unknown Track';

  const StatusBadge = ({ status }: { status: Application['status'] }) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      shortlisted: 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20',
      accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${colors[status]}`}>
        {status}
      </span>
    );
  };

  // --- Audio Logic ---
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pt-24 pb-48 md:pb-32 px-4 md:px-12 max-w-[1600px] mx-auto min-h-screen relative">
       <audio 
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={() => {
            if(audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                setDuration(audioRef.current.duration || 0);
            }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">
            Supervisor <span className="text-[#ccff00]">Console</span>
          </h1>
          <p className="text-white/50 font-mono text-sm">Welcome, {user.displayName}</p>
        </div>
        
        {view === 'artist' && (
          <button 
            onClick={() => { setView('browse'); setSelectedArtist(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Artists
          </button>
        )}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: BROWSE ARTISTS (Apple Music Grid) */}
        {view === 'browse' && (
          <motion.div 
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <Grid className="w-5 h-5 text-[#ccff00]" />
              Browse Talent
            </h2>
            
            {loading ? (
              <div className="text-white/40 text-center py-20">Loading global roster...</div>
            ) : artists.length === 0 ? (
              <EmptyState 
                 icon={Ghost}
                 title="No Artists Found"
                 description="The roster is currently empty. Wait for new artists to join."
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                {artists.map((artist) => (
                  <div 
                    key={artist.id}
                    onClick={() => { setSelectedArtist(artist); setView('artist'); }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square rounded-full overflow-hidden bg-[#1a1b3b] mb-4 relative shadow-2xl border border-white/5 group-hover:border-[#ccff00]/50 transition-colors">
                      <img 
                        src={artist.avatar_url || `https://ui-avatars.com/api/?name=${artist.full_name}&background=random`} 
                        alt={artist.full_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Play className="w-12 h-12 text-white fill-white" />
                      </div>
                    </div>
                    <h3 className="text-center font-bold text-sm md:text-lg truncate text-white group-hover:text-[#ccff00] transition-colors">{artist.full_name}</h3>
                    <p className="text-center text-[10px] md:text-xs text-white/50 uppercase tracking-widest">{artist.genre || 'Multi-Genre'}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 2: ARTIST DETAIL (Song List) */}
        {view === 'artist' && selectedArtist && (
          <motion.div
            key="artist"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Artist Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end mb-8">
               <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-[#ccff00]/20 shrink-0">
                  <img 
                    src={selectedArtist.avatar_url || `https://ui-avatars.com/api/?name=${selectedArtist.full_name}`} 
                    className="w-full h-full object-cover"
                    alt={selectedArtist.full_name}
                  />
               </div>
               <div className="text-center md:text-left w-full">
                  <span className="text-[#ccff00] font-mono text-xs uppercase tracking-widest mb-2 block">Artist Profile</span>
                  <h2 className="text-4xl md:text-7xl font-heading font-black text-white mb-4">{selectedArtist.full_name}</h2>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
                     <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wide border border-white/10">{selectedArtist.genre || 'Unclassified'}</span>
                     
                     {/* Social Links */}
                     {selectedArtist.socials && (
                       <div className="flex gap-2 ml-2">
                         {selectedArtist.socials.spotify && (
                           <a href={selectedArtist.socials.spotify} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-black/30 hover:bg-[#1DB954] hover:text-black transition-colors text-white">
                             <Music className="w-4 h-4" />
                           </a>
                         )}
                         {selectedArtist.socials.appleMusic && (
                           <a href={selectedArtist.socials.appleMusic} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-black/30 hover:bg-[#FA243C] hover:text-white transition-colors text-white">
                             <Disc className="w-4 h-4" />
                           </a>
                         )}
                         {selectedArtist.socials.instagram && (
                           <a href={selectedArtist.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-black/30 hover:bg-[#E1306C] hover:text-white transition-colors text-white">
                             <LinkIcon className="w-4 h-4" />
                           </a>
                         )}
                         {selectedArtist.socials.website && (
                           <a href={selectedArtist.socials.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-black/30 hover:bg-blue-500 hover:text-white transition-colors text-white">
                             <Globe className="w-4 h-4" />
                           </a>
                         )}
                       </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
               <div className="bg-[#1a1b3b]/40 border border-white/10 p-6 rounded-xl flex items-center gap-4">
                   <div className="p-3 bg-[#ccff00]/10 text-[#ccff00] rounded-full">
                       <Disc className="w-6 h-6" />
                   </div>
                   <div>
                       <div className="text-2xl font-bold text-white font-heading">{artistStats.totalTracks}</div>
                       <div className="text-xs text-white/50 uppercase tracking-wider">Total Tracks</div>
                   </div>
               </div>

               <div className="bg-[#1a1b3b]/40 border border-white/10 p-6 rounded-xl flex items-center gap-4">
                   <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full">
                       <Activity className="w-6 h-6" />
                   </div>
                   <div>
                       <div className="text-2xl font-bold text-white font-heading">{artistStats.topGenre}</div>
                       <div className="text-xs text-white/50 uppercase tracking-wider">Top Genre</div>
                   </div>
               </div>

               <div className="bg-[#1a1b3b]/40 border border-white/10 p-6 rounded-xl flex items-center gap-4">
                   <div className="p-3 bg-purple-500/10 text-purple-400 rounded-full">
                       <Award className="w-6 h-6" />
                   </div>
                   <div>
                       <div className="text-2xl font-bold text-white font-heading">{artistStats.totalApps}</div>
                       <div className="text-xs text-white/50 uppercase tracking-wider">Brief Applications</div>
                   </div>
               </div>

               {/* View Applications Button */}
               <button 
                  onClick={() => setShowAppsModal(true)}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#ccff00]/50 p-6 rounded-xl flex flex-col items-center justify-center gap-2 group transition-all h-full"
               >
                  <Briefcase className="w-8 h-8 text-white group-hover:text-[#ccff00] transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#ccff00]">View Application History</span>
               </button>
            </div>

            {/* Song List */}
            <div className="bg-[#1a1b3b]/40 rounded-2xl border border-white/10 overflow-hidden">
               <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/20 text-xs font-bold uppercase tracking-widest text-white/40 min-w-[600px]">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5">Title</div>
                  <div className="col-span-4">Tags</div>
                  <div className="col-span-2 text-right">Duration</div>
               </div>
               
               <div className="overflow-x-auto">
                 <div className="min-w-[600px]">
                   {artistTracks.length === 0 ? (
                      <div className="p-12">
                          <EmptyState 
                             icon={Music}
                             title="No Tracks"
                             description="This artist hasn't uploaded any tracks to their library yet."
                          />
                      </div>
                   ) : (
                     artistTracks.map((track, idx) => {
                       const isCurrent = currentTrack?.id === track.id;
                       return (
                         <div 
                           key={track.id} 
                           className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors group ${isCurrent ? 'bg-[#ccff00]/5' : ''}`}
                           onDoubleClick={() => handlePlayTrack(track)}
                         >
                            <div className="col-span-1 flex justify-center">
                               <button 
                                 onClick={() => handlePlayTrack(track)}
                                 className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-[#ccff00] hover:bg-white/10 transition-all"
                               >
                                 {isCurrent && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                               </button>
                            </div>
                            <div className="col-span-5">
                               <div className={`font-bold ${isCurrent ? 'text-[#ccff00]' : 'text-white'}`}>{track.title}</div>
                               <div className="text-xs text-white/40">{track.artist}</div>
                            </div>
                            <div className="col-span-4 flex gap-2 overflow-hidden">
                               {track.tags.slice(0, 3).map(tag => (
                                 <span key={tag} className="text-[10px] border border-white/10 px-2 py-0.5 rounded text-white/40 uppercase">{tag}</span>
                               ))}
                            </div>
                            <div className="col-span-2 text-right text-xs font-mono text-white/40">
                               {track.duration || "0:00"}
                            </div>
                         </div>
                       );
                     })
                   )}
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications Modal */}
      <AnimatePresence>
        {showAppsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
               onClick={() => setShowAppsModal(false)}
            />
            <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-[95%] md:w-full max-w-4xl bg-[#1a1b3b] border border-white/10 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
               <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-white">Application History</h3>
                    <p className="text-xs text-white/50 uppercase tracking-widest">{selectedArtist?.full_name}</p>
                  </div>
                  <button onClick={() => setShowAppsModal(false)}><X className="w-5 h-5 text-white/50 hover:text-white" /></button>
               </div>
               
               <div className="overflow-y-auto p-0">
                 <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40 sticky top-0 backdrop-blur-sm z-10">
                       <tr>
                          <th className="p-4">Brief</th>
                          <th className="p-4">Track Submitted</th>
                          <th className="p-4">Submitted Date</th>
                          <th className="p-4 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {artistApps.length === 0 ? (
                          <tr>
                             <td colSpan={4} className="p-12">
                                <EmptyState 
                                  icon={Briefcase}
                                  title="No Applications"
                                  description="This artist hasn't applied to any briefs yet."
                                />
                             </td>
                          </tr>
                       ) : (
                          artistApps.map((app) => (
                             <tr key={app.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                   <div className="font-bold text-white text-sm">{getBriefTitle(app.briefId)}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-300">
                                   <div className="flex items-center gap-2">
                                      <Music className="w-3 h-3 text-[#ccff00]" />
                                      {getTrackTitle(app.trackId)}
                                   </div>
                                </td>
                                <td className="p-4 text-xs font-mono text-white/50">{app.submittedDate}</td>
                                <td className="p-4 text-right">
                                   <StatusBadge status={app.status} />
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Player - Mobile Responsive */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1025]/95 backdrop-blur-xl border-t border-white/10 px-4 md:px-8 py-4 md:py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]"
          >
             {/* Simple Player UI reusing style from Dashboard */}
            <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0">
               <div className={`w-12 h-12 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shrink-0 ${isPlaying ? 'animate-pulse' : ''}`}>
                 <Music className="w-6 h-6 text-white/30" />
               </div>
               <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white truncate">{currentTrack.title}</div>
                  <div className="text-xs text-white/50 truncate">{currentTrack.artist}</div>
               </div>
                {/* Mobile Play Button */}
               <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="md:hidden w-10 h-10 rounded-full bg-white text-black flex items-center justify-center ml-2"
               >
                   {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
               </button>
            </div>

            <div className="flex flex-col items-center gap-2 w-full md:flex-1 md:max-w-lg order-2 md:order-none">
               <div className="hidden md:flex items-center gap-6">
                  <button className="text-white/40 hover:text-white"><SkipBack className="w-4 h-4" /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                  >
                     {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button className="text-white/40 hover:text-white"><SkipForward className="w-4 h-4" /></button>
               </div>
               
               <div className="w-full flex items-center gap-2 text-[10px] font-mono text-white/40">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => {
                         if(audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value);
                         setCurrentTime(parseFloat(e.target.value));
                    }}
                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ccff00]"
                  />
                  <span>{formatTime(duration)}</span>
               </div>
            </div>

            <div className="hidden md:flex items-center justify-end gap-2 w-1/4">
               <Volume2 className="w-4 h-4 text-white/40" />
               <input 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.01" 
                 value={volume}
                 onChange={(e) => setVolume(parseFloat(e.target.value))}
                 className="w-20 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupervisorDashboard;
