/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { createClient } from '@supabase/supabase-js';
import { SyncBrief, Track, Application, User, Profile, Agency } from '../types';

// Hardcoded keys as provided
const SUPABASE_URL = 'https://nqptmmqvhpasrwrhyibt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcHRtbXF2aHBhc3J3cmh5aWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDE2OTcsImV4cCI6MjA3NjQxNzY5N30.8BwrjttJ2TGkMkw-dVVww4Pbbt2x9taccOSUxgoNAyg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    // Prevent throw on initial failure to allow fallback
    headers: { 'x-application-name': 'syncmaster' }
  }
});

// --- OFFLINE / MOCK MODE STATE ---
const STORAGE_KEY = 'syncmaster_mock_db';

const getMockDB = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { 
      users: {}, 
      tracks: [], 
      applications: [],
      currentUser: null 
    };
  } catch {
    return { users: {}, tracks: [], applications: [], currentUser: null };
  }
};

const saveMockDB = (db: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  window.dispatchEvent(new Event('mock_db_update'));
};

const SEED_BRIEFS: SyncBrief[] = [
  {
    id: '1',
    title: 'Cyberpunk Racing Game Title Track',
    client: 'Neon Interactive',
    budget: '$5,000 - $8,000',
    genre: 'Synthwave / Industrial',
    deadline: '2 Days Left',
    description: 'Looking for a high-energy, aggressive synthwave track for the main menu and title sequence of a AAA racing game.',
    tags: ['Gaming', 'High Energy', 'Instrumental']
  },
  {
    id: '2',
    title: 'Futuristic Perfume Commercial',
    client: 'Luxe Digital',
    budget: '$12,000',
    genre: 'Ethereal / Ambient',
    deadline: '1 Week Left',
    description: 'Need a dreamy, floating track with female vocals (optional) for a 30s TV spot. The visual is a woman floating in zero gravity.',
    tags: ['Advertising', 'Atmospheric', 'Luxury']
  }
];

export const seedBriefsIfNeeded = async () => {
  try {
    const { count, error } = await supabase.from('briefs').select('*', { count: 'exact', head: true });
    if (!error && count === 0) {
       await supabase.from('briefs').insert(SEED_BRIEFS.map(b => ({
          id: b.id,
          title: b.title,
          client: b.client,
          budget: b.budget,
          genre: b.genre,
          deadline: b.deadline,
          description: b.description,
          tags: b.tags
       })));
    }
  } catch (e) {
    // Ignore offline errors
  }
};

// --- Auth Services ---

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  // 1. Supabase Listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const db = getMockDB();
      try {
         const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
         if (error) throw error;
         callback(mapUser(session.user, profile));
      } catch (e) {
         const mockProfile = db.users[session.user.id];
         callback(mapUser(session.user, mockProfile));
      }
    } else {
      const db = getMockDB();
      callback(db.currentUser); 
    }
  });

  // 2. Mock Listener
  const mockListener = () => {
    const db = getMockDB();
    if (db.currentUser) {
       callback(db.currentUser);
    } else {
       supabase.auth.getSession().then(({ data }) => {
         if (!data.session) callback(null);
       });
    }
  };
  window.addEventListener('mock_db_update', mockListener);

  return () => {
    subscription.unsubscribe();
    window.removeEventListener('mock_db_update', mockListener);
  };
};

const mapUser = (sbUser: any, profile?: any): User => ({
  uid: sbUser.id || sbUser.uid,
  email: sbUser.email || '',
  displayName: profile?.full_name || sbUser.user_metadata?.full_name || 'Artist',
  role: profile?.role || 'artist',
  credits: profile?.credits || 0,
  subscriptionTier: profile?.subscription_tier || 'free',
  avatarUrl: profile?.avatar_url,
  socials: profile?.socials || {}
});

export const loginUser = async (email: string, pass: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return data;
  } catch (err: any) {
    if (err.message?.includes('Failed to fetch') || err.message?.includes('Network request failed') || err.message?.includes('Invalid login credentials')) {
      console.warn("Offline/Demo Mode: Logging in locally.");
      
      const db = getMockDB();
      const mockId = 'mock_user_123';
      const user = {
        uid: mockId,
        email: email,
        displayName: 'Demo User',
        role: 'artist' as const,
        credits: 0,
        subscriptionTier: 'free' as const,
        avatarUrl: `https://ui-avatars.com/api/?name=${email}&background=ccff00&color=000`
      };
      
      db.users[mockId] = { ...user, ...db.users[mockId] };
      db.currentUser = db.users[mockId];
      saveMockDB(db);
      
      return { user, session: { user } };
    }
    throw err;
  }
};

