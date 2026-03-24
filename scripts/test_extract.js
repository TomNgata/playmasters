const fs = require('fs');
const path = require('path');
const { PDFParse } = require('../extraction_temp/node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs');

async function testExtract() {
    const filePath = path.resolve('Data/renainfluenceplaymastersproject (2)/MonWk7FinalGrpStageResults_UBLSn16_2026.pdf');
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    fs.writeFileSync('extraction_temp/test_parse.txt', result.text);
    console.log('Test extraction saved to extraction_temp/test_parse.txt');
    console.log('--- SNIPPET ---');
    console.log(result.text.substring(0, 500));
    await parser.destroy();
}
testExtract().catch(console.error);
