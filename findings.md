# Findings

## Discovery Answers
- **North Star:** A unified 3D digital headquarters boosting team performance via data insights, fan engagement, and sponsor visibility, turning casual bowlers into optimized champions.
- **Integrations:** Slack (notifications), Shop page (merch), Contact page (sponsors), PostgreSQL/Supabase (data storage, training logs). Keys to be generated and stored in `.env` or GitHub Secrets.
- **Source of Truth:** PostgreSQL database (scores, profiles, tournaments via ETL), with JSON exports and GitHub repo (schedule.md, stats CSVs) as backups.
- **Delivery Payload:** Deployed site on Vercel from GitHub repo. Local dev via `npm run dev`. Auto-generated README/PDF docs. API endpoints for sync.
- **Behavioral Rules:** Energetic/competitive tone ("Strike like Playmasters!"). Auto-update standings/notifications. Prevent data overwrites (versioned scores). Free for players (no paywalls). Mobile-first (Nairobi on-the-go access). Do not expose raw scoring scrapers publicly.

## Research

### Next.js + Supabase Auth Approach
- **Framework**: Next.js 14 App Router (chosen) with `@supabase/ssr` package for server-side session management. The `@supabase/auth-helpers-nextjs` package is deprecated; `@supabase/ssr` is the current standard.
- **Auth Pattern**: `src/middleware.ts` intercepts all `/dashboard/*` routes. It uses a Supabase server client to validate the session cookie. Unauthenticated users are redirected to `/login`.
- **Login Page**: Email + password via `supabase.auth.signInWithPassword()`. Session is stored as an HTTP-only cookie (handled by `@supabase/ssr`'s `createServerClient`).
- **CSV Ingestion**: `POST /api/upload-csv` (Next.js Route Handler). Parses multipart/form-data, validates row headers match expected bowling frame columns, then upserts to `scores` table using the service role key (from `SUPABASE_SERVICE_ROLE_KEY` env var — never exposed to the client).
- **Spline 3D**: `@splinetool/react-spline/next` (already installed). Scene URL to be provided by user. Gracefully falls back to dark navy background on mobile or low-end devices.
- **Boilerplate Decision**: No third-party boilerplate used. Keeping the stack lean: Next.js + Tailwind + Supabase client-only. Adding `@supabase/ssr` is the only new dependency needed for auth.

## Constraints
- Mobile-first approach required.
- Raw scoring scrapers must be secured/hidden.
- No paywalls.
