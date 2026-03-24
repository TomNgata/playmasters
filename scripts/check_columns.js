const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function checkColumns() {
    console.log(`Checking columns for existing tables...`);
    
    const { data: teams, error: e1 } = await supabase.from('teams').select('*').limit(1);
    console.log('Teams Columns:', teams ? Object.keys(teams[0] || {}) : 'Empty Table');
    
    const { data: matches, error: e2 } = await supabase.from('matches').select('*').limit(1);
    console.log('Matches Columns:', matches ? Object.keys(matches[0] || {}) : 'Empty Table');
}

checkColumns().catch(console.error);
