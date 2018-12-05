const {extractInputs,getHead} = require('./src/lib.js');
const fs = require('fs');

const main = function() {
  let userArgs = process.argv;
  let headDetails = extractInputs(userArgs);
  console.log(getHead(headDetails,fs));
}

main();













/* 
  Usage:
  node ./head.js file1
  node ./head.js -n5 file1
  node ./head.js -n 5 file1
  node ./head.js -5 file1
  node ./head.js file1 file2
  node ./head.js -n 5 file1 file2
  node ./head.js -n5 file1 file2
  node ./head.js -5 file1 file2 
  node ./head.js -c5 file1
  node ./head.js -c 5 file1
  node ./head.js -c5 file1 file2
  node ./head.js -c 5 file1 file2
*/



