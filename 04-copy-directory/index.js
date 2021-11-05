const fs = require('fs');
const fsPromises = fs.promises;
// const { promises: fs, stat: stat } = require('fs'); // var.2

const path = require('path');

const FOLDER = 'files';
const COPYFOLDER = 'files-copy';

const copyFolder = async () => {
  const pathDir = path.join(__dirname, FOLDER);
  const pathDirCopy = path.join(__dirname, COPYFOLDER);

  try {
    await fsPromises.stat(pathDirCopy);
    const copyDirFileList = await fsPromises.readdir(pathDirCopy);
    for await (const file of copyDirFileList) {
      await fsPromises.rm(path.join(pathDirCopy, file), {recursive: true});
    }
  } catch (err) {
      if (err.code === 'ENOENT') {
        await fsPromises.mkdir(pathDirCopy, { recursive: true });
      } else console.error(err);
    };

  try {
    const originDirFileList = await fsPromises.readdir(pathDir, {withFileTypes: true});
    for await (const file of originDirFileList) {
      if (!file.isDirectory()) {
        await fsPromises.copyFile(path.join(pathDir, file.name), path.join(pathDirCopy, file.name));
      }
    }
  } catch (err) {
      console.error(err);
    }
}

copyFolder();
