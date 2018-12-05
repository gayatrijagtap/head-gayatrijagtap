//---------------------extractInputs-------------------
const extractInputs = function(userArgs) {
  let headDetails = new Object;
  let error = 'head: illegal line count -- 0';
  headDetails.option = extractOption(userArgs[2]);
  let {lines,index} = extractNoOfLines(userArgs.slice(2,4));
  if(lines == 0) {
    console.log(error)
    process.exit();
  }
  headDetails.noOfLines = lines;
  headDetails.files = userArgs.slice(index,userArgs.length);
  return headDetails;
}

exports.extractInputs = extractInputs;

//--------------------------extractOption--------------    -
const extractOption = function(userArgs) {
  let option = userArgs.split('')[1];
  let error = 'head: illegal option -- '+option+'\nusage:head [-n lines | -c bytes] [file ...]'
  if(userArgs.match(/^-[a-b d-m o-z A-B D-M O-Z]/)) {
    console.log(error);
    process.exit();
  }
  return userArgs.match(/-c/) ? 'c' : 'n';
}

exports.extractOption = extractOption;

//-------------------------extractNoOfLines-------------------
const extractNoOfLines = function(userArgs) {
  let array = userArgs[0].split('');
  if(userArgs[0].match(/^-.*[0-9]$/)) {
    return {lines:array[array.length-1],index:3};
  }
  if(userArgs[1]) {
    return userArgs[1].match(/^[0-9]$/) ? {lines:userArgs[1],index:4} : {lines:10,index:2};
  }
  return {lines:10,index:2};
}

exports.extractNoOfLines = extractNoOfLines;

 //-------------------------createHeadLines--------------
const createHeadLines = function(filename) {
  return '==> '+filename+' <==';
}

exports.createHeadLines = createHeadLines;

//-----------------------------extractLines------------
const extractLines = function(text,noOfLines) {
  let lines = text.split('\n');
  return lines.slice(0,noOfLines).join('\n');
}

exports.extractLines = extractLines;

//----------------------extractCharacters---------------
const extractCharacters = function(text,noOfChars) {
  let lines = text.split('');
  return lines.slice(0,noOfChars).join('');
}

exports.extractCharacters = extractCharacters;

//--------------------------getHead---------------------
const getHead = function(userArgs,fs) {
  let headDetails = extractInputs(userArgs);
  let {files,option,noOfLines} = headDetails;
  let type = { 'n':extractLines , 'c':extractCharacters };
  let head = '';
  for(let file of files) {
    let data = readFile(file,fs);
    if(files.length == 1) { return type[option](data,noOfLines); }
    head = head+'\n'+createHeadLines(file)+'\n'+type[option](data,noOfLines)+'\n';
  }
  return head;
}

exports.getHead = getHead;

//----------------------------readFile-------------------
const readFile = function(file,fs) {
  let error = 'head: '+file+': No such file or directory';
  if(!fs.existsSync(file)) { 
    return error;
  }
  const read = fs.readFileSync;
  let data = read('./'+file,'utf8');
  return data;
}

exports.readFile = readFile;
