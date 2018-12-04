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
  return '==> '+filename+' <==';
}

exports.createHeadLines = createHeadLines;

const extractLines = function(text,noOfLines) {
  text = text.split('\n');
  return text.slice(0,noOfLines).join('\n');
}

exports.extractLines = extractLines;

const extractCharacters = function(text,noOfChars) {
  text = text.split('');
  return text.slice(0,noOfChars).join('');
}

exports.extractCharacters = extractCharacters;
