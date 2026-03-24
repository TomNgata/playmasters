import fs from 'fs';
import { PDFParse } from 'pdf-parse';

const filePath = 'c:\\Users\\Lenovo\\Documents\\playmasters\\Data\\renainfluenceplaymastersproject (2)\\MonWk1Result_UBLSn16_2026.pdf';
let dataBuffer = fs.readFileSync(filePath);

async function run() {
    try {
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        console.log('--- PDF TEXT START ---');
        console.log(result.text.substring(0, 4000));
        console.log('--- PDF TEXT END ---');
    } catch (err) {
        console.error('Error:', err);
    }
}
run();
