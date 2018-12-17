//---------------------parseInput-------------------

const parseInput = function (userArgs) {
  let commandDetails = new Object();
  commandDetails.option = extractOption(userArgs[0]);
  let { lines, index } = noOfLinesWithFileIndex(userArgs.slice(0, 2));
  commandDetails.noOfLines = lines;
  commandDetails.files = userArgs.slice(index, userArgs.length);
  return commandDetails;
};

exports.parseInput = parseInput;

//--------------------------extractOption---------------

const extractOption = function (optionCandidate) {
  return userOption(optionCandidate) || 'n';
};

exports.extractOption = extractOption;

//----------------------------userOption----------------------

const userOption = function (optionCandidate) {
  if (optionCandidate.match(/^-[A-m O-z]/)) {
    return optionCandidate[1];
  }
}

exports.userOption = userOption;

//-------------------------noOfLinesWithFileIndex-------------------

const noOfLinesWithFileIndex = function (userArgs) {
  if (userArgs[0].match(/^-[0-9]/)) {
    return { lines: userArgs[0].slice(1), index: 1 };
  }
  if (userArgs[0].match(/^-.[0-9]/)) {
    return { lines: userArgs[0].slice(2), index: 1 };
  }
  if (userArgs[0].match(/^-/) && userArgs[1].match(/[0-9]/)) {
    return { lines: userArgs[1], index: 2 }
  }
  return { lines: '10', index: 0 };
};

exports.noOfLinesWithFileIndex = noOfLinesWithFileIndex;

//-------------------------createHeadLines--------------

const createHeadLines = function (filename) {
  return "==> " + filename + " <==";
};

exports.createHeadLines = createHeadLines;


//-----------------------------extractHeadLines------------

const extractHeadLines = function (text, noOfLines) {
  let lines = text.split("\n");
  noOfLines = smallerNumber(noOfLines, lines.length);
  return lines.slice(0, noOfLines).join("\n");
};

exports.extractHeadLines = extractHeadLines;

//-----------------------------smallerNumber------------------

const smallerNumber = function (firstNumber, secondNumber) {
  return firstNumber >= secondNumber ? secondNumber : firstNumber;
}

exports.smallerNumber = smallerNumber;

//----------------------extractHeadCharacters---------------

const extractHeadCharacters = function (text, noOfChars) {
  let characters = text.split("");
  return characters.slice(0, noOfChars).join("");
};

exports.extractHeadCharacters = extractHeadCharacters;

//----------------------handleHeadErrors---------------------

const handleHeadErrors = function (option, noOfLines) {
  return invalidHeadOptionError(option) || invalidCountError(noOfLines, option);
};

exports.handleHeadErrors = handleHeadErrors;

//-------------------------------invalidHeadOptionError---------------------

const invalidHeadOptionError = function (optionCandidate) {
  let optionError = "head: illegal option -- " + optionCandidate[0] + "\nusage:head [-n lines | -c bytes] [file ...]";
  if (optionCandidate != 'c' && optionCandidate != 'n') {
    return optionError;
  }
}

exports.invalidHeadOptionError = invalidHeadOptionError;

//------------------------------invalidCountError-------------------------

const invalidCountError = function (count, option) {
  let countError = new Object;
  countError['n'] = "head: illegal line count -- " + count;
  countError['c'] = "head: illegal byte count -- " + count;
  if ((count <= 0 || count.match(/[a-z A-Z]/))) {
    return countError[option];
  }
}

exports.invalidCountError = invalidCountError;

//-----------------------------------extractTailLines---------------------------

const extractTailLines = function (text, noOfLines) {
  let lines = text.split('\n')
  let trailingLines = getTrailingLines(noOfLines, lines.length);
  return lines.slice(trailingLines, lines.length).join('\n');
}

exports.extractTailLines = extractTailLines;

//---------------------------getTrailingLines-------------------------

const getTrailingLines = function (noOfLines, length) {
  return noOfLines >= length ? 0 : Math.abs(length - noOfLines);
}

exports.getTrailingLines = getTrailingLines;

//----------------------extractHeadCharacters---------------

const extractTailCharacters = function (text, noOfChars) {
  let characters = text.split('')
  let trailingChars = getTrailingLines(noOfChars, characters.length);
  return characters.slice(trailingChars, characters.length).join('')
}

