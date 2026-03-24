# UBL Season 16 ETL Pipeline

This directory contains the Node.js scripts for extracting, normalizing, and ingesting UBL (Unified Bowling League) result data from PDF formats into the Playmasters Supabase database.

## ⚙️ Configuration

The scripts use the following environment variables (from `.env`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Required for bypass of RLS during ingestion)

## 🛠️ Core Scripts

### 1. `inventory_entities.mjs`
Analyzes the `extracted_data.json` to identify unique divisions, teams, and players across the entire dataset.

### 2. `seed_entities.mjs`
Seeds the identified teams and player profiles into the database. It handles idempotent upserts to prevent duplicate records.

### 3. `extract_matches_and_scores.mjs`
The main ingestion engine.
- **Lane Pairing:** Groups lanes (e.g., 1-2, 3-4) into distinct matches.
- **Granular Scoring:** Extracts individual game scores for every player.
- **Points Extraction:** Parses the "Last Week" table to distribute league points (Won/Lost) to each match.

## 📊 Processing Workflow

1.  **Extract:** Run `extract_league_data.mjs` to parse raw PDF text (saved to `extracted_data.json`).
2.  **Inventory:** Run `inventory_entities.mjs` to verify teams and players.
3.  **Seed:** Run `seed_entities.mjs` to populate the `teams` and `profiles` tables.
4.  **Ingest:** Run `extract_matches_and_scores.mjs` to populate the `matches` and `game_scores` tables.

## 🛠️ Troubleshooting
- **Regex Misses:** If a PDF format changes, update the regex patterns in `extract_matches_and_scores.mjs`.
- **Team Mapping:** Ensure team names in the PDF match the `cleanName` logic for consistent mapping.
- **Timeout:** Ingestion of 68+ files takes ~1-2 minutes. Ensure your Supabase connection string is stable.
