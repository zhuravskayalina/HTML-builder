const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(filePath, 'utf8');
let data = '';
readableStream.on('data', chunk => (data += chunk));
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.error(`Error: ${error.message}`));


