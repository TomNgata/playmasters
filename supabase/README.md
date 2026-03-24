# Supabase Data Architecture & Analytics

This directory documents the Supabase backend for Playmasters Kenya. The architecture focuses on high-fidelity performance tracking and real-time standings for the UBL League.

## 🗄️ Database Schema

The core schema is defined in `migrations/20260324_analytics_core.sql`.

### 1. `seasons`
Tracks league seasons (e.g., UBL Season 16).
- **Key Fields:** `id`, `name`, `start_date`, `end_date`, `status`.

### 2. `divisions`
Categorizes teams and matches by day (Monday, Tuesday, Wednesday).
- **Key Fields:** `id`, `name`, `season_id`.

### 3. `teams`
Records league teams with division and season associations.
- **Key Fields:** `id`, `name`, `division_id`, `season_id`.
- **Constraint:** Unique `name` + `division_id` + `season_id` to prevent duplicates.

### 4. `profiles` (Players)
Extends standard Supabase profiles to include league-specific metadata.
- **Key Fields:** `id`, `display_name`, `team_id`, `division_id`, `usbc_number`.

### 5. `matches`
Transactional record of weekly league matches.
- **Key Fields:** `week_number`, `home_team_id`, `away_team_id`, `home_points`, `away_points`.
- **Constraint:** Unique `season_id` + `division_id` + `week_number` + `team_pair` to support idempotent ingestion.

### 6. `game_scores`
Normalized record for every individual game bowled.
- **Fields:** `player_id`, `match_id`, `team_id`, `game_number`, `scratch_score`.

## 📊 Analytics Views

### `season_standings_v2`
Aggregates match points and pins in real-time.
- **Logic:** Sums points won/lost from `matches` and total pins from `game_scores`.
- **Performance:** Indexed for rapid frontend leaderboard rendering.

## 🔐 Security (RLS)
The database uses Row Level Security (RLS) to ensure data integrity:
- **Public access:** Enabled for `seasons`, `divisions`, and `standings` via SELECT policies.
- **Authenticated access:** Required for score uploads and profile management.
- **Service Role:** The ETL pipeline bypasses RLS during automated ingestion to ensure 100% data fidelity.

---
**"Strike like Playmasters!"** 🎳💨
