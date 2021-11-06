const { ENOENT } = require('constants');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const DEST_FOLDER_NAME = 'project-dist';
const BUNDLE_HTML_NAME = 'index.html';
const BUNDLE_CSS_NAME = 'style.css';

const ENRTY_HTML_NAME = 'template.html';
const STYLES_FOLDER_NAME = 'styles';
const ASSETS_FOLDER_NAME = 'assets';
const COMPONENTS_FOLDER_NAME = 'components';

const pathDestDir = path.join(__dirname, DEST_FOLDER_NAME);
const pathEntryHtml = path.join(__dirname, ENRTY_HTML_NAME);
const pathOutputHtml = path.join(pathDestDir, BUNDLE_HTML_NAME);
const pathStylesDir = path.join(__dirname, STYLES_FOLDER_NAME);
const pathCompDir = path.join(__dirname, COMPONENTS_FOLDER_NAME);
const pathAssetsDir = path.join(__dirname, ASSETS_FOLDER_NAME);

let errorCount = 0;

const readFile = (path) => new Promise((res, rej) => {
    let data = '';
    const readStream = fs.createReadStream(path, 'utf8');
    readStream.on('data', (chunk) => {
      data += chunk;
    }).on("end", () => {
      res(data);
    }).on('error', (error) => rej(error));
}).catch((error) => {
    console.log(error.name, error.message);
    errorCount++;
    return null;
  });


const buildBundle = async () => {
  try {
    await fsPromises.access(pathDestDir);
    await fsPromises.rm(pathDestDir, {recursive: true});
  } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(err);
        errorCount++;
      }
    }

  try {
    await fsPromises.mkdir(pathDestDir, { recursive: true }); // Create new output dyrectory
    console.log(`\n> Info: <${DEST_FOLDER_NAME}> folder was created`);

    let htmlFile = await readFile(pathEntryHtml);
    compRegex = /\{\{.+\}\}/g;
    let compInHtmlArr = [...htmlFile.match(compRegex)]; // [{{header }}, {{ footer}}]
    let compInHtmlArrNorm = compInHtmlArr.map(el => el.slice(2,-2).trim()); // [{{header }}, {{ footer}}] ==> ['header', 'footer']

    for await (const [idx, comp] of compInHtmlArrNorm.entries()) {
      const htmlCompFile = await readFile(path.join(pathCompDir, `${comp}.html`));
      if (htmlCompFile !== null) {
        htmlFile = htmlFile.replace(compInHtmlArr[idx], htmlCompFile);
      }
    }

    await fsPromises.writeFile(pathOutputHtml, htmlFile); // Write new bundle-html file
    console.log(`> Info: '${BUNDLE_HTML_NAME}' in <${DEST_FOLDER_NAME}> folder was created`);

    await mergeCopyCss(); // Merge and write new bundle-css file
    console.log(`> Info: '${BUNDLE_CSS_NAME}' in <${DEST_FOLDER_NAME}> folder was created`);

    await copyFolder(pathAssetsDir, path.join(pathDestDir, ASSETS_FOLDER_NAME));
    console.log(`> Info: <${ASSETS_FOLDER_NAME}> folder was copied`);

    console.log(`> Info: Done! All operations was completed. Errors count: ${errorCount}`);

  } catch (err){
    console.error(err);
    errorCount++;
  }
}

const mergeCopyCss = () => new Promise (async (res, rej) => {
  try {
    const stylesDirFileList = await fsPromises.readdir(pathStylesDir, {withFileTypes: true});
    for (const file of stylesDirFileList) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let inputCssFile = await readFile(path.join(pathStylesDir, file.name));
        inputCssFile += '\n';
        fs.appendFile(path.join(pathDestDir, BUNDLE_CSS_NAME), inputCssFile, (error) => {
          if (error) {
            (error) => rej(error);
          };
        });
      }
    }
    res();
  } catch (err) {
    console.error(err)
    errorCount++;
  }
});

const copyFolder = (from, to) => new Promise (async (res, rej) => {
  try {
      await fsPromises.mkdir(to, { recursive: true });
      let objects = await fsPromises.readdir(from, { withFileTypes: true });

      for (const obj of objects) {
        let pathFrom = path.join(from, obj.name);
        let pathTo = path.join(to, obj.name);
        if (obj.isDirectory()) {
          await copyFolder(pathFrom, pathTo)
        } else {
          await fsPromises.copyFile(pathFrom, pathTo);
        }
      }
    res();
  } catch (err) {
    (err) => rej(err);
    console.error(err)
    errorCount++;
  }

});

buildBundle();
