const fs = require('fs');
const path = require('path');
const { PDFParse } = require('../extraction_temp/node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs');

const DATA_DIR = path.resolve('Data/renainfluenceplaymastersproject (2)');
const OUTPUT_FILE = path.resolve('extraction_temp/squad_data.json');

async function processAll() {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
    console.log(`Found ${files.length} PDFs to process.`);

    const results = {
        meta: { season: 'Season 16', processed_at: new Date().toISOString() },
        divisions: {},
        players: {},
        teams: {}
    };

    for (const file of files) {
        console.log(`Processing: ${file}`);
        try {
            const filePath = path.join(DATA_DIR, file);
            const dataBuffer = fs.readFileSync(filePath);
            const parser = new PDFParse({ data: dataBuffer });
            const result = await parser.getText();
            const text = result.text;

            let division = 'Unknown';
            if (text.includes('MONDAY')) division = 'Monday';
            else if (text.includes('TUESDAY')) division = 'Tuesday';
            else if (text.includes('WEDNESDAY')) division = 'Wednesday';

            const weekMatch = text.match(/Week\s+(\d+)/i) || file.match(/Wk(\d+)/i);
            const week = weekMatch ? parseInt(weekMatch[1]) : 0;

            if (division === 'Unknown' || week === 0) {
                if (file.toLowerCase().startsWith('mon')) division = 'Monday';
                if (file.toLowerCase().startsWith('tues')) division = 'Tuesday';
                if (file.toLowerCase().startsWith('wed')) division = 'Wednesday';
            }

            if (!results.divisions[division]) results.divisions[division] = { weeks: {} };
            if (!results.divisions[division].weeks[week]) results.divisions[division].weeks[week] = { matches: [] };

            const bowlerStatsRegex = /(\d+)-([^\n]+)\n([\s\S]+?)(?=\n\d+-|$|Page|League)/g;
            let match;
            while ((match = bowlerStatsRegex.exec(text)) !== null) {
                const teamName = match[2].trim();
                const playersText = match[3].trim();
                results.teams[teamName] = { division };
                const playerLines = playersText.split('\n');
                playerLines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 5 && isNaN(parts[0])) {
                        const playerName = parts[0];
                        results.players[playerName] = { team: teamName, division };
                    }
                });
            }

            const recapRegex = /Team\s+(\d+)\n[\s\S]+?Players\s+HDCP\s+TOTAL\s+Game 1\s+Game 2\n([\s\S]+?)(?=Points Won|Team|\d+\s+of\s+30)/g;
            let matchRecap;
            while ((matchRecap = recapRegex.exec(text)) !== null) {
                const teamNum = matchRecap[1];
                const rows = matchRecap[2].trim().split('\n');
                const matchData = { team_number: teamNum, week, division, scores: [] };
                rows.forEach(row => {
                    const p = row.trim().split(/\s+/);
                    if (p.length >= 5) {
                        matchData.scores.push({
                            player: p[0],
                            g1: parseInt(p[p.length-3]),
                            g2: parseInt(p[p.length-2])
                        });
                    }
                });
                const pointsText = text.substring(recapRegex.lastIndex, recapRegex.lastIndex + 200);
                const pointsMatch = pointsText.match(/Points Won\s+Points Lost\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/i);
                if (pointsMatch) {
                    matchData.points_won = parseFloat(pointsMatch[1]);
                    matchData.points_lost = parseFloat(pointsMatch[2]);
                }
                results.divisions[division].weeks[week].matches.push(matchData);
            }
            await parser.destroy();
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`Processing complete. Data saved to ${OUTPUT_FILE}`);
}
processAll().catch(console.error);