export const registerUser = async (email: string, pass: string, name: string, role: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email, password: pass, options: { data: { full_name: name, role } }
    });
    if (error) throw error;
    if (data.user) {
        await supabase.from('profiles').insert({
            id: data.user.id,
            email,
            full_name: name,
            role,
            avatar_url: `https://ui-avatars.com/api/?name=${name}&background=random`,
            credits: 0,
            subscription_tier: 'free'
        }).catch(e => console.warn("Profile creation failed", e));
    }
    return data;
  } catch (err: any) {
    const db = getMockDB();
    const mockId = `mock_${Date.now()}`;
    const user = {
        uid: mockId,
        email,
        displayName: name,
        role: role as any,
        credits: 0,
        subscriptionTier: 'free' as const,
        avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`
    };
    db.users[mockId] = user;
    return { user, session: null };
  }
};

export const logoutUser = async () => {
  await supabase.auth.signOut().catch(() => {});
  const db = getMockDB();
  db.currentUser = null;
  saveMockDB(db);
};

export const loginWithGoogle = async () => {
   const { error } = await supabase.auth.signInWithOAuth({
     provider: 'google',
     options: { redirectTo: window.location.origin }
   });
   if (error) throw error;
};

export const resendConfirmation = async (email: string) => {
  await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: window.location.origin } });
};

// --- Data Services ---

export const subscribeToBriefs = (callback: (briefs: SyncBrief[]) => void) => {
  supabase.from('briefs').select('*').then(({ data, error }) => {
    if (error) throw error;
    if (data) callback(data as SyncBrief[]);
  }).catch(() => {
    callback(SEED_BRIEFS);
  });
  return () => {};
};

export const subscribeToUserTracks = (userId: string, callback: (tracks: Track[]) => void) => {
  supabase.from('tracks').select('*').eq('user_id', userId).then(({ data, error }) => {
    if (error) throw error;
    if (data) callback(data.map(mapTrack));
  }).catch(() => {
    const db = getMockDB();
    callback(db.tracks.filter((t: Track) => t.userId === userId));
  });

  const handler = () => {
    const db = getMockDB();
    callback(db.tracks.filter((t: Track) => t.userId === userId));
  };
  window.addEventListener('mock_db_update', handler);
  return () => window.removeEventListener('mock_db_update', handler);
};

export const subscribeToUserApplications = (userId: string, callback: (apps: Application[]) => void) => {
  supabase.from('applications').select('*').eq('user_id', userId).then(({ data, error }) => {
    if (error) throw error;
    if (data) callback(data.map(mapApp));
  }).catch(() => {
    const db = getMockDB();
    callback(db.applications.filter((a: Application) => a.userId === userId));
  });

  const handler = () => {
    const db = getMockDB();
    callback(db.applications.filter((a: Application) => a.userId === userId));
  };
  window.addEventListener('mock_db_update', handler);
  return () => window.removeEventListener('mock_db_update', handler);
};

export const uploadTrackFile = async (file: File, userId: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    }, 1000);
  });
};

export const saveTrackMetadata = async (track: Omit<Track, 'id'>, userId: string) => {
  try {
     const { data, error } = await supabase.from('tracks').insert({
         user_id: userId,
         title: track.title,
         genre: track.genre,
         bpm: track.bpm,
         tags: track.tags,
         description: track.description,
         upload_date: track.uploadDate,
         audio_url: track.audioUrl
     }).select().single();
     if (error) throw error;
     return mapTrack(data);
  } catch (e) {
     const db = getMockDB();
     const newTrack = { id: `local_${Date.now()}`, ...track, userId };
     db.tracks.unshift(newTrack);
     saveMockDB(db);
     return newTrack;
  }
};

export const updateTrackMetadata = async (trackId: string, updates: Partial<Track>) => {
    try {
        const { error } = await supabase.from('tracks').update(updates).eq('id', trackId);
        if (error) throw error;
    } catch {
        const db = getMockDB();
        const idx = db.tracks.findIndex((t: Track) => t.id === trackId);
        if (idx !== -1) {
            db.tracks[idx] = { ...db.tracks[idx], ...updates };
            saveMockDB(db);
        }
    }
};

export const submitApplication = async (app: Omit<Application, 'id'>, userId: string) => {
    try {
        const { error } = await supabase.from('applications').insert({
            user_id: userId,
            brief_id: app.briefId,
            track_id: app.trackId,
            status: app.status,
            submitted_date: app.submittedDate
        });
        if (error) throw error;
    } catch {
        const db = getMockDB();
        const newApp = { id: `local_app_${Date.now()}`, ...app, userId };
        db.applications.unshift(newApp);
        saveMockDB(db);
    }
};

export const updateUserSubscription = async (userId: string, tier: 'pro' | 'agency') => {
    try {
        const { error } = await supabase.from('profiles').update({ subscription_tier: tier }).eq('id', userId);
        if (error) throw error;
        await supabase.auth.refreshSession();
    } catch {
        const db = getMockDB();
        if (db.users[userId]) {
            db.users[userId].subscriptionTier = tier;
        }
        if (db.currentUser && db.currentUser.uid === userId) {
            db.currentUser.subscriptionTier = tier;
        }
        saveMockDB(db);
    }
};

export const addUserCredits = async (userId: string, amount: number) => {
    try {
        const { data } = await supabase.from('profiles').select('credits').eq('id', userId).single();
        const current = data?.credits || 0;
        
        const { error } = await supabase.from('profiles').update({ credits: current + amount }).eq('id', userId);
        if (error) throw error;
        await supabase.auth.refreshSession();
    } catch {
        const db = getMockDB();
        if (db.users[userId]) {
            db.users[userId].credits = (db.users[userId].credits || 0) + amount;
        }
        if (db.currentUser && db.currentUser.uid === userId) {
            db.currentUser.credits = (db.currentUser.credits || 0) + amount;
        }
        saveMockDB(db);
    }
};

export const updateArtistProfile = async (userId: string, updates: Partial<Profile>) => {
    try {
        await supabase.from('profiles').update(updates).eq('id', userId);
    } catch {
        const db = getMockDB();
        if (db.users[userId]) {
            db.users[userId] = { ...db.users[userId], ...updates };
        }
        if (db.currentUser?.uid === userId) {
            db.currentUser = { ...db.currentUser, ...updates };
        }
        saveMockDB(db);
    }
};

export const uploadProfilePicture = async (file: File, userId: string) => {
    return `https://ui-avatars.com/api/?name=User&background=random&time=${Date.now()}`;
};

export const fetchAgencies = async (): Promise<Agency[]> => {
    return new Promise(resolve => {
        setTimeout(() => resolve([
            {
                id: '1', name: 'Big Sync Music', type: 'Agency', location: 'London',
                contactEmail: 'info@bigsync.com', website: 'https://bigsyncmusic.com',
                credits: ['Samsung', 'Google'], logo: 'https://ui-avatars.com/api/?name=BS',
                description: 'Global licensing agency.'
            },
            {
                id: '2', name: 'Cobalt', type: 'Supervisor', location: 'LA',
                contactEmail: 'sync@cobalt.music', website: 'https://cobalt.music',
                credits: ['Stranger Things'], logo: 'https://ui-avatars.com/api/?name=C',
                description: 'Film & TV specialists.'
            }
        ]), 300);
    });
};

// --- Supervisor Functions (Implemented) ---

export const fetchArtists = async (): Promise<Profile[]> => {
    try {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'artist');
        if (error) throw error;
        return data as Profile[];
    } catch {
        const db = getMockDB();
        return Object.values(db.users).filter((u: any) => u.role === 'artist').map((u: any) => ({
            id: u.uid,
            email: u.email || '',
            full_name: u.displayName || '',
            role: u.role,
            avatar_url: u.avatarUrl,
            credits: u.credits,
            subscription_tier: u.subscriptionTier,
            socials: u.socials
        })) as Profile[];
    }
};