exports.extractTailCharacters = extractTailCharacters;

//------------------------------handleTailErrors------------------------

const handleTailErrors = function (option, noOfLines) {
  return invalidTailOptionError(option) || isNoOfLinesZero(noOfLines) || illegalOffsetError(noOfLines);
};

exports.handleTailErrors = handleTailErrors;

//-----------------------------------invalidTailOptionError--------------------

const invalidTailOptionError = function (option) {
  let optionError = 'tail: illegal option -- ' + option + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
  if (option != 'c' && option != 'n') {
    return optionError;
  }
}

exports.invalidTailOptionError = invalidTailOptionError;

//--------------------------------isNoOfLinesZero-----------------------------

const isNoOfLinesZero = function (noOfLines) {
  if (noOfLines == 0) {
    return ' ';
  }
}

exports.isNoOfLinesZero = isNoOfLinesZero;

//---------------------------------illegalOffsetError-----------------------

const illegalOffsetError = function (noOfLines) {
  let errorMessage = 'tail: illegal offset -- ' + noOfLines;
  if (noOfLines.match(/[a-z A-Z]/)) {
    return errorMessage;
  }
}

exports.illegalOffsetError = illegalOffsetError;

//------------------------------missingFileError-------------------

const missingFileError = function (file, existsSync, command) {
  let head = "head: " + file + ": No such file or directory";
  let tail = 'tail: ' + file + ": No such file or directory";
  let error = { head, tail };
  if (!existsSync(file)) {
    return error[command];
  }
};

exports.missingFileError = missingFileError;

//-----------------------------singleFileOutput-----------------------

const singleFileOutput = function (commandDetails, type, fs, command) {
  let { files, option, noOfLines } = commandDetails;
  if (files.length == 1 && fs.existsSync(files[0])) {
    return missingFileError(files[0], fs.existsSync, command) || type[option](fs.readFileSync(files[0], 'utf8'), noOfLines);
  }
}

exports.singleFileOutput = singleFileOutput;

//----------------------------getHead-------------------------------

const getHead = function (userArgs, fs) {
  let commandDetails = parseInput(userArgs);
  let { files, option, noOfLines } = commandDetails;
  return handleHeadErrors(option, noOfLines) || head(commandDetails, fs);
};

exports.getHead = getHead;

//-------------------------------head---------------------------

const head = function (commandDetails, fs) {
  let { files, option, noOfLines } = commandDetails;
  let type = { n: extractHeadLines, c: extractHeadCharacters };
  let linesAtTop = "";
  for (let file of files) {
    linesAtTop = linesAtTop + (missingFileError(file, fs.existsSync, 'head') || createHeadLines(file) + '\n' + type[option](fs.readFileSync(file, 'utf8'), noOfLines)) + '\n\n';
  }
  return singleFileOutput(commandDetails, type, fs, 'head') || linesAtTop;
}

exports.head = head;

//----------------------------------getTail------------------------

const getTail = function (userArgs, fs) {
  let tailDetails = parseInput(userArgs);
  let { files, option, noOfLines } = tailDetails;
  return handleTailErrors(option, noOfLines) || tail(tailDetails, fs);
};

exports.getTail = getTail;

//------------------------------------tail------------------------

const tail = function (tailDetails, fs) {
  let { files, option, noOfLines } = tailDetails;
  let type = { n: extractTailLines, c: extractTailCharacters };
  let linesAtBottom = "";
  for (let file of files) {
    linesAtBottom = linesAtBottom + (missingFileError(file, fs.existsSync, 'tail') || createHeadLines(file) + '\n' + type[option](fs.readFileSync(file, 'utf8'), noOfLines)) + '\n\n';
  }
  return singleFileOutput(tailDetails, type, fs, 'tail') || linesAtBottom;
}

exports.tail = tail;

module.exports = {
  singleFileOutput,
  missingFileError,
  illegalOffsetError,
  isNoOfLinesZero,
  invalidTailOptionError,
  getTrailingLines,
  smallerNumber,
  invalidCountError,
  invalidHeadOptionError,
  userOption,
  getTail,
  handleTailErrors,
  extractTailCharacters,
  extractTailLines,
  handleHeadErrors,
  getHead,
  extractOption,
  noOfLinesWithFileIndex,
  extractHeadCharacters,
  extractHeadLines,
  parseInput,
  createHeadLines
};