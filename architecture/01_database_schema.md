# Playmasters Database Schema (Supabase)

This document serves as the technical SOP for Playmasters' Supabase database.
All changes to Supabase DDL must be documented here first before applied.

## Core Tables

### 1. `profiles`
Stores player information.
- `id`: `uuid` PRIMARY KEY (references `auth.users` if using Supabase Auth later)
- `name`: `text` NOT NULL
- `avatar_url`: `text`
- `role`: `text` DEFAULT 'player' // 'player' or 'captain'
- `team_id`: `uuid` REFERENCES `teams(id)`
- `stats`: `jsonb` DEFAULT '{}' (e.g., {"highest_score": 300, "average_score": 180})
- `is_active`: `boolean` DEFAULT true
- `created_at`: `timestamptz` DEFAULT now()

### 2. `teams`
Bowling units (Max 4-8 players).
- `id`: `uuid` PRIMARY KEY DEFAULT gen_random_uuid()
- `name`: `text` NOT NULL
- `created_at`: `timestamptz` DEFAULT now()

### 3. `tournaments`
Stores events.
- `id`: `uuid` PRIMARY KEY DEFAULT gen_random_uuid()
- `name`: `text` NOT NULL
- `date`: `timestamptz` NOT NULL
- `status`: `text` (e.g., 'upcoming', 'active', 'completed')
- `created_at`: `timestamptz` DEFAULT now()

### 4. `matches`
A specific game or match within a tournament.
- `id`: `uuid` PRIMARY KEY DEFAULT gen_random_uuid()
- `tournament_id`: `uuid` REFERENCES `tournaments(id)`
- `status`: `text` (e.g., 'in-progress', 'completed')
- `created_at`: `timestamptz` DEFAULT now()

### 5. `scores`
Individual player scores linked to a match.
- `id`: `uuid` PRIMARY KEY DEFAULT gen_random_uuid()
- `match_id`: `uuid` REFERENCES `matches(id)`
- `player_id`: `uuid` REFERENCES `profiles(id)`
- `frame_scores`: `jsonb` NOT NULL DEFAULT '[]' // Array of 10-12 frame evaluations
- `total_score`: `integer` DEFAULT 0
- `version`: `integer` DEFAULT 1 // For optimistic concurrency (preventing overwrites)
- `updated_at`: `timestamptz` DEFAULT now()

## Constraints & Security
- **Version Control on Scores**: Updates to `scores` must include `version = version + 1` to prevent overwrites from alley tablets sending stale JSON dumps.
- **RLS**: Row Level Security will be enabled.
-   - Read access: Public (no paywalls, visible standings).
-   - Write access: Restricted to authenticated service roles (API Keys from the ETL process). Raw scraper logic is NOT public.
