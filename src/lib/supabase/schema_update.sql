-- SQL Migration: Team & Role Support
-- Run this in your Supabase SQL Editor

-- 1. Create Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Update Profiles Table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'player',
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id);

-- 3. Create a default team if none exists
INSERT INTO public.teams (name) 
VALUES ('Playmasters Alpha')
ON CONFLICT DO NOTHING;

-- 4. Set the admin user as a captain (Manual step: replace with your actual UID if needed)
-- UPDATE public.profiles SET role = 'captain' WHERE name ILIKE 'admin%';

-- 5. Enable RLS (Basics)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
