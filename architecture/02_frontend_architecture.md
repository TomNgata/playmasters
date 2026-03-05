# Playmasters Frontend Architecture

This SOP defines the structure and rules for the Next.js frontend application.

## Tech Stack
- **Framework**: Next.js 14/15 (App Router)
- **Language**: TypeScript (`.tsx`, `.ts`)
- **Styling**: Tailwind CSS for responsive, utility-first styling.
- **3D Engine**: DEPRIORITIZED. Replaced by high-fidelity CSS/Tailwind layouts.
- **Typography**: Barlow Condensed (Headlines), Barlow (Body), IM Fell English (Decorative Italics).
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
- `src/app/page.tsx`: The Public Modern Functional Landing Page (Nairobi themed).
- `src/app/dashboard/player/page.tsx`: Private authenticated Hub (Visceral player stat tracking & PvP rivalries).
- `src/app/login/page.tsx`: Authentication wall.
- `src/components/ui/`: Reusable Tailwind styled components.

## Visual Hierarchy (The Flyer System)
**Modular Data Panels**: The UI adopts the "Regal Meridian" registry from the Westlands kit.
- **Grids**: Strict 2-column or 4-column grids with 1px contrast borders (#FFFFFF/5).
- **Hero**: A typography-heavy data-driven header replacing the 3D scene.
- **Consistency**: High-fidelity overlays and glass-morphism panels for data visualization (e.g., Frame 7 Analytics).
- **Mobile-First**: High-legibility spacing and touch-optimized buttons.
