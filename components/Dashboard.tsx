
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, CheckCircle, Clock, DollarSign, Music, Upload, X, FileAudio, Loader2, ChevronRight, ListMusic, Layers, Edit2, Calendar, Tag, Save, Filter, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Mic2, Disc, FilePlus, Film, Search as SearchIcon, ImageIcon, Plus, Settings, Link as LinkIcon, Globe, AlertCircle, LogOut, Ghost, Building2, MapPin, Mail, Copy, Check, Info, Phone, Linkedin, Instagram, Twitter, Award, Menu, LayoutDashboard, Activity, User as UserIcon } from 'lucide-react';
import { SyncBrief, Track, Application, TabView, ResearchResult, User, Agency, TrendingSync } from '../types';
import { subscribeToBriefs, subscribeToUserTracks, subscribeToUserApplications, uploadTrackFile, saveTrackMetadata, updateTrackMetadata, submitApplication, updateArtistProfile, fetchAgencies, logoutUser } from '../services/supabase';
import { searchSyncDatabase, getTrendingSyncs } from '../services/geminiService';

interface DashboardProps {
  user: User;
}

const SUGGESTED_GENRES = ['Cinematic', 'Electronic', 'Rock', 'Pop', 'Hip Hop', 'Ambient', 'Folk', 'Corporate', 'Orchestral', 'Synthwave'];
const SUGGESTED_TAGS = ['Uplifting', 'Dark', 'Energetic', 'Emotional', 'Driving', 'Hopeful', 'Tense', 'Epic', 'Quirky', 'Sentimental', 'Advertising', 'Trailer'];

// --- Helper for Errors ---
const getErrorMessage = (err: any) => {
  if (!err) return 'Unknown error occurred';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (err?.message) return err.message;
  // Check for DOM Event objects (which cause circular refs when stringified)
  if (err.target || err.currentTarget || err.srcElement || err.type) return 'Operation failed (Event object received)';
  
  try {
    return JSON.stringify(err);
  } catch (e) {
    return "Error details could not be displayed";
  }
};

