//---------------------parseInput-------------------

const parseInput = function (userArgs) {
  let commandDetails = new Object();
  commandDetails.option = extractOption(userArgs[0]);
  let { count, index } = countWithFileIndex(userArgs.slice(0, 2));
  commandDetails.count = count;
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

//-------------------------countWithFileIndex-------------------

const countWithFileIndex = function (userArgs) {
  if (userArgs[0].match(/^-[0-9]/)) {
    return { count: userArgs[0].slice(1), index: 1 };
  }
  if (userArgs[0].match(/^-.[0-9]/)) {
    return { count: userArgs[0].slice(2), index: 1 };
  }
  if (userArgs[0].match(/^-/) && userArgs[1].match(/[0-9]/)) {
    return { count: userArgs[1], index: 2 }
  }
  return { count: '10', index: 0 };
};

exports.countWithFileIndex = countWithFileIndex;

//-------------------------createHeadLines--------------

const createHeadLines = function (filename) {
  return "==> " + filename + " <==";
};

exports.createHeadLines = createHeadLines;


//-----------------------------extractHeadLines------------

const extractHeadLines = function (text, count) {
  let lines = text.split("\n");
  count = Math.min(count, lines.length);
  return lines.slice(0, count).join("\n");
};

exports.extractHeadLines = extractHeadLines;

//----------------------extractHeadCharacters---------------

const extractHeadCharacters = function (text, noOfChars) {
  let characters = text.split("");
  return characters.slice(0, noOfChars).join("");
};

exports.extractHeadCharacters = extractHeadCharacters;

//----------------------handleHeadErrors---------------------

const handleHeadErrors = function (option, count) {
  return invalidHeadOptionError(option) || invalidCountError(count, option);
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
  if ((count <= 0 || count.match(/[A-z]/))) {
    return countError[option];
  }
}

exports.invalidCountError = invalidCountError;

//-----------------------------------extractTailLines---------------------------

const extractTailLines = function (text, count) {
  let lines = text.split('\n')
  let trailingLines = getTrailingLines(count, lines.length);
  return lines.slice(trailingLines, lines.length).join('\n');
}

exports.extractTailLines = extractTailLines;

//---------------------------getTrailingLines-------------------------

const getTrailingLines = function (count, length) {
  return count >= length ? 0 : Math.abs(length - count);
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

const handleTailErrors = function (option, count) {
  return invalidTailOptionError(option) || countZeroError(count) || illegalOffsetError(count);
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

//--------------------------------countZeroError-----------------------------

const countZeroError = function (count) {
  if (count == 0) {
    return ' ';
  }
}

exports.countZeroError = countZeroError;

//---------------------------------illegalOffsetError-----------------------

const illegalOffsetError = function (count) {
  let errorMessage = 'tail: illegal offset -- ' + count;
  if (count.match(/[A-z]/)) {
    return errorMessage;
  }
}

exports.illegalOffsetError = illegalOffsetError;

//------------------------------missingFileError-------------------

const missingFileError = function (file, existsSync, command) {
  let error = command + ": " + file + ": No such file or directory";
  if (!existsSync(file)) {
    return error;
  }
};

exports.missingFileError = missingFileError;

//-----------------------------singleFileOutput-----------------------

const singleFileOutput = function (commandDetails, type, fs, command) {
  let { files, option, count } = commandDetails;
  if (files.length == 1 && fs.existsSync(files[0])) {
    return missingFileError(files[0], fs.existsSync, command) || type[option](fs.readFileSync(files[0], 'utf8'), count);
  }
}

exports.singleFileOutput = singleFileOutput;

//----------------------------getHead-------------------------------

const getHead = function (userArgs, fs) {
  let commandDetails = parseInput(userArgs);
  let { option, count } = commandDetails;
  return handleHeadErrors(option, count) || head(commandDetails, fs);
};

exports.getHead = getHead;

//-------------------------------head---------------------------

const head = function (commandDetails, fs) {
  let { files, option, count } = commandDetails;
  let type = { n: extractHeadLines, c: extractHeadCharacters };
  let linesAtTop = "";
  for (let file of files) {
    linesAtTop = linesAtTop + (missingFileError(file, fs.existsSync, 'head') ||
      createHeadLines(file) + '\n' + type[option](fs.readFileSync(file, 'utf8'), count)) + '\n\n';
  }
  return singleFileOutput(commandDetails, type, fs, 'head') || linesAtTop;
}

exports.head = head;

//----------------------------------getTail------------------------

const getTail = function (userArgs, fs) {
  let tailDetails = parseInput(userArgs);
  let { option, count } = tailDetails;
  return handleTailErrors(option, count) || tail(tailDetails, fs);
};

exports.getTail = getTail;

//------------------------------------tail------------------------

const tail = function (tailDetails, fs) {
  let { files, option, count } = tailDetails;
  let type = { n: extractTailLines, c: extractTailCharacters };
  let linesAtBottom = "";
  for (let file of files) {
    linesAtBottom = linesAtBottom + (missingFileError(file, fs.existsSync, 'tail') ||
      createHeadLines(file) + '\n' + type[option](fs.readFileSync(file, 'utf8'), count)) + '\n\n';
  }
  return singleFileOutput(tailDetails, type, fs, 'tail') || linesAtBottom;
}

exports.tail = tail;

module.exports = {
  singleFileOutput,
  missingFileError,
  illegalOffsetError,
  countZeroError,
  invalidTailOptionError,
  getTrailingLines,
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
  countWithFileIndex,
  extractHeadCharacters,
  extractHeadLines,
  parseInput,
  createHeadLines
};