const fs = require('fs');
const path = require('path');

const DATA = JSON.parse(fs.readFileSync('extraction_temp/squad_data.json', 'utf8'));
const SQL_FILE = 'extraction_temp/seed_data.sql';

function escape(str) {
    if (!str) return 'NULL';
    return "'" + str.toString().replace(/'/g, "''") + "'";
}

// Rewriting for atomicity and simplicity
function generateRobust() {
    let sql = `BEGIN;\n\n`;
    
    // Season & Divisions
    sql += `INSERT INTO public.seasons (name, start_date, end_date) VALUES ('UBL Season 16', '2025-11-04', '2026-04-28') ON CONFLICT (name) DO NOTHING;\n`;
    
    // Use subqueries for IDs
    const getSeason = `(SELECT id FROM public.seasons WHERE name = 'UBL Season 16')`;
    
    ['Monday', 'Tuesday', 'Wednesday'].forEach(div => {
        sql += `INSERT INTO public.divisions (name, season_id) VALUES ('${div}', ${getSeason}) ON CONFLICT (name) DO NOTHING;\n`;
    });

    const blacklist = ['PAGE', 'RESULTS', 'VS', 'AVERAGE', 'LANE', 'WEEK', 'BOWLER', 'THE', 'TOTAL', 'HANDICAP', 'G1', 'G2', 'SCORE'];
    
    function isBlacklisted(name) {
        if (!name) return true;
        const upper = name.toUpperCase();
        if (blacklist.some(b => upper.includes(b))) return true;
        if (/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/.test(name)) return true; // Date patterns
        if (/^[0-9\s-]+$/.test(name)) return true; // Just numbers/dashes
        if (name.length < 2) return true;
        return false;
    }

    // Teams
    for (const [teamName, info] of Object.entries(DATA.teams)) {
        if (isBlacklisted(teamName)) continue;
        const getDiv = `(SELECT id FROM public.divisions WHERE name = '${info.division}')`;
        sql += `INSERT INTO public.teams (name, division_id, season_id) VALUES (${escape(teamName)}, ${getDiv}, ${getSeason}) ON CONFLICT (name, division_id, season_id) DO NOTHING;\n`;
    }

    // Players
    for (const [playerName, info] of Object.entries(DATA.players)) {
        if (isBlacklisted(playerName)) continue;
        const getDiv = `(SELECT id FROM public.divisions WHERE name = '${info.division}')`;
        const getTeam = `(SELECT id FROM public.teams WHERE name = ${escape(info.team)} AND division_id = ${getDiv})`;
        sql += `INSERT INTO public.players (display_name, team_id, division_id) VALUES (${escape(playerName)}, ${getTeam}, ${getDiv}) ON CONFLICT (display_name, team_id, division_id) DO NOTHING;\n`;
    }

    // Matches
    for (const [divName, divInfo] of Object.entries(DATA.divisions)) {
        const getDiv = `(SELECT id FROM public.divisions WHERE name = '${divName}')`;
        for (const [weekNum, weekInfo] of Object.entries(divInfo.weeks)) {
            weekInfo.matches.forEach(m => {
                const getTeam = `(SELECT id FROM public.teams WHERE name = (SELECT name FROM public.teams WHERE division_id = ${getDiv} LIMIT 1 OFFSET ${parseInt(m.team_number)-1}))`;
                
                m.scores.forEach(s => {
                    if (isBlacklisted(s.player)) return;
                    const getPlayer = `(SELECT id FROM public.players WHERE display_name = ${escape(s.player)} AND division_id = ${getDiv} LIMIT 1)`;
                    const teamForPlayer = `(SELECT team_id FROM public.players WHERE id = ${getPlayer})`;
                    
                    if (s.g1) sql += `INSERT INTO public.game_scores (player_id, team_id, week_number, game_number, scratch_score) VALUES (${getPlayer}, ${teamForPlayer}, ${weekNum}, 1, ${s.g1});\n`;
                    if (s.g2) sql += `INSERT INTO public.game_scores (player_id, team_id, week_number, game_number, scratch_score) VALUES (${getPlayer}, ${teamForPlayer}, ${weekNum}, 2, ${s.g2});\n`;
                });
            });
        }
    }

    sql += `\nCOMMIT;`;
    fs.writeFileSync(SQL_FILE, sql);
    console.log(`SQL seed generated: ${SQL_FILE}`);
}

generateRobust();
