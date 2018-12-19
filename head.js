const { extractInputs, getHead } = require('./src/fileUtil.js');
const fs = require('fs');

const main = function () {
  let userArgs = process.argv;
  console.log(getHead(userArgs.slice(2), fs));
}

main();