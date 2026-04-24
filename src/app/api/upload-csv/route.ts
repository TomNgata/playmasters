import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ─── Expected CSV header columns ────────────────────────────────────────────
// player_name, match_id, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, total_score
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_HEADERS = [
    'player_name', 'match_id',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10',
    'total_score',
];

function parseCSV(text: string): Record<string, string>[] {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

    // Validate required headers
    const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
        throw new Error(`CSV is missing required columns: ${missing.join(', ')}`);
    }

    return lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
    });
}

export async function POST(req: NextRequest) {
    try {
        // ── 1. Auth check ──────────────────────────────────────────────────────
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 });
        }

        // ── 2. Parse multipart form ────────────────────────────────────────────
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded. Expected a field named "file".' }, { status: 400 });
        }
        if (!file.name.endsWith('.csv')) {
            return NextResponse.json({ error: 'Only .csv files are accepted.' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return NextResponse.json({ error: 'File size exceeds the 5MB limit.' }, { status: 400 });
        }

        const text = await file.text();
        const rows = parseCSV(text);

        // ── 3. Process rows ────────────────────────────────────────────────────
        const results = { inserted: 0, skipped: 0, errors: [] as string[] };

        for (const row of rows) {
            try {
                // Resolve player_id by name (case-insensitive)
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('id')
                    .ilike('name', row.player_name)
                    .single();

                if (profileError || !profile) {
                    results.errors.push(`Row skipped — player "${row.player_name}" not found in profiles.`);
                    results.skipped++;
                    continue;
                }

                // Build frame_scores JSON array
                const frameScores = [
                    row.f1, row.f2, row.f3, row.f4, row.f5,
                    row.f6, row.f7, row.f8, row.f9, row.f10,
                ].map((v, i) => ({ frame: i + 1, score: parseInt(v, 10) || 0 }));

                const totalScore = parseInt(row.total_score, 10) || 0;

                // Fetch current version for optimistic concurrency
                const { data: existing } = await supabase
                    .from('scores')
                    .select('id, version')
                    .eq('match_id', row.match_id)
                    .eq('player_id', profile.id)
                    .maybeSingle();

                if (existing) {
                    // Update only if incoming version is newer
                    const { error: updateError } = await supabase
                        .from('scores')
                        .update({
                            frame_scores: frameScores,
                            total_score: totalScore,
                            version: existing.version + 1,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', existing.id)
                        .eq('version', existing.version); // Concurrency guard

                    if (updateError) {
                        results.errors.push(`Row for "${row.player_name}" — update failed: ${updateError.message}`);
                        results.skipped++;
                    } else {
                        results.inserted++;
                    }
                } else {
                    // Insert new score row
                    const { error: insertError } = await supabase
                        .from('scores')
                        .insert({
                            match_id: row.match_id,
                            player_id: profile.id,
                            frame_scores: frameScores,
                            total_score: totalScore,
                            version: 1,
                        });

                    if (insertError) {
                        results.errors.push(`Row for "${row.player_name}" — insert failed: ${insertError.message}`);
                        results.skipped++;
                    } else {
                        results.inserted++;
                    }
                }
            } catch (rowErr) {
                results.errors.push(`Unexpected error on row "${row.player_name}": ${String(rowErr)}`);
                results.skipped++;
            }
        }

        return NextResponse.json({
            message: `CSV processed. ${results.inserted} row(s) upserted, ${results.skipped} skipped.`,
            ...results,
        });

    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
