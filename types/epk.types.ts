export type EPKType = 'Album Release' | 'EP Page' | 'Artist Profile';
export type EPKStatus = 'draft' | 'published';

export interface EPKTrack {
  id: string;
  title: string;
  audioUrl?: string;
  duration?: string;
}

export interface EPKSocialLinks {
  instagram?: string;
  twitter?: string;
  spotify?: string;
  youtube?: string;
  soundcloud?: string;
  website?: string;
}

export interface EPK {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  type: EPKType;
  status: EPKStatus;
  views: number;
  image_url?: string;
  bio?: string;
  tracks: EPKTrack[];
  social_links: EPKSocialLinks;
  created_at: string;
  updated_at: string;
}
