const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const FILE = 'text.txt';
const fileName = path.join(__dirname, FILE);

output.write('Please, enter your text below:\n\n');

try {
  const stream = fs.createWriteStream(fileName, 'utf8');
  const rl = readline.createInterface({ input, stream });

  rl.on('line', (line) => {
    if (line === 'exit') exitHandler();
    else stream.write(`${line}\n`);
  });
  const exitHandler = () => {
    output.write('\n\nThank you and Good bye!!!\n');
    rl.close();
  };
  process.on('SIGINT', exitHandler);

} catch (err) {
  throw err;
}
