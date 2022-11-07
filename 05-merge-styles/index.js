const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname, 'styles');

fs.readdir(pathFolder, {withFileTypes: true}, (error, files) => {
  if (error) console.error(`Error: ${error.message}`);

  fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', function (error) {
    if (error) console.error(`Error: ${error.message}`);

    for (const file of files) {
      if (file.isFile()) {
        const type = file.name.split('.')[1];
        if (type === 'css') {
          const filePath = path.join(pathFolder, file.name);
          const stream = fs.createReadStream(filePath, 'utf8');
          let data = '';
          stream.on('data', chunk => (data += chunk));
          stream.on('end', () => {
            fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, (error) => {
              if (error) console.error(`Error: ${error.message}`);
            });
          });
        }
      }
    }
  });
});
