/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, CheckCircle, Clock, DollarSign, Music, Upload, X, FileAudio, Loader2, ChevronRight, ListMusic, Layers, Edit2, Calendar, Tag, Save, Filter, Play, Pause, SkipBack, SkipForward, Volume2, Mic2, Disc, FilePlus } from 'lucide-react';
import { SyncBrief, Track, Application } from '../types';
import { User } from 'firebase/auth';
import { subscribeToBriefs, subscribeToUserTracks, subscribeToUserApplications, uploadTrackFile, saveTrackMetadata, updateTrackMetadata, submitApplication } from '../services/firebase';

interface DashboardProps {
  user: User;
}

type TabView = 'browse' | 'applications' | 'library';

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<TabView>('browse');
  
  // Data State
  const [briefs, setBriefs] = useState<SyncBrief[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // View State
  const [selectedBrief, setSelectedBrief] = useState<SyncBrief | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Apply Workflow State
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [applicationMethod, setApplicationMethod] = useState<'library' | 'upload'>('library');
  const [selectedLibraryTrackId, setSelectedLibraryTrackId] = useState<string | null>(null);

  const [applyFormData, setApplyFormData] = useState({
    title: '',
    artist: user?.displayName || 'Unknown Artist',
    description: '',
    rights: false
  });
  
  // Library Upload State
  const [libraryUploadData, setLibraryUploadData] = useState({
      title: '',
      artist: user?.displayName || 'Unknown Artist',
      genre: '',
      tags: '',
      description: '',
      rights: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const libraryFileInputRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---
  const getBrief = (id: string) => briefs.find(b => b.id === id);
  const getTrack = (id: string) => tracks.find(t => t.id === id);
  const hasApplied = (briefId: string) => applications.some(app => app.briefId === briefId);

  // --- Subscriptions ---
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to Briefs (Public)
    const unsubBriefs = subscribeToBriefs((data) => setBriefs(data));
    
    // Subscribe to User Tracks
    const unsubTracks = subscribeToUserTracks(user.uid, (data) => setTracks(data));
    
    // Subscribe to User Applications
    const unsubApps = subscribeToUserApplications(user.uid, (data) => setApplications(data));

    return () => {
      unsubBriefs();
      unsubTracks();
      unsubApps();
    };
  }, [user]);

  // --- Audio Handlers ---
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // --- Form Handlers ---

  const handleOpenApply = (brief: SyncBrief) => {
    setSelectedBrief(brief);
    setUploadState('idle');
    setTrackFile(null);
    setApplyFormData({ title: '', artist: user.displayName || '', description: '', rights: false });
    // Default to library if they have tracks, otherwise default to upload
    setApplicationMethod(tracks.length > 0 ? 'library' : 'upload');
    setSelectedLibraryTrackId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isLibrary: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTrackFile(file);
      const name = file.name.replace(/\.[^/.]+$/, "");
      
      if (isLibrary) {
          if (!libraryUploadData.title) setLibraryUploadData(prev => ({ ...prev, title: name }));
      } else {
          if (!applyFormData.title) setApplyFormData(prev => ({ ...prev, title: name }));
      }
    }
  };

  const handleSubmitNewTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrief || !trackFile || !user) return;

    setUploadState('uploading');

    try {
      // 1. Upload File
      const audioUrl = await uploadTrackFile(trackFile, user.uid);
      
      // 2. Create Track Metadata
      const newTrack: Omit<Track, 'id'> = {
        title: applyFormData.title,
        artist: applyFormData.artist,
        genre: selectedBrief.genre.split('/')[0].trim(),
        tags: [],
        uploadDate: new Date().toISOString().split('T')[0],
        duration: 'Unknown', // In a real app, read metadata from file
        description: applyFormData.description,
        audioUrl
      };
      
      const savedTrack = await saveTrackMetadata(newTrack, user.uid);

      // 3. Create Application
      const newApplication: Omit<Application, 'id'> = {
        briefId: selectedBrief.id,
        trackId: savedTrack.id!,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      };

      await submitApplication(newApplication, user.uid);

      setUploadState('success');

      setTimeout(() => {
        setSelectedBrief(null);
        setActiveTab('applications');
      }, 1500);

    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed. Please try again.");
      setUploadState('idle');
    }
  };

  const handleSubmitExistingTrackApplication = async () => {
    if (!selectedBrief || !user || !selectedLibraryTrackId) return;
    setUploadState('uploading');

    try {
      const newApplication: Omit<Application, 'id'> = {
        briefId: selectedBrief.id,
        trackId: selectedLibraryTrackId,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      };

      await submitApplication(newApplication, user.uid);
      setUploadState('success');

      setTimeout(() => {
        setSelectedBrief(null);
        setActiveTab('applications');
      }, 1500);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed.");
      setUploadState('idle');
    }
  };

  const handleLibraryUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackFile || !user) return;
    
    setUploadState('uploading');
    
    try {
        const audioUrl = await uploadTrackFile(trackFile, user.uid);
        
        const newTrack: Omit<Track, 'id'> = {
            title: libraryUploadData.title,
            artist: libraryUploadData.artist,
            genre: libraryUploadData.genre,
            tags: libraryUploadData.tags.split(',').map(t => t.trim()).filter(Boolean),
            uploadDate: new Date().toISOString().split('T')[0],
            duration: 'Unknown',
            description: libraryUploadData.description,
            audioUrl
        };
        
        await saveTrackMetadata(newTrack, user.uid);
        
        setUploadState('success');
        setTimeout(() => {
            setShowUploadModal(false);
            setUploadState('idle');
            setTrackFile(null);
            setLibraryUploadData({ title: '', artist: user?.displayName || 'Unknown', genre: '', tags: '', description: '', rights: false });
        }, 1500);
    } catch (error) {
        console.error("Library upload failed:", error);
        alert("Upload failed.");
        setUploadState('idle');
    }
  };

  const handleSaveTrackMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;

    try {
      await updateTrackMetadata(editingTrack.id, {
        title: editingTrack.title,
        artist: editingTrack.artist,
        genre: editingTrack.genre,
        tags: editingTrack.tags,
        description: editingTrack.description
      });
      setEditingTrack(null);
    } catch (error) {
      console.error("Error updating track:", error);
      alert("Failed to save changes.");
    }
  };

  const filteredLibraryTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(librarySearch.toLowerCase()) || 
    t.artist.toLowerCase().includes(librarySearch.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(librarySearch.toLowerCase()))
  );

  // --- Render Components ---

  const StatusBadge = ({ status }: { status: Application['status'] }) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      shortlisted: 'bg-[#4fb7b3]/10 text-[#4fb7b3] border-[#4fb7b3]/20',
      accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen relative">
      <audio 
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">
            SYNC<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">MASTER</span>
          </h1>
          <p className="text-white/60 font-mono text-sm">Welcome back, {user?.displayName || 'Creator'}</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
           {(['browse', 'applications', 'library'] as TabView[]).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all
                 ${activeTab === tab 
                   ? 'bg-[#4fb7b3] text-black shadow-lg shadow-[#4fb7b3]/20' 
                   : 'text-white/60 hover:text-white hover:bg-white/5'
                 }
               `}
             >
               {tab === 'browse' ? 'Briefs' : tab}
             </button>
           ))}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}

      {/* 1. BROWSE BRIEFS */}
      {activeTab === 'browse' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search briefs by keyword, genre, or mood..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-4 text-sm text-white focus:border-[#4fb7b3] outline-none transition-colors"
              />
            </div>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.length === 0 ? (
               <div className="col-span-full py-12 flex justify-center">
                  <Loader2 className="w-8 h-8 text-[#4fb7b3] animate-spin" />
               </div>
            ) : briefs.map((brief, index) => {
              const applied = hasApplied(brief.id);
              return (
                <motion.div
                  key={brief.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-[#1a1b3b]/60 backdrop-blur-md border ${applied ? 'border-[#4fb7b3]/50' : 'border-white/10'} p-6 flex flex-col gap-4 group hover:bg-[#1a1b3b]/80 transition-colors rounded-xl`}
                >
                  <div className="flex justify-between items-start">
                     <div className="bg-white/5 p-2 rounded-lg text-[#a8fbd3]">
                       <Briefcase className="w-5 h-5" />
                     </div>
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${brief.deadline === 'Urgent' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/50'}`}>
                       {brief.deadline}
                     </span>
                  </div>
    
                  <div>
                    <h3 className="text-lg font-bold font-heading leading-tight mb-2 text-white group-hover:text-[#4fb7b3] transition-colors">
                      {brief.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-4">
                      <span>{brief.client}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3 mb-4 min-h-[60px]">
                      {brief.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {brief.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider border border-white/10 px-2 py-0.5 rounded-full text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
    
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#a8fbd3] font-bold text-sm">
                      <DollarSign className="w-4 h-4" />
                      {brief.budget}
                    </div>
                    
                    <button
                      onClick={() => handleOpenApply(brief)}
                      disabled={applied}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center gap-2
                        ${applied 
                          ? 'bg-[#4fb7b3]/20 text-[#4fb7b3] cursor-default' 
                          : 'bg-white text-black hover:bg-[#a8fbd3]'
                        }`}
                    >
                      {applied ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Applied
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 2. APPLICATIONS LIST */}
      {activeTab === 'applications' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-[#1a1b3b]/40 border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/20 text-xs font-bold uppercase tracking-widest text-white/50">
              <div className="col-span-4">Brief</div>
              <div className="col-span-3">Track Submitted</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1"></div>
            </div>
            
            {applications.length === 0 ? (
               <div className="p-12 text-center text-white/40">No applications found. Start applying!</div>
            ) : (
              applications.map((app) => {
                const brief = getBrief(app.briefId);
                const track = getTrack(app.trackId);
                return (
                  <div key={app.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="col-span-4">
                      <div className="font-bold text-white mb-1">{brief?.title || 'Loading Brief...'}</div>
                      <div className="text-xs text-white/50">{brief?.client}</div>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                       <Music className="w-3 h-3 text-[#4fb7b3]" />
                       <span className="text-sm text-gray-200">{track?.title || 'Loading Track...'}</span>
                    </div>
                    <div className="col-span-2 text-xs font-mono text-white/60">
                      {app.submittedDate}
                    </div>
                    <div className="col-span-2">
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      {/* 3. MUSIC LIBRARY */}
      {activeTab === 'library' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1a1b3b]/40 p-6 rounded-xl border border-white/10 gap-4">
            <div>
               <h2 className="text-2xl font-bold font-heading text-white">Your Tracks</h2>
               <p className="text-white/50 text-sm">Manage your metadata and sync assets</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                <input 
                  type="text" 
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search tracks..." 
                  className="w-full bg-white/5 border border-white/10 rounded py-2 pl-8 pr-4 text-xs text-white focus:border-[#4fb7b3] outline-none transition-colors"
                />
              </div>
              <button 
                onClick={() => {
                    setShowUploadModal(true);
                    setUploadState('idle');
                    setTrackFile(null);
                    setLibraryUploadData({ title: '', artist: user.displayName || '', genre: '', tags: '', description: '', rights: false });
                }}
                className="flex items-center gap-2 px-6 py-2 bg-[#4fb7b3] text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-white transition-colors"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
             {filteredLibraryTracks.length === 0 ? (
                <div className="p-8 text-center text-white/30 italic">No tracks found. Upload tracks to build your portfolio.</div>
             ) : filteredLibraryTracks.map((track) => {
               const isCurrent = currentTrack?.id === track.id;
               return (
                <div 
                  key={track.id} 
                  className={`bg-[#1a1b3b]/60 border p-3 rounded-lg flex items-center gap-4 group transition-all
                    ${isCurrent ? 'border-[#4fb7b3]/50 bg-[#4fb7b3]/5' : 'border-white/5 hover:bg-white/5 hover:border-white/20'}
                  `}
                >
                   {/* Play Button */}
                   <button 
                     onClick={() => handlePlayTrack(track)}
                     className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                       ${isCurrent 
                         ? 'bg-[#4fb7b3] text-black' 
                         : 'bg-white/10 text-white hover:bg-white hover:text-black group-hover:bg-white/20'
                       }
                     `}
                   >
                      {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                   </button>
                   
                   <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#a8fbd3]' : 'text-white'}`}>{track.title}</h3>
                      <p className="text-xs text-white/40 truncate">{track.artist}</p>
                   </div>

                   {/* Tags - Desktop Only */}
                   <div className="hidden md:flex gap-2">
                      {track.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] border border-white/10 px-2 py-0.5 rounded text-white/30 uppercase tracking-wide">{t}</span>
                      ))}
                   </div>

                   {/* Metadata Info */}
                   <div className="flex items-center gap-4 text-xs font-mono text-white/30 w-32 justify-end">
                      <div className="hidden md:block">{track.duration}</div>
                      <div className="hidden md:block">{track.genre}</div>
                   </div>

                   <button 
                     onClick={() => setEditingTrack(track)}
                     className="p-2 text-white/30 hover:text-white transition-colors"
                   >
                     <Edit2 className="w-4 h-4" />
                   </button>
                </div>
             )})}
          </div>
        </motion.div>
      )}

      {/* --- PERSISTENT PLAYER BAR --- */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f1025]/95 backdrop-blur-xl border-t border-white/10 px-4 md:px-8 py-3 flex items-center justify-between gap-4"
          >
            {/* Left: Track Info */}
            <div className="flex items-center gap-4 w-1/3 md:w-1/4 min-w-0">
               <div className={`w-12 h-12 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shrink-0 ${isPlaying ? 'animate-pulse' : ''}`}>
                 <Music className="w-6 h-6 text-white/30" />
               </div>
               <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{currentTrack.title}</div>
                  <div className="text-xs text-white/50 truncate">{currentTrack.artist}</div>
               </div>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-lg">
               <div className="flex items-center gap-6">
                  <button className="text-white/40 hover:text-white transition-colors"><SkipBack className="w-4 h-4" /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                  >
                     {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button className="text-white/40 hover:text-white transition-colors"><SkipForward className="w-4 h-4" /></button>
               </div>
               
               <div className="w-full flex items-center gap-2 text-[10px] font-mono text-white/40">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4fb7b3]"
                  />
                  <span>{formatTime(duration)}</span>
               </div>
            </div>

            {/* Right: Volume */}
            <div className="flex items-center justify-end gap-2 w-1/3 md:w-1/4">
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

      {/* --- MODALS --- */}

      {/* Application Modal (Specific to Briefs) */}
      <AnimatePresence>
        {selectedBrief && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedBrief(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1a1b3b] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-2xl"
            >
              <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-start">
                <div>
                  <div className="text-[#a8fbd3] text-xs font-mono uppercase tracking-widest mb-2">Submitting to Brief</div>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white">{selectedBrief.title}</h3>
                  <p className="text-white/50 text-sm mt-1">{selectedBrief.client} • {selectedBrief.budget}</p>
                </div>
                <button onClick={() => setSelectedBrief(null)} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selection Tabs */}
              {uploadState !== 'success' && (
                <div className="flex border-b border-white/10">
                  <button 
                    onClick={() => setApplicationMethod('library')}
                    disabled={tracks.length === 0}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors
                      ${applicationMethod === 'library' 
                        ? 'bg-white/5 text-[#a8fbd3] border-b-2 border-[#a8fbd3]' 
                        : 'text-white/50 hover:text-white hover:bg-white/5'}
                      ${tracks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    Select from Library
                  </button>
                  <button 
                    onClick={() => setApplicationMethod('upload')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors
                      ${applicationMethod === 'upload' 
                        ? 'bg-white/5 text-[#a8fbd3] border-b-2 border-[#a8fbd3]' 
                        : 'text-white/50 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    Upload New
                  </button>
                </div>
              )}

              <div className="p-6 overflow-y-auto custom-scrollbar">
                {uploadState === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-[#4fb7b3]/20 flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-[#4fb7b3]" />
                    </motion.div>
                    <h4 className="text-2xl font-bold font-heading mb-2">Submission Received</h4>
                    <p className="text-white/60">Your track has been sent to the music supervisor.</p>
                  </div>
                ) : applicationMethod === 'library' ? (
                  /* --- LIBRARY SELECTION VIEW --- */
                  <div className="space-y-6">
                    <p className="text-sm text-white/60">Choose a track from your existing catalog:</p>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {tracks.map(track => (
                        <div 
                          key={track.id}
                          onClick={() => setSelectedLibraryTrackId(track.id)}
                          className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all
                            ${selectedLibraryTrackId === track.id 
                              ? 'bg-[#4fb7b3]/20 border-[#4fb7b3]' 
                              : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}
                          `}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedLibraryTrackId === track.id ? 'bg-[#4fb7b3] text-black' : 'bg-white/10 text-white/50'}`}>
                            {selectedLibraryTrackId === track.id ? <CheckCircle className="w-5 h-5" /> : <Music className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-white">{track.title}</div>
                            <div className="text-xs text-white/50">{track.artist}</div>
                          </div>
                          <div className="text-xs text-white/30 font-mono">{track.genre}</div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                       <button type="button" onClick={() => setSelectedBrief(null)} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white">Cancel</button>
                       <button 
                         onClick={handleSubmitExistingTrackApplication}
                         disabled={!selectedLibraryTrackId || uploadState === 'uploading'}
                         className="bg-[#4fb7b3] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
                       >
                         {uploadState === 'uploading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Submit Selected Track'}
                       </button>
                    </div>
                  </div>
                ) : (
                  /* --- UPLOAD NEW VIEW --- */
                  <form onSubmit={handleSubmitNewTrackApplication} className="space-y-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${trackFile ? 'border-[#4fb7b3] bg-[#4fb7b3]/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                    >
                      <input type="file" ref={fileInputRef} onChange={e => handleFileChange(e, false)} accept="audio/*" className="hidden" />
                      {trackFile ? (
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#4fb7b3]/20 rounded-full"><FileAudio className="w-6 h-6 text-[#4fb7b3]" /></div>
                          <div className="text-left"><p className="font-bold text-white">{trackFile.name}</p><p className="text-xs text-[#4fb7b3]">Ready to upload</p></div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-white/50 mb-4" />
                          <p className="text-sm font-bold uppercase tracking-widest text-white mb-1">Upload Track</p>
                          <p className="text-xs text-white/40">WAV, MP3, or AIFF (Max 50MB)</p>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/70">Track Title</label>
                        <input type="text" required value={applyFormData.title} onChange={e => setApplyFormData({...applyFormData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none rounded-lg" placeholder="e.g. Neon Nights" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/70">Artist</label>
                        <input type="text" required value={applyFormData.artist} onChange={e => setApplyFormData({...applyFormData, artist: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none rounded-lg" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/70">Description / Pitch</label>
                        <textarea rows={2} value={applyFormData.description} onChange={e => setApplyFormData({...applyFormData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none rounded-lg resize-none" placeholder="Notes for the supervisor..." />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" required checked={applyFormData.rights} onChange={e => setApplyFormData({...applyFormData, rights: e.target.checked})} className="mt-1 w-4 h-4 rounded border-white/30 bg-white/5 checked:bg-[#4fb7b3]" />
                      <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">I confirm that I control 100% of the rights for this track.</span>
                    </label>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                       <button type="button" onClick={() => setSelectedBrief(null)} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white">Cancel</button>
                       <button type="submit" disabled={uploadState === 'uploading' || !trackFile || !applyFormData.rights} className="bg-[#4fb7b3] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2">
                         {uploadState === 'uploading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Submit Track'}
                       </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Library Upload Modal (Generic) */}
      <AnimatePresence>
          {showUploadModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                      onClick={() => setShowUploadModal(false)}
                  />
                  
                  <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="relative w-full max-w-2xl bg-[#1a1b3b] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-2xl"
                  >
                      <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-start">
                          <div>
                              <div className="text-[#a8fbd3] text-xs font-mono uppercase tracking-widest mb-2">Add to Library</div>
                              <h3 className="text-xl md:text-2xl font-heading font-bold text-white">Upload New Track</h3>
                          </div>
                          <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white">
                              <X className="w-5 h-5" />
                          </button>
                      </div>

                      <div className="p-6 overflow-y-auto custom-scrollbar">
                          {uploadState === 'success' ? (
                              <div className="flex flex-col items-center justify-center py-12 text-center">
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-[#4fb7b3]/20 flex items-center justify-center mb-6">
                                      <CheckCircle className="w-10 h-10 text-[#4fb7b3]" />
                                  </motion.div>
                                  <h4 className="text-2xl font-bold font-heading mb-2">Upload Complete</h4>
                                  <p className="text-white/60">Your track is now in your library and ready for sync.</p>
                              </div>
                          ) : (
                              <form onSubmit={handleLibraryUploadSubmit} className="space-y-6">
                                  <div 
                                      onClick={() => libraryFileInputRef.current?.click()}
                                      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${trackFile ? 'border-[#4fb7b3] bg-[#4fb7b3]/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}
                                  >
                                      <input type="file" ref={libraryFileInputRef} onChange={e => handleFileChange(e, true)} accept="audio/*" className="hidden" />
                                      {trackFile ? (
                                          <div className="flex items-center gap-4">
                                              <div className="p-3 bg-[#4fb7b3]/20 rounded-full"><FileAudio className="w-6 h-6 text-[#4fb7b3]" /></div>
                                              <div className="text-left"><p className="font-bold text-white">{trackFile.name}</p><p className="text-xs text-[#4fb7b3]">Ready to upload</p></div>
                                          </div>
                                      ) : (
                                          <>
                                              <Upload className="w-8 h-8 text-white/50 mb-4" />
                                              <p className="text-sm font-bold uppercase tracking-widest text-white mb-1">Select Audio File</p>
                                              <p className="text-xs text-white/40">WAV, MP3, or AIFF (Max 50MB)</p>
                                          </>
                                      )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                          <label className="text-xs font-bold uppercase tracking-widest text-white/70">Track Title</label>
                                          <input type="text" required value={libraryUploadData.title} onChange={e => setLibraryUploadData({...libraryUploadData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none rounded-lg" placeholder="e.g. Midnight Run" />
                                      </div>
                                      <div className="space-y-2">
                                          <label className="text-xs font-bold uppercase tracking-widest text-white/70">Artist</label>
                                          <input type="text" required value={libraryUploadData.artist} onChange={e => setLibraryUploadData({...libraryUploadData, artist: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none rounded-lg" />
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                          <label className="text-xs font-bold uppercase tracking-widest text-white/70">Genre</label>
                                          <input type="text" required value={libraryUploadData.genre} onChange={e => setLibraryUploadData({...libraryUploadData, genre: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none rounded-lg" placeholder="e.g. Synthwave" />
                                      </div>
                                      <div className="space-y-2">
                                          <label className="text-xs font-bold uppercase tracking-widest text-white/70">Tags (Comma Separated)</label>
                                          <input type="text" value={libraryUploadData.tags} onChange={e => setLibraryUploadData({...libraryUploadData, tags: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none rounded-lg" placeholder="e.g. Upbeat, Sports, Driving" />
                                      </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase tracking-widest text-white/70">Description / Metadata</label>
                                      <textarea rows={2} value={libraryUploadData.description} onChange={e => setLibraryUploadData({...libraryUploadData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none rounded-lg resize-none" placeholder="BPM, Key, Mood..." />
                                  </div>

                                  <label className="flex items-start gap-3 cursor-pointer group">
                                      <input type="checkbox" required checked={libraryUploadData.rights} onChange={e => setLibraryUploadData({...libraryUploadData, rights: e.target.checked})} className="mt-1 w-4 h-4 rounded border-white/30 bg-white/5 checked:bg-[#4fb7b3]" />
                                      <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">I confirm that I control 100% of the rights for this track.</span>
                                  </label>

                                  <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                                      <button type="button" onClick={() => setShowUploadModal(false)} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white">Cancel</button>
                                      <button type="submit" disabled={uploadState === 'uploading' || !trackFile || !libraryUploadData.rights} className="bg-[#4fb7b3] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2">
                                          {uploadState === 'uploading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Save to Library'}
                                      </button>
                                  </div>
                              </form>
                          )}
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* Edit Metadata Modal */}
      <AnimatePresence>
        {editingTrack && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
               onClick={() => setEditingTrack(null)}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="relative w-full max-w-lg bg-[#1a1b3b] border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
             >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                  <h3 className="font-heading font-bold text-xl text-white">Edit Metadata</h3>
                  <button onClick={() => setEditingTrack(null)}><X className="w-5 h-5 text-white/50 hover:text-white" /></button>
                </div>
                
                <form onSubmit={handleSaveTrackMetadata} className="p-6 space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#a8fbd3]">Title</label>
                      <input 
                        type="text" 
                        value={editingTrack.title} 
                        onChange={e => setEditingTrack({...editingTrack, title: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:border-[#4fb7b3] outline-none rounded"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#a8fbd3]">Artist</label>
                        <input 
                          type="text" 
                          value={editingTrack.artist} 
                          onChange={e => setEditingTrack({...editingTrack, artist: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:border-[#4fb7b3] outline-none rounded"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#a8fbd3]">Genre</label>
                        <input 
                          type="text" 
                          value={editingTrack.genre} 
                          onChange={e => setEditingTrack({...editingTrack, genre: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:border-[#4fb7b3] outline-none rounded"
                        />
                     </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#a8fbd3]">Tags (comma separated)</label>
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-2 rounded focus-within:border-[#4fb7b3]">
                        <Tag className="w-4 h-4 text-white/30" />
                        <input 
                          type="text" 
                          value={editingTrack.tags.join(', ')} 
                          onChange={e => setEditingTrack({...editingTrack, tags: e.target.value.split(',').map(t => t.trim())})}
                          className="w-full bg-transparent text-sm text-white outline-none"
                        />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#a8fbd3]">Description</label>
                      <textarea 
                        rows={3}
                        value={editingTrack.description || ''} 
                        onChange={e => setEditingTrack({...editingTrack, description: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 px-4 py-2 text-sm text-white focus:border-[#4fb7b3] outline-none rounded resize-none"
                      />
                   </div>

                   <div className="pt-4 flex justify-end gap-3">
                      <button type="button" onClick={() => setEditingTrack(null)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white">Cancel</button>
                      <button type="submit" className="px-6 py-2 bg-[#4fb7b3] hover:bg-white text-black text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;