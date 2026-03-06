const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://shpqmnwwxhmvcasiqpyi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocHFtbnd3eGhtdmNhc2lxcHlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM1Mzk0NywiZXhwIjoyMDg3OTI5OTQ3fQ.CftOTtxGc9Lh1PnJ73vW3DbB34loSHrzBh-ZK_qnDtU';

async function parseFile(filename, division, weekNumber) {
    const rawData = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
    const lines = rawData.split('\n').filter(l => l.trim() !== '');

    let parsingTeams = true;
    let currentTeam = '';

    const teams = [];
    const bowlers = [];

    for (const line of lines) {
        if (line.includes('Bowler Statistics')) {
            parsingTeams = false;
            continue;
        }

        if (parsingTeams) {
            const teamMatch = line.match(/^\s*\d+\s+\d+\s+([A-Z0-9\s]+?)\s+(?:I\s+)?(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
            if (teamMatch && !line.includes('League Team Standings') && !line.includes('Id Team Name')) {
                const teamName = teamMatch[1].trim();
                teams.push({
                    team_name: teamName,
                    won: parseFloat(teamMatch[2]),
                    lost: parseFloat(teamMatch[3]),
                    total_pins: parseInt(teamMatch[4], 10),
                    high_game: parseInt(teamMatch[5], 10),
                    high_series: parseInt(teamMatch[6], 10),
                    week_number: weekNumber,
                    division: division
                });
            }
        } else {
            const teamHeaderMatch = line.match(/^\d+-([A-Z0-9\s\.]+)/);
            if (teamHeaderMatch) {
                currentTeam = teamHeaderMatch[1].trim();
                continue;
            }

            if (currentTeam && !line.includes('Bowler Statistics') && !line.includes('p = pacer score')) {
                const nameMatch = line.match(/^([A-Z\s\.\-]+)\s+/);
                if (nameMatch) {
                    const bowlerName = nameMatch[1].trim();
                    const numsStr = line.substring(nameMatch[0].length).trim();
                    const nums = numsStr.split(/\s+/).map(n => parseFloat(n));

                    if (nums.length >= 7) {
                        const avg = nums[nums.length - 1];
                        const gms = nums[nums.length - 2];
                        const pins = nums[nums.length - 3];
                        const hss = nums[nums.length - 6];
                        const hgs = nums[nums.length - 7];

                        bowlers.push({
                            bowler_name: bowlerName,
                            team_name: currentTeam,
                            games: gms,
                            average: avg,
                            high_game: hgs,
                            high_series: hss,
                            total_pins: pins,
                            week_number: weekNumber,
                            division: division
                        });
                    }
                }
            }
        }
    }

    return { teams, bowlers };
}

async function upsertData(table, data) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to upsert ${table}: ${response.status} ${errText}`);
    }
}

async function ingest() {
    console.log('Parsing Monday...');
    const monData = await parseFile('raw_mon.txt', 'Monday', 11);
    console.log('Parsing Tuesday...');
    const tuesData = await parseFile('raw_tues.txt', 'Tuesday', 11);

    const allTeams = [...monData.teams, ...tuesData.teams];
    const allBowlers = [...monData.bowlers, ...tuesData.bowlers];

    console.log(`Ingesting ${allTeams.length} teams...`);
    await upsertData('ubl_team_standings', allTeams);
    
    console.log(`Ingesting ${allBowlers.length} bowlers...`);
    await upsertData('ubl_bowler_stats', allBowlers);

    console.log('Ingestion Complete!');
}

ingest().catch(err => {
    console.error(err);
    process.exit(1);
});
