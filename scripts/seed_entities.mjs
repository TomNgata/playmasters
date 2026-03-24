import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
// import dotenv from 'dotenv';
// dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const DATA_FILE = 'scripts/extracted_data.json';
const SEASON_ID = '2ea3a403-c353-4089-8e80-1ee6a7d239ad';

const DIVISION_MAP = {
    'MONDAY': 'f35668bb-0ddf-429c-a89b-2bf0d5614432',
    'TUESDAY': 'bcfdc784-e278-4683-a3c1-7b2446e9dd10',
    'WEDNESDAY': '2624e134-c8eb-452b-8ad8-25516b869607'
};

function cleanName(name) {
    if (!name) return '';
    return name.replace(/^\d+-/, '').trim();
}

async function run() {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const teamsToSeed = new Map(); // key: division_id | team_name, value: { name, division_id }
    const playersToSeed = new Map(); // key: player_name, value: { name, team_name, division_name }

    data.forEach(fileData => {
        const divId = DIVISION_MAP[fileData.division];
        if (!divId) return;

        fileData.stats.forEach(s => {
            const tName = cleanName(s.team);
            const teamKey = `${divId}|${tName}`;
            if (!teamsToSeed.has(teamKey)) {
                teamsToSeed.set(teamKey, { name: tName, division_id: divId, season_id: SEASON_ID });
            }

            if (!playersToSeed.has(s.player)) {
                playersToSeed.set(s.player, { name: s.player, team_name: tName, division_id: divId });
            }
        });
    });

    console.log(`Found ${teamsToSeed.size} teams and ${playersToSeed.size} players.`);

    // 1. Seed Teams
    const teamList = Array.from(teamsToSeed.values());
    console.log('Upserting teams...');
    const { data: seededTeams, error: teamError } = await supabase
        .from('teams')
        .upsert(teamList, { onConflict: 'name, division_id, season_id' })
        .select();

    if (teamError) {
        console.error('Error seeding teams:', teamError);
        return;
    }
    console.log(`Seeded ${seededTeams.length} teams.`);

    // Map team names to IDs for player seeding
    const teamIdMap = new Map();
    seededTeams.forEach(t => teamIdMap.set(`${t.division_id}|${t.name}`, t.id));

    // 2. Seed Players (Profiles)
    const playerList = Array.from(playersToSeed.values()).map(p => ({
        name: p.name,
        team_id: teamIdMap.get(`${p.division_id}|${p.team_name}`),
        division_id: p.division_id,
        role: 'player'
    }));

    console.log('Upserting players...');
    const { data: seededPlayers, error: playerError } = await supabase
        .from('profiles')
        .upsert(playerList, { onConflict: 'name' }) // Assuming name is unique for now
        .select();

    if (playerError) {
        console.error('Error seeding players:', playerError);
        return;
    }
    console.log(`Seeded ${seededPlayers.length} players.`);
}

run();
