CREATE TABLE public.radio_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_city TEXT NOT NULL,
  school TEXT NOT NULL,
  station TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  show_name TEXT,
  dj_music_dir TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  submitted TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.radio_stations ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read
CREATE POLICY "Allow read access to authenticated users" ON public.radio_stations
  FOR SELECT TO authenticated USING (true);

-- Create indexes for common searches
CREATE INDEX idx_radio_stations_station ON public.radio_stations(station);
CREATE INDEX idx_radio_stations_school ON public.radio_stations(school);
CREATE INDEX idx_radio_stations_state_city ON public.radio_stations(state_city);
