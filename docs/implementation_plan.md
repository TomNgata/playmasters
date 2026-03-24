# Implementation Plan: 2026 Build Guide Alignment

This plan addresses the critical and high-priority gaps identified in the GAP Analysis against the **Web Design Build Guide 2026**.

## Proposed Changes

### 1. Data Maintainability (Chapter 4)
Migrate hardcoded stats and records to Supabase to enable client autonomy.
- [MODIFY] [page.tsx](file:///c:/Users/Lenovo/Documents/playmasters/src/app/page.tsx): Fetch "Active Roster" and "Tournaments Won" from Supabase.
- [MODIFY] [player/page.tsx](file:///c:/Users/Lenovo/Documents/playmasters/src/app/dashboard/player/page.tsx): Fetch "Hall of Fame" and "Achievement" data from a new `achievements` or `records` table.
- [NEW] [records_schema.sql](file:///c:/Users/Lenovo/Documents/playmasters/supabase/migrations/20260324_records_schema.sql): DDL for the new records tables.

### 2. Conversion & Contact Flow (Chapter 5C)
Implement direct contact methods for the Nairobi market.
- [NEW] [ContactForm.tsx](file:///c:/Users/Lenovo/Documents/playmasters/src/components/ui/ContactForm.tsx): A minimalist, editorial-style contact form.
- [MODIFY] [Navbar.tsx](file:///c:/Users/Lenovo/Documents/playmasters/src/components/ui/Navbar.tsx): Add a "WhatsApp" icon/link with the `wa.me` protocol.

### 3. SEO & Analytics (Chapter 5A-B)
Configure the launch-ready infrastructure.
- [NEW] [sitemap.ts](file:///c:/Users/Lenovo/Documents/playmasters/src/app/sitemap.ts): Dynamic sitemap generation.
- [NEW] [robots.ts](file:///c:/Users/Lenovo/Documents/playmasters/src/app/robots.ts): Standard robots.txt configuration.
- [MODIFY] [layout.tsx](file:///c:/Users/Lenovo/Documents/playmasters/src/app/layout.tsx): Add Google Analytics 4 script and Open Graph tags.

### 4. Design Refinement (Chapter 3)
Consolidate typography and apply "Anti-Grid" elements.
- [MODIFY] [globals.css](file:///c:/Users/Lenovo/Documents/playmasters/src/app/globals.css): Consolidate to 2 primary typefaces (Inter and Anton).
- [MODIFY] [Hero.tsx](file:///c:/Users/Lenovo/Documents/playmasters/src/components/layout/Hero.tsx): Introduce a compositional offset to break the strict grid.

## Verification Plan

### Automated Tests
- `npm run build`: Ensure no regressions in the Next.js build.
- `npx cypress run`: (If available) to verify contact form submission.

### Manual Verification
- Visual inspection of the new Contact Form and WhatsApp link.
- Verify Supabase data fetching by updating a record in the Supabase dashboard and checking the UI.
- Check `sitemap.xml` and `robots.txt` at `/sitemap.xml` and `/robots.txt`.
