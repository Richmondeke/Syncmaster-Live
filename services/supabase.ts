/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { createClient } from '@supabase/supabase-js';
import { SyncBrief, Track, Application, User, Profile } from '../types';

// Hardcoded keys as provided by the user
const SUPABASE_URL = 'https://nqptmmqvhpasrwrhyibt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcHRtbXF2aHBhc3J3cmh5aWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDE2OTcsImV4cCI6MjA3NjQxNzY5N30.8BwrjttJ2TGkMkw-dVVww4Pbbt2x9taccOSUxgoNAyg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Helpers ---
const mapUser = (sbUser: any, profile?: any): User | null => {
  if (!sbUser) return null;
  return {
    uid: sbUser.id,
    email: sbUser.email || '',
    displayName: profile?.full_name || sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Artist',
    role: profile?.role || sbUser.user_metadata?.role || 'artist',
    socials: profile?.socials || {}
  };
};

// --- Auth ---
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  // Helper to fetch profile and map
  const handleSession = async (session: any) => {
    if (!session?.user) {
      callback(null);
      return;
    }
    // Fetch public profile to get role and socials
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    callback(mapUser(session.user, profile));
  };

  // Check initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    handleSession(session);
  });

  // Listen for changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    handleSession(session);
  });

  return () => subscription.unsubscribe();
};

export const loginUser = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass
  });
  if (error) throw error;
  return data;
};

export const loginWithGoogle = async () => {
  const origin = window.location.origin;
  console.log("Initiating Google Login.");
  console.log("IMPORTANT: Ensure this URL is in your Supabase Auth > URL Configuration > Redirect URLs:", origin + "/**");
  
  // Uses window.location.origin to ensure it redirects back to wherever the app is hosted
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: origin
    }
  });
  if (error) throw error;
  return data;
};

export const registerUser = async (email: string, pass: string, name: string, role: 'artist' | 'supervisor') => {
  const origin = window.location.origin;
  
  // 1. Create Auth User
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        full_name: name,
        role: role
      },
      emailRedirectTo: origin // Ensure email verification link comes back here
    }
  });
  if (error) throw error;

  // Note: If email confirmation is enabled, data.user might be null or session null
  if (data.user) {
    // 2. Create Public Profile Entry
    try {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        full_name: name,
        role: role,
        avatar_url: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=ccff00&color=000`,
        socials: {} // Initialize empty socials
      });
    } catch (e) {
      console.warn("Could not create public profile. Ensure 'profiles' table exists in Supabase.", e);
    }
  }

  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const updateArtistProfile = async (userId: string, updates: Partial<Profile>) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
};

// --- Data ---

const SEED_BRIEFS: any[] = [
  {
    title: 'Cyberpunk Racing Game Title Track',
    client: 'Neon Interactive',
    budget: '$5,000 - $8,000',
    genre: 'Synthwave / Industrial',
    deadline: '2 Days Left',
    description: 'Looking for a high-energy, aggressive synthwave track for the main menu and title sequence of a AAA racing game.',
    tags: ['Gaming', 'High Energy', 'Instrumental']
  },
  {
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
      console.log('Seeding briefs...');
      await supabase.from('briefs').insert(SEED_BRIEFS);
    }
  } catch (err) {
    console.error("Error seeding briefs:", err);
  }
};

export const getBriefs = async (): Promise<SyncBrief[]> => {
  const { data, error } = await supabase.from('briefs').select('*');
  if (error) {
    console.error("Error fetching briefs:", error);
    return [];
  }
  return data as SyncBrief[];
};

export const subscribeToBriefs = (callback: (briefs: SyncBrief[]) => void) => {
  // Initial Fetch
  supabase.from('briefs').select('*').then(({ data, error }) => {
    if (!error && data) callback(data as SyncBrief[]);
  });

  // Realtime
  const channel = supabase
    .channel('briefs-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'briefs' }, (payload) => {
      supabase.from('briefs').select('*').then(({ data }) => {
        if (data) callback(data as SyncBrief[]);
      });
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

export const subscribeToUserTracks = (userId: string, callback: (tracks: Track[]) => void) => {
  supabase.from('tracks').select('*').eq('user_id', userId).then(({ data, error }) => {
    if (!error && data) {
       const mapped = data.map((t: any) => ({
         id: t.id,
         userId: t.user_id,
         title: t.title,
         artist: t.artist,
         genre: t.genre,
         tags: t.tags || [],
         uploadDate: t.upload_date,
         duration: t.duration,
         description: t.description,
         audioUrl: t.audio_url
       }));
       callback(mapped);
    }
  });

  const channel = supabase
    .channel(`tracks-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tracks', filter: `user_id=eq.${userId}` }, () => {
       supabase.from('tracks').select('*').eq('user_id', userId).then(({ data }) => {
         if (data) {
           const mapped = data.map((t: any) => ({
             id: t.id,
             userId: t.user_id,
             title: t.title,
             artist: t.artist,
             genre: t.genre,
             tags: t.tags || [],
             uploadDate: t.upload_date,
             duration: t.duration,
             description: t.description,
             audioUrl: t.audio_url
           }));
           callback(mapped);
         }
       });
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

export const fetchArtists = async (): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'artist');
    
    if (error) throw error;
    return data as Profile[];
  } catch (e) {
    console.error("Error fetching artists:", e);
    return [];
  }
};