// --- Reusable Empty State Component ---
const EmptyState = ({ icon: Icon, title, description, action }: { icon: any, title: string, description: string, action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#1a1b3b]/40 border border-white/5 rounded-xl border-dashed">
    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-white/20" />
    </div>
    <h3 className="text-lg font-bold font-heading text-white mb-2">{title}</h3>
    <p className="text-white/40 text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
    {action}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<TabView>('browse');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data State
  const [briefs, setBriefs] = useState<SyncBrief[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  
  // UI State
  const [selectedBrief, setSelectedBrief] = useState<SyncBrief | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [applicationStep, setApplicationStep] = useState<'select' | 'upload' | 'confirm'>('select');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Research State
  const [searchQuery, setSearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingSyncs, setTrendingSyncs] = useState<TrendingSync[]>([]);

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Subscriptions
  useEffect(() => {
    const unsubBriefs = subscribeToBriefs(setBriefs);
    const unsubTracks = subscribeToUserTracks(user.uid, setTracks);
    const unsubApps = subscribeToUserApplications(user.uid, setApplications);
    
    fetchAgencies().then(setAgencies);

    // Initial Trend Load
    getTrendingSyncs().then(setTrendingSyncs);

    return () => {
      if (typeof unsubBriefs === 'function') unsubBriefs();
      if (typeof unsubTracks === 'function') unsubTracks();
      if (typeof unsubApps === 'function') unsubApps();
    };
  }, [user.uid]);

  // Audio Effects
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            // Safe logging
            console.error("Playback error. Check source URL or permissions.");
            setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Handlers
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const genre = formData.get('genre') as string;
    const description = formData.get('description') as string;
    
    if (!file || !title) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // 1. Upload File
      const audioUrl = await uploadTrackFile(file, user.uid);
      setUploadProgress(50);

      // 2. Save Metadata
      await saveTrackMetadata({
        title,
        artist: user.displayName || 'Unknown Artist',
        genre,
        description,
        tags: [],
        uploadDate: new Date().toISOString().split('T')[0],
        duration: '0:00', // In a real app, we'd calculate this
        audioUrl
      }, user.uid);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + getErrorMessage(error));
      setIsUploading(false);
    }
  };

  const handleApply = (brief: SyncBrief) => {
    setSelectedBrief(brief);
    setApplicationStep('select');
    setIsApplicationModalOpen(true);
  };

  const handleConfirmApplication = async () => {
    if (!selectedBrief || !selectedTrackId) return;
    
    setIsUploading(true); // Reuse loading state
    try {
      await submitApplication({
        briefId: selectedBrief.id,
        trackId: selectedTrackId,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      }, user.uid);
      
      setIsApplicationModalOpen(false);
      setSelectedBrief(null);
      setSelectedTrackId(null);
    } catch (error) {
      alert("Application failed: " + getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const result = await searchSyncDatabase(searchQuery);
    setResearchResult(result);
    setIsSearching(false);
  };

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume > 0 ? prevVolume : 0.7);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const Logo = () => (
    <div className="flex items-center gap-3 mb-8 px-2">
      <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center shrink-0">
        <span className="font-heading font-bold text-[#31326f] text-lg transform translate-y-[1px]">S</span>
      </div>
      <span className="text-xl font-heading font-bold text-white tracking-tighter">
        SYNC<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#e6ff80]">MASTER</span>
      </span>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#31326f] overflow-hidden">
      {/* Invisible Audio Element */}
      <audio 
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={() => {
            if(audioRef.current && !isDragging) {
                setCurrentTime(audioRef.current.currentTime);
                setDuration(audioRef.current.duration || 0);
            }
        }}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
            // Prevent circular structure error by NOT logging 'e' directly in some environments
            console.error("Audio playback failed. The source URL may be invalid or access denied.");
            if (currentTrack) {
               setIsPlaying(false);
            }
        }}
      />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0f1025] border-r border-white/10 relative z-40">
        <div className="p-6">
          <Logo />
          <nav className="space-y-2">
            {[
              { id: 'browse', icon: Briefcase, label: 'Browse Briefs' },
              { id: 'library', icon: Layers, label: 'My Library' },
              { id: 'applications', icon: Activity, label: 'Applications' },
              { id: 'research', icon: SearchIcon, label: 'Market Research' },
              { id: 'directory', icon: Building2, label: 'Agency Directory' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
                  ${activeTab === item.id 
                    ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-black' : ''}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-white/10 bg-black/20">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold border border-white/20">
                 {user.displayName?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                 <div className="font-bold text-white text-sm truncate">{user.displayName}</div>
                 <div className="text-[10px] text-white/50 uppercase tracking-wider">Artist Account</div>
              </div>
           </div>
           <button 
             onClick={logoutUser}
             className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors uppercase tracking-widest"
           >
             <LogOut className="w-3 h-3" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f1025] border-b border-white/10 z-50 flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center shrink-0">
               <span className="font-heading font-bold text-[#31326f] text-lg">S</span>
            </div>
            <span className="font-bold font-heading text-lg">SYNCMASTER</span>
         </div>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
            {isSidebarOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
         {isSidebarOpen && (
            <motion.div 
               initial={{ x: '-100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               className="fixed inset-0 z-40 bg-[#0f1025] md:hidden pt-20 px-6"
            >
               <nav className="space-y-4">
                  {[
                    { id: 'browse', icon: Briefcase, label: 'Browse Briefs' },
                    { id: 'library', icon: Layers, label: 'My Library' },
                    { id: 'applications', icon: Activity, label: 'Applications' },
                    { id: 'research', icon: SearchIcon, label: 'Market Research' },
                    { id: 'directory', icon: Building2, label: 'Agency Directory' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as TabView); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all
                        ${activeTab === item.id 
                          ? 'bg-[#ccff00] text-black' 
                          : 'text-white/60 bg-white/5'
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                  <button 
                     onClick={logoutUser}
                     className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-red-400 bg-red-500/10 mt-8"
                  >
                     <LogOut className="w-5 h-5" /> Sign Out
                  </button>
               </nav>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full relative pt-20 md:pt-0">
        <div className="p-6 md:p-12 pb-32 max-w-[1600px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-white/10">
             <div className="w-full md:w-auto">
                <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">
                   {activeTab === 'browse' && <>Active <span className="text-[#ccff00]">Briefs</span></>}
                   {activeTab === 'library' && <>My <span className="text-[#ccff00]">Tracks</span></>}
                   {activeTab === 'applications' && <>My <span className="text-[#ccff00]">Applications</span></>}
                   {activeTab === 'research' && <>Market <span className="text-[#ccff00]">Intel</span></>}
                   {activeTab === 'directory' && <>Agency <span className="text-[#ccff00]">Directory</span></>}
                </h1>
                <p className="text-white/50 font-mono text-sm">
                   {activeTab === 'browse' && 'Opportunities curated for your sound.'}
                   {activeTab === 'library' && 'Manage and organize your portfolio.'}
                   {activeTab === 'applications' && 'Track the status of your submissions.'}
                   {activeTab === 'research' && 'Analyze successful placements.'}
                   {activeTab === 'directory' && 'Connect with top industry partners.'}
                </p>
             </div>
             
             {activeTab === 'library' && (
                <button 
                   onClick={() => setIsUploadModalOpen(true)}
                   className="mt-4 md:mt-0 flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                   <Upload className="w-4 h-4" /> Upload Track
                </button>
             )}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            
            {/* 1. BROWSE TAB */}
            {activeTab === 'browse' && (
              <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 {briefs.length === 0 ? (
                    <EmptyState icon={Briefcase} title="No Briefs Available" description="Check back later for new opportunities." />
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {briefs.map((brief) => (
                          <div key={brief.id} className="bg-[#1a1b3b]/40 border border-white/10 p-6 rounded-xl hover:border-[#ccff00]/50 transition-colors flex flex-col h-full group">
                             <div className="flex justify-between items-start mb-4">
                                <span className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase tracking-wider font-bold text-white/50">{brief.client}</span>
                                <span className="px-2 py-1 bg-[#ccff00]/10 text-[#ccff00] rounded text-[10px] uppercase tracking-wider font-bold">{brief.deadline}</span>
                             </div>
                             <h3 className="text-lg font-bold text-white group-hover:text-[#ccff00] transition-colors mb-2">{brief.title}</h3>
                             <p className="text-sm text-white/50 line-clamp-3 mb-6 flex-1">{brief.description}</p>
                             <div className="flex flex-wrap gap-2 mb-6">
                                {brief.tags.map(tag => (
                                   <span key={tag} className="text-[10px] border border-white/10 px-2 py-1 rounded text-white/40 uppercase">{tag}</span>
                                ))}
                             </div>
                             <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                                <span className="font-mono text-[#ccff00] font-bold">{brief.budget}</span>
                                <button 
                                   onClick={() => handleApply(brief)}
                                   className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#ccff00] flex items-center gap-1"
                                >
                                   Pitch Track <ChevronRight className="w-3 h-3" />
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </motion.div>
            )}

            {/* 2. LIBRARY TAB */}
            {activeTab === 'library' && (
               <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {tracks.length === 0 ? (
                     <EmptyState 
                        icon={Music} 
                        title="Your library is empty" 
                        description="Upload your first track to start pitching to briefs." 
                        action={
                           <button onClick={() => setIsUploadModalOpen(true)} className="text-[#ccff00] underline uppercase tracking-widest text-xs font-bold mt-4">Upload Now</button>
                        }
                     />
                  ) : (
                     <div className="bg-[#1a1b3b]/40 rounded-xl border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/20 text-xs font-bold uppercase tracking-widest text-white/40 min-w-[800px]">
                           <div className="col-span-1 text-center">Play</div>
                           <div className="col-span-4">Title</div>
                           <div className="col-span-3">Tags</div>
                           <div className="col-span-2">Date</div>
                           <div className="col-span-2 text-right">Duration</div>
                        </div>
                        <div className="overflow-x-auto">
                           <div className="min-w-[800px]">
                              {tracks.map((track) => (
                                 <div key={track.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="col-span-1 flex justify-center">
                                       <button 
                                         onClick={() => handlePlayTrack(track)}
                                         className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#ccff00] hover:text-black flex items-center justify-center transition-colors"
                                       >
                                          {currentTrack?.id === track.id && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                       </button>
                                    </div>
                                    <div className={`col-span-4 font-bold ${currentTrack?.id === track.id ? 'text-[#ccff00]' : 'text-white'}`}>{track.title}</div>
                                    <div className="col-span-3 flex gap-2 overflow-hidden">
                                       {track.tags.slice(0, 2).map(tag => (
                                          <span key={tag} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/60 uppercase">{tag}</span>
                                       ))}
                                    </div>
                                    <div className="col-span-2 text-xs text-white/40 font-mono">{track.uploadDate}</div>
                                    <div className="col-span-2 text-right text-xs text-white/40 font-mono">{track.duration || "2:30"}</div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}
               </motion.div>
            )}

            {/* 3. APPLICATIONS TAB */}
            {activeTab === 'applications' && (
               <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {applications.length === 0 ? (
                     <EmptyState icon={Activity} title="No Applications" description="You haven't applied to any briefs yet." />
                  ) : (
                     <div className="grid gap-4">
                        {applications.map((app) => {
                           const brief = briefs.find(b => b.id === app.briefId);
                           const track = tracks.find(t => t.id === app.trackId);
                           return (
                              <div key={app.id} className="bg-[#1a1b3b]/40 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                 <div>
                                    <h4 className="font-bold text-white mb-1">{brief?.title || 'Unknown Brief'}</h4>
                                    <p className="text-xs text-white/50 uppercase tracking-wide">Track: {track?.title || 'Unknown Track'}</p>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="text-right">
                                       <div className="text-xs text-white/30 uppercase mb-1">Status</div>
                                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                                          ${app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                                            app.status === 'shortlisted' ? 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20' :
                                            app.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            'bg-green-500/10 text-green-500 border-green-500/20'
                                          }`}>
                                          {app.status}
                                       </span>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-xs text-white/30 uppercase mb-1">Date</div>
                                       <div className="font-mono text-sm text-white/60">{app.submittedDate}</div>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}
               </motion.div>
            )}
            
            {/* 4. RESEARCH TAB */}
            {activeTab === 'research' && (
               <motion.div key="research" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-8">
                     <form onSubmit={handleSearch} className="relative max-w-2xl">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ccff00]" />
                        <input 
                           type="text" 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="Search for 'Inception soundtrack' or 'Stranger Things syncs'..." 
                           className="w-full bg-[#1a1b3b]/60 border border-white/10 pl-12 pr-4 py-4 rounded-xl text-white focus:border-[#ccff00] outline-none"
                        />
                        <button type="submit" disabled={isSearching} className="absolute right-2 top-2 bottom-2 px-4 bg-[#ccff00] text-black font-bold uppercase tracking-widest text-xs rounded-lg disabled:opacity-50">
                           {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
                        </button>
                     </form>
                  </div>

                  {researchResult && (
                     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#1a1b3b]/40 border border-white/10 rounded-xl p-6 md:p-8 mb-8">
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                           {researchResult.imageUrl && (
                              <div className="w-32 h-48 bg-black/50 rounded-lg shadow-lg overflow-hidden shrink-0 border border-white/10">
                                 <img src={researchResult.imageUrl} alt={researchResult.subject} className="w-full h-full object-cover" />
                              </div>
                           )}
                           <div>
                              <div className="inline-block px-2 py-1 bg-[#ccff00]/10 text-[#ccff00] text-[10px] font-bold uppercase tracking-wider mb-2 rounded">{researchResult.type}</div>
                              <h2 className="text-3xl font-heading font-bold text-white mb-2">{researchResult.subject}</h2>
                              <p className="text-white/50 text-sm max-w-2xl">Found {researchResult.results.length} key musical moments.</p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           {researchResult.results.map((item, i) => (
                              <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-mono text-xs text-[#ccff00]">
                                    {item.timestamp || "0:00"}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                    {item.artist && <div className="text-[#ccff00] text-sm font-bold mb-2">{item.artist}</div>}
                                    <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                                    <div className="flex gap-2 mt-3">
                                       {item.bpm && <span className="text-[10px] bg-black/40 px-2 py-1 rounded text-white/40 uppercase font-mono">BPM: {item.bpm}</span>}
                                       {item.genre && <span className="text-[10px] bg-black/40 px-2 py-1 rounded text-white/40 uppercase font-mono">{item.genre}</span>}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                  )}
                  
                  {!researchResult && (
                     <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-[#ccff00]" /> Trending Syncs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {trendingSyncs.map((trend) => (
                              <div key={trend.id} onClick={() => { setSearchQuery(trend.title); handleSearch({ preventDefault: () => {} } as any); }} className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-xl cursor-pointer transition-colors group flex gap-4">
                                 {trend.imageUrl ? (
                                    <img src={trend.imageUrl} className="w-16 h-24 object-cover rounded shadow-md" alt={trend.title} />
                                 ) : (
                                    <div className="w-16 h-24 bg-black/50 rounded flex items-center justify-center"><Film className="w-6 h-6 text-white/20" /></div>
                                 )}
                                 <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white group-hover:text-[#ccff00] truncate">{trend.title}</h4>
                                    <p className="text-xs text-white/50 mb-2">{trend.year} • {trend.type}</p>
                                    <div className="text-xs bg-black/30 p-2 rounded border border-white/5">
                                       <div className="text-[#ccff00] font-bold truncate">{trend.topTrack}</div>
                                       <div className="text-white/40 truncate">{trend.artist}</div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </motion.div>
            )}

            {/* 5. DIRECTORY TAB */}
            {activeTab === 'directory' && (
               <motion.div key="directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {agencies.map((agency) => (
                        <div key={agency.id} className="bg-[#1a1b3b]/40 border border-white/10 p-6 rounded-xl flex gap-6 hover:border-white/20 transition-colors">
                           <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                              <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <h3 className="font-bold text-xl text-white">{agency.name}</h3>
                                 <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] uppercase font-bold text-white/60">{agency.type}</span>
                              </div>
                              <p className="text-white/50 text-sm mb-4 line-clamp-2">{agency.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                 {agency.credits.map(credit => (
                                    <span key={credit} className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-1 rounded font-bold uppercase">{credit}</span>
                                 ))}
                              </div>

                              <div className="flex gap-3">
                                 {agency.website && <a href={agency.website} target="_blank" className="p-2 bg-white/5 rounded hover:bg-white/10 text-white/60 hover:text-white"><Globe className="w-4 h-4" /></a>}
                                 {agency.socials?.linkedin && <a href={agency.socials.linkedin} target="_blank" className="p-2 bg-white/5 rounded hover:bg-white/10 text-white/60 hover:text-[#0077b5]"><Linkedin className="w-4 h-4" /></a>}
                                 {agency.socials?.instagram && <a href={agency.socials.instagram} target="_blank" className="p-2 bg-white/5 rounded hover:bg-white/10 text-white/60 hover:text-[#E1306C]"><Instagram className="w-4 h-4" /></a>}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
         {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                  onClick={() => !isUploading && setIsUploadModalOpen(false)} 
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                  className="relative w-full max-w-lg bg-[#1a1b3b] border border-white/10 p-8 rounded-xl shadow-2xl"
               >
                  <h2 className="text-2xl font-heading font-bold text-white mb-6">Upload Track</h2>
                  <form onSubmit={handleUpload} className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Track Title</label>
                        <input name="title" required type="text" className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-lg text-white focus:border-[#ccff00] outline-none" placeholder="e.g. Neon Nights" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Genre</label>
                        <select name="genre" className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-lg text-white focus:border-[#ccff00] outline-none appearance-none">
                           {SUGGESTED_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Audio File (MP3/WAV)</label>
                        <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-[#ccff00]/50 transition-colors cursor-pointer relative">
                           <input name="file" required type="file" accept="audio/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                           <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                           <p className="text-sm text-white/50">Click or Drag to Upload</p>
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Description</label>
                        <textarea name="description" rows={3} className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-lg text-white focus:border-[#ccff00] outline-none" placeholder="Mood, instrumentation, key..." />
                     </div>

                     {uploadProgress > 0 && (
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-[#ccff00] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                     )}

                     <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setIsUploadModalOpen(false)} disabled={isUploading} className="px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-white/60 hover:text-white text-xs">Cancel</button>
                        <button type="submit" disabled={isUploading} className="bg-[#ccff00] text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 text-xs">
                           {isUploading ? 'Uploading...' : 'Save Track'}
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Application Modal */}
      <AnimatePresence>
         {isApplicationModalOpen && selectedBrief && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                  onClick={() => setIsApplicationModalOpen(false)} 
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                  className="relative w-full max-w-lg bg-[#1a1b3b] border border-white/10 p-8 rounded-xl shadow-2xl"
               >
                  <h2 className="text-xl font-heading font-bold text-white mb-2">Apply to: <span className="text-[#ccff00]">{selectedBrief.title}</span></h2>
                  <p className="text-white/50 text-sm mb-6">Select a track from your library to submit.</p>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2 mb-6 pr-2">
                     {tracks.length === 0 ? (
                        <p className="text-white/40 text-center py-4 text-sm">No tracks found. Upload one first.</p>
                     ) : (
                        tracks.map(track => (
                           <div 
                              key={track.id} 
                              onClick={() => setSelectedTrackId(track.id)}
                              className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${selectedTrackId === track.id ? 'bg-[#ccff00]/10 border-[#ccff00] text-white' : 'bg-black/20 border-white/5 text-white/60 hover:border-white/20'}`}
                           >
                              <div className="font-bold text-sm">{track.title}</div>
                              {selectedTrackId === track.id && <CheckCircle className="w-4 h-4 text-[#ccff00]" />}
                           </div>
                        ))
                     )}
                  </div>

                  <div className="flex justify-end gap-4">
                     <button onClick={() => setIsApplicationModalOpen(false)} className="px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-white/60 hover:text-white text-xs">Cancel</button>
                     <button 
                        onClick={handleConfirmApplication} 
                        disabled={!selectedTrackId || isUploading} 
                        className="bg-[#ccff00] text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 text-xs"
                     >
                        {isUploading ? 'Submitting...' : 'Submit Application'}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Persistent Player */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 md:left-64 z-[60] bg-[#0f1025]/95 backdrop-blur-xl border-t border-white/10 px-4 md:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
             <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0">
               <div className={`w-12 h-12 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shrink-0 ${isPlaying ? 'animate-pulse' : ''}`}><Music className="w-6 h-6 text-white/30" /></div>
               <div className="min-w-0 flex-1"><div className="text-sm font-bold text-white truncate">{currentTrack.title}</div><div className="text-xs text-white/50 truncate">{currentTrack.artist}</div></div>
               <button onClick={() => setIsPlaying(!isPlaying)} className="md:hidden w-10 h-10 rounded-full bg-white text-black flex items-center justify-center ml-2">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}</button>
            </div>
            
            <div className="flex flex-col items-center gap-2 w-full md:flex-1 md:max-w-lg order-2 md:order-none">
               <div className="hidden md:flex items-center gap-6">
                 <button className="text-white/40 hover:text-white"><SkipBack className="w-4 h-4" /></button>
                 <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}</button>
                 <button className="text-white/40 hover:text-white"><SkipForward className="w-4 h-4" /></button>
               </div>
               
               {/* Visual Seek Bar */}
               <div className="w-full flex items-center gap-3 text-[10px] font-mono text-white/40 select-none">
                  <span className="w-8 text-right">{formatTime(isDragging ? currentTime : (audioRef.current?.currentTime || 0))}</span>
                  
                  <div className="relative flex-1 h-6 flex items-center group cursor-pointer">
                    {/* Track Background */}
                    <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden">
                       {/* Progress Fill */}
                       <div 
                         className="h-full bg-[#ccff00] group-hover:bg-[#d4ff33] transition-colors" 
                         style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                       />
                    </div>
                    
                    {/* Range Input (Invisible but interactive) */}
                    <input 
                      type="range" 
                      min="0" 
                      max={duration || 100} 
                      value={currentTime} 
                      onChange={(e) => {
                        const newTime = parseFloat(e.target.value);
                        setCurrentTime(newTime);
                        if(audioRef.current) audioRef.current.currentTime = newTime;
                      }}
                      onMouseDown={() => setIsDragging(true)}
                      onMouseUp={() => setIsDragging(false)}
                      onTouchStart={() => setIsDragging(true)}
                      onTouchEnd={() => setIsDragging(false)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {/* Visual Thumb */}
                    <div 
                       className="absolute h-3 w-3 bg-white rounded-full shadow-lg pointer-events-none transition-transform group-hover:scale-125"
                       style={{ left: `${(currentTime / (duration || 1)) * 100}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>

                  <span className="w-8">{formatTime(duration)}</span>
               </div>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
               <button onClick={toggleMute} className="text-white/40 hover:text-white">
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
               </button>
               <div className="relative w-24 h-1 bg-white/10 rounded-full group cursor-pointer">
                  <div className="absolute inset-y-0 left-0 bg-white group-hover:bg-[#ccff00] rounded-full transition-colors" style={{ width: `${volume * 100}%` }} />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
