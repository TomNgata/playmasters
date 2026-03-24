import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { PDFParse } from 'pdf-parse';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const DATA_DIR = 'c:\\Users\\Lenovo\\Documents\\playmasters\\Data\\renainfluenceplaymastersproject (2)';
const SEASON_ID = '2ea3a403-c353-4089-8e80-1ee6a7d239ad';

const DIVISION_MAP = {
    'MONDAY': 'f35668bb-0ddf-429c-a89b-2bf0d5614432',
    'TUESDAY': 'bcfdc784-e278-4683-a3c1-7b2446e9dd10',
    'WEDNESDAY': '2624e134-c8eb-452b-8ad8-25516b869607'
};

function cleanName(name) {
    if (!name) return '';
    return name.replace(/^\d+ -/, '').replace(/^\d+-/, '').trim();
}

async function getTeamsAndPlayers() {
    const { data: teams } = await supabase.from('teams').select('id, name, division_id');
    const { data: profiles } = await supabase.from('profiles').select('id, name, team_id');
    return { teams, profiles };
}

async function run() {
    console.log('Fetching existing entities from Supabase...');
    const { teams, profiles } = await getTeamsAndPlayers();
    const teamMap = new Map();
    teams.forEach(t => teamMap.set(`${t.division_id}|${t.name}`, t.id));
    const playerMap = new Map();
    profiles.forEach(p => playerMap.set(p.name, p.id));

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'));
    
    for (const file of files) {
        console.log(`Processing ${file}...`);
        try {
            const dataBuffer = fs.readFileSync(path.join(DATA_DIR, file));
            const parser = new PDFParse({ data: dataBuffer });
            const result = await parser.getText();
            const text = result.text;

            const weekMatch = text.match(/Week\s+(\d+)\s+of\s+(\d+)/i) || text.match(/Week\s+Number\s+(\d+)/i) || text.match(/Week #\s+(\d+)/i);
            const divisionMatch = text.match(/MONDAY|TUESDAY|WEDNESDAY/i);
            if (!weekMatch || !divisionMatch) continue;

            const week = parseInt(weekMatch[1]);
            const divName = divisionMatch[0].toUpperCase();
            const divId = DIVISION_MAP[divName];

            // 1. Map Team Numbers to IDs found in this PDF
            console.log(`Found division ${divName}, week ${week}`);

            const teamNumToId = new Map();
            const recapSections = text.split(/League Scores Verification Recap Sheet|League Scores Verification RecapSheet/);
            
            // 2. Extract Points from "Last Week" table
            const teamPointsMap = new Map(); // teamNum -> points
            const lastWeekTableMatch = text.match(/Last Week[^\n]*\n([\s\S]+?)(?=\n[A-Z]|\n\n|$)/i);
            if (lastWeekTableMatch) {
                const tableLines = lastWeekTableMatch[1].split('\n');
                tableLines.forEach(line => {
                    const row = line.trim().split(/\s+/);
                    // Match pattern: Num G1 G2 Total Points ...
                    // e.g. 6 648 642 1290 2
                    for (let i = 0; i < row.length - 4; i += 5) {
                        const num = parseInt(row[i]);
                        const pts = parseFloat(row[i+4]);
                        if (!isNaN(num)) teamPointsMap.set(num, pts);
                    }
                });
            }

            // Temporary storage for lane-based data
            const laneData = new Map(); // laneNum -> { teamId, teamNum, scores: [] }

            recapSections.slice(1).forEach(recapSection => {
                const laneSubSections = recapSection.split(/Lane[^\d]+/i);
                laneSubSections.slice(1).forEach(recap => {
                    const laneMatch = recap.match(/^(\d+)/);
                    const teamLineMatch = recap.match(/(\d+)\s*[-–—]\s*(.+?)(?=\n|$)/i);
                    
                    if (!laneMatch || !teamLineMatch) return;

                    const laneNum = parseInt(laneMatch[1]);
                    const teamNum = parseInt(teamLineMatch[1]);
                    const teamName = cleanName(teamLineMatch[2].trim());
                    const teamId = teamMap.get(`${divId}|${teamName}`);
                    
                    if (!teamId) {
                        console.warn(`Team not found in map: ${teamName} (${divId})`);
                        return;
                    }
                    
                    console.log(`Processing Lane ${laneNum} for Team ${teamName} (Team ${teamNum})`);

                    const playerScores = [];
                    const lines = recap.split('\n');
                    lines.forEach(line => {
                        const pMatch = line.match(/^([A-Z. ]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
                        if (pMatch && !pMatch[1].match(/POINTS|SCRATCH|TEAM|TOTAL|AVG|PLAYERS/i)) {
                            const pName = pMatch[1].trim();
                            const pId = playerMap.get(pName);
                            if (pId) {
                                playerScores.push({
                                    player_id: pId,
                                    game1: parseInt(pMatch[4]),
                                    game2: parseInt(pMatch[5])
                                });
                            }
                        }
                    });

                    laneData.set(laneNum, { teamId, teamNum, scores: playerScores });
                });
            });

            // Group lanes into matches (1-2, 3-4, 5-6, 7-8)
            const lanePairs = [[1, 2], [3, 4], [5, 6], [7, 8]];
            for (const [l1, l2] of lanePairs) {
                const d1 = laneData.get(l1);
                const d2 = laneData.get(l2);
                if (d1 && d2) {
                    // Create Match
                    const homePoints = teamPointsMap.get(d1.teamNum) || 0;
                    const awayPoints = teamPointsMap.get(d2.teamNum) || 0;

                    const { data: matchData, error: matchError } = await supabase
                        .from('matches')
                        .upsert({
                            season_id: SEASON_ID,
                            division_id: divId,
                            week_number: week,
                            home_team_id: d1.teamId,
                            away_team_id: d2.teamId,
                            home_points: homePoints,
                            away_points: awayPoints,
                            status: 'completed'
                        }, { onConflict: 'season_id, division_id, week_number, home_team_id, away_team_id' })
                        .select()
                        .single();

                    if (matchError) {
                        console.error(`Error upserting match (Week ${week}):`, matchError.message);
                    }

                    if (!matchError && matchData) {
                        const gScores = [];
                        // Process Team 1 scores
                        d1.scores.forEach(s => {
                            gScores.push({ match_id: matchData.id, player_id: s.player_id, team_id: d1.teamId, week_number: week, game_number: 1, scratch_score: s.game1 });
                            gScores.push({ match_id: matchData.id, player_id: s.player_id, team_id: d1.teamId, week_number: week, game_number: 2, scratch_score: s.game2 });
                        });
                        // Process Team 2 scores
                        d2.scores.forEach(s => {
                            gScores.push({ match_id: matchData.id, player_id: s.player_id, team_id: d2.teamId, week_number: week, game_number: 1, scratch_score: s.game1 });
                            gScores.push({ match_id: matchData.id, player_id: s.player_id, team_id: d2.teamId, week_number: week, game_number: 2, scratch_score: s.game2 });
                        });

                        if (gScores.length > 0) {
                            console.log(`Upserting ${gScores.length} scores for match ${matchData.id}...`);
                            const { error: scoreError } = await supabase.from('game_scores').upsert(gScores, { onConflict: 'match_id, player_id, game_number' });
                            if (scoreError) console.error('Error upserting scores:', scoreError.message);
                        }
                    }
                }
            }
        } catch (err) {
            console.error(`Error in ${file}:`, err);
        }
    }
    console.log('Ingestion complete.');
}

run();