export const fetchArtistTracks = async (artistId: string): Promise<Track[]> => {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('user_id', artistId);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((t: any) => ({
    id: t.id,
    userId: t.user_id,
    title: t.title,
    artist: t.artist,
    genre: t.genre,
    tags: t.tags || [],
    uploadDate: t.upload_date,
    duration: t.duration,
    description: t.description,
    audioUrl: t.audio_url
  }));
};

export const fetchArtistApplications = async (artistId: string): Promise<Application[]> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', artistId);

  if (error) {
    console.error("Error fetching artist applications:", error);
    return [];
  }

  return data.map((a: any) => ({
    id: a.id,
    userId: a.user_id,
    briefId: a.brief_id,
    trackId: a.track_id,
    status: a.status,
    submittedDate: a.submitted_date
  }));
};

export const subscribeToUserApplications = (userId: string, callback: (apps: Application[]) => void) => {
  supabase.from('applications').select('*').eq('user_id', userId).then(({ data, error }) => {
    if (!error && data) {
      const mapped = data.map((a: any) => ({
        id: a.id,
        userId: a.user_id,
        briefId: a.brief_id,
        trackId: a.track_id,
        status: a.status,
        submittedDate: a.submitted_date
      }));
      callback(mapped);
    }
  });

  const channel = supabase
    .channel(`apps-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `user_id=eq.${userId}` }, () => {
      supabase.from('applications').select('*').eq('user_id', userId).then(({ data }) => {
        if (data) {
          const mapped = data.map((a: any) => ({
            id: a.id,
            userId: a.user_id,
            briefId: a.brief_id,
            trackId: a.track_id,
            status: a.status,
            submittedDate: a.submitted_date
          }));
          callback(mapped);
        }
      });
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

export const uploadTrackFile = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('tracks')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('tracks').getPublicUrl(filePath);
  return data.publicUrl;
};

export const saveTrackMetadata = async (track: Omit<Track, 'id'>, userId: string) => {
  const dbTrack = {
    user_id: userId,
    title: track.title,
    artist: track.artist,
    genre: track.genre,
    tags: track.tags,
    upload_date: track.uploadDate,
    duration: track.duration,
    description: track.description,
    audio_url: track.audioUrl
  };

  const { data, error } = await supabase
    .from('tracks')
    .insert(dbTrack)
    .select()
    .single();

  if (error) throw error;

  return {
     id: data.id,
     userId: data.user_id,
     title: data.title,
     artist: data.artist,
     genre: data.genre,
     tags: data.tags || [],
     uploadDate: data.upload_date,
     duration: data.duration,
     description: data.description,
     audioUrl: data.audio_url
  };
};

export const updateTrackMetadata = async (trackId: string, updates: Partial<Track>) => {
  const dbUpdates: any = {};
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.artist) dbUpdates.artist = updates.artist;
  if (updates.genre) dbUpdates.genre = updates.genre;
  if (updates.tags) dbUpdates.tags = updates.tags;
  if (updates.description) dbUpdates.description = updates.description;

  const { error } = await supabase
    .from('tracks')
    .update(dbUpdates)
    .eq('id', trackId);

  if (error) throw error;
};

export const submitApplication = async (application: Omit<Application, 'id'>, userId: string) => {
  const dbApp = {
    user_id: userId,
    brief_id: application.briefId,
    track_id: application.trackId,
    status: application.status,
    submitted_date: application.submittedDate
  };

  const { data, error } = await supabase
    .from('applications')
    .insert(dbApp)
    .select()
    .single();
    
  if (error) throw error;
  return data.id;
};
