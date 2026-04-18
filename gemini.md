# Project Constitution

## Data Schemas
### Player Profile Schema (Initial Draft)
- `id`: UUID (Primary Key)
- `name`: String
- `avatar_url`: String
- `is_active`: Boolean
- `stats`: JSONB (averages, high scores, etc.)
- `created_at`: Timestamp

### Match/Score Schema (Initial Draft)
- `id`: UUID (Primary Key)
- `match_id`: UUID
- `player_id`: UUID (Foreign Key -> Players)
- `frame_scores`: JSONB (Array of frame data)
- `total_score`: Integer
- `version`: Integer (for preventing overwrites)
- `timestamp`: Timestamp

*(Schemas to be refined during architecture phase with full Supabase DDL)*

## Behavioral Rules
- Prioritize reliability over speed.
- Never guess at business logic.
- Coding ONLY begins once the Payload shape is confirmed.
- `gemini.md` is law; update only when schema changes, a rule is added, or architecture is modified.
- **Tone & Brand:** Energetic, competitive, and distinctly "Nairobi" ('Strike like Playmasters!'). Authentic, real-world imagery of various Nairobi bowling alleys (e.g., Pins Entertainment, Village Bowl, Strikez) reflecting that Playmasters is a multi-venue team, rather than generic stock aesthetics.
- **Functionality:** 
  - Auto-updates standings/notifications, prevents data overwrites (versioned scores).
  - **Modern Functional Layout:** Replaces 3D elements with a high-contrast, structured grid system inspired by professional kits (Reference: Westlands Election Flyers). Emphasis on data panels, "Glass Morphism" overlays, and refined typography (Barlow Condensed).
  - Generates shareable PNG tournament bracket results automatically for Instagram.
  - Provide player-vs-player comparison tools to build rivalry and engagement.
- **Audience:** Split UX cleanly between Public outward-facing PR (Scrollable Landing Page) and Private inward-facing value (Authenticated Team Hub for analytics/uploading).
- **Access:** Free for players, but analytics and score uploading must be gated behind Supabase Authentication. Mobile-first design inspired by "Nairobi" on-the-go functional aesthetics.
- **Data Entry:** Manual CSV upload from authenticated players is the PRIMARY path for data (must be <2 min frictionless).
- **Security:** Do not expose raw scoring scrapers publicly.

## Architectural Invariants
- 3-Layer Architecture:
  1. Layer 1 (Architecture): SOPs in Markdown in `architecture/`. Update SOP before modifying tool code.
  2. Layer 2 (Navigation): Reasoning routing layer.
  3. Layer 3 (Tools): Deterministic, atomic, testable Python scripts in `tools/`.
- Local ephemeral files go into `.tmp/`.
- Credentials go in `.env`.
