const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const FILE = 'text.txt';
const fileName = path.join(__dirname, FILE);

output.write('Please, enter your text below:\n');
try {
  const stream = fs.createWriteStream(fileName, 'utf8');
  const rl = readline.createInterface({ input, stream });

  rl.on('line', (line) => {
    if (line === 'exit') {
      rl.close();
      process.exit();
    }
    else stream.write(line+'\n')
  });
  // rl.on('close', () => {
  //   process.exit();
  // })

  process.on('exit', () => output.write('Thank you and Good bye!!!'));

} catch (err) {
  throw err;
}
