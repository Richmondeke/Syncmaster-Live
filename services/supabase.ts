




/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { createClient } from '@supabase/supabase-js';
import { SyncBrief, Track, Application, User, Profile, Agency } from '../types';

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
    try {
      // Fetch public profile to get role and socials
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      callback(mapUser(session.user, profile));
    } catch (e) {
      console.error("Profile fetch error:", e);
      // Fallback to basic user info if profile fetch fails
      callback(mapUser(session.user));
    }
  };

  // Check initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    handleSession(session);
  }).catch(err => {
    console.error("Auth Session check failed:", err);
    callback(null);
  });

  // Listen for changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    handleSession(session);
  });

  return () => subscription.unsubscribe();
};

export const loginUser = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
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
    email: email.trim(),
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
        email: email.trim(),
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

export const resendConfirmation = async (email: string) => {
  const origin = window.location.origin;
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
    options: {
      emailRedirectTo: origin
    }
  });
  if (error) throw error;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) return null;
    return data as Profile;
  } catch (e) {
    return null;
  }
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
    
    if (error) {
       // Check for missing table error (42P01) or other schema issues
       if (error.code === '42P01' || error.message.includes('schema cache')) {
          console.warn("WARN: Table 'briefs' missing or schema invalid. Please run the SQL setup script in Supabase.");
          console.warn("IMPORTANT: Ensure table is named 'briefs' (lowercase, plural). Postgres is case-sensitive.");
          return;
       }
       // If standard fetch error (e.g. network), just return, don't crash.
       return;
    }

    if (count === 0) {
      console.log('Seeding briefs...');
      await supabase.from('briefs').insert(SEED_BRIEFS);
    }
  } catch (err: any) {
    // Suppress errors during seed to allow app to load
    console.warn("Skipping seed due to error:", err.message || err);
  }
};

export const getBriefs = async (): Promise<SyncBrief[]> => {
  try {
    const { data, error } = await supabase.from('briefs').select('*');
    if (error) {
      if (error.code === '42P01') console.warn("Missing 'briefs' table. Ensure it is named 'briefs' (lowercase).");
      else console.error("Error fetching briefs:", error.message);
      return [];
    }
    return (data || []) as SyncBrief[];
  } catch(e) {
    console.error("Network error fetching briefs:", e);
    return [];
  }
};

export const getBriefApplicationCounts = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('brief_id');
    
    if (error) {
      if (error.code === '42P01') console.warn("Missing 'applications' table.");
      else console.error("Error fetching app counts:", error.message);
      return {};
    }
    
    const counts: Record<string, number> = {};
    if (data) {
      data.forEach((app: any) => {
        const id = app.brief_id;
        counts[id] = (counts[id] || 0) + 1;
      });
    }
    return counts;
  } catch (e) {
    console.error("Error in getBriefApplicationCounts:", e);
    return {};
  }
};

export const subscribeToBriefs = (callback: (briefs: SyncBrief[]) => void) => {
  // Initial Fetch
  supabase.from('briefs').select('*').then(({ data, error }) => {
    if (!error && data) callback(data as SyncBrief[]);
    if (error) {
       console.error("Initial briefs fetch error:", error.message || error);
       callback([]); // Return empty if table missing or fetch fails
    }
  }).catch(err => {
    console.error("Failed to fetch briefs (Network/Auth):", err);
    callback([]);
  });

  // Realtime
  const channel = supabase
    .channel('briefs-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'briefs' }, (payload) => {
      supabase.from('briefs').select('*').then(({ data }) => {
        if (data) callback(data as SyncBrief[]);
      }).catch(err => console.error("Realtime brief refresh failed:", err));
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
         bpm: t.bpm,
         tags: t.tags || [],
         uploadDate: t.upload_date,
         duration: t.duration,
         description: t.description,
         audioUrl: t.audio_url
       }));
       callback(mapped);
    }
    if (error) {
      console.error("Track fetch error:", error.message || error);
      callback([]);
    }
  }).catch(err => {
    console.error("Failed to fetch tracks (Network/Auth):", err);
    callback([]);
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
             bpm: t.bpm,
             tags: t.tags || [],
             uploadDate: t.upload_date,
             duration: t.duration,
             description: t.description,
             audioUrl: t.audio_url
           }));
           callback(mapped);
         }
       }).catch(console.error);
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
    return (data || []) as Profile[];
  } catch (e) {
    console.error("Error fetching artists:", e);
    return [];
  }
};

