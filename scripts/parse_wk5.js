const fs = require('fs');
const pdf = require('pdf-parse');

const filePath = 'C:/Users/Lenovo/Documents/playmasters/MonWk5Results_UBLSn16_2026_Amended.pdf';

async function extractText() {
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdf(dataBuffer);
        fs.writeFileSync('C:/tmp/wk5_text.txt', data.text);
        console.log(`Extracted ${data.text.length} characters to C:/tmp/wk5_text.txt`);
    } catch (err) {
        console.error('PDF Parse Error:', err);
    }
}

extractText();
