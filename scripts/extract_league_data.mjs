import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

const DATA_DIR = 'c:\\Users\\Lenovo\\Documents\\playmasters\\Data\\renainfluenceplaymastersproject (2)';
const SEASON_ID = '2ea3a403-c353-4089-8e80-1ee6a7d239ad';

const DIVISION_MAP = {
    'MONDAY': 'f35668bb-0ddf-429c-a89b-2bf0d5614432',
    'TUESDAY': 'bcfdc784-e278-4683-a3c1-7b2446e9dd10',
    'WEDNESDAY': '2624e134-c8eb-452b-8ad8-25516b869607'
};

async function parsePdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text;
}

function extractWeekAndDivision(text) {
    const weekMatch = text.match(/Week\s+(\d+)\s+of\s+(\d+)/i) || text.match(/Week\s+Number\s+(\d+)/i);
    const divisionMatch = text.match(/MONDAY|TUESDAY|WEDNESDAY/i);
    
    return {
        week: weekMatch ? parseInt(weekMatch[1]) : null,
        division: divisionMatch ? divisionMatch[0].toUpperCase() : null
    };
}

function extractBowlerStats(text) {
    // Look for sections like "1-4BAGGERZ NATION" followed by player names and scores
    const sections = text.split(/\n(\d+-[A-Z0-9 ]+)\n/);
    const playerStats = [];
    let currentTeam = null;

    for (let i = 1; i < sections.length; i += 2) {
        currentTeam = sections[i].trim();
        const teamContent = sections[i+1];
        const lines = teamContent.split('\n');
        
        for (const line of lines) {
            // Regex to match: Name LW G1 G2 Serie ...
            // Usually: PLAYER 2 215 136 351
            const match = line.match(/^([A-Z. ]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
            if (match) {
                playerStats.push({
                    team: currentTeam,
                    player: match[1].trim(),
                    game1: parseInt(match[3]),
                    game2: parseInt(match[4]),
                    series: parseInt(match[5])
                });
            }
        }
    }
    return playerStats;
}

async function run() {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'));
    const allData = [];

    for (const file of files) {
        console.log(`Processing ${file}...`);
        try {
            const text = await parsePdf(path.join(DATA_DIR, file));
            const { week, division } = extractWeekAndDivision(text);
            const stats = extractBowlerStats(text);
            
            allData.push({
                file,
                week,
                division,
                stats
            });
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    fs.writeFileSync('scripts/extracted_data.json', JSON.stringify(allData, null, 2));
    console.log('Extraction complete. Data saved to scripts/extracted_data.json');
}

run();