export const fetchArtistTracks = async (artistId: string): Promise<Track[]> => {
    try {
        const { data, error } = await supabase.from('tracks').select('*').eq('user_id', artistId);
        if (error) throw error;
        return data.map(mapTrack);
    } catch {
        const db = getMockDB();
        return db.tracks.filter((t: Track) => t.userId === artistId);
    }
};

export const fetchArtistApplications = async (artistId: string): Promise<Application[]> => {
    try {
        const { data, error } = await supabase.from('applications').select('*').eq('user_id', artistId);
        if (error) throw error;
        return data.map(mapApp);
    } catch {
        const db = getMockDB();
        return db.applications.filter((a: Application) => a.userId === artistId);
    }
};

export const getBriefs = async (): Promise<SyncBrief[]> => {
    try {
        const { data, error } = await supabase.from('briefs').select('*');
        if (error) throw error;
        return data as SyncBrief[];
    } catch {
        return SEED_BRIEFS;
    }
};

export const getBriefApplicationCounts = async () => {
    try {
        const { data, error } = await supabase.from('applications').select('brief_id');
        if (error) throw error;
        const counts: Record<string, number> = {};
        data.forEach((a: any) => {
            counts[a.brief_id] = (counts[a.brief_id] || 0) + 1;
        });
        return counts;
    } catch {
        const db = getMockDB();
        const counts: Record<string, number> = {};
        db.applications.forEach((a: Application) => {
            counts[a.briefId] = (counts[a.briefId] || 0) + 1;
        });
        return counts;
    }
};

