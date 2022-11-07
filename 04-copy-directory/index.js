const fs = require('fs');
const path = require('path');
const destinationPath = `${__dirname}/files-copy`;
const originalPath = path.join(__dirname, 'files');

fs.rm(destinationPath, {recursive: true, force: true}, (error) => {
  if (error) console.error(`Error: ${error.message}`);
  fs.mkdir(destinationPath, {recursive: true}, () => {
    fs.readdir(originalPath, {withFileTypes: true}, (error, files) => {
      if (error) console.error(`Error: ${error.message}`);
      for (let file of files) {
        if (file.isFile()) {
          fs.copyFile(`${originalPath}/${file.name}`, `${destinationPath}/${file.name}`, (error) => {
            if (error) console.error(`Copy error: ${error.message}`);
          });
        }
      }
    });
  });
});
