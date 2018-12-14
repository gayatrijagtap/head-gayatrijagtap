//---------------------extractInputs-------------------

const extractInputs = function(userArgs) {
  let headDetails = new Object();
  headDetails.option = extractOption(userArgs[2]);
  let { lines, index } = extractNoOfLinesWithIndex(userArgs.slice(2, 4));
  headDetails.noOfLines = lines;
  headDetails.files = userArgs.slice(index, userArgs.length);
  return headDetails;
};

exports.extractInputs = extractInputs;

//--------------------------extractOption---------------

const extractOption = function(optionCandidate) {
  return getOption(optionCandidate) || 'n';
};

exports.extractOption = extractOption;

//----------------------------getOption----------------------

const getOption = function (optionCandidate) {
  if (optionCandidate.match(/^-[a-m o-z A-M O-Z]/)) {
    return optionCandidate[1];
  }
}

exports.getOption = getOption;

//-------------------------extractNoOfLinesWithIndex-------------------

const extractNoOfLinesWithIndex = function (userArgs) {
  let array = userArgs[0].split("");
  let lines = { lines: "10", index: 2 };
  return extractNumber(userArgs) || getNoOfLines(array[1], 3) || noOfLinesWithFileIndex(array[2], userArgs[1], 3, 4) || lines;
};

exports.extractNoOfLinesWithIndex = extractNoOfLinesWithIndex;

//--------------------------------noOfLines---------------------

const noOfLinesWithFileIndex = function(firstNumber,secondNumber,firstIndex,secondIndex) {
  return getNoOfLines(firstNumber,firstIndex) || getNoOfLines(secondNumber,secondIndex);
}

exports.noOfLinesWithFileIndex = noOfLinesWithFileIndex;

//-----------------------------getNoOfLines-------------------------------

const getNoOfLines = function(number,index) {
  if(parseInt(number) || parseInt(number) == 0) {
    return {lines:number,index:index};
  } 
}

exports.getNoOfLines = getNoOfLines;

//--------------------------getNumberWithIndex-------------------------

const getNumberWithIndex = function(numberCandidate,index) {
  if(parseInt(numberCandidate)) {
    return {lines:numberCandidate , index:index};
  }
}

exports.getNumberWithIndex = getNumberWithIndex;

//---------------------------extractNumber-------------------

const extractNumber = function(userArgs) {
  let array = userArgs[0].split("");
  let numberCandidate1 = array.slice(1,4).join('');
  let numberCandidate2 = array.slice(2,5).join('');
  let number = getNumberWithIndex(numberCandidate1,3) || getNumberWithIndex(numberCandidate2,3);
  return number;
};

exports.extractNumber = extractNumber;

//-------------------------createHeadLines--------------

const createHeadLines = function(filename) {
  return "==> " + filename + " <==";
};

exports.createHeadLines = createHeadLines;


//-----------------------------extractHeadLines------------

const extractHeadLines = function(text, noOfLines) {
  let lines = text.split("\n");
  noOfLines = greaterNumber(noOfLines,lines.length);
  return lines.slice(0, noOfLines).join("\n");
};

exports.extractHeadLines = extractHeadLines;

//-----------------------------greaterNumber------------------

const greaterNumber = function(noOfLines,length) {
  return noOfLines >= length ? length : noOfLines;
}

exports.greaterNumber = greaterNumber;

//----------------------extractHeadCharacters---------------

const extractHeadCharacters = function(text, noOfChars) {
  let characters = text.split("");
  return characters.slice(0, noOfChars).join("");
};

exports.extractHeadCharacters = extractHeadCharacters;

//----------------------handleHeadErrors---------------------

const handleHeadErrors = function(option, noOfLines) {
  return getInvalidHeadOptionError(option) || getInvalidCountError(noOfLines,option);
};

exports.handleHeadErrors = handleHeadErrors;

//-------------------------------getInvalidHeadOptionError---------------------

const getInvalidHeadOptionError = function(optionCandidate) {
  let optionError = "head: illegal option -- " + optionCandidate[0] + "\nusage:head [-n lines | -c bytes] [file ...]";
  if(optionCandidate != 'c' && optionCandidate != 'n') {
    return optionError;
  }
}

exports.getInvalidHeadOptionError = getInvalidHeadOptionError;

//------------------------------getInvalidCountError-------------------------

const getInvalidCountError = function(count,option) {
  let countError = new Object;
  countError['n'] = "head: illegal line count -- " + count;
  countError['c'] = "head: illegal byte count -- " + count;
  if ((count <= 0 || count.match(/[a-z A-Z]/))) {
    return countError[option];
  }
}

