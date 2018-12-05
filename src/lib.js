//---------------------extractInputs-------------------
const extractInputs = function(userArgs) {
  let headDetails = new Object;
  headDetails.option = extractOption(userArgs[2]);
  let {lines,index} = extractNoOfLines(userArgs.slice(2,4));
  headDetails.noOfLines = lines;
  headDetails.files = userArgs.slice(index,userArgs.length);
  return headDetails;
}

exports.extractInputs = extractInputs;

//--------------------------extractOption--------------    -
const extractOption = function(userArgs) {
  return userArgs.split('')[1]=='c' ? 'c' : 'n';
}

exports.extractOption = extractOption;

//-------------------------extractNoOfLines-------------------
const extractNoOfLines = function(userArgs) {
  let array = userArgs[0].split('');
  let lines = parseInt(array[1]) ? {lines:array[1],index:3} : {lines:10,index:2};
  if(parseInt(array[2])) {
    return {lines:array[2],index:3};
  }
  if(parseInt(userArgs[1])) {
    return {lines:userArgs[1],index:4};
  }
  return lines;
}

exports.extractNoOfLines = extractNoOfLines;

 //-------------------------createHeadLines--------------
const createHeadLines = function(filename) {
  return '==> '+filename+' <==';
}

exports.createHeadLines = createHeadLines;

//-----------------------------extractLines------------
const extractLines = function(text,noOfLines) {
  text = text.split('\n');
  return text.slice(0,noOfLines).join('\n');
}

exports.extractLines = extractLines;

//----------------------extractCharacters---------------
const extractCharacters = function(text,noOfChars) {
  text = text.split('');
  return text.slice(0,noOfChars).join('');
}

exports.extractCharacters = extractCharacters;

//--------------------------getHead---------------------
const getHead = function(file,headDetails,fs) {
  let {option,noOfLines} = headDetails;
  let type = {};
  let data = readFile(file,fs);
  type['n'] = extractLines(data,noOfLines);
  type['c'] = extractCharacters(data,noOfLines);
  let head = '\n'+createHeadLines(file)+'\n'+type[option];
  return head;
}

exports.getHead = getHead;

//----------------------------readFile-------------------
const readFile = function(file,fs) {
  const read = fs.readFileSync;
  let data = read('./'+file,'utf8');
  return data;
}

exports.readFile = readFile;
