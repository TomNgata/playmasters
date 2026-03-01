# Data Sync & CSV Ingestion Strategy

This SOP outlines how scores are retrieved. Per Sonnet 4.6 feedback, the primary ingestion path is manual CSV upload by players. Tablet ETL is deprioritized to avoid endless blocking.

## Goal
Securely and frictionlessly receive score updates and populate the `scores` and `matches` database tables using user-uploaded CSV files.

## Process
1. **The Source**: Players upload standard CSV files from their phones (< 2 min friction).
2. **The Ingestion Endpoint (`/api/upload-csv`)**:
   - The Next.js app exposes a secure upload endpoint.
   - It parses the CSV, validates the format against expected game columns (Frames 1-10 headers).
3. **Collision Prevention**:
   - The parser evaluates the incoming match data.
   - It checks the `version` column against the database and executes an upsert if the data is newer.

## The Admin Override
In the future, a `/api/sync` route for tablet ETL logic can be constructed using an isolated scraper, but CSV is the MVP required for launch.
