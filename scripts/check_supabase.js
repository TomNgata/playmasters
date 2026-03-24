const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function parseEnv() {
    const envFile = fs.readFileSync(path.resolve('.env'), 'utf-8');
    const env = {};
    envFile.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.join('=').trim();
        }
    });
    return env;
}

const env = parseEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
    console.log(`Checking tables on: ${env.NEXT_PUBLIC_SUPABASE_URL}`);
    const tables = ['seasons', 'divisions', 'teams', 'players', 'matches', 'game_scores'];
    
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`[X] Table '${table}' missing or error: ${error.message}`);
        } else {
            console.log(`[OK] Table '${table}' found.`);
        }
    }
}

checkTables().catch(console.error);
