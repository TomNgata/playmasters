const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://shpqmnwwxhmvcasiqpyi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocHFtbnd3eGhtdmNhc2lxcHlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM1Mzk0NywiZXhwIjoyMDg3OTI5OTQ3fQ.CftOTtxGc9Lh1PnJ73vW3DbB34loSHrzBh-ZK_qnDtU';

const WOMEN_PLAYERS = [
    'DOROTHY', 'DARSHI', // Monday
    'SONIKA', 'JUSTINE', 'ROSE', 'NILMA', 'DASHNI', 'AMRIT', 'ALEXA' // Tuesday
];

const PLAYMASTERS_TEAMS = ['PLAYMASTERS', 'PLAYMASTERS MAVERICKS', 'PLAYMASTERS RISING'];

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

            const bowlerMatch = line.match(/^([A-Z\s\.\-]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/);
        
            if (bowlerMatch) {
                const [_, name, lw, g1, g2, serie, hdcp, hgs, hss, hgh, hsh, pins, gms, avg] = bowlerMatch;
                const cleanName = name.trim();
                const gender = WOMEN_PLAYERS.includes(cleanName.toUpperCase()) ? 'F' : 'M';
                const isPlaymaster = currentTeam && PLAYMASTERS_TEAMS.some(t => currentTeam.includes(t));

                bowlers.push({
                    bowler_name: cleanName,
                    team_name: currentTeam,
                    game1: parseInt(g1),
                    game2: parseInt(g2),
                    series: parseInt(serie),
                    gender: gender,
                    is_playmaster: isPlaymaster,
                    last_week_avg: parseFloat(avg), // Used for momentum logic
                    handicap: parseInt(hdcp),
                    high_game: parseInt(hgs),
                    high_series: parseInt(hss),
                    high_game_hdcp: parseInt(hgh),
                    high_series_hdcp: parseInt(hsh),
                    total_pins: parseInt(pins),
                    games: parseInt(gms),
                    average: parseFloat(avg),
                    division,
                    week_number: weekNumber
                });
            } else if (currentTeam && !line.includes('Bowler Statistics') && !line.includes('p = pacer score')) {
                const nameMatch = line.match(/^([A-Z\s\.\-]+)\s+/);
                if (nameMatch) {
                    const bowlerName = nameMatch[1].trim();
                    const numsStr = line.substring(nameMatch[0].length).trim();
                    const nums = numsStr.split(/\s+/).map(n => parseFloat(n));

                    if (nums.length >= 7) {
                        // Pattern: LW G1 G2 SERIE HDCP HGS HSS HGH HSH PINS GMS AVG
                        // But some lines have fewer (missing HDCP for example)
                        // We will map from the end for stability
                        const avg = nums[nums.length - 1];
                        const gms = nums[nums.length - 2];
                        const pins = nums[nums.length - 3];
                        const hsh = nums[nums.length - 4];
                        const hgh = nums[nums.length - 5];
                        const hss = nums[nums.length - 6];
                        const hgs = nums[nums.length - 7];
                        
                        // From the front
                        const lw = nums[0];
                        const g1 = nums[1];
                        const g2 = nums[2];
                        const serie = nums[3];
                        const hdcp = nums.length >= 10 ? nums[4] : 0;

                        const gender = WOMEN_PLAYERS.includes(bowlerName.toUpperCase()) ? 'F' : 'M';
                        const isPlaymaster = currentTeam && PLAYMASTERS_TEAMS.some(t => currentTeam.includes(t));

                        bowlers.push({
                            bowler_name: bowlerName,
                            team_name: currentTeam,
                            game1: g1,
                            game2: g2,
                            series: serie,
                            gender: gender,
                            is_playmaster: isPlaymaster,
                            last_week_avg: avg,
                            handicap: hdcp,
                            high_game: hgs,
                            high_series: hss,
                            high_game_hdcp: hgh,
                            high_series_hdcp: hsh,
                            total_pins: pins,
                            games: gms,
                            average: avg,
                            division: division,
                            week_number: weekNumber
                        });
                    }
                }
            }
        }
    }

    return { standings: teams, bowlers };
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

async function ingestData() {
    console.log('Parsing Monday...');
    const monData = await parseFile('raw_mon.txt', 'Monday', 11);
    console.log('Parsing Tuesday...');
    const tuesData = await parseFile('raw_tues.txt', 'Tuesday', 11);

    const allTeams = [...monData.standings, ...tuesData.standings];
    const allBowlers = [...monData.bowlers, ...tuesData.bowlers];

    console.log(`Ingesting ${allTeams.length} teams...`);
    await upsertData('ubl_team_standings?on_conflict=team_name,week_number,division', allTeams);
    
    console.log(`Ingesting ${allBowlers.length} bowlers...`);
    await upsertData('ubl_bowler_stats?on_conflict=bowler_name,team_name,week_number,division', allBowlers);

    console.log('Ingestion Complete!');
}

ingestData().catch(err => {
    console.error(err);
    process.exit(1);
});
