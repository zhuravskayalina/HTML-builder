const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const destinationFolder = path.join(__dirname, 'project-dist');
const assetsOriginalPath = path.join(__dirname, 'assets');
const assetsDestinationPath = path.join(destinationFolder, 'assets');

fsPromises.rm(destinationFolder, {recursive: true, force: true})
  .then(() => {
    build()
      .then(error => {
        if (error) console.error(`Error: ${error.message}`);
      });
  });

async function build() {
  await fsPromises.mkdir(destinationFolder, {recursive: true})
    .then(() => copyAssets(assetsOriginalPath, assetsDestinationPath))
    .then(() => changeTemplate())
    .then(() => buildStyles())
    .catch(error => console.error(`Error: ${error.message}`));
}

function copyAssets(input, output) {
  fs.readdir(input, {withFileTypes: true}, (error, files) => {
    if (error) console.error(`Error: ${error.message}`);
    for (let file of files) {
      if (file.isDirectory()) {
        fs.rm(`${output}/${file.name}`, {recursive: true, force: true}, (error) => {
          if (error) console.error(`Error: ${error.message}`);
          fs.mkdir(`${output}/${file.name}`, {recursive: true}, (error) => {
            if (error) console.error(`Copy error: ${error.message}`);
            copyAssets(`${input}/${file.name}`, `${output}/${file.name}`);
          });
        });
      } else {
        fs.copyFile(`${input}/${file.name}`, `${output}/${file.name}`, (error) => {
          if (error) console.error(`Copy error: ${error.message}`);
        });
      }
    }
  });
}

function buildStyles() {
  const pathFolder = path.join(__dirname, 'styles');

  fs.readdir(pathFolder, {withFileTypes: true}, (error, files) => {
    if (error) console.error(`Error: ${error.message}`);

    fs.writeFile(path.join(destinationFolder, 'style.css'), '', function (error) {
      if (error) console.error(`Error: ${error.message}`);

      files.forEach(file => {
        if (file.isFile()) {
          const type = file.name.split('.')[1];
          if (type === 'css') {
            const filePath = path.join(pathFolder, file.name);
            const stream = fs.createReadStream(filePath, 'utf8');
            let data = '';
            stream.on('data', chunk => (data += chunk));
            stream.on('end', () => {
              fs.appendFile(path.join(destinationFolder, 'style.css'), data, (error) => {
                if (error) {
                  console.error(`Error: ${error.message}`);
                }
              });
            });
          }
        }
      });
    });
  });
}

async function changeTemplate() {
  let template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf8');
  const reg = new RegExp(/{{+[a-z]+}}/g);
  const componentsList = template.match(reg);
  for await (const component of componentsList) {
    const componentName = component.slice(2, -2);
    const componentData = await fsPromises.readFile(path.join(__dirname, 'components', `${componentName}.html`), 'utf8');
    template = template.replace(component, componentData);
  }
  await fsPromises.writeFile(path.join(destinationFolder, 'index.html'), template, 'utf8');
}