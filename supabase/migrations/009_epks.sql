CREATE TABLE public.epks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Album Release', 'EP Page', 'Artist Profile')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  bio TEXT,
  tracks JSONB NOT NULL DEFAULT '[]'::jsonb,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.epks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to published EPKs or owner" ON public.epks
  FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Allow owners to insert their own EPKs" ON public.epks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow owners to update their own EPKs" ON public.epks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow owners to delete their own EPKs" ON public.epks
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for auto-updating updated_at
CREATE TRIGGER epks_updated_at BEFORE UPDATE ON public.epks
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Create unique index on slug and index on user_id
CREATE UNIQUE INDEX idx_epks_slug ON public.epks(slug);
CREATE INDEX idx_epks_user_id ON public.epks(user_id);