exports.getInvalidCountError = getInvalidCountError;

//-----------------------------------extractTailingLines---------------------------
  
const extractTailingLines = function (text, noOfLines) {
  let lines = text.split('\n')
  let trailingLines = getTrailingLines(noOfLines,lines.length);
  return lines.slice(trailingLines, lines.length).join('\n');
}

exports.extractTailingLines = extractTailingLines;

//---------------------------getTrailingLines-------------------------

const getTrailingLines = function(noOfLines,length) {
  return noOfLines >= length ? 0 : Math.abs( length-noOfLines );
}

exports.getTrailingLines = getTrailingLines;

//----------------------extractHeadCharacters---------------
  
const extractTailingChars = function (text, noOfChars) {
  let characters = text.split('')
  let trailingChars = getTrailingLines(noOfChars,characters.length);
  return characters.slice(trailingChars, characters.length).join('')
}

exports.extractTailingChars = extractTailingChars;

//------------------------------handleTailErrors------------------------
  
const handleTailErrors = function(option, noOfLines) {
  return isInvalidTailOption(option) || isNoOfLinesZero(noOfLines) || isIllegalOffset(noOfLines);
};

exports.handleTailErrors = handleTailErrors;

//-----------------------------------isInvalidTailOption--------------------

const isInvalidTailOption = function(option) {
  let optionError = 'tail: illegal option -- ' + option + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
  if(option != 'c' && option != 'n') {
    return optionError;
  }
}

exports.isInvalidTailOption = isInvalidTailOption;

//--------------------------------isNoOfLinesZero-----------------------------

const isNoOfLinesZero = function(noOfLines) {
  if(noOfLines == 0) {
    return;
  }
}

exports.isNoOfLinesZero = isNoOfLinesZero;

//---------------------------------isIllegalOffset-----------------------

const isIllegalOffset = function(noOfLines) {
  let errorMessage = 'tail: illegal offset -- ' + noOfLines;
  if (noOfLines.match(/[a-z A-Z]/)) {
    return errorMessage;
  }
}

exports.isIllegalOffset = isIllegalOffset;

const getMissingFileError = function(file,existsSync,command) {
  let head = "head: " + file + ": No such file or directory";
  let tail = 'tail: ' + file + ": No such file or directory";
  let error = {head,tail};
  if(!existsSync(file)) {
    return error[command];
  }
};

exports.getMissingFileError = getMissingFileError;

const getSingleFileHead = function(headDetails,type,fs,command) {
  let {files,option,noOfLines} = headDetails;
  if(files.length == 1 && fs.existsSync(files[0])) {
    return getMissingFileError(files[0],fs.existsSync,command) || type[option](fs.readFileSync(files[0],'utf8'),noOfLines);
  }
}

exports.getSingleFileHead = getSingleFileHead;

const getHead = function(userArgs,fs) {
  let headDetails = extractInputs(userArgs);
  let {files,option,noOfLines} = headDetails;
  return handleHeadErrors(option,noOfLines) || head(headDetails,fs);
};

exports.getHead = getHead;

const head = function(headDetails,fs) {
  let {files,option,noOfLines} = headDetails;  
  let type = {n:extractHeadLines , c:extractHeadCharacters};
  let linesAtTop = "";
  for(let file of files) { 
    linesAtTop = linesAtTop + (getMissingFileError(file,fs.existsSync,'head') || createHeadLines(file) +'\n'+ type[option](fs.readFileSync(file,'utf8'),noOfLines))+'\n\n';
  }
  return getSingleFileHead(headDetails,type,fs,'head') || linesAtTop;
}

exports.head = head;

const getTail = function(userArgs,fs) {
  let tailDetails = extractInputs(userArgs);
  let {files,option,noOfLines} = tailDetails;
  return handleTailErrors(option,noOfLines) || tail(tailDetails,fs);
};

exports.getTail = getTail;

const tail = function(tailDetails,fs) {
  let {files,option,noOfLines} = tailDetails;  
  let type = {n:extractTailingLines , c:extractTailingChars};
  let linesAtBottom = "";
  for(let file of files) { 
    linesAtBottom = linesAtBottom + (getMissingFileError(file,fs.existsSync,'tail') || createHeadLines(file) +'\n'+ type[option](fs.readFileSync(file,'utf8'),noOfLines))+'\n\n';
  }
  return getSingleFileHead(tailDetails,type,fs,'tail') || linesAtBottom;
}

exports.tail = tail;