const path = require('path');
const fs = require('fs');

const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf8');

stdout.write('Write your note:\n');
stdin.on('data', data => {
  const dataString = data.toString().trim();
  if (dataString === 'exit') {
    process.exit();
  }
  output.write(dataString  + '\n');
});

process.on('exit', () => stdout.write('\nBye! :)\n'));
process.on('SIGINT', () => process.exit());