export const fetchArtistTracks = async (artistId: string): Promise<Track[]> => {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('user_id', artistId);

    if (error) {
      console.error("fetchArtistTracks error", error);
      return [];
    }

    return (data || []).map((t: any) => ({
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
    }));
  } catch (e) {
    console.error("fetchArtistTracks error:", e);
    return [];
  }
};

export const fetchArtistApplications = async (artistId: string): Promise<Application[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', artistId);

    if (error) {
      console.error("Error fetching artist applications:", error);
      return [];
    }

    return (data || []).map((a: any) => ({
      id: a.id,
      userId: a.user_id,
      briefId: a.brief_id,
      trackId: a.track_id,
      status: a.status,
      submittedDate: a.submitted_date
    }));
  } catch (e) {
    console.error("fetchArtistApplications error:", e);
    return [];
  }
};

export const fetchBriefApplicationsWithDetails = async (briefId: string) => {
  try {
    const { data: apps, error } = await supabase
      .from('applications')
      .select('*')
      .eq('brief_id', briefId);

    if (error) {
       console.error("Fetch apps error:", error.message);
       // Handle BigInt error specifically to guide user but return empty to prevent crash
       if (error.message.includes("invalid input syntax for type bigint") || error.code === '22P02') {
         console.warn(`
CRITICAL DB SCHEMA ERROR: Your tables use Integer IDs but the app uses UUIDs.
Since you cannot cast directly, you must DROP and RE-CREATE the tables.
Run this SQL in Supabase:

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS briefs;

CREATE TABLE briefs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  client text,
  budget text,
  genre text,
  deadline text,
  description text,
  tags text[]
);

CREATE TABLE tracks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  artist text,
  genre text,
  tags text[], 
  upload_date text,
  duration text,
  description text,
  audio_url text
);

CREATE TABLE applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  brief_id uuid references briefs(id) not null,
  track_id uuid references tracks(id) not null,
  status text default 'pending',
  submitted_date text
);

-- Re-enable RLS policies after creating tables
`);
       }
       return [];
    }

    if (!apps || apps.length === 0) return [];

    // Get unique IDs to prevent duplicate fetching
    const userIds = [...new Set(apps.map((a: any) => a.user_id))];
    const trackIds = [...new Set(apps.map((a: any) => a.track_id))];

    // Fetch user profiles
    let profiles: any[] = [];
    if (userIds.length > 0) {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);
      profiles = data || [];
    }

    // Fetch tracks
    let tracks: any[] = [];
    if (trackIds.length > 0) {
      const { data } = await supabase
        .from('tracks')
        .select('id, title')
        .in('id', trackIds);
      tracks = data || [];
    }

    // Map details back to applications
    return apps.map((a: any) => {
      const profile = profiles.find((p: any) => p.id === a.user_id);
      const track = tracks.find((t: any) => t.id === a.track_id);
      return {
        id: a.id,
        userId: a.user_id,
        briefId: a.brief_id,
        trackId: a.track_id,
        status: a.status,
        submittedDate: a.submitted_date,
        artistName: profile?.full_name || 'Unknown Artist',
        artistAvatar: profile?.avatar_url,
        trackTitle: track?.title || 'Unknown Track'
      };
    });
  } catch (e) {
    console.error("fetchBriefApplicationsWithDetails error:", e);
    return [];
  }
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
    if (error) {
       console.error("Apps fetch error:", error.message || error);
       callback([]); // Return empty on error
    }
  }).catch(err => {
    console.error("Failed to fetch applications (Network/Auth):", err);
    callback([]);
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
      }).catch(console.error);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

