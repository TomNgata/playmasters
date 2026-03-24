import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/extracted_data.json', 'utf8'));

const teams = new Set();
const players = new Set();
const divisions = new Set();

data.forEach(fileData => {
    if (fileData.division) divisions.add(fileData.division);
    fileData.stats.forEach(s => {
        teams.add(`${fileData.division} | ${s.team}`);
        players.add(s.player);
    });
});

console.log('--- DIVISIONS ---');
console.log([...divisions]);
console.log('\n--- TEAMS (Sample) ---');
console.log([...teams].slice(0, 20));
console.log('\n--- PLAYERS (Count) ---');
console.log(players.size);
console.log('\n--- PLAYERS (Sample) ---');
console.log([...players].slice(0, 20));
