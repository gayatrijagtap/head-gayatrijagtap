const extractInputs = function(userArgs) {
  let headDetails = new Object;
  headDetails.option = extractOption(userArgs[2]);
  let {lines,index} = extractNoOfLines(userArgs.slice(2,4));
  headDetails.noOfLines = lines;
  headDetails.files = userArgs.slice(index,userArgs.length);
  return headDetails;
}

exports.extractInputs = extractInputs;

const extractOption = function(userArgs) {
  return userArgs.match(/-c/) ? 'c' : 'n';
}

exports.extractOption = extractOption;

const extractNoOfLines = function(userArgs) {
  let array = userArgs[0].split('');
  if(userArgs[0].match(/^-.*[0-9]$/)) {
    return {lines:array[array.length-1],index:3};
  }
  return userArgs[1].match(/^[0-9]$/) ? {lines:userArgs[1],index:4} : {lines:10,index:2};
}

exports.extractNoOfLines = extractNoOfLines;

const createHeadLines = function(filename) {
  let heading = '==> '+filename+' <==';
  return heading;
}

exports.createHeadLines = createHeadLines;

const extractLines = function(text,noOfLines) {
  text = text.split('\n');
  let head = text.slice(0,noOfLines).join('\n');
  return head;
}

exports.extractLines = extractLines;

const extractCharacters = function(text,noOfChars) {
  text = text.split('');
  let head = text.slice(0,noOfChars).join('');
  return head;
}

exports.extractCharacters = extractCharacters;
