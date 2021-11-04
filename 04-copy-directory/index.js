const fs = require('fs');
const fsPromises = fs.promises;
// const { promises: fs, stat: stat } = require('fs'); //var.2

const path = require('path');

const FOLDER = 'files';
const NEWFOLDER = 'files-copy';

const copyFolder = async () => {

  const pathDir = path.join(__dirname, FOLDER);
  const pathDirCopy = path.join(__dirname, NEWFOLDER);
  try {

   await fsPromises.stat(pathDirCopy, async (err) => {
      if (!err) {
        const dir = await fsPromises.opendir(pathDirCopy);
        for await (const dirent of dir) {
          await fsPromises.rm(path.join(pathDirCopy, dirent.name), {recursive: true});
        }
      } else if (err.code === 'ENOENT') {
          await fsPromises.mkdir(pathDirCopy, { recursive: true });
        }
    });

    const filesList = await fsPromises.readdir(pathDir, {withFileTypes: true});

    for (const file of filesList) {
      if (!file.isDirectory()) {
        await fsPromises.copyFile(path.join(pathDir, file.name), path.join(pathDirCopy, file.name));
      }

    }
  } catch (err) {
      console.error(err);
    }
}

copyFolder();
