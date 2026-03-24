-- Advanced Analytics Core Schema for UBL Season 16
-- Date: 2026-03-24

-- 1. Metadata Tables
CREATE TABLE IF NOT EXISTS public.seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- 'Monday', 'Tuesday', 'Wednesday'
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(name, season_id)
);

-- 2. Core Entities
-- Update existing teams table
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'teams') THEN
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='teams' AND column_name='division_id') THEN
            ALTER TABLE public.teams ADD COLUMN division_id UUID REFERENCES public.divisions(id);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='teams' AND column_name='season_id') THEN
            ALTER TABLE public.teams ADD COLUMN season_id UUID REFERENCES public.seasons(id);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='teams' AND column_name='status') THEN
            ALTER TABLE public.teams ADD COLUMN status TEXT DEFAULT 'ACTIVE';
        END IF;
    ELSE
        CREATE TABLE public.teams (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            division_id UUID REFERENCES public.divisions(id),
            season_id UUID REFERENCES public.seasons(id),
            status TEXT DEFAULT 'ACTIVE',
            created_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(name, division_id, season_id)
        );
    END IF;
END $$;

-- Update existing profiles table to act as players
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='profiles' AND column_name='display_name') THEN
        ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='profiles' AND column_name='usbc_number') THEN
        ALTER TABLE public.profiles ADD COLUMN usbc_number TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='profiles' AND column_name='division_id') THEN
        ALTER TABLE public.profiles ADD COLUMN division_id UUID REFERENCES public.divisions(id);
    END IF;
END $$;

-- 3. Match & Transaction Tables
-- Update existing matches table
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'matches') THEN
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='week_number') THEN
            ALTER TABLE public.matches ADD COLUMN week_number INT;
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='match_date') THEN
            ALTER TABLE public.matches ADD COLUMN match_date DATE;
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='division_id') THEN
            ALTER TABLE public.matches ADD COLUMN division_id UUID REFERENCES public.divisions(id);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='season_id') THEN
            ALTER TABLE public.matches ADD COLUMN season_id UUID REFERENCES public.seasons(id);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='home_team_id') THEN
            ALTER TABLE public.matches ADD COLUMN home_team_id UUID REFERENCES public.teams(id);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='away_team_id') THEN
            ALTER TABLE public.matches ADD COLUMN away_team_id UUID REFERENCES public.teams(id);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='home_points') THEN
            ALTER TABLE public.matches ADD COLUMN home_points DECIMAL(5,1) DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='away_points') THEN
            ALTER TABLE public.matches ADD COLUMN away_points DECIMAL(5,1) DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='home_series') THEN
            ALTER TABLE public.matches ADD COLUMN home_series INT DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='matches' AND column_name='away_series') THEN
            ALTER TABLE public.matches ADD COLUMN away_series INT DEFAULT 0;
        END IF;
    ELSE
        CREATE TABLE public.matches (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            week_number INT NOT NULL,
            match_date DATE,
            division_id UUID REFERENCES public.divisions(id),
            season_id UUID REFERENCES public.seasons(id),
            home_team_id UUID REFERENCES public.teams(id),
            away_team_id UUID REFERENCES public.teams(id),
            home_points DECIMAL(5,1) DEFAULT 0,
            away_points DECIMAL(5,1) DEFAULT 0,
            home_series INT DEFAULT 0,
            away_series INT DEFAULT 0,
            status TEXT DEFAULT 'COMPLETE',
            created_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Create game_scores table (Normalized individual scores)
CREATE TABLE IF NOT EXISTS public.game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.profiles(id),
    match_id UUID REFERENCES public.matches(id),
    team_id UUID REFERENCES public.teams(id),
    week_number INT NOT NULL,
    game_number INT NOT NULL, -- 1 or 2
    scratch_score INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Analytics Views
CREATE OR REPLACE VIEW public.season_standings AS
SELECT 
    t.id AS team_id,
    t.name AS team_name,
    d.name AS division,
    COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.home_points ELSE m.away_points END), 0) AS total_points,
    COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.home_series ELSE m.away_series END), 0) AS total_pins,
    COUNT(m.id) AS matches_played
FROM public.teams t
JOIN public.divisions d ON t.division_id = d.id
LEFT JOIN public.matches m ON t.id IN (m.home_team_id, m.away_team_id)
GROUP BY t.id, t.name, d.name;

-- 5. RLS Policies
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public select' AND tablename = 'seasons') THEN
        CREATE POLICY "Public select" ON public.seasons FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public select' AND tablename = 'divisions') THEN
        CREATE POLICY "Public select" ON public.divisions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public select' AND tablename = 'game_scores') THEN
        CREATE POLICY "Public select" ON public.game_scores FOR SELECT USING (true);
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
