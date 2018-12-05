const {extractInputs,getHead} = require('./src/lib.js');
const fs = require('fs');

const main = function() {
  let userArgs = process.argv;
  let headDetails = extractInputs(userArgs);
  console.log(getHead(process.argv,fs));
}

main();
