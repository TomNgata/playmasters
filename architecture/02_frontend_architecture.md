# Playmasters Frontend Architecture

This SOP defines the structure and rules for the Next.js frontend application.

## Tech Stack
- **Framework**: Next.js 14/15 (App Router)
- **Language**: TypeScript (`.tsx`, `.ts`)
- **Styling**: Tailwind CSS for responsive, utility-first styling.
- **3D Engine**: `@splinetool/react-spline` (Specifically using the `/next` adapter for SSR support and native blurred placeholders, per the Spline Skill guide).
- **Database Client**: `@supabase/supabase-js`

## Core Principles
1. **Nairobi Authenticity**: The UI must reflect Strikez at Westgate (dark, neon, tangible) instead of generic sports branding.
2. **Audience Split (Public vs. Private Hub)**:
   - **Public Landing (`/`)**: A long-scrolling PR outward-facing page (About, Gallery, Sponsors).
   - **Private Team Hub (`/dashboard`)**: Hidden behind Supabase Authentication. Visceral, competitive, focused on personal stats. 
   - **"Frame 7 Headline"**: Inside the private hub, the foremost visible analytic MUST highlight focus drop-offs or clutch performances starting at Frame 7 to create a compelling narrative.
   - **Admin Tools**: Integrated securely alongside player stats for frictionless CSV uploads.
3. **No Paywalls**: All functions are free for team members, but authentication is required to access the hub.

## Component Structure
- `src/app/page.tsx`: The Public 3D HQ Scrollable Landing Page (Nairobi themed).
- `src/app/dashboard/player/page.tsx`: Private authenticated Hub (Visceral player stat tracking & PvP rivalries).
- `src/app/login/page.tsx`: Authentication wall.
- `src/components/ui/`: Reusable Tailwind styled components.

## 3D Integration Rule
**Spline Data-Driven Approach**: The 3D Hero must utilize `Spline` from `@splinetool/react-spline/next`. The Spline iframe/asset provided must be interacted with. If the asset is purely decorative, we use a static fallback. Heavy models must be lazy-loaded to ensure mobile browser stability (following the `REACT_INTEGRATION.md` Skill guide).
