-- Migration for Playmasters Records and Achievements
-- Date: 2026-03-24

-- 1. Table for Global Team Stats (Editorial)
CREATE TABLE IF NOT EXISTS public.team_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    category TEXT DEFAULT 'general', -- 'general', 'achievement', 'record'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Table for Individual Achievements/Hall of Fame
CREATE TABLE IF NOT EXISTS public.league_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bowler_name TEXT NOT NULL,
    record_type TEXT NOT NULL, -- 'High Series', 'Season Average', 'Scratch High'
    value TEXT NOT NULL,
    sub_label TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed Data for Team Stats
INSERT INTO public.team_stats (label, value, category) VALUES
('Active Roster', '12+', 'general'),
('Tournaments Won', '14', 'general'),
('Official Team Headquarters', 'Nairobi HQ', 'general'),
('Established', '1994', 'general');

-- Seed Data for League Records (Formerly hardcoded in player/page.tsx)
INSERT INTO public.league_records (bowler_name, record_type, value, sub_label) VALUES
('DEEPEN', 'High Series (Season)', '444', 'Avg: 180.25 // Form: Apex'),
('HARSH', 'Season Average Leader', '180.25', 'Consistency Matrix: Diamond'),
('PARTH', 'Individual Scratch High', '429', 'High Game: 237 // Power Strike'),
('BISMARK', 'Weekly Highs (Wk 11)', '235', 'Rank: 1st (Scratch High Game)');

-- RLS Policies (Public read-only for now)
ALTER TABLE public.team_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to team_stats" ON public.team_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read access to league_records" ON public.league_records FOR SELECT USING (true);
