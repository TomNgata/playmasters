import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

const DATA_DIR = 'c:\\Users\\Lenovo\\Documents\\playmasters\\Data\\renainfluenceplaymastersproject (2)';
const file = 'MonWk1Result_UBLSn16_2026.pdf';

async function test() {
    const dataBuffer = fs.readFileSync(path.join(DATA_DIR, file));
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    const text = result.text;

    console.log('--- FULL TEXT START ---');
    console.log(text.substring(0, 2000));
    console.log('--- FULL TEXT END ---');

    const lastWeekTableMatch = text.match(/Last Week[^\n]*\n([\s\S]+?)(?=\n[A-Z]|\n\n|$)/i);
    if (lastWeekTableMatch) {
        console.log('Found Last Week Table block:');
        console.log(lastWeekTableMatch[1]);
        const tableLines = lastWeekTableMatch[1].split('\n');
        tableLines.forEach(line => {
            const row = line.trim().split(/\s+/);
            console.log('Row tokens:', row);
            for (let i = 0; i < row.length - 4; i += 5) {
                const num = parseInt(row[i]);
                const pts = parseFloat(row[i+4]);
                console.log(`Team ${num} -> Points ${pts}`);
            }
        });
    } else {
        console.log('Last Week table not found via regex.');
    }
}
test();
