const { promises: fs, stat: stat } = require('fs');
const path = require('path');

const FOLDER = 'secret-folder';

const readFolder = async () => {
  const pathDir = path.join(__dirname, FOLDER);
  try {
    const files = await fs.readdir(pathDir, {withFileTypes: true});
    for (const file of files) {
      if (!file.isDirectory()) {
        let name = path.basename(file.name, path.extname(file.name));  // path.basename('quux.html', '.html'); => 'quux'
        let extname = (path.extname(file.name)).slice(1);

        stat(path.join(__dirname, FOLDER, file.name), (err, stats) => {
          if (err) throw err;
          console.log(`${name} - ${extname} - ${stats.size}`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}
readFolder();
