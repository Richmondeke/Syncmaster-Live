

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, CheckCircle, Clock, DollarSign, Music, Upload, X, FileAudio, Loader2, ChevronRight, ListMusic, Layers, Edit2, Calendar, Tag, Save, Filter, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Mic2, Disc, FilePlus, Film, ImageIcon, Plus, Settings, Link as LinkIcon, Globe, AlertCircle, LogOut, Ghost, Building2, MapPin, Mail, Copy, Check, Info, Phone, Linkedin, Instagram, Twitter, Award, Menu, LayoutDashboard, Activity, User as UserIcon, Wand2, ChevronLeft, Repeat, Repeat1, CreditCard, Coins } from 'lucide-react';
import { SyncBrief, Track, Application, TabView, User, Agency } from '../types';
import { subscribeToBriefs, subscribeToUserTracks, subscribeToUserApplications, uploadTrackFile, saveTrackMetadata, updateTrackMetadata, submitApplication, updateArtistProfile, fetchAgencies, logoutUser, addUserCredits, updateUserSubscription, uploadProfilePicture } from '../services/supabase';

interface DashboardProps {
  user: User;
}

const SUGGESTED_GENRES = ['Cinematic', 'Electronic', 'Rock', 'Pop', 'Hip Hop', 'Ambient', 'Folk', 'Corporate', 'Orchestral', 'Synthwave'];
const SUGGESTED_TAGS = ['Uplifting', 'Dark', 'Energetic', 'Emotional', 'Driving', 'Hopeful', 'Tense', 'Epic', 'Quirky', 'Sentimental', 'Advertising', 'Trailer'];
const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK-e56c2c23b29101ad4b0b1f8cbf637ccc-X';

