const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, {withFileTypes: true}, (error, files) => {
  if (error) {
    console.error(`Error: ${error.message}`);
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(__dirname, './secret-folder', file.name);
        const name = path.parse(filePath).name;
        const type = path.parse(filePath).ext.slice(1);

        fs.stat(filePath, function (error, stats) {
          if (error) {
            console.error(`Error: ${error.message}`);
          } else {
            console.log(`${name} - ${type} - ${stats.size / 1000}kb`);
          }
        });
      }
    });
  }
});