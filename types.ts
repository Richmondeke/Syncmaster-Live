
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: 'artist' | 'supervisor';
  socials?: {
    spotify?: string;
    appleMusic?: string;
    instagram?: string;
    website?: string;
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'artist' | 'supervisor';
  avatar_url?: string;
  genre?: string;
  socials?: {
    spotify?: string;
    appleMusic?: string;
    instagram?: string;
    website?: string;
  };
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  day: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  LINEUP = 'lineup',
  EXPERIENCE = 'experience',
  TICKETS = 'tickets',
}

export interface SyncBrief {
  id: string;
  title: string;
  client: string;
  budget: string;
  genre: string;
  deadline: string;
  description: string;
  tags: string[];
}

export interface Track {
  id: string;
  userId?: string; // Added for DB ownership
  title: string;
  artist: string;
  genre: string;
  tags: string[];
  uploadDate: string;
  duration: string;
  description?: string;
  audioUrl?: string;
}

export interface Application {
  id: string;
  userId?: string; // Added for DB ownership
  briefId: string;
  trackId: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'accepted';
  submittedDate: string;
}

export interface ResearchItem {
  title: string;
  artist?: string;
  description: string;
  timestamp?: string;
  bpm?: string; // New field
  genre?: string; // New field
}

export interface ResearchResult {
  subject: string;
  type: string;
  imageUrl?: string; // New field for poster/album art
  year?: string; // New field
  results: ResearchItem[];
}

export type ViewState = 'landing' | 'auth' | 'dashboard';
export type TabView = 'browse' | 'applications' | 'library' | 'research' | 'profile';
