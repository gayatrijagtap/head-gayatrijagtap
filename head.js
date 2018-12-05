const {extractInputs,getHead} = require('./src/lib.js');
const fs = require('fs');

const main = function() {
  console.log(getHead(process.argv,fs));
}

main();
