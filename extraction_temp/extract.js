const fs = require('fs');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');
const path = require('path');

async function extract() {
    const docxPath = path.resolve('../UBL_Analytics_Framework.docx');
    if (fs.existsSync(docxPath)) {
        const result = await mammoth.extractRawText({ path: docxPath });
        fs.writeFileSync('framework.txt', result.value);
        console.log('Saved framework.txt');
    } else {
        console.log('Not found:', docxPath);
    }

    const pdf1 = path.resolve('../MonWk5Results_UBLSn16_2026_Amended.pdf');
    if (fs.existsSync(pdf1)) {
        const dataBuffer = fs.readFileSync(pdf1);
        const data = await pdf(dataBuffer);
        fs.writeFileSync('mon.txt', data.text);
        console.log('Saved mon.txt');
    }

    const pdf2 = path.resolve('../TuesWk5Results_UBLSn16_2026.pdf');
    if (fs.existsSync(pdf2)) {
        const dataBuffer = fs.readFileSync(pdf2);
        const data = await pdf(dataBuffer);
        fs.writeFileSync('tues.txt', data.text);
        console.log('Saved tues.txt');
    }
}

extract().catch(console.error);
