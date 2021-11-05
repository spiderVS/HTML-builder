const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const SOURCE_FOLDER_NAME = 'styles';
const DEST_FOLDER_NAME = 'project-dist';
const BUNDLE_NAME = 'bundle.css';

const mergeCopyCss = async () => {
  const pathDirSource = path.join(__dirname, SOURCE_FOLDER_NAME);
  const pathDirDest = path.join(__dirname, DEST_FOLDER_NAME);

  try {
    await fsPromises.access(path.join(pathDirDest, BUNDLE_NAME));
    await fsPromises.rm(path.join(pathDirDest, BUNDLE_NAME), {recursive: true});
  } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(err);
      }
    }

  try {
    const sourceFileList = await fsPromises.readdir(pathDirSource, {withFileTypes: true});
    for (const file of sourceFileList) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let data = '';
        const readStream = fs.createReadStream(path.join(pathDirSource, file.name), 'utf8');

        readStream.on("data", (chunk) => {
          data += chunk;
        }).on("end", () => {
          data += '\n';
          fs.appendFile(path.join(pathDirDest, BUNDLE_NAME), data, (err) => {
            if (err) throw err;
          });
        });
      }
    }
  } catch (err) {
      console.error(err);
    }
}

mergeCopyCss();