const getErrorMessage = (err: any) => {
  if (!err) return 'Unknown error';
  return typeof err === 'string' ? err : err.message || 'Operation failed';
};

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
  
  // Forms
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadBpm, setUploadBpm] = useState<string>('');
  
  // Audio
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loopMode, setLoopMode] = useState<'off' | 'all' | 'one'>('off');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  // Profile
  const [socialLinks, setSocialLinks] = useState({
     spotify: user.socials?.spotify || '',
     appleMusic: user.socials?.appleMusic || '',
     instagram: user.socials?.instagram || '',
     website: user.socials?.website || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [directoryFilter, setDirectoryFilter] = useState<'All' | 'Agency' | 'Supervisor' | 'Library'>('All');

  // Load Data
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

  // Player Sync
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
      else audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Handlers
  const handleLibraryUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const genre = formData.get('genre') as string;
    const description = formData.get('description') as string;
    const tags = (formData.get('tags') as string).split(',').map(t => t.trim());
    
    if (!uploadFile || !title) return;

    setIsUploading(true);
    setUploadState('uploading');
    setUploadProgress(10);

    try {
      const audioUrl = await uploadTrackFile(uploadFile, user.uid);
      setUploadProgress(90);
      setUploadState('processing');

      await saveTrackMetadata({
        title,
        artist: user.displayName || 'Artist',
        genre,
        bpm: uploadBpm ? parseInt(uploadBpm) : undefined,
        description,
        tags,
        uploadDate: new Date().toISOString().split('T')[0],
        duration: '0:00',
        audioUrl
      }, user.uid);

      setUploadProgress(100);
      setUploadState('success');
      
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setIsUploading(false);
        setUploadState('idle');
        setUploadFile(null);
        setActiveTab('library');
      }, 1500);
    } catch (error: any) {
      alert("Upload failed: " + getErrorMessage(error));
      setIsUploading(false);
      setUploadState('idle');
    }
  };

  const handleEditTrackSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingTrack) return;
    const formData = new FormData(event.currentTarget);
    setIsUploading(true);
    try {
        await updateTrackMetadata(editingTrack.id, {
            title: formData.get('title') as string,
            genre: formData.get('genre') as string,
            bpm: parseInt(uploadBpm) || undefined,
            tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
            description: formData.get('description') as string
        });
        setIsEditModalOpen(false);
        setEditingTrack(null);
    } catch (e: any) {
        alert("Update failed: " + getErrorMessage(e));
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
    if (!selectedBrief || !uploadFile) return;

    setIsUploading(true);
    try {
      const audioUrl = await uploadTrackFile(uploadFile, user.uid);
      const formData = new FormData(event.currentTarget);
      const newTrack = await saveTrackMetadata({
        title: formData.get('title') as string,
        artist: user.displayName || 'Artist',
        genre: formData.get('genre') as string,
        bpm: parseInt(uploadBpm) || undefined,
        tags: [],
        uploadDate: new Date().toISOString().split('T')[0],
        duration: '0:00',
        audioUrl
      }, user.uid);

      await submitApplication({
        briefId: selectedBrief.id,
        trackId: newTrack.id,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      }, user.uid);

      setIsApplicationModalOpen(false);
      setSelectedBrief(null);
      setActiveTab('applications');
    } catch (e: any) {
      alert("Failed: " + getErrorMessage(e));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitExistingTrackApplication = async () => {
    if (!selectedBrief || !selectedTrackId) return;
    setIsUploading(true);
    try {
      await submitApplication({
        briefId: selectedBrief.id,
        trackId: selectedTrackId,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      }, user.uid);
      setIsApplicationModalOpen(false);
      setSelectedBrief(null);
      setActiveTab('applications');
    } catch (e: any) {
      alert("Failed: " + getErrorMessage(e));
    } finally {
      setIsUploading(false);
    }
  };

  // Playback
  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setQueue(tracks);
      setCurrentTrackIndex(tracks.findIndex(t => t.id === track.id));
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % queue.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTrack(queue[nextIdx]);
    setIsPlaying(true);
  };

  // Profile
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateArtistProfile(user.uid, { socials: socialLinks });
      alert("Saved!");
    } catch (e) {
      alert("Failed to save.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadProfilePicture(file, user.uid);
      await updateArtistProfile(user.uid, { avatar_url: url });
      // Reload page or force update handled by auth subscription
    } catch (err: any) {
      alert(getErrorMessage(err));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpgradeToPro = () => {
    if ((window as any).FlutterwaveCheckout) {
      (window as any).FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: "PRO-" + Date.now(),
        amount: 15,
        currency: "USD",
        payment_options: "card, mobilemoneyghana, ussd",
        customer: { email: user.email, name: user.displayName },
        callback: function (data: any) {
           if (data.status === "successful") {
              updateUserSubscription(user.uid, 'pro').then(() => {
                 addUserCredits(user.uid, 50);
                 alert("Welcome to Pro! 50 Credits added.");
              });
           }
        },
        customizations: { title: "SyncMaster Pro", description: "Upgrade to Pro Artist", logo: "https://ui-avatars.com/api/?name=S&background=ccff00" },
      });
    } else {
      alert("Payment system loading...");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#31326f] overflow-hidden">
      <audio ref={audioRef} src={currentTrack?.audioUrl} onTimeUpdate={() => { if(audioRef.current) { setCurrentTime(audioRef.current.currentTime); setDuration(audioRef.current.duration||0); }}} onEnded={handleNextTrack} />
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0f1025] border-r border-white/10 relative z-40 shrink-0 h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center shrink-0">
              <span className="font-heading font-bold text-[#31326f] text-lg">S</span>
            </div>
            <span className="text-xl font-heading font-bold text-white tracking-tighter">SYNCMASTER</span>
          </div>
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
                  ${activeTab === item.id ? 'bg-[#ccff00] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-white/10 bg-black/20">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                 <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden">
                 <div className="font-bold text-white text-sm truncate">{user.displayName}</div>
                 <div className="text-[10px] text-white/50 uppercase tracking-wider">{user.role}</div>
              </div>
           </div>
           <button onClick={logoutUser} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl uppercase tracking-widest">
             <LogOut className="w-3 h-3" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f1025] z-50 flex items-center justify-between px-4 border-b border-white/10">
         <span className="font-bold text-white">SYNCMASTER</span>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white"><Menu /></button>
      </div>
      
      {/* Content */}
      <main className="flex-1 overflow-y-auto h-full relative pt-20 md:pt-0 bg-[#31326f]">
        <div className="p-6 md:p-12 pb-32 max-w-[1600px] mx-auto min-h-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-white/10 gap-4">
             <div>
                <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">
                   {activeTab === 'browse' && 'Active Briefs'}
                   {activeTab === 'library' && 'My Tracks'}
                   {activeTab === 'applications' && 'My Applications'}
                   {activeTab === 'directory' && 'Agency Directory'}
                   {activeTab === 'profile' && 'Artist Settings'}
                </h1>
             </div>
             {activeTab === 'library' && (
                <button onClick={() => setIsUploadModalOpen(true)} className="bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                   <Upload className="w-4 h-4" /> Upload Track
                </button>
             )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'browse' && (
              <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {briefs.map(brief => (
                    <div key={brief.id} className="bg-[#1a1b3b]/40 border border-white/10 p-6 rounded-xl hover:border-[#ccff00]/50 transition-colors flex flex-col group">
                       <div className="flex justify-between mb-4"><span className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/50">{brief.client}</span><span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-1 rounded">{brief.deadline}</span></div>
                       <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ccff00]">{brief.title}</h3>
                       <p className="text-sm text-white/50 mb-6 flex-1 line-clamp-3">{brief.description}</p>
                       <div className="flex justify-between items-center border-t border-white/5 pt-4">
                          <span className="text-[#ccff00] font-mono font-bold text-sm">{brief.budget}</span>
                          <button onClick={() => handleApply(brief)} className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#ccff00] flex items-center gap-1">Pitch Track <ChevronRight className="w-3 h-3" /></button>
                       </div>
                    </div>
                 ))}
                 {briefs.length === 0 && <EmptyState icon={Briefcase} title="No Briefs" description="Check back later." />}
              </motion.div>
            )}

            {activeTab === 'library' && (
               <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {tracks.length === 0 ? <EmptyState icon={Music} title="Empty Library" description="Upload tracks to start." action={<button onClick={() => setIsUploadModalOpen(true)} className="text-[#ccff00] underline uppercase text-xs font-bold mt-4">Upload Now</button>} /> : (
                     <div className="bg-[#1a1b3b]/40 rounded-xl border border-white/10 overflow-hidden">
                        {tracks.map(t => (
                           <div key={t.id} className="p-4 border-b border-white/5 flex items-center gap-4 hover:bg-white/5">
                              <button onClick={() => handlePlayTrack(t)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#ccff00] hover:text-black flex items-center justify-center transition-colors">
                                 {currentTrack?.id === t.id && isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                              </button>
                              <div className="flex-1">
                                 <div className={`font-bold ${currentTrack?.id === t.id ? 'text-[#ccff00]' : 'text-white'}`}>{t.title}</div>
                                 <div className="text-xs text-white/40">{t.bpm ? `${t.bpm} BPM • ` : ''}{t.genre}</div>
                              </div>
                              <button onClick={() => { setEditingTrack(t); setUploadBpm(t.bpm?.toString() || ''); setIsEditModalOpen(true); }} className="p-2 text-white/30 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                           </div>
                        ))}
                     </div>
                  )}
               </motion.div>
            )}
            
            {activeTab === 'applications' && (
               <motion.div key="apps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {applications.length === 0 ? <EmptyState icon={Briefcase} title="No Applications" description="Apply to briefs to see status here." /> : (
                     <div className="bg-[#1a1b3b]/40 rounded-xl border border-white/10 overflow-hidden">
                        {applications.map(app => (
                           <div key={app.id} className="p-4 border-b border-white/5 flex justify-between items-center">
                              <div><div className="text-sm font-bold text-white">Application to Brief</div><div className="text-xs text-white/40">{app.submittedDate}</div></div>
                              <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold border ${app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>{app.status}</span>
                           </div>
                        ))}
                     </div>
                  )}
               </motion.div>
            )}

            {activeTab === 'directory' && (
               <motion.div key="directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {agencies.map(a => (
                        <div key={a.id} className="bg-[#1a1b3b]/40 p-6 rounded-xl border border-white/10 hover:border-[#ccff00]/50 transition-colors">
                           <div className="flex items-center gap-4 mb-4">
                              <img src={a.logo} className="w-10 h-10 rounded bg-white/10" />
                              <div><div className="font-bold text-white">{a.name}</div><div className="text-xs text-white/50 uppercase">{a.type}</div></div>
                           </div>
                           <p className="text-sm text-white/60 mb-4 h-10 line-clamp-2">{a.description}</p>
                           <div className="flex gap-2"><a href={a.website} target="_blank" className="text-xs text-[#ccff00] hover:underline flex items-center gap-1"><Globe className="w-3 h-3" /> Website</a></div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}

            {activeTab === 'profile' && (
               <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="bg-[#1a1b3b]/40 border border-white/10 p-8 rounded-xl flex flex-col items-center">
                        <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#ccff00]/20 mb-4 relative group cursor-pointer">
                           <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"><Upload className="w-6 h-6" /></div>
                        </div>
                        <input type="file" ref={fileInputRef} hidden onChange={handleAvatarChange} />
                        <h2 className="text-2xl font-bold text-white">{user.displayName}</h2>
                        <div className="text-xs text-[#ccff00] uppercase tracking-widest mb-6">{user.role} • {user.subscriptionTier}</div>
                        
                        <div className="w-full bg-white/5 rounded-xl p-6 relative overflow-hidden group">
                           <div className="flex justify-between items-end mb-4 relative z-10">
                              <div><div className="text-3xl font-bold text-white">{user.credits || 0}</div><div className="text-xs text-white/50 uppercase tracking-widest">Credits</div></div>
                              <Coins className="w-8 h-8 text-[#ccff00]" />
                           </div>
                           <button onClick={handleUpgradeToPro} className="w-full bg-[#ccff00] text-black font-bold uppercase tracking-widest py-3 rounded-lg text-xs hover:bg-white transition-colors relative z-10 flex items-center justify-center gap-2">
                              <Award className="w-4 h-4" /> Upgrade to Pro ($15)
                           </button>
                        </div>
                     </div>
                     
                     <div className="lg:col-span-2 bg-[#1a1b3b]/40 border border-white/10 p-8 rounded-xl space-y-4">
                        <h3 className="font-bold text-white mb-4">Social Connections</h3>
                        <input value={socialLinks.spotify} onChange={e => setSocialLinks({...socialLinks, spotify: e.target.value})} placeholder="Spotify URL" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
                        <input value={socialLinks.instagram} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} placeholder="Instagram Handle" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
                        <input value={socialLinks.website} onChange={e => setSocialLinks({...socialLinks, website: e.target.value})} placeholder="Website URL" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
                        <div className="flex justify-end pt-4"><button onClick={handleSaveProfile} disabled={isSavingProfile} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold uppercase text-xs">{isSavingProfile ? 'Saving...' : 'Save Changes'}</button></div>
                     </div>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Persistent Player Bar */}
      {currentTrack && (
         <div className="fixed bottom-0 left-0 right-0 md:left-64 h-20 bg-[#0f1025]/95 border-t border-white/10 flex items-center px-6 z-50 backdrop-blur-xl gap-4">
            <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center"><Music className="w-6 h-6 text-white/50" /></div>
            <div className="flex-1 min-w-0">
               <div className="font-bold text-white text-sm truncate">{currentTrack.title}</div>
               <div className="text-xs text-white/50 truncate">{currentTrack.artist}</div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}</button>
               <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-20 hidden md:block" />
            </div>
         </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-[#1a1b3b] p-8 rounded-xl max-w-lg w-full border border-white/10">
               <h2 className="text-xl font-bold text-white mb-6">Upload Track</h2>
               <form onSubmit={handleLibraryUploadSubmit} className="space-y-4">
                  <input name="title" required placeholder="Track Title" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white" />
                  <input type="file" required onChange={e => setUploadFile(e.target.files?.[0] || null)} className="text-white text-sm" />
                  <div className="grid grid-cols-2 gap-4">
                     <select name="genre" className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white">{SUGGESTED_GENRES.map(g => <option key={g}>{g}</option>)}</select>
                     <input name="bpm" placeholder="BPM" value={uploadBpm} onChange={e => setUploadBpm(e.target.value)} className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white" />
                  </div>
                  <input name="tags" placeholder="Tags (comma separated)" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white" />
                  <div className="flex justify-end gap-3 pt-4">
                     <button type="button" onClick={() => setIsUploadModalOpen(false)} className="text-white/50 hover:text-white px-4 py-2 text-xs font-bold uppercase">Cancel</button>
                     <button type="submit" disabled={isUploading} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold uppercase text-xs">{isUploading ? `Uploading ${uploadProgress}%` : 'Save'}</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Dashboard;
