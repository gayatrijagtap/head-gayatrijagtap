//---------------------extractInputs-------------------

const extractInputs = function(userArgs) {
  let headDetails = new Object();
  headDetails.option = extractOption(userArgs[2]);
  let { lines, index } = extractNoOfLines(userArgs.slice(2, 4));
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

//-------------------------extractNoOfLines-------------------

const extractNoOfLines = function (userArgs) {
  let array = userArgs[0].split("");
  let lines = { lines: "10", index: 2 };
  return extractNumber(userArgs) || getNoOfLines(array[1], 3) || noOfLines(array[2], userArgs[1], 3, 4) || lines;
};

exports.extractNoOfLines = extractNoOfLines;

//--------------------------------noOfLines---------------------

const noOfLines = function(firstNumber,secondNumber,firstIndex,secondIndex) {
  return getNoOfLines(firstNumber,firstIndex) || getNoOfLines(secondNumber,secondIndex);
}

exports.noOfLines = noOfLines;

//-----------------------------getNoOfLines-------------------------------

const getNoOfLines = function(number,index) {
  if(parseInt(number) || parseInt(number) == 0) {
    return {lines:number,index:index};
  } 
}

exports.getNoOfLines = getNoOfLines;

//--------------------------isNumber-------------------------

const isNumber = function(numberCandidate,index) {
  if(parseInt(numberCandidate)) {
    return {lines:numberCandidate , index:index};
  }
}

exports.isNumber = isNumber;

//---------------------------extractNumber-------------------

const extractNumber = function(userArgs) {
  let array = userArgs[0].split("");
  let numberCandidate1 = array.slice(1,4).join('');
  let numberCandidate2 = array.slice(2,5).join('');
  let number = isNumber(numberCandidate1,3) || isNumber(numberCandidate2,3);
  return number;
};

exports.extractNumber = extractNumber;

//-------------------------createHeadLines--------------

const createHeadLines = function(filename) {
  return "==> " + filename + " <==";
};

exports.createHeadLines = createHeadLines;

//-----------------------------extractLines------------

const extractLines = function(text, noOfLines) {
  let lines = text.split("\n");
  noOfLines = isNoOfLinesGreater(noOfLines,lines.length);
  return lines.slice(0, noOfLines).join("\n");
};

exports.extractLines = extractLines;

//-----------------------------isNoOfLinesGreater------------------

const isNoOfLinesGreater = function(noOfLines,length) {
  return noOfLines >= length ? length : noOfLines;
}

exports.isNoOfLinesGreater = isNoOfLinesGreater;

//----------------------extractCharacters---------------

const extractCharacters = function(text, noOfChars) {
  let characters = text.split("");
  return characters.slice(0, noOfChars).join("");
};

exports.extractCharacters = extractCharacters;

//----------------------handleErrors---------------------

const handleErrors = function(option, noOfLines) {
  return isInvalidOption(option) || isInvalidCount(noOfLines,option);
};

exports.handleErrors = handleErrors;

//-------------------------------isInvalidOption---------------------

const isInvalidOption = function(optionCandidate) {
  let optionError = "head: illegal option -- " + optionCandidate[0] + "\nusage:head [-n lines | -c bytes] [file ...]";
  if(optionCandidate != 'c' && optionCandidate != 'n') {
    return optionError;
  }
}

exports.isInvalidOption = isInvalidOption;

//------------------------------isInvalidCount-------------------------

const isInvalidCount = function(count,option) {
  let countError = new Object;
  countError['n'] = "head: illegal line count -- " + count;
  countError['c'] = "head: illegal byte count -- " + count;
  if ((count <= 0 || count.match(/[a-z A-Z]/))) {
    return countError[option];
  }
}

exports.isInvalidCount = isInvalidCount;

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

//----------------------extractCharacters---------------
  
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

//-------------------------------------getTail--------------------------------------

const getTail = function (userArgs,fs) {
  let tailDetails = extractInputs(userArgs);
  let { files, option, noOfLines } = tailDetails;
  if (handleTailErrors(option, noOfLines)) {
    return handleTailErrors(option, noOfLines);
  }
  let type = { n: extractTailingLines, c: extractTailingChars };
  let tail = "";
  let delimeter = "";

  for (let file of files) {
    if (!fs.existsSync(file)) {
      let error = "tail: " + file + ": No such file or directory";
      tail = tail + delimeter + error;
      delimeter = "\n";
      continue;
    }

    let data = fs.readFileSync(file, "utf8");
    if (files.length == 1) {
      return type[option](data, noOfLines);
    }
    tail = tail + delimeter + createHeadLines(file) + "\n" + type[option](data, noOfLines);
    delimeter = "\n\n";
  }
  return tail;    
};

exports.getTail = getTail;

const getMissingFileError = function(file,existsSync) {
  let error = "head: " + file + ": No such file or directory";
  if(!existsSync(file)) {
    return error;
  }
};

exports.getMissingFileError = getMissingFileError;

const getSingleFileHead = function(headDetails,type,fs) {
  let {files,option,noOfLines} = headDetails;
  if(files.length == 1 && fs.existsSync(files[0])) {
    return getMissingFileError(files[0],fs.existsSync) || type[option](fs.readFileSync(files[0],'utf8'),noOfLines);
  }
}

exports.getSingleFileHead = getSingleFileHead;

const getHead = function(userArgs,fs) {
  let headDetails = extractInputs(userArgs);
  let {files,option,noOfLines} = headDetails;
  return handleErrors(option,noOfLines) || head(headDetails,fs);
};

exports.getHead = getHead;

const head = function(headDetails,fs) {
  let {files,option,noOfLines} = headDetails;  
  let type = {n:extractLines , c:extractCharacters};
  let linesAtTop = "";
  for(let file of files) { 
    linesAtTop = linesAtTop + (getMissingFileError(file,fs.existsSync) || createHeadLines(file) +'\n'+ type[option](fs.readFileSync(file,'utf8'),noOfLines))+'\n\n';
  }
  return getSingleFileHead(headDetails,type,fs) || linesAtTop;
}

exports.head = head;