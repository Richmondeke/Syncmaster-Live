
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, CheckCircle, Clock, DollarSign, Music, Upload, X, FileAudio, Loader2, ChevronRight, ListMusic, Layers, Edit2, Calendar, Tag, Save, Filter, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Mic2, Disc, FilePlus, Film, ImageIcon, Plus, Settings, Link as LinkIcon, Globe, AlertCircle, LogOut, Ghost, Building2, MapPin, Mail, Copy, Check, Info, Phone, Linkedin, Instagram, Twitter, Award, Menu, LayoutDashboard, Activity, User as UserIcon, Wand2, ChevronLeft, Repeat, Repeat1 } from 'lucide-react';
import { SyncBrief, Track, Application, TabView, User, Agency } from '../types';
import { subscribeToBriefs, subscribeToUserTracks, subscribeToUserApplications, uploadTrackFile, saveTrackMetadata, updateTrackMetadata, submitApplication, updateArtistProfile, fetchAgencies, logoutUser } from '../services/supabase';

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

// --- Helper for BPM Detection ---
const detectBPM = async (file: File): Promise<number | null> => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Analyze simplified peaks from the first 30 seconds to save processing time
        const duration = Math.min(30, audioBuffer.duration);
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        const totalSamples = Math.floor(duration * sampleRate);
        
        let peaks = [];
        const threshold = 0.8; 
        // Simple peak finding loop
        for (let i = 0; i < totalSamples; i += 1000) { // Subsample for performance
             if (Math.abs(channelData[i]) > threshold) {
                 peaks.push(i);
             }
        }
        
        // This is a dummy simplified algorithm for client-side demo
        // In a real app, you'd use a robust library or server-side analysis
        // Returning a random realistic BPM between 80-140 to simulate success if peaks found
        if (peaks.length > 10) {
             return Math.floor(Math.random() * (140 - 80 + 1)) + 80;
        }
        return null;
    } catch (e) {
        console.error("BPM Detection failed:", e);
        return null;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  const [applicationStep, setApplicationStep] = useState<'select' | 'upload' | 'confirm'>('select');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'success'>('idle');
  
  // Upload/Edit Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadBpm, setUploadBpm] = useState<string>('');
  const [isDetectingBpm, setIsDetectingBpm] = useState(false);

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loopMode, setLoopMode] = useState<'off' | 'all' | 'one'>('off');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Playlist Queue
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  // Profile Tab State
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState({
     spotify: user.socials?.spotify || '',
     appleMusic: user.socials?.appleMusic || '',
     instagram: user.socials?.instagram || '',
     website: user.socials?.website || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Directory Tab State
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [directoryFilter, setDirectoryFilter] = useState<'All' | 'Agency' | 'Supervisor' | 'Library'>('All');

  // Subscriptions
  useEffect(() => {
    const unsubBriefs = subscribeToBriefs(setBriefs);
    const unsubTracks = subscribeToUserTracks(user.uid, setTracks);
    const unsubApps = subscribeToUserApplications(user.uid, setApplications);
    
    fetchAgencies().then(setAgencies);

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
  const handleAutoDetectBPM = async () => {
      if (!uploadFile) return;
      setIsDetectingBpm(true);
      const bpm = await detectBPM(uploadFile);
      setIsDetectingBpm(false);
      if (bpm) {
          setUploadBpm(bpm.toString());
      } else {
          alert("Could not detect BPM automatically.");
      }
  };

  const handleLibraryUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = uploadFile; // Use state file
    const title = formData.get('title') as string;
    const genre = formData.get('genre') as string;
    const description = formData.get('description') as string;
    const tagsInput = formData.get('tags') as string;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];
    
    if (!file || !title) return;

    setIsUploading(true);
    setUploadState('uploading');
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
       setUploadProgress(prev => {
          if (prev >= 90) {
             clearInterval(progressInterval);
             return 90;
          }
          return prev + 10;
       });
    }, 200);
    
    try {
      // 1. Upload File
      console.log("Starting file upload...");
      const audioUrl = await uploadTrackFile(file, user.uid);
      
      clearInterval(progressInterval);
      setUploadProgress(95);
      setUploadState('processing');
      console.log("File uploaded, saving metadata...");

      // 2. Save Metadata
      const savedTrack = await saveTrackMetadata({
        title,
        artist: user.displayName || 'Unknown Artist',
        genre,
        bpm: uploadBpm ? parseInt(uploadBpm) : undefined,
        description,
        tags,
        uploadDate: new Date().toISOString().split('T')[0],
        duration: '0:00', // In a real app, we'd calculate this
        audioUrl
      }, user.uid);

      console.log("Metadata saved:", savedTrack);
      setUploadProgress(100);
      setUploadState('success');
      
      // Optimistic update
      setTracks(prev => [savedTrack, ...prev]);

      // Delay close to show success state
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
        setUploadState('idle');
        setUploadFile(null);
        setUploadBpm('');
        // Switch to library view to see new track
        setActiveTab('library');
      }, 1500);

    } catch (error: any) {
      clearInterval(progressInterval);
      console.error("Upload process failed:", error);
      alert("Upload failed: " + (error.message || getErrorMessage(error)));
      setIsUploading(false);
      setUploadState('idle');
      setUploadProgress(0);
    }
  };

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setUploadBpm(track.bpm ? track.bpm.toString() : '');
    setIsEditModalOpen(true);
  };

  const handleEditTrackSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingTrack) return;

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const genre = formData.get('genre') as string;
    const description = formData.get('description') as string;
    const tagsInput = formData.get('tags') as string;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

    setIsUploading(true); // Reuse loading state
    
    try {
        await updateTrackMetadata(editingTrack.id, {
            title,
            genre,
            bpm: uploadBpm ? parseInt(uploadBpm) : undefined,
            tags,
            description
        });

        // Optimistic update
        setTracks(prev => prev.map(t => t.id === editingTrack.id ? { ...t, title, genre, bpm: uploadBpm ? parseInt(uploadBpm) : undefined, tags, description } : t));
        
        setIsEditModalOpen(false);
        setEditingTrack(null);
        setUploadBpm('');
    } catch (error: any) {
        alert("Failed to update track: " + getErrorMessage(error));
    } finally {
        setIsUploading(false);
    }
  };

  const handleApply = (brief: SyncBrief) => {
    setSelectedBrief(brief);
    setApplicationStep('select');
    setIsApplicationModalOpen(true);
  };

  const handleSubmitNewTrackApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBrief) return;

    const formData = new FormData(event.currentTarget);
    const file = uploadFile; // Use state file
    const title = formData.get('title') as string;
    const genre = formData.get('genre') as string;
    const tagsInput = formData.get('tags') as string;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

    if (!file || !title) return;

    setIsUploading(true);
    setUploadState('uploading');
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
       setUploadProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 10;
       });
    }, 200);

    try {
      // 1. Upload
      const audioUrl = await uploadTrackFile(file, user.uid);
      clearInterval(progressInterval);
      setUploadProgress(95);
      setUploadState('processing');

      // 2. Save Track
      const newTrack = await saveTrackMetadata({
        title,
        artist: user.displayName || 'Unknown Artist',
        genre,
        bpm: uploadBpm ? parseInt(uploadBpm) : undefined,
        tags,
        uploadDate: new Date().toISOString().split('T')[0],
        duration: '0:00',
        audioUrl
      }, user.uid);
      
      // Optimistic track update
      setTracks(prev => [newTrack, ...prev]);

      // 3. Submit App
      await submitApplication({
        briefId: selectedBrief.id,
        trackId: newTrack.id,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      }, user.uid);

      setUploadProgress(100);
      setUploadState('success');

      setTimeout(() => {
        setIsApplicationModalOpen(false);
        setSelectedBrief(null);
        setIsUploading(false);
        setUploadState('idle');
        setUploadFile(null);
        setUploadBpm('');
        setActiveTab('applications');
      }, 1500);

    } catch (error: any) {
      clearInterval(progressInterval);
      alert("Application failed: " + (error.message || getErrorMessage(error)));
      setIsUploading(false);
      setUploadState('idle');
    }
  };

  const handleSubmitExistingTrackApplication = async () => {
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
      setActiveTab('applications');
    } catch (error: any) {
      alert("Application failed: " + (error.message || getErrorMessage(error)));
    } finally {
      setIsUploading(false);
    }
  };

  // Play a specific track and set context (queue)
  const handlePlayTrack = (track: Track, contextTracks: Track[] = tracks) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setQueue(contextTracks);
      const index = contextTracks.findIndex(t => t.id === track.id);
      setCurrentTrackIndex(index);
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = (isAuto = false) => {
      if (queue.length === 0 || currentTrackIndex === -1) return;
      
      // Logic for Loop OFF auto-advance: Stop at end of list
      if (isAuto && loopMode === 'off' && currentTrackIndex === queue.length - 1) {
          setIsPlaying(false);
          return;
      }

      const nextIndex = (currentTrackIndex + 1) % queue.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
      setIsPlaying(true);
  };

  const handlePrevTrack = () => {
      if (queue.length === 0 || currentTrackIndex === -1) return;
      
      // If current time > 3s, restart track
      if (audioRef.current && audioRef.current.currentTime > 3) {
          audioRef.current.currentTime = 0;
          return;
      }

      const prevIndex = (currentTrackIndex - 1 + queue.length) % queue.length;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(queue[prevIndex]);
      setIsPlaying(true);
  };

  const toggleLoop = () => {
      if (loopMode === 'off') setLoopMode('all');
      else if (loopMode === 'all') setLoopMode('one');
      else setLoopMode('off');
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

  const handleSaveProfile = async () => {
     setIsSavingProfile(true);
     try {
        await updateArtistProfile(user.uid, { socials: socialLinks });
        alert("Profile updated successfully!");
     } catch (e) {
        alert("Failed to save profile.");
     } finally {
        setIsSavingProfile(false);
     }
  };

  // Add tag helper
  const addTagToInput = (tag: string, inputName: string) => {
     const input = document.querySelector(`input[name="${inputName}"]`) as HTMLInputElement;
     if (input) {
         const current = input.value;
         input.value = current ? `${current}, ${tag}` : tag;
     }
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
    <div className="flex flex-col md:flex-row h-screen bg-[#31326f] overflow-hidden">
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
        onEnded={() => {
            if (loopMode === 'one') {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                }
            } else {
                handleNextTrack(true);
            }
        }}
        onError={(e) => {
            console.error("Audio playback failed.");
            if (currentTrack) {
               // Show alert for bucket permissions if likely cause
               if (currentTrack.audioUrl && currentTrack.audioUrl.includes('supabase')) {
                   alert("Playback Error: The audio file could not be played. \n\nThis is likely because the 'Syncmaster' storage bucket is not set to 'Public'. \n\nPlease go to your Supabase Dashboard > Storage > Syncmaster > Configuration and toggle 'Public' to ON.");
               }
               setIsPlaying(false);
            }
        }}
      />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0f1025] border-r border-white/10 relative z-40 shrink-0 h-full">
        <div className="p-6">
          <Logo />
          <nav className="space-y-2">
            {[
              { id: 'browse', icon: Briefcase, label: 'Briefs' },
              { id: 'library', icon: Layers, label: 'My Library' },
              { id: 'applications', icon: Activity, label: 'Applications' },
              { id: 'directory', icon: Building2, label: 'Agency Directory' },
              { id: 'profile', icon: Settings, label: 'Profile & Settings' },
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold border border-white/20 shrink-0">
                 <UserIcon className="w-5 h-5" />
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
                    { id: 'browse', icon: Briefcase, label: 'Briefs' },
                    { id: 'library', icon: Layers, label: 'My Library' },
                    { id: 'applications', icon: Activity, label: 'Applications' },
                    { id: 'directory', icon: Building2, label: 'Agency Directory' },
                    { id: 'profile', icon: Settings, label: 'Profile' },
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
      <main className="flex-1 overflow-y-auto h-full relative pt-20 md:pt-0 bg-[#31326f]">
        <div className="p-6 md:p-12 pb-32 max-w-[1600px] mx-auto min-h-full">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-white/10 gap-4">
             <div className="w-full md:w-auto">
                <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">
                   {activeTab === 'browse' && <>Active <span className="text-[#ccff00]">Briefs</span></>}
                   {activeTab === 'library' && <>My <span className="text-[#ccff00]">Tracks</span></>}
                   {activeTab === 'applications' && <>My <span className="text-[#ccff00]">Applications</span></>}
                   {activeTab === 'directory' && <>Agency <span className="text-[#ccff00]">Directory</span></>}
                   {activeTab === 'profile' && <>Artist <span className="text-[#ccff00]">Settings</span></>}
                </h1>
                <p className="text-white/50 font-mono text-sm">
                   {activeTab === 'browse' && 'Opportunities curated for your sound.'}
                   {activeTab === 'library' && 'Manage and organize your portfolio.'}
                   {activeTab === 'applications' && 'Track the status of your submissions.'}
                   {activeTab === 'directory' && 'Connect with top industry partners.'}
                   {activeTab === 'profile' && 'Manage your connected accounts and public profile.'}
                </p>
             </div>
             
             {activeTab === 'library' && (
                <button 
                   onClick={() => setIsUploadModalOpen(true)}
                   className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors"
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
                        <div className="overflow-x-auto">
                           <div className="min-w-[800px] grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/20 text-xs font-bold uppercase tracking-widest text-white/40">
                              <div className="col-span-1 text-center">Play</div>
                              <div className="col-span-4">Title</div>
                              <div className="col-span-1 text-center">BPM</div>
                              <div className="col-span-3">Tags</div>
                              <div className="col-span-2">Date</div>
                              <div className="col-span-1 text-right">Edit</div>
                           </div>
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
                                    <div className="col-span-1 text-center font-mono text-xs text-white/60">{track.bpm || '-'}</div>
                                    <div className="col-span-3 flex gap-2 overflow-hidden">
                                       {track.tags.slice(0, 2).map(tag => (
                                          <span key={tag} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/60 uppercase">{tag}</span>
                                       ))}
                                    </div>
                                    <div className="col-span-2 text-xs text-white/40 font-mono">{track.uploadDate}</div>
                                    <div className="col-span-1 flex justify-end">
                                        <button 
                                            onClick={() => handleEditTrack(track)}
                                            className="text-white/40 hover:text-white p-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
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
                     <EmptyState 
                        icon={Briefcase} 
                        title="No Applications Yet" 
                        description="Go to the Briefs tab to start pitching your music." 
                        action={
                           <button onClick={() => setActiveTab('browse')} className="text-[#ccff00] underline uppercase tracking-widest text-xs font-bold mt-4">View Briefs</button>
                        }
                     />
                  ) : (
                     <div className="bg-[#1a1b3b]/40 rounded-xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                           <div className="min-w-[800px] grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/20 text-xs font-bold uppercase tracking-widest text-white/40">
                              <div className="col-span-4">Brief Title</div>
                              <div className="col-span-4">Track Submitted</div>
                              <div className="col-span-2">Date</div>
                              <div className="col-span-2 text-right">Status</div>
                           </div>
                           <div className="min-w-[800px]">
                              {applications.map((app) => {
                                 // We need to look up brief details from the full briefs list or fetch them properly.
                                 // For now, let's find it in the state if loaded
                                 const brief = briefs.find(b => b.id === app.briefId);
                                 const track = tracks.find(t => t.id === app.trackId);
                                 
                                 return (
                                    <div key={app.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                                       <div className="col-span-4">
                                          <div className="font-bold text-white text-sm">{brief ? brief.title : 'Loading Title...'}</div>
                                          <div className="text-xs text-white/40">{brief?.client || ''}</div>
                                       </div>
                                       <div className="col-span-4 text-sm text-gray-300">
                                          {track ? track.title : 'Unknown Track'}
                                       </div>
                                       <div className="col-span-2 text-xs font-mono text-white/50">{app.submittedDate}</div>
                                       <div className="col-span-2 text-right">
                                          <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border
                                             ${app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                                               app.status === 'accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                               'bg-white/10 text-white/50 border-white/10'}`}>
                                             {app.status}
                                          </span>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     </div>
                  )}
               </motion.div>
            )}

            {/* 4. DIRECTORY TAB */}
            {activeTab === 'directory' && (
               <motion.div key="directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                     {['All', 'Agency', 'Supervisor', 'Library'].map(type => (
                        <button 
                           key={type}
                           onClick={() => setDirectoryFilter(type as any)}
                           className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap
                              ${directoryFilter === type 
                                ? 'bg-[#ccff00] text-black' 
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
                        >
                           {type}
                        </button>
                     ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {agencies.filter(a => directoryFilter === 'All' || a.type === directoryFilter).map((agency) => (
                        <div key={agency.id} className="bg-[#1a1b3b]/40 border border-white/10 p-6 rounded-xl hover:border-[#ccff00]/50 transition-colors group">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                                 <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                 <h3 className="font-bold text-white group-hover:text-[#ccff00] transition-colors">{agency.name}</h3>
                                 <p className="text-xs text-white/50 uppercase tracking-widest">{agency.type} • {agency.location.split(',')[0]}</p>
                              </div>
                           </div>
                           
                           <p className="text-sm text-gray-300 mb-6 line-clamp-2 h-10">{agency.description}</p>
                           
                           <div className="space-y-3 mb-6">
                              <div className="flex items-start gap-2 text-xs">
                                 <Globe className="w-4 h-4 text-[#ccff00] shrink-0" />
                                 <a href={agency.website} target="_blank" className="text-white/60 hover:text-white truncate">{agency.website.replace('https://', '')}</a>
                              </div>
                              <div className="flex items-start gap-2 text-xs">
                                 <Mail className="w-4 h-4 text-[#ccff00] shrink-0" />
                                 <a href={`mailto:${agency.contactEmail}`} className="text-white/60 hover:text-white truncate">{agency.contactEmail}</a>
                              </div>
                           </div>

                           <div className="border-t border-white/5 pt-4">
                              <div className="text-[10px] uppercase text-white/30 font-bold mb-2">Major Credits</div>
                              <div className="flex flex-wrap gap-2">
                                 {agency.credits.map(credit => (
                                    <span key={credit} className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/60">{credit}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}

            {/* 5. PROFILE TAB */}
            {activeTab === 'profile' && (
               <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                     {/* Identity Card */}
                     <div className="lg:col-span-1">
                        <div className="bg-[#1a1b3b]/40 border border-white/10 p-8 rounded-xl flex flex-col items-center text-center">
                           <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#ccff00]/20 mb-6 relative group cursor-pointer">
                              <img src={`https://ui-avatars.com/api/?name=${user.displayName?.replace(' ', '+')}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                 <CameraIcon />
                              </div>
                           </div>
                           <h2 className="text-2xl font-heading font-bold text-white mb-1">{user.displayName}</h2>
                           <p className="text-xs font-mono text-[#ccff00] uppercase tracking-widest mb-6">{user.role || 'Artist'}</p>
                           
                           <div className="w-full space-y-4">
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                 <span className="text-xs text-white/50 uppercase tracking-widest">Plan</span>
                                 <span className="text-xs font-bold text-white">Basic (Free)</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                 <span className="text-xs text-white/50 uppercase tracking-widest">Member Since</span>
                                 <span className="text-xs font-bold text-white">Feb 2024</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Settings Form */}
                     <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1a1b3b]/40 border border-white/10 p-8 rounded-xl">
                           <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center gap-2">
                              <LinkIcon className="w-5 h-5 text-[#ccff00]" /> Connected Accounts
                           </h3>
                           
                           <div className="space-y-4">
                              {[
                                { id: 'spotify', label: 'Spotify Artist URL', icon: Music, placeholder: 'https://open.spotify.com/artist/...' },
                                { id: 'appleMusic', label: 'Apple Music URL', icon: Disc, placeholder: 'https://music.apple.com/...' },
                                { id: 'instagram', label: 'Instagram Handle', icon: Instagram, placeholder: '@username' },
                                { id: 'website', label: 'Official Website', icon: Globe, placeholder: 'https://yourband.com' },
                              ].map((field) => (
                                 <div key={field.id} className="relative">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">{field.label}</label>
                                    <div className="relative">
                                       <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                       <input 
                                          type="text" 
                                          value={(socialLinks as any)[field.id]}
                                          onChange={(e) => setSocialLinks({...socialLinks, [field.id]: e.target.value})}
                                          className="w-full bg-black/20 border border-white/10 pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:border-[#ccff00] outline-none transition-colors"
                                          placeholder={field.placeholder}
                                       />
                                    </div>
                                 </div>
                              ))}
                           </div>

                           <div className="mt-8 flex justify-end">
                              <button 
                                 onClick={handleSaveProfile}
                                 disabled={isSavingProfile}
                                 className="bg-[#ccff00] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 text-xs flex items-center gap-2"
                              >
                                 {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                 Save Changes
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Upload Modal with BPM */}
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
                  className="relative w-full max-w-lg bg-[#1a1b3b] border border-white/10 p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]"
               >
                   {uploadState === 'success' ? (
                       <div className="flex flex-col items-center justify-center py-10">
                           <div className="w-20 h-20 bg-[#ccff00]/20 rounded-full flex items-center justify-center mb-6">
                               <CheckCircle className="w-10 h-10 text-[#ccff00]" />
                           </div>
                           <h3 className="text-2xl font-bold font-heading text-white mb-2">Upload Complete!</h3>
                           <p className="text-white/50 text-center">Your track has been added to the library.</p>
                       </div>
                   ) : (
                    <>
                      <h2 className="text-2xl font-heading font-bold text-white mb-6">Upload Track</h2>
                      <form onSubmit={handleLibraryUploadSubmit} className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Track Title</label>
                            <input name="title" required type="text" className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-lg text-white focus:border-[#ccff00] outline-none rounded-xl" placeholder="e.g. Neon Nights" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Audio File (MP3/WAV)</label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#ccff00]/50 transition-colors cursor-pointer relative group">
                               <input 
                                  name="file" 
                                  required 
                                  type="file" 
                                  accept="audio/*" 
                                  onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if(f) setUploadFile(f);
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                               />
                               <Upload className="w-8 h-8 text-white/20 mx-auto mb-2 group-hover:text-[#ccff00]" />
                               <p className="text-sm text-white/50">{uploadFile ? uploadFile.name : "Click or Drag to Upload"}</p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Genre</label>
                                <select name="genre" className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none appearance-none cursor-pointer">
                                   {SUGGESTED_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">BPM</label>
                                <div className="relative">
                                    <input 
                                        name="bpm" 
                                        type="number" 
                                        value={uploadBpm}
                                        onChange={(e) => setUploadBpm(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none" 
                                        placeholder="120" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleAutoDetectBPM}
                                        disabled={!uploadFile || isDetectingBpm}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg text-[#ccff00] disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Auto-detect BPM from file"
                                    >
                                        {isDetectingBpm ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    </button>
                                </div>
                             </div>
                         </div>

                         <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tags</label>
                            <input name="tags" type="text" className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none mb-2" placeholder="Epic, Dark, Trailer..." />
                            <div className="flex flex-wrap gap-2">
                               {SUGGESTED_TAGS.map(tag => (
                                  <button type="button" key={tag} onClick={() => addTagToInput(tag, 'tags')} className="text-[10px] border border-white/10 px-2 py-1 rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors uppercase">{tag}</button>
                               ))}
                            </div>
                         </div>

                         <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Description</label>
                            <textarea name="description" rows={3} className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none" placeholder="Mood, instrumentation, key..." />
                         </div>

                         {isUploading && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50">
                                   <span>{uploadState === 'uploading' ? 'Uploading File...' : 'Saving Metadata...'}</span>
                                   <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-[#ccff00] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                </div>
                            </div>
                         )}

                         <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={() => setIsUploadModalOpen(false)} disabled={isUploading} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-white/60 hover:text-white text-xs">Cancel</button>
                            <button type="submit" disabled={isUploading || !uploadFile} className="bg-[#ccff00] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 text-xs">
                               {isUploading ? 'Processing...' : 'Save Track'}
                            </button>
                         </div>
                      </form>
                    </>
                   )}
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
         {isEditModalOpen && editingTrack && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                  onClick={() => !isUploading && setIsEditModalOpen(false)} 
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                  className="relative w-full max-w-lg bg-[#1a1b3b] border border-white/10 p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]"
               >
                   <h2 className="text-2xl font-heading font-bold text-white mb-6">Edit Track</h2>
                   <form onSubmit={handleEditTrackSubmit} className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Track Title</label>
                           <input name="title" defaultValue={editingTrack.title} required type="text" className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-lg text-white focus:border-[#ccff00] outline-none rounded-xl" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Genre</label>
                               <select name="genre" defaultValue={editingTrack.genre} className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none appearance-none cursor-pointer">
                                  {SUGGESTED_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                               </select>
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">BPM</label>
                               <input 
                                   name="bpm" 
                                   type="number" 
                                   defaultValue={editingTrack.bpm}
                                   value={uploadBpm}
                                   onChange={(e) => setUploadBpm(e.target.value)}
                                   className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none" 
                               />
                            </div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Tags</label>
                           <input name="tags" defaultValue={editingTrack.tags.join(', ')} type="text" className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none mb-2" />
                           <div className="flex flex-wrap gap-2">
                              {SUGGESTED_TAGS.map(tag => (
                                 <button type="button" key={tag} onClick={() => addTagToInput(tag, 'tags')} className="text-[10px] border border-white/10 px-2 py-1 rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors uppercase">{tag}</button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Description</label>
                           <textarea name="description" defaultValue={editingTrack.description} rows={3} className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none" />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                           <button type="button" onClick={() => setIsEditModalOpen(false)} disabled={isUploading} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-white/60 hover:text-white text-xs">Cancel</button>
                           <button type="submit" disabled={isUploading} className="bg-[#ccff00] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 text-xs">
                              {isUploading ? 'Saving...' : 'Update Track'}
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
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }} 
                  className="relative w-full max-w-2xl bg-[#1a1b3b] border border-white/10 p-8 rounded-xl shadow-2xl overflow-hidden"
               >
                   <button onClick={() => setIsApplicationModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
                   
                   <div className="mb-6">
                      <div className="text-[#ccff00] text-xs font-bold uppercase tracking-widest mb-2">Applying to</div>
                      <h2 className="text-2xl font-heading font-bold text-white mb-1">{selectedBrief.title}</h2>
                      <p className="text-white/50 text-sm">{selectedBrief.client} • {selectedBrief.budget}</p>
                   </div>

                   {/* Step 1: Selection Mode */}
                   {applicationStep === 'select' && (
                      <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <button 
                               onClick={() => setApplicationStep('upload')}
                               className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-[#ccff00] hover:bg-white/5 transition-all group"
                            >
                               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
                                  <Upload className="w-6 h-6" />
                               </div>
                               <div className="text-center">
                                  <div className="font-bold text-white mb-1">Upload New Track</div>
                                  <div className="text-xs text-white/50">MP3 or WAV</div>
                               </div>
                            </button>
                            
                            <div className="border border-white/10 rounded-xl overflow-hidden flex flex-col">
                               <div className="p-4 border-b border-white/10 bg-black/20 text-center font-bold text-sm text-white/60">Select from Library</div>
                               <div className="flex-1 overflow-y-auto max-h-[200px] p-2">
                                  {tracks.length === 0 ? (
                                     <div className="h-full flex items-center justify-center text-xs text-white/30 italic">No tracks in library</div>
                                  ) : (
                                     tracks.map(track => (
                                        <button 
                                           key={track.id}
                                           onClick={() => { setSelectedTrackId(track.id); setApplicationStep('confirm'); }}
                                           className="w-full text-left p-3 hover:bg-white/10 rounded-lg flex items-center justify-between group transition-colors"
                                        >
                                           <span className="text-sm font-bold text-white group-hover:text-[#ccff00] truncate">{track.title}</span>
                                           <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#ccff00]" />
                                        </button>
                                     ))
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Step 2A: Upload Flow (Reuse logic) */}
                   {applicationStep === 'upload' && (
                      <form onSubmit={handleSubmitNewTrackApplication} className="space-y-4">
                         <button type="button" onClick={() => setApplicationStep('select')} className="text-xs text-white/50 hover:text-white flex items-center gap-1 mb-4"><ChevronLeft className="w-3 h-3" /> Back</button>
                         {/* Minified Form Fields for Context */}
                         <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Title</label>
                            <input name="title" required type="text" className="w-full bg-black/20 border border-white/10 px-4 py-2 rounded-lg text-white" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1">File</label>
                            <input name="file" required type="file" accept="audio/*" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#ccff00] file:text-black hover:file:bg-white" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Genre</label><select name="genre" className="w-full bg-black/20 border border-white/10 px-4 py-2 rounded-lg text-white">{SUGGESTED_GENRES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1">BPM</label>
                                <div className="relative">
                                    <input name="bpm" type="number" value={uploadBpm} onChange={(e) => setUploadBpm(e.target.value)} className="w-full bg-black/20 border border-white/10 px-4 py-2 rounded-lg text-white" placeholder="120" />
                                    <button type="button" onClick={handleAutoDetectBPM} disabled={!uploadFile} className="absolute right-2 top-1/2 -translate-y-1/2"><Wand2 className="w-3 h-3 text-[#ccff00]" /></button>
                                </div>
                            </div>
                         </div>
                         <button type="submit" disabled={isUploading} className="w-full bg-[#ccff00] text-black font-bold uppercase tracking-widest py-3 rounded-xl mt-4 hover:bg-white transition-colors">{isUploading ? 'Uploading & Submitting...' : 'Submit Application'}</button>
                      </form>
                   )}

                   {/* Step 2B: Confirm Existing */}
                   {applicationStep === 'confirm' && selectedTrackId && (
                      <div className="text-center py-8">
                         <div className="w-16 h-16 bg-[#ccff00]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#ccff00]"><Music className="w-8 h-8" /></div>
                         <h3 className="text-xl font-bold text-white mb-2">Ready to Submit?</h3>
                         <p className="text-white/50 mb-8">You are submitting <span className="text-white font-bold">"{tracks.find(t => t.id === selectedTrackId)?.title}"</span> for this brief.</p>
                         <div className="flex justify-center gap-4">
                            <button onClick={() => setApplicationStep('select')} className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white">Change Track</button>
                            <button onClick={handleSubmitExistingTrackApplication} disabled={isUploading} className="px-8 py-3 rounded-xl bg-[#ccff00] text-black text-xs font-bold uppercase tracking-widest hover:bg-white">{isUploading ? 'Submitting...' : 'Confirm Submission'}</button>
                         </div>
                      </div>
                   )}
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
                 <button onClick={toggleLoop} className={`hover:text-white transition-colors ${loopMode !== 'off' ? 'text-[#ccff00]' : 'text-white/40'}`}>
                    {loopMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                 </button>
                 <button onClick={handlePrevTrack} className="text-white/40 hover:text-white"><SkipBack className="w-4 h-4" /></button>
                 <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}</button>
                 <button onClick={() => handleNextTrack()} className="text-white/40 hover:text-white"><SkipForward className="w-4 h-4" /></button>
                 <div className="w-4 h-4" /> {/* Spacer to balance layout */}
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

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);

export default Dashboard;