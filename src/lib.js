const extractInputs = function(userArgs) {
  let headDetails = new Object;
  let index = 2;
  let option = userArgs[2].split('')[1];
  headDetails.noOfLines = 10;
  if(option == 'n' || option == 'c') {
    headDetails.option = option;
    headDetails.noOfLines = userArgs[3];
    index = 4;
    if(userArgs[2].split('')[2]) {
      headDetails.noOfLines = userArgs[2].split('')[2];
      index = 3;
    }
  }
  if(parseInt(option)) {
    headDetails.noOfLines = parseInt(option);
    index = 3;
  }
  headDetails.files = userArgs.slice(index,userArgs.length);
  return headDetails;
}

exports.extractInputs = extractInputs;

const createHeadLines = function(filename) {
  let heading = '==> '+filename+' <==';
  return heading;
}

exports.createHeadLines = createHeadLines;
