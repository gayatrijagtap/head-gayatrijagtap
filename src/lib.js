const { parseInput } = require('./inputParser.js');

//-------------------------generateHeading--------------

const generateHeading = function (filename) {
  return "==> " + filename + " <==";
};

//-----------------------------extractHeadLines------------

const extractHeadLines = function (text, count) {
  let lines = text.split("\n");
  count = Math.min(count, lines.length);
  return lines.slice(0, count).join("\n");
};

//----------------------extractHeadCharacters---------------

const extractHeadCharacters = function (text, noOfChars) {
  let characters = text.split("");
  return characters.slice(0, noOfChars).join("");
};

//----------------------handleHeadErrors---------------------

const handleHeadErrors = function (option, count) {
  return invalidHeadOptionError(option) || invalidCountError(count, option);
};

//-------------------------------invalidHeadOptionError---------------------

const invalidHeadOptionError = function (optionCandidate) {
  let optionError = "head: illegal option -- " + optionCandidate[0] + "\nusage:head [-n lines | -c bytes] [file ...]";
  if (optionCandidate != 'c' && optionCandidate != 'n') {
    return optionError;
  }
}

//------------------------------invalidCountError-------------------------

const invalidCountError = function (count, option) {
  let countError = new Object;
  countError['n'] = "head: illegal line count -- " + count;
  countError['c'] = "head: illegal byte count -- " + count;
  if ((count <= 0 || count.match(/[A-z]/))) {
    return countError[option];
  }
}

//-----------------------------------extractTailLines---------------------------

const extractTailLines = function (text, count) {
  let lines = text.split('\n')
  let trailingLines = getTrailingLines(count, lines.length);
  return lines.slice(trailingLines, lines.length).join('\n');
}

//---------------------------getTrailingLines-------------------------

const getTrailingLines = function (count, length) {
  return count >= length ? 0 : Math.abs(length - count);
}

//----------------------extractHeadCharacters---------------

const extractTailCharacters = function (text, noOfChars) {
  let characters = text.split('')
  let trailingChars = getTrailingLines(noOfChars, characters.length);
  return characters.slice(trailingChars, characters.length).join('')
}

//------------------------------handleTailErrors------------------------

const handleTailErrors = function (option, count) {
  return invalidTailOptionError(option) || countZeroError(count) || illegalOffsetError(count);
};

//-----------------------------------invalidTailOptionError--------------------

const invalidTailOptionError = function (option) {
  let optionError = 'tail: illegal option -- ' + option + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
  if (option != 'c' && option != 'n') {
    return optionError;
  }
}

//--------------------------------countZeroError-----------------------------

const countZeroError = function (count) {
  if (count == 0) {
    return ' ';
  }
}

//---------------------------------illegalOffsetError-----------------------

const illegalOffsetError = function (count) {
  let errorMessage = 'tail: illegal offset -- ' + count;
  if (count.match(/[A-z]/)) {
    return errorMessage;
  }
}

//------------------------------missingFileError-------------------

const missingFileError = function (file, existsSync, command) {
  let error = command + ": " + file + ": No such file or directory";
  if (!existsSync(file)) {
    return error;
  }
};

//-----------------------------singleFileOutput-----------------------

const singleFileOutput = function (commandDetails, type, fs, command) {
  let { files, option, count } = commandDetails;
  if (files.length == 1 && fs.existsSync(files[0])) {
    return missingFileError(files[0], fs.existsSync, command) || type[option](fs.readFileSync(files[0], 'utf8'), count);
  }
}

//----------------------------getHead-------------------------------

const getHead = function (userArgs, fs) {
  let commandDetails = parseInput(userArgs);
  let { option, count } = commandDetails;
  return handleHeadErrors(option, count) || head(commandDetails, fs);
};

//-------------------------------head---------------------------

const head = function (commandDetails, fs) {
  let { files, option, count } = commandDetails;
  let type = { n: extractHeadLines, c: extractHeadCharacters };
  let linesAtTop = "";
  for (let file of files) {
    linesAtTop = linesAtTop + (missingFileError(file, fs.existsSync, 'head') ||
      generateHeading(file) + '\n' + type[option](fs.readFileSync(file, 'utf8'), count)) + '\n\n';
  }
  return singleFileOutput(commandDetails, type, fs, 'head') || linesAtTop;
}

//----------------------------------getTail------------------------

const getTail = function (userArgs, fs) {
  let tailDetails = parseInput(userArgs);
  let { option, count } = tailDetails;
  return handleTailErrors(option, count) || tail(tailDetails, fs);
};

//------------------------------------tail------------------------

const tail = function (tailDetails, fs) {
  let { files, option, count } = tailDetails;
  let type = { n: extractTailLines, c: extractTailCharacters };
  let linesAtBottom = "";
  for (let file of files) {
    linesAtBottom = linesAtBottom + (missingFileError(file, fs.existsSync, 'tail') ||
      generateHeading(file) + '\n' + type[option](fs.readFileSync(file, 'utf8'), count)) + '\n\n';
  }
  return singleFileOutput(tailDetails, type, fs, 'tail') || linesAtBottom;
}

module.exports = {
  singleFileOutput,
  missingFileError,
  illegalOffsetError,
  countZeroError,
  invalidTailOptionError,
  getTrailingLines,
  invalidCountError,
  invalidHeadOptionError,
  getTail,
  handleTailErrors,
  extractTailCharacters,
  extractTailLines,
  handleHeadErrors,
  getHead,
  extractHeadCharacters,
  extractHeadLines,
  generateHeading
};