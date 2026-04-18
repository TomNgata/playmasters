import fs from 'fs';
import path from 'path';

async function parseFile(filename: string, division: string, weekNumber: number) {
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
            const teamHeaderMatch = line.match(/^\d+-([A-Z0-9\s]+)/);
            if (teamHeaderMatch) {
                currentTeam = teamHeaderMatch[1].trim();
                continue;
            }

            if (currentTeam && !line.includes('Bowler Statistics') && !line.includes('p = pacer score')) {
                const nameMatch = line.match(/^([A-Z\s\.]+)\s+/);
                if (nameMatch) {
                    const bowlerName = nameMatch[1].trim();
                    const numsStr = line.substring(nameMatch[0].length).trim();
                    const nums = numsStr.split(/\s+/).map(n => parseFloat(n));

                    if (nums.length >= 7) {
                        const avg = nums[nums.length - 1];
                        const gms = nums[nums.length - 2];
                        const pins = nums[nums.length - 3];
                        const hsh = nums[nums.length - 4];
                        const hgh = nums[nums.length - 5];
                        const hss = nums[nums.length - 6];
                        const hgs = nums[nums.length - 7];
                        const hdcp = nums.length >= 8 ? nums[nums.length - 8] : 0;
                        const lw = nums[0];

                        bowlers.push({
                            bowler_name: bowlerName,
                            team_name: currentTeam,
                            games: gms,
                            average: avg,
                            high_game: hgs,
                            high_series: hss,
                            total_pins: pins,
                            week_number: weekNumber,
                            division: division,
                            last_week_score: lw,
                            handicap: hdcp,
                            high_game_hdcp: hgh,
                            high_series_hdcp: hsh
                        });
                    }
                }
            }
        }
    }

    return { teams, bowlers };
}

async function ingest() {
    console.log('Parsing Monday...');
    const monData = await parseFile('raw_mon.txt', 'Monday', 11);
    console.log('Parsing Tuesday...');
    const tuesData = await parseFile('raw_tues.txt', 'Tuesday', 11);

    const allTeams = [...monData.teams, ...tuesData.teams];
    const allBowlers = [...monData.bowlers, ...tuesData.bowlers];

    let sql = '-- UBL Ingestion SQL\n\n';
    
    for (const t of allTeams) {
        sql += `INSERT INTO ubl_team_standings (team_name, won, lost, total_pins, high_game, high_series, week_number, division) VALUES ('${t.team_name.replace(/'/g, "''")}', ${t.won}, ${t.lost}, ${t.total_pins}, ${t.high_game}, ${t.high_series}, ${t.week_number}, '${t.division}') ON CONFLICT (team_name, week_number, division) DO UPDATE SET won=EXCLUDED.won, lost=EXCLUDED.lost, total_pins=EXCLUDED.total_pins, high_game=EXCLUDED.high_game, high_series=EXCLUDED.high_series;\n`;
    }
    
    sql += '\n';

    for (const b of allBowlers) {
        sql += `INSERT INTO ubl_bowler_stats (bowler_name, team_name, games, average, high_game, high_series, total_pins, week_number, division, last_week_score, handicap, high_game_hdcp, high_series_hdcp) VALUES ('${b.bowler_name.replace(/'/g, "''")}', '${b.team_name.replace(/'/g, "''")}', ${b.games}, ${b.average}, ${b.high_game}, ${b.high_series}, ${b.total_pins}, ${b.week_number}, '${b.division}', ${b.last_week_score}, ${b.handicap}, ${b.high_game_hdcp}, ${b.high_series_hdcp}) ON CONFLICT (bowler_name, team_name, week_number, division) DO UPDATE SET games=EXCLUDED.games, average=EXCLUDED.average, high_game=EXCLUDED.high_game, high_series=EXCLUDED.high_series, total_pins=EXCLUDED.total_pins, last_week_score=EXCLUDED.last_week_score, handicap=EXCLUDED.handicap, high_game_hdcp=EXCLUDED.high_game_hdcp, high_series_hdcp=EXCLUDED.high_series_hdcp;\n`;
    }

    fs.writeFileSync(path.join(__dirname, 'insert.sql'), sql);
    console.log('SQL generated at insert.sql');
}

ingest().catch(console.error);
