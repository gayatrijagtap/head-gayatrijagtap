//---------------------extractInputs-------------------
const extractInputs = function(userArgs) {
  let headDetails = new Object;
  headDetails.option = extractOption(userArgs[2]);
  let {lines,index} = extractNoOfLines(userArgs.slice(2,4));
  let error = 'head: illegal line count -- '+lines;
  if((lines <=0 || lines.match(/[a-z A-Z]/)) && headDetails.option == 'c') {
    console.log('head: illegal byte count -- '+lines);
    process.exit();
  }
  if((lines <= 0 || lines.match(/[a-z A-Z]/)) && headDetails.option == 'n') {
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
  if(extractNumber(userArgs)) {
    return extractNumber(userArgs);
  }
  let array = userArgs[0].split('');
  let lines = parseInt(array[1]) || parseInt(array[1]) == 0 ? {lines:array[1],index:3} : {lines:'10',index:2};
  if(parseInt(array[2]) || parseInt(array[2]) == 0) {
    return {lines:array[2],index:3};
  }
  if(parseInt(userArgs[1]) || parseInt(userArgs[1]) == 0) {
    return {lines:userArgs[1],index:4};
  }
  return lines;
}

exports.extractNoOfLines = extractNoOfLines;

const extractNumber = function(userArgs) {
  let array = userArgs[0].split('');
  if(parseInt(array.slice(1,4).join(''))) {
    return {lines:array.slice(1,4).join(''),index:3};
  }
  if(parseInt(array.slice(2,5).join(''))) {
    return {lines:array.slice(2,5).join(''),index:3};
  }
}

exports.extractNumber = extractNumber;

 //-------------------------createHeadLines--------------
const createHeadLines = function(filename) {
  return '==> '+filename+' <==';
}

exports.createHeadLines = createHeadLines;

//-----------------------------extractLines------------
const extractLines = function(text,noOfLines) {
  let lines = text.split('\n');
  if(lines.length <= noOfLines) {
    noOfLines = lines.length-1;
  }
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
  let delimeter = '';
  for(let file of files) {
    if(!fs.existsSync(file)) {
      let error = 'head: '+file+': No such file or directory';
      head = head +delimeter+ error;
      delimeter = '\n'
      continue;
    }
    let data = fs.readFileSync(file,'utf8');
    if(files.length == 1) { 
      return type[option](data,noOfLines); 
    }
    head = head+delimeter+createHeadLines(file)+'\n'+type[option](data,noOfLines);
    delimeter = '\n\n';
  }
  return head;
}

exports.getHead = getHead;
