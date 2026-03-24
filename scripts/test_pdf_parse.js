const fs = require('fs');
const pdf = require('pdf-parse');

const filePath = 'c:\\Users\\Lenovo\\Documents\\playmasters\\Data\\renainfluenceplaymastersproject (2)\\MonWk1Result_UBLSn16_2026.pdf';
let dataBuffer = fs.readFileSync(filePath);

pdf(dataBuffer).then(function(data) {
    console.log('--- PDF TEXT START ---');
    console.log(data.text);
    console.log('--- PDF TEXT END ---');
}).catch(err => {
    console.error(err);
});
