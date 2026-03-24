const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('extraction_temp/seed_data.sql', 'utf8')
    .replace(/^BEGIN;/, '')
    .replace(/COMMIT;$/, '');
const lines = content.split('\n');

let currentBatch = [];
let batchCount = 1;
const linesPerBatch = 500;

for (let i = 0; i < lines.length; i++) {
    currentBatch.push(lines[i]);
    if (currentBatch.length >= linesPerBatch || i === lines.length - 1) {
        fs.writeFileSync(`extraction_temp/seed_batch_${batchCount}.sql`, 
            'BEGIN;\n' + currentBatch.join('\n') + '\nCOMMIT;');
        batchCount++;
        currentBatch = [];
    }
}

console.log(`Split into ${batchCount - 1} batches.`);