export const fetchBriefApplicationsWithDetails = async (briefId: string) => {
    try {
        const { data, error } = await supabase.from('applications')
            .select(`*, profiles:user_id ( full_name, avatar_url ), tracks:track_id ( title, audio_url )`)
            .eq('brief_id', briefId);
        if (error) throw error;
        return data.map((a: any) => ({
            id: a.id,
            userId: a.user_id,
            briefId: a.brief_id,
            trackId: a.track_id,
            status: a.status,
            submittedDate: a.submitted_date,
            artistName: a.profiles?.full_name || 'Unknown',
            artistAvatar: a.profiles?.avatar_url,
            trackTitle: a.tracks?.title || 'Unknown Track',
            audioUrl: a.tracks?.audio_url
        }));
    } catch {
        const db = getMockDB();
        const apps = db.applications.filter((a: Application) => a.briefId === briefId);
        return apps.map((a: Application) => {
             const user = db.users[a.userId || ''] || {};
             const track = db.tracks.find((t: Track) => t.id === a.trackId) || {};
             return {
                 ...a,
                 artistName: user.displayName || 'Unknown',
                 artistAvatar: user.avatarUrl,
                 trackTitle: track.title || 'Unknown Track',
                 audioUrl: track.audioUrl
             };
        });
    }
};

export const getUserProfile = async (id: string): Promise<Profile | null> => {
    try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) throw error;
        return {
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role,
            avatar_url: data.avatar_url,
            credits: data.credits,
            subscription_tier: data.subscription_tier,
            socials: data.socials
        };
    } catch {
        const db = getMockDB();
        const user = db.users[id];
        if (user) {
             return {
                 id: user.uid,
                 email: user.email || '',
                 full_name: user.displayName || '',
                 role: user.role || 'artist',
                 avatar_url: user.avatarUrl,
                 credits: user.credits,
                 subscription_tier: user.subscriptionTier,
                 socials: user.socials
             };
        }
        return null;
    }
};

export const createBrief = async (brief: Omit<SyncBrief, 'id'>) => {
    try {
        const { data, error } = await supabase.from('briefs').insert(brief).select().single();
        if (error) throw error;
        return data as SyncBrief;
    } catch {
        return { id: `local_brief_${Date.now()}`, ...brief } as SyncBrief;
    }
};

export const updateApplicationStatus = async (appId: string, status: 'pending' | 'shortlisted' | 'rejected' | 'accepted') => {
    try {
        const { error } = await supabase.from('applications').update({ status }).eq('id', appId);
        if (error) throw error;
    } catch {
        const db = getMockDB();
        const app = db.applications.find((a: Application) => a.id === appId);
        if (app) {
            app.status = status;
            saveMockDB(db);
        }
    }
};

// Mappers
const mapTrack = (t: any): Track => ({
    id: t.id,
    userId: t.user_id,
    title: t.title,
    artist: t.artist,
    genre: t.genre,
    bpm: t.bpm,
    tags: t.tags || [],
    uploadDate: t.upload_date,
    duration: t.duration,
    description: t.description,
    audioUrl: t.audio_url
});

const mapApp = (a: any): Application => ({
    id: a.id,
    userId: a.user_id,
    briefId: a.brief_id,
    trackId: a.track_id,
    status: a.status,
    submittedDate: a.submitted_date
});