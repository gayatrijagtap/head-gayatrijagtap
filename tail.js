const {getTail} = require('./src/lib.js');
const fs = require('fs');

const main = function() {
  let userArgs = process.argv;
  console.log(getTail(userArgs.slice(2),fs));
}

main();