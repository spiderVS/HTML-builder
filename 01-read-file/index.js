const fs = require('fs');
const path = require('path');

const FILE = 'text.txt';

const fileName = path.join(__dirname, FILE);

async function readFile(fileName) {
  try {
    const stream = fs.createReadStream(fileName, 'utf8');
    stream.on('data', (chunk) => {
      console.log(chunk);
    });

  } catch (err) {
    throw err;
  }
}

readFile(fileName);
