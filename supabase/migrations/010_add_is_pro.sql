-- Migration: Add is_pro, role, full_name, and updated_at to profiles if missing, and establish correct constraints

DO $$ BEGIN
  CREATE TYPE public.role AS ENUM ('composer', 'producer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role public.role,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false NOT NULL;

-- Populate values
UPDATE public.profiles SET full_name = username WHERE full_name IS NULL;

UPDATE public.profiles p
SET role = 'composer'::public.role
WHERE role IS NULL AND EXISTS (SELECT 1 FROM public.composers c WHERE c.profile_id = p.id);

UPDATE public.profiles p
SET role = 'producer'::public.role
WHERE role IS NULL AND EXISTS (SELECT 1 FROM public.producers pr WHERE pr.profile_id = p.id);

UPDATE public.profiles SET role = 'composer'::public.role WHERE role IS NULL;

-- Make role NOT NULL
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Delete orphaned child rows to prevent foreign key constraint violations
DELETE FROM public.submissions WHERE composer_id IN (SELECT id FROM public.composers WHERE profile_id NOT IN (SELECT id FROM public.profiles));
DELETE FROM public.tracks WHERE composer_id IN (SELECT id FROM public.composers WHERE profile_id NOT IN (SELECT id FROM public.profiles));
DELETE FROM public.outreach WHERE composer_id IN (SELECT id FROM public.composers WHERE profile_id NOT IN (SELECT id FROM public.profiles));
DELETE FROM public.composers WHERE profile_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.briefs WHERE producer_id IN (SELECT id FROM public.producers WHERE profile_id NOT IN (SELECT id FROM public.profiles));
DELETE FROM public.producers WHERE profile_id NOT IN (SELECT id FROM public.profiles);

-- Establish foreign keys
DO $$ BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.composers ADD CONSTRAINT composers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.producers ADD CONSTRAINT producers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
