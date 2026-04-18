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

-- 6. Create Division Standings Table
CREATE TABLE IF NOT EXISTS public.division_standings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division TEXT NOT NULL CHECK (division IN ('monday', 'tuesday')),
    rank INT NOT NULL,
    team_name TEXT NOT NULL,
    wins INT NOT NULL,
    losses INT NOT NULL,
    pins INT NOT NULL,
    points INT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.division_standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public division standings are viewable by everyone" ON public.division_standings FOR SELECT USING (true);

-- Initial Data
INSERT INTO public.division_standings (division, rank, team_name, wins, losses, pins, points)
VALUES 
('monday', 1, 'PLAYMASTERS', 26, 4, 13700, 52),
('monday', 2, 'AMIGOS SEGUNDO', 24, 6, 13649, 48),
('monday', 3, '4BAGGERZ NATION', 20, 10, 13814, 40),
('monday', 4, 'PLAYMASTERS MAVERICK', 19, 11, 13190, 38),
('monday', 5, 'PLAYMASTERS RISING', 12, 18, 12512, 24),
('monday', 6, 'BALLBARIANS STRIKERS', 8, 22, 12211, 16),
('monday', 7, 'MAHADEV STRIKERS', 8, 22, 11825, 16),
('monday', 8, 'NDOVU STRIKERS', 3, 27, 11056, 6),
('tuesday', 1, 'EASTLINE STARS', 22, 8, 13608, 44),
('tuesday', 2, 'AMIGOS ESTRELLA', 22, 5, 12265, 44),
('tuesday', 3, 'THE UNBOWLIVABLES', 20, 10, 13416, 40),
('tuesday', 4, '254 BOWLERS', 19, 11, 13447, 38),
('tuesday', 5, 'NOISY KINGS', 16, 14, 13259, 32),
('tuesday', 6, 'UNBOWLIVABLE STRIK', 8, 19, 10912, 16),
('tuesday', 7, 'TEAM 55', 4, 20, 9165, 8),
('tuesday', 8, 'AMIGOS SENORAS', 3, 27, 11381, 6)
ON CONFLICT DO NOTHING;
