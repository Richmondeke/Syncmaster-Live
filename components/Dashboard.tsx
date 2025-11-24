
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, CheckCircle, Clock, DollarSign, Music, Upload, X, FileAudio, Loader2, ChevronRight, ListMusic, Layers, Edit2, Calendar, Tag, Save, Filter, Play, Pause, SkipBack, SkipForward, Volume2, Mic2, Disc, FilePlus, Film, Search as SearchIcon, ImageIcon, Plus, Settings, Link as LinkIcon, Globe, AlertCircle, LogOut, Ghost } from 'lucide-react';
import { SyncBrief, Track, Application, TabView, ResearchResult, User } from '../types';
import { subscribeToBriefs, subscribeToUserTracks, subscribeToUserApplications, uploadTrackFile, saveTrackMetadata, updateTrackMetadata, submitApplication, updateArtistProfile } from '../services/supabase';
import { searchSyncDatabase } from '../services/geminiService';

interface DashboardProps {
  user: User;
}

const SUGGESTED_GENRES = ['Cinematic', 'Electronic', 'Rock', 'Pop', 'Hip Hop', 'Ambient', 'Folk', 'Corporate', 'Orchestral', 'Synthwave'];
const SUGGESTED_TAGS = ['Uplifting', 'Dark', 'Energetic', 'Emotional', 'Driving', 'Hopeful', 'Tense', 'Epic', 'Quirky', 'Sentimental', 'Advertising', 'Trailer'];

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
  
  // Data State
  const [briefs, setBriefs] = useState<SyncBrief[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // View State
  const [selectedBrief, setSelectedBrief] = useState<SyncBrief | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');

  // Research State
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Profile State
  const [profileData, setProfileData] = useState({
      spotify: user.socials?.spotify || '',
      appleMusic: user.socials?.appleMusic || '',
      instagram: user.socials?.instagram || '',
      website: user.socials?.website || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Real Connection State
  const [activeInput, setActiveInput] = useState<'spotify' | 'appleMusic' | null>(null);
  const [tempUrl, setTempUrl] = useState('');

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
    
    // Update local profile state if user object updates
    setProfileData({
        spotify: user.socials?.spotify || '',
        appleMusic: user.socials?.appleMusic || '',
        instagram: user.socials?.instagram || '',
        website: user.socials?.website || ''
    });

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

  const addTagToLibraryUpload = (tag: string) => {
    const currentTags = libraryUploadData.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      const newTags = currentTags.length > 0 ? `${libraryUploadData.tags}, ${tag}` : tag;
      setLibraryUploadData(prev => ({ ...prev, tags: newTags }));
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

  const handleResearchSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchQuery.trim()) return;

    setIsResearching(true);
    setResearchResult(null);
    setImageError(false); // Reset image error on new search

    try {
      const result = await searchSyncDatabase(researchQuery);
      setResearchResult(result);
    } catch (e) {
      console.error(e);
      // Optional: Handle error UI
    } finally {
      setIsResearching(false);
    }
  };
  
  // --- Connect Service Handlers ---
  const handleStartConnect = (service: 'spotify' | 'appleMusic') => {
      setActiveInput(service);
      setTempUrl('');
  };

  const handleConfirmConnect = (service: 'spotify' | 'appleMusic') => {
      if (!tempUrl.trim()) {
          setActiveInput(null);
          return;
      }
      
      if (service === 'spotify' && !tempUrl.includes('spotify.com')) {
          alert("Please enter a valid Spotify Artist URL");
          return;
      }
      if (service === 'appleMusic' && !tempUrl.includes('music.apple.com')) {
          alert("Please enter a valid Apple Music Artist URL");
          return;
      }

      setProfileData(prev => ({...prev, [service]: tempUrl}));
      setActiveInput(null);
      setTempUrl('');
  };

  const handleCancelConnect = () => {
      setActiveInput(null);
      setTempUrl('');
  };

  const handleDisconnectService = (service: 'spotify' | 'appleMusic') => {
      if(window.confirm(`Are you sure you want to disconnect your ${service === 'spotify' ? 'Spotify' : 'Apple Music'} account?`)) {
          setProfileData(prev => ({...prev, [service]: ''}));
      }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSavingProfile(true);
      try {
          await updateArtistProfile(user.uid, { socials: profileData });
          alert("Profile connections updated!");
      } catch (error) {
          console.error(error);
          alert("Failed to update profile.");
      } finally {
          setIsSavingProfile(false);
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
  
  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center shrink-0">
        <span className="font-heading font-bold text-[#31326f] text-lg transform translate-y-[1px]">S</span>
      </div>
      <span className="text-3xl md:text-5xl font-heading font-bold">
        SYNC<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#e6ff80]">MASTER</span>
      </span>
    </div>
  );

  return (
    <div className="pt-24 pb-48 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen relative">
      <audio 
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <Logo />
          <p className="text-white/60 font-mono text-sm mt-2">Welcome back, {user?.displayName || 'Creator'}</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto max-w-full w-full md:w-auto scrollbar-hide">
           {(['browse', 'applications', 'library', 'research', 'profile'] as TabView[]).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 md:px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 shrink-0
                 ${activeTab === tab 
                   ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20' 
                   : 'text-white/60 hover:text-white hover:bg-white/5'
                 }
               `}
             >
               {tab === 'browse' ? 'Briefs' : tab === 'research' ? 'Research' : tab === 'profile' ? <><Settings className="w-3 h-3" /> Profile</> : tab}
             </button>
           ))}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}

      {/* 1. BROWSE BRIEFS */}
      {activeTab === 'browse' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search briefs by keyword, genre, or mood..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-4 text-sm text-white focus:border-[#ccff00] outline-none transition-colors"
              />
            </div>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors self-start md:self-auto">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.length === 0 ? (
               <div className="col-span-full">
                  <EmptyState 
                    icon={Ghost}
                    title="No Briefs Found"
                    description="We are currently sourcing new opportunities. Check back shortly."
                  />
               </div>
            ) : briefs.map((brief, index) => {
              const applied = hasApplied(brief.id);
              return (
                <motion.div
                  key={brief.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-[#1a1b3b]/60 backdrop-blur-md border ${applied ? 'border-[#ccff00]/50' : 'border-white/10'} p-6 flex flex-col gap-4 group hover:bg-[#1a1b3b]/80 transition-colors rounded-xl`}
                >
                  <div className="flex justify-between items-start">
                     <div className="bg-white/5 p-2 rounded-lg text-[#ccff00]">
                       <Briefcase className="w-5 h-5" />
                     </div>
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${brief.deadline === 'Urgent' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/50'}`}>
                       {brief.deadline}
                     </span>
                  </div>
    
                  <div>
                    <h3 className="text-lg font-bold font-heading leading-tight mb-2 text-white group-hover:text-[#ccff00] transition-colors">
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
                    <div className="flex items-center gap-1.5 text-[#ccff00] font-bold text-sm">
                      <DollarSign className="w-4 h-4" />
                      {brief.budget}
                    </div>
                    
                    <button
                      onClick={() => handleOpenApply(brief)}
                      disabled={applied}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center gap-2
                        ${applied 
                          ? 'bg-[#ccff00]/20 text-[#ccff00] cursor-default' 
                          : 'bg-white text-black hover:bg-[#ccff00]'
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
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/20 text-xs font-bold uppercase tracking-widest text-white/50">
              <div className="col-span-4">Brief</div>
              <div className="col-span-3">Track Submitted</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1"></div>
            </div>
            
            {applications.length === 0 ? (
               <EmptyState 
                 icon={Briefcase}
                 title="No Applications Yet"
                 description="You haven't applied to any briefs. Browse the 'Briefs' tab to get started."
                 action={
                    <button onClick={() => setActiveTab('browse')} className="mt-4 px-6 py-2 bg-[#ccff00] text-black font-bold text-xs uppercase tracking-widest rounded">Browse Briefs</button>
                 }
               />
            ) : (
              applications.map((app) => {
                const brief = getBrief(app.briefId);
                const track = getTrack(app.trackId);
                return (
                  <div key={app.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="col-span-1 md:col-span-4 flex flex-col">
                      <div className="font-bold text-white mb-1">{brief?.title || 'Loading Brief...'}</div>
                      <div className="text-xs text-white/50">{brief?.client}</div>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex items-center gap-2">
                       <Music className="w-3 h-3 text-[#ccff00]" />
                       <span className="text-sm text-gray-200">{track?.title || 'Loading Track...'}</span>
                    </div>
                    <div className="col-span-1 md:col-span-2 text-xs font-mono text-white/60 flex items-center gap-2 md:gap-0">
                      <span className="md:hidden text-white/30 uppercase text-[10px] tracking-widest">Sent:</span>
                      {app.submittedDate}
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center gap-2 md:gap-0">
                       <span className="md:hidden text-white/30 uppercase text-[10px] tracking-widest">Status:</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="hidden md:flex col-span-1 justify-end">
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
                  className="w-full bg-white/5 border border-white/10 rounded py-2 pl-8 pr-4 text-xs text-white focus:border-[#ccff00] outline-none transition-colors"
                />
              </div>
              <button 
                onClick={() => {
                    setShowUploadModal(true);
                    setUploadState('idle');
                    setTrackFile(null);
                    setLibraryUploadData({ title: '', artist: user.displayName || '', genre: '', tags: '', description: '', rights: false });
                }}
                className="flex items-center gap-2 px-6 py-2 bg-[#ccff00] text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-white transition-colors whitespace-nowrap"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
             {filteredLibraryTracks.length === 0 ? (
                <EmptyState 
                  icon={Music}
                  title="Your Library is Empty"
                  description="Upload your tracks to start building your portfolio and applying to briefs."
                  action={
                    <button onClick={() => setShowUploadModal(true)} className="mt-4 px-6 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors text-white font-bold text-xs uppercase tracking-widest rounded">Upload Track</button>
                  }
                />
             ) : filteredLibraryTracks.map((track) => {
               const isCurrent = currentTrack?.id === track.id;
               return (
                <div 
                  key={track.id} 
                  className={`bg-[#1a1b3b]/60 border p-3 rounded-lg flex items-center gap-4 group transition-all
                    ${isCurrent ? 'border-[#ccff00]/50 bg-[#ccff00]/5' : 'border-white/5 hover:bg-white/5 hover:border-white/20'}
                  `}
                >
                   {/* Play Button */}
                   <button 
                     onClick={() => handlePlayTrack(track)}
                     className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                       ${isCurrent 
                         ? 'bg-[#ccff00] text-black' 
                         : 'bg-white/10 text-white hover:bg-white hover:text-black group-hover:bg-white/20'
                       }
                     `}
                   >
                      {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                   </button>
                   
                   <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#ccff00]' : 'text-white'}`}>{track.title}</h3>
                      <p className="text-xs text-white/40 truncate">{track.artist}</p>
                   </div>

                   {/* Tags - Desktop Only */}
                   <div className="hidden md:flex gap-2">
                      {track.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] border border-white/10 px-2 py-0.5 rounded text-white/30 uppercase tracking-wide">{t}</span>
                      ))}
                   </div>

                   {/* Metadata Info */}
                   <div className="flex items-center gap-4 text-xs font-mono text-white/30 w-auto md:w-32 justify-end">
                      <div className="hidden md:block">{track.duration}</div>
                      <div className="hidden md:block">{track.genre}</div>
                      <button 
                         onClick={() => setEditingTrack(track)}
                         className="p-2 text-white/30 hover:text-white transition-colors"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                   </div>
                </div>
             )})}
          </div>
        </motion.div>
      )}

      {/* 4. SYNC RESEARCH */}
      {activeTab === 'research' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#1a1b3b]/60 border border-white/10 rounded-xl p-8 md:p-12 text-center">
             <Film className="w-12 h-12 text-[#ccff00] mx-auto mb-4" />
             <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Sync Research</h2>
             <p className="text-white/60 max-w-lg mx-auto mb-8">
               Search for Movies, TV Shows, or Songs to uncover placement data. Find out what songs were used in specific scenes.
             </p>

             <form onSubmit={handleResearchSearch} className="max-w-xl mx-auto relative">
                <input 
                  type="text" 
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  placeholder="e.g. 'The Batman Soundtrack' or 'Stranger Things'" 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:border-[#ccff00] outline-none transition-colors text-base md:text-lg"
                />
                <button 
                  type="submit"
                  disabled={isResearching || !researchQuery.trim()}
                  className="absolute right-2 top-2 p-2 rounded-full bg-[#ccff00] text-black hover:bg-white transition-colors disabled:opacity-50"
                >
                   {isResearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <SearchIcon className="w-6 h-6" />}
                </button>
             </form>
          </div>

          {researchResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1b3b]/40 border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row gap-6">
                 {/* Main Image Card */}
                 <div className="w-full md:w-32 h-48 bg-black/40 rounded-lg flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                   {researchResult.imageUrl && !imageError ? (
                     <img 
                       src={researchResult.imageUrl} 
                       alt={researchResult.subject} 
                       className="w-full h-full object-cover" 
                       onError={() => setImageError(true)}
                     />
                   ) : (
                     <div className="text-center p-2">
                       {researchResult.type === 'Song' ? <Music className="w-8 h-8 text-white/20 mx-auto mb-2" /> : <Film className="w-8 h-8 text-white/20 mx-auto mb-2" />}
                       <span className="text-[10px] text-white/30 uppercase">No Image</span>
                     </div>
                   )}
                 </div>

                 {/* Header Details */}
                 <div className="flex-1 py-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="px-3 py-1 bg-[#ccff00]/10 text-[#ccff00] rounded-full border border-[#ccff00]/20 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        {researchResult.type === 'Song' ? <Music className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                        {researchResult.type} Results
                      </div>
                      {researchResult.year && (
                        <div className="px-3 py-1 bg-white/5 text-white/50 rounded-full border border-white/10 text-xs font-mono">
                          {researchResult.year}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-3xl font-heading font-bold text-white mb-2">{researchResult.subject}</h3>
                    
                    <div className="flex gap-8 text-sm text-gray-400">
                       <div className="flex flex-col">
                         <span className="text-xs uppercase text-white/30 font-bold tracking-wider mb-1">Total Found</span>
                         <span className="text-white">{researchResult.results.length} Placements</span>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                   <thead>
                      <tr className="bg-black/20 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-white/40">
                         <th className="p-4 w-1/4">{researchResult.type === 'Song' ? 'Media Title' : 'Song Title'}</th>
                         {researchResult.type !== 'Song' && <th className="p-4 w-1/6">Artist</th>}
                         <th className="p-4 w-1/12">BPM</th>
                         <th className="p-4 w-1/6">Genre</th>
                         <th className="p-4 w-1/3">Scene Context</th>
                         <th className="p-4 text-right">Timestamp</th>
                      </tr>
                   </thead>
                   <tbody>
                      {researchResult.results.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-white/30 italic">No exact placement details found in public database.</td></tr>
                      ) : (
                        researchResult.results.map((item, idx) => (
                           <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4 font-bold text-white">{item.title}</td>
                              {researchResult.type !== 'Song' && <td className="p-4 text-white/70">{item.artist || '-'}</td>}
                              <td className="p-4 text-xs font-mono text-[#ccff00]">{item.bpm || '-'}</td>
                              <td className="p-4 text-xs uppercase tracking-wide text-white/50">{item.genre || '-'}</td>
                              <td className="p-4 text-sm text-gray-300">{item.description}</td>
                              <td className="p-4 text-right text-xs font-mono text-white/50">{item.timestamp || '-'}</td>
                           </tr>
                        ))
                      )}
                   </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 5. PROFILE & SETTINGS */}
      {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="bg-[#1a1b3b]/60 border border-white/10 rounded-xl p-8 mb-8">
                  <h2 className="text-2xl font-heading font-bold text-white mb-2">Connected Accounts</h2>
                  <p className="text-white/50 text-sm mb-8">Link your streaming profiles so supervisors can find you easily.</p>

                  <div className="space-y-6">
                      {/* Spotify Card */}
                      <div className="bg-black/20 border border-white/5 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shrink-0">
                                  <Music className="w-6 h-6 text-black" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg">Spotify</h3>
                                  <p className="text-xs text-white/50">Connect your artist profile</p>
                              </div>
                          </div>
                          
                          <div className="w-full md:w-auto">
                              {profileData.spotify ? (
                                  <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2 px-3 py-1 bg-[#1DB954]/10 text-[#1DB954] rounded-full text-xs font-bold uppercase tracking-wider border border-[#1DB954]/20">
                                          <CheckCircle className="w-3 h-3" /> Connected
                                      </div>
                                      <button 
                                          onClick={() => handleDisconnectService('spotify')}
                                          className="text-white/40 hover:text-red-400 transition-colors"
                                      >
                                          <LogOut className="w-4 h-4" />
                                      </button>
                                  </div>
                              ) : activeInput === 'spotify' ? (
                                  <div className="flex flex-col gap-2 w-full md:w-80">
                                      <input 
                                          type="text"
                                          value={tempUrl}
                                          onChange={(e) => setTempUrl(e.target.value)}
                                          placeholder="https://open.spotify.com/artist/..."
                                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#1DB954] outline-none"
                                          autoFocus
                                      />
                                      <div className="flex gap-2">
                                          <button 
                                              onClick={() => handleConfirmConnect('spotify')}
                                              className="flex-1 bg-[#1DB954] text-black text-xs font-bold py-2 rounded hover:bg-white transition-colors"
                                          >
                                              Confirm
                                          </button>
                                          <button 
                                              onClick={handleCancelConnect}
                                              className="flex-1 bg-white/5 text-white text-xs font-bold py-2 rounded hover:bg-white/10 transition-colors"
                                          >
                                              Cancel
                                          </button>
                                      </div>
                                  </div>
                              ) : (
                                  <button 
                                      onClick={() => handleStartConnect('spotify')}
                                      className="w-full md:w-auto px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-[#1DB954] transition-colors"
                                  >
                                      Connect Spotify
                                  </button>
                              )}
                          </div>
                      </div>

                      {/* Apple Music Card */}
                      <div className="bg-black/20 border border-white/5 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-[#FA243C] rounded-full flex items-center justify-center shrink-0">
                                  <Disc className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg">Apple Music</h3>
                                  <p className="text-xs text-white/50">Connect your artist profile</p>
                              </div>
                          </div>

                          <div className="w-full md:w-auto">
                              {profileData.appleMusic ? (
                                  <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2 px-3 py-1 bg-[#FA243C]/10 text-[#FA243C] rounded-full text-xs font-bold uppercase tracking-wider border border-[#FA243C]/20">
                                          <CheckCircle className="w-3 h-3" /> Connected
                                      </div>
                                      <button 
                                          onClick={() => handleDisconnectService('appleMusic')}
                                          className="text-white/40 hover:text-red-400 transition-colors"
                                      >
                                          <LogOut className="w-4 h-4" />
                                      </button>
                                  </div>
                              ) : activeInput === 'appleMusic' ? (
                                  <div className="flex flex-col gap-2 w-full md:w-80">
                                      <input 
                                          type="text"
                                          value={tempUrl}
                                          onChange={(e) => setTempUrl(e.target.value)}
                                          placeholder="https://music.apple.com/artist/..."
                                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#FA243C] outline-none"
                                          autoFocus
                                      />
                                      <div className="flex gap-2">
                                          <button 
                                              onClick={() => handleConfirmConnect('appleMusic')}
                                              className="flex-1 bg-[#FA243C] text-white text-xs font-bold py-2 rounded hover:bg-white hover:text-black transition-colors"
                                          >
                                              Confirm
                                          </button>
                                          <button 
                                              onClick={handleCancelConnect}
                                              className="flex-1 bg-white/5 text-white text-xs font-bold py-2 rounded hover:bg-white/10 transition-colors"
                                          >
                                              Cancel
                                          </button>
                                      </div>
                                  </div>
                              ) : (
                                  <button 
                                      onClick={() => handleStartConnect('appleMusic')}
                                      className="w-full md:w-auto px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-[#FA243C] hover:text-white transition-colors"
                                  >
                                      Connect Apple Music
                                  </button>
                              )}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Other Links Form */}
              <div className="bg-[#1a1b3b]/60 border border-white/10 rounded-xl p-8">
                  <h3 className="text-lg font-bold font-heading mb-6">Additional Links</h3>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-widest text-white/50">Instagram URL</label>
                          <div className="relative">
                              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                              <input 
                                  type="text"
                                  value={profileData.instagram}
                                  onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                                  placeholder="https://instagram.com/..."
                                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-[#ccff00] outline-none transition-colors"
                              />
                          </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-widest text-white/50">Website URL</label>
                          <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                              <input 
                                  type="text"
                                  value={profileData.website}
                                  onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                                  placeholder="https://..."
                                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-[#ccff00] outline-none transition-colors"
                              />
                          </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                          <button 
                              type="submit"
                              disabled={isSavingProfile}
                              className="px-8 py-3 bg-[#ccff00] text-black font-bold uppercase tracking-widest rounded hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                              {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Profile
                          </button>
                      </div>
                  </form>
              </div>
          </motion.div>
      )}

      {/* --- MODALS --- */}

      {/* Upload Modal (Library) */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowUploadModal(false)} />
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-[95%] md:w-full max-w-2xl bg-[#1a1b3b] border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-heading">Upload to Library</h2>
                    <button onClick={() => setShowUploadModal(false)}><X className="w-6 h-6 text-white/50 hover:text-white" /></button>
                 </div>
                 
                 <form onSubmit={handleLibraryUploadSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#ccff00]/50 transition-colors bg-black/20">
                      <input 
                        type="file" 
                        accept="audio/*"
                        ref={libraryFileInputRef}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, true)}
                      />
                      {trackFile ? (
                        <div className="flex items-center justify-center gap-3 text-[#ccff00]">
                          <FileAudio className="w-6 h-6" />
                          <span className="font-bold">{trackFile.name}</span>
                        </div>
                      ) : (
                        <div onClick={() => libraryFileInputRef.current?.click()} className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-white/50" />
                          <p className="text-sm text-white/60">Click to upload WAV, MP3, or AIFF</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Track Title</label>
                           <input 
                              type="text" required
                              className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-[#ccff00] outline-none"
                              value={libraryUploadData.title}
                              onChange={e => setLibraryUploadData({...libraryUploadData, title: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Artist</label>
                           <input 
                              type="text" required
                              className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-[#ccff00] outline-none"
                              value={libraryUploadData.artist}
                              onChange={e => setLibraryUploadData({...libraryUploadData, artist: e.target.value})}
                           />
                        </div>
                    </div>
                    
                    {/* Enhanced Genre & Tag Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Genre</label>
                           <input 
                              type="text" required
                              placeholder="e.g. Cinematic"
                              className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-[#ccff00] outline-none"
                              value={libraryUploadData.genre}
                              onChange={e => setLibraryUploadData({...libraryUploadData, genre: e.target.value})}
                           />
                           {/* Genre Chips */}
                           <div className="flex flex-wrap gap-2">
                              {SUGGESTED_GENRES.map(g => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => setLibraryUploadData(prev => ({ ...prev, genre: g }))}
                                  className={`text-[10px] border px-2 py-1 rounded-full transition-colors ${libraryUploadData.genre === g ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                                >
                                  {g}
                                </button>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Tags (comma separated)</label>
                           <input 
                              type="text"
                              placeholder="e.g. Epic, Dark, Trailer"
                              className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-[#ccff00] outline-none"
                              value={libraryUploadData.tags}
                              onChange={e => setLibraryUploadData({...libraryUploadData, tags: e.target.value})}
                           />
                           {/* Tag Chips */}
                           <div className="flex flex-wrap gap-2">
                              {SUGGESTED_TAGS.map(t => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => addTagToLibraryUpload(t)}
                                  className="text-[10px] border border-white/10 px-2 py-1 rounded-full text-white/40 hover:border-white/30 transition-colors"
                                >
                                  + {t}
                                </button>
                              ))}
                           </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Description / Mood</label>
                       <textarea 
                          className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-[#ccff00] outline-none h-24 resize-none"
                          value={libraryUploadData.description}
                          onChange={e => setLibraryUploadData({...libraryUploadData, description: e.target.value})}
                       />
                    </div>
                    
                    <button 
                       type="submit"
                       disabled={uploadState === 'uploading'}
                       className="w-full bg-[#ccff00] text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors"
                    >
                       {uploadState === 'uploading' ? 'Uploading...' : uploadState === 'success' ? 'Uploaded!' : 'Add to Library'}
                    </button>
                 </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedBrief && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedBrief(null)} />
             
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-[95%] md:w-full max-w-2xl bg-[#1a1b3b] border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
               <button onClick={() => setSelectedBrief(null)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X /></button>
               
               <div className="mb-6">
                 <span className="text-xs font-bold text-[#ccff00] uppercase tracking-widest">Applying to</span>
                 <h2 className="text-2xl font-bold font-heading mt-1">{selectedBrief.title}</h2>
               </div>

               {/* Step 1: Choose Method */}
               <div className="flex flex-col md:flex-row gap-4 mb-6">
                 <button 
                   type="button"
                   onClick={() => setApplicationMethod('library')}
                   disabled={tracks.length === 0}
                   className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${applicationMethod === 'library' ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'border-white/10 text-white/40 hover:bg-white/5'} ${tracks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   <ListMusic className="w-6 h-6" />
                   <span className="text-xs font-bold uppercase">Select from Library</span>
                 </button>
                 <button 
                   type="button"
                   onClick={() => setApplicationMethod('upload')}
                   className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${applicationMethod === 'upload' ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'border-white/10 text-white/40 hover:bg-white/5'}`}
                 >
                   <Upload className="w-6 h-6" />
                   <span className="text-xs font-bold uppercase">Upload New</span>
                 </button>
               </div>

               {/* Step 2: Content based on Method */}
               {applicationMethod === 'library' ? (
                 <div className="space-y-6">
                   <div className="max-h-60 overflow-y-auto space-y-2 border border-white/10 rounded-lg p-2 bg-black/20">
                     {tracks.map(track => (
                       <div 
                         key={track.id}
                         onClick={() => setSelectedLibraryTrackId(track.id)}
                         className={`p-3 rounded flex items-center justify-between cursor-pointer transition-colors ${selectedLibraryTrackId === track.id ? 'bg-[#ccff00] text-black' : 'hover:bg-white/5 text-white'}`}
                       >
                         <div className="min-w-0">
                           <div className="font-bold text-sm truncate">{track.title}</div>
                           <div className={`text-xs truncate ${selectedLibraryTrackId === track.id ? 'text-black/60' : 'text-white/40'}`}>{track.artist}</div>
                         </div>
                         {selectedLibraryTrackId === track.id && <CheckCircle className="w-4 h-4 shrink-0" />}
                       </div>
                     ))}
                   </div>
                   <button 
                     onClick={handleSubmitExistingTrackApplication}
                     disabled={!selectedLibraryTrackId || uploadState === 'uploading'}
                     className="w-full bg-[#ccff00] text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors disabled:opacity-50"
                   >
                     {uploadState === 'uploading' ? 'Submitting...' : 'Submit Application'}
                   </button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmitNewTrackApplication} className="space-y-6">
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#ccff00]/50 transition-colors bg-black/20">
                      <input 
                        type="file" 
                        accept="audio/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, false)}
                      />
                      {trackFile ? (
                        <div className="flex items-center justify-center gap-3 text-[#ccff00]">
                          <FileAudio className="w-6 h-6" />
                          <span className="font-bold">{trackFile.name}</span>
                        </div>
                      ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-white/50" />
                          <p className="text-sm text-white/60">Click to upload WAV, MP3, or AIFF</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Track Title</label>
                           <input 
                              type="text" required
                              className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-[#ccff00] outline-none"
                              value={applyFormData.title}
                              onChange={e => setApplyFormData({...applyFormData, title: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Artist</label>
                           <input 
                              type="text" required
                              className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-[#ccff00] outline-none"
                              value={applyFormData.artist}
                              onChange={e => setApplyFormData({...applyFormData, artist: e.target.value})}
                           />
                        </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Message to Supervisor</label>
                       <textarea 
                          className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-[#ccff00] outline-none h-24 resize-none"
                          placeholder="Why is this track perfect for this brief?"
                          value={applyFormData.description}
                          onChange={e => setApplyFormData({...applyFormData, description: e.target.value})}
                       />
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                       <input 
                         type="checkbox" 
                         required
                         checked={applyFormData.rights}
                         onChange={e => setApplyFormData({...applyFormData, rights: e.target.checked})}
                         className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#ccff00] focus:ring-[#ccff00] mt-0.5"
                       />
                       <span className="text-xs text-white/60">I confirm I own 100% of the rights to this master and publishing.</span>
                    </div>

                    <button 
                       type="submit"
                       disabled={uploadState === 'uploading'}
                       className="w-full bg-[#ccff00] text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors"
                    >
                       {uploadState === 'uploading' ? 'Uploading & Submitting...' : uploadState === 'success' ? 'Application Sent!' : 'Submit Application'}
                    </button>
                 </form>
               )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Track Modal */}
      <AnimatePresence>
        {editingTrack && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingTrack(null)} />
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-[95%] md:w-full max-w-lg bg-[#1a1b3b] border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl">
                 <h2 className="text-xl font-bold font-heading mb-6">Edit Metadata</h2>
                 <form onSubmit={handleSaveTrackMetadata} className="space-y-4">
                    <div>
                       <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Title</label>
                       <input 
                         className="w-full bg-black/40 border border-white/10 p-2 text-sm text-white" 
                         value={editingTrack.title}
                         onChange={e => setEditingTrack({...editingTrack, title: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Genre</label>
                       <input 
                         className="w-full bg-black/40 border border-white/10 p-2 text-sm text-white" 
                         value={editingTrack.genre}
                         onChange={e => setEditingTrack({...editingTrack, genre: e.target.value})}
                       />
                    </div>
                    <button type="submit" className="w-full bg-[#ccff00] text-black font-bold py-3 uppercase tracking-widest">Save Changes</button>
                 </form>
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
             {/* Simple Player UI */}
            <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0">
               <div className={`w-12 h-12 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shrink-0 ${isPlaying ? 'animate-pulse' : ''}`}>
                 <Music className="w-6 h-6 text-white/30" />
               </div>
               <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white truncate">{currentTrack.title}</div>
                  <div className="text-xs text-white/50 truncate">{currentTrack.artist}</div>
               </div>
               {/* Mobile Play Button in info section */}
               <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="md:hidden w-10 h-10 rounded-full bg-white text-black flex items-center justify-center ml-2"
               >
                   {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
               </button>
            </div>

            <div className="flex flex-col items-center gap-2 w-full md:flex-1 md:max-w-lg order-2 md:order-none">
               {/* Desktop Controls */}
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
               
               {/* Progress Bar */}
               <div className="w-full flex items-center gap-2 text-[10px] font-mono text-white/40">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ccff00]"
                  />
                  <span>{formatTime(duration)}</span>
               </div>
            </div>

            {/* Volume Control - Hidden on Mobile */}
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

export default Dashboard;