export const uploadTrackFile = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // User confirmed bucket is 'Syncmaster' (Capitalized)
  let bucketName = 'Syncmaster';
  
  // Try upload
  let { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  // Fallback: If 'Syncmaster' not found, try 'syncmaster' (lowercase)
  if (uploadError && (uploadError.message.includes('not found') || (uploadError as any).statusCode === '404')) {
    console.warn(`Bucket '${bucketName}' not found. Trying 'syncmaster'...`);
    bucketName = 'syncmaster';
    const retry = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (retry.error) {
       console.warn(`Bucket '${bucketName}' also not found. Trying legacy 'tracks'.`);
       bucketName = 'tracks';
       const retry2 = await supabase.storage
         .from(bucketName)
         .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
       uploadError = retry2.error;
    } else {
       uploadError = retry.error;
    }
  }

  if (uploadError) {
    console.error("Upload failed details:", uploadError);
    throw new Error(`Upload Failed: ${uploadError.message}. IMPORTANT: You must create a public storage bucket named 'Syncmaster' in Supabase AND add RLS policies to allow uploads.`);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

export const saveTrackMetadata = async (track: Omit<Track, 'id'>, userId: string) => {
  const dbTrack = {
    user_id: userId,
    title: track.title,
    artist: track.artist,
    genre: track.genre,
    bpm: track.bpm,
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
     bpm: data.bpm,
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
  if (updates.bpm) dbUpdates.bpm = updates.bpm;
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

// --- Directory Service (Seeded) ---
const SEED_AGENCIES: Agency[] = [
  {
    id: '1',
    name: 'Big Sync Music',
    type: 'Agency',
    location: 'London / LA',
    contactEmail: 'info@bigsync.com',
    website: 'https://bigsyncmusic.com',
    credits: ['Google', 'Samsung', 'L\'Oreal'],
    logo: 'https://ui-avatars.com/api/?name=Big+Sync&background=000&color=fff',
    description: 'A global music licensing agency that connects brands with the world\'s best music talent. We handle creative search, licensing, and strategy for major campaigns.',
    submissionPolicy: 'We accept demos via our website submission form only. Do not send attachments via email.',
    socials: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' }
  },
  {
    id: '2',
    name: 'Cobalt Music',
    type: 'Supervisor',
    location: 'Los Angeles, CA',
    contactEmail: 'sync@cobalt.music',
    website: 'https://cobaltmusic.com',
    credits: ['Stranger Things', 'FIFA', 'Netflix'],
    logo: 'https://ui-avatars.com/api/?name=Cobalt&background=000&color=fff',
    description: 'Specializing in film and television placements. Known for high-impact trailer music and emotional scene-setters for top-tier streaming series.',
    submissionPolicy: 'Referral only. We do not accept unsolicited material at this time.',
    socials: { twitter: 'https://twitter.com' }
  },
  {
    id: '3',
    name: 'Audio Network',
    type: 'Library',
    location: 'Global',
    contactEmail: 'licensing@audionetwork.com',
    website: 'https://audionetwork.com',
    credits: ['BBC', 'Vice', 'Top Gear'],
    logo: 'https://ui-avatars.com/api/?name=Audio+Network&background=000&color=fff',
    description: 'A premier production music library with a catalog of high-quality, original music recorded by real orchestras and artists in world-class studios.',
    submissionPolicy: 'Composers can apply to join our roster via the "Become a Composer" page on our main site.',
    socials: { instagram: 'https://instagram.com' }
  },
  {
    id: '4',
    name: 'Ghostwriter Music',
    type: 'Agency',
    location: 'Nashville, TN',
    contactEmail: 'subs@ghostwriter.com',
    website: 'https://ghostwriter.music',
    credits: ['Marvel Trailers', 'Star Wars'],
    logo: 'https://ui-avatars.com/api/?name=Ghost+Writer&background=000&color=fff',
    description: 'The industry leader in custom music for motion picture advertising. We create the epic sounds behind the world\'s biggest movie trailers.',
    submissionPolicy: 'We are looking for sound designers and epic orchestral composers. Send streaming links only.',
    socials: { linkedin: 'https://linkedin.com' }
  },
  {
    id: '5',
    name: 'Alexandra Patsavas',
    type: 'Supervisor',
    location: 'Los Angeles, CA',
    contactEmail: 'contact@chopshopmusic.com',
    website: 'https://chopshopmusic.com',
    credits: ['Grey\'s Anatomy', 'Bridgerton', 'Twilight'],
    logo: 'https://ui-avatars.com/api/?name=Alex+Patsavas&background=000&color=fff',
    description: 'Legendary music supervision firm responsible for defining the sound of modern teen drama and romance. Focus on indie rock and pop.',
    submissionPolicy: 'Closed to unsolicited submissions.',
    socials: {}
  },
  {
    id: '6',
    name: 'Secret Road',
    type: 'Agency',
    location: 'Los Angeles, CA',
    contactEmail: 'licensing@secretroad.com',
    website: 'https://secretroad.com',
    credits: ['Apple', 'Target', 'Grey\'s Anatomy'],
    logo: 'https://ui-avatars.com/api/?name=Secret+Road&background=000&color=fff',
    description: 'A music licensing, supervision, and management company. We represent a diverse roster of artists for placement in film, TV, and advertising.',
    submissionPolicy: 'Open to new artist submissions quarterly. Check our social media for submission windows.',
    socials: { instagram: 'https://instagram.com', twitter: 'https://twitter.com' }
  }
];

export const fetchAgencies = async (): Promise<Agency[]> => {
  // In a real app, we would fetch from a 'directory' table.
  // For now, we return the seeded data directly to guarantee the feature works for the user.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(SEED_AGENCIES);
    }, 500);
  });
};
