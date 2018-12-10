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
  if (optionCandidate.match(/^-[a-m o-z A-M O-Z]/)) {
    return optionCandidate[1];
  }
  return 'n';
};

exports.extractOption = extractOption;

//-------------------------extractNoOfLines-------------------
const extractNoOfLines = function(userArgs) {
  if (extractNumber(userArgs)) {
    return extractNumber(userArgs);
  }
  let array = userArgs[0].split("");
  let lines =
    parseInt(array[1]) || parseInt(array[1]) == 0
      ? { lines: array[1], index: 3 }
      : { lines: "10", index: 2 };
  return noOfLines(array[2],userArgs[1],3,4) || lines;
};

exports.extractNoOfLines = extractNoOfLines;

//--------------------------------noOfLines---------------------

const noOfLines = function(firstNumber,secondNumber,firstIndex,secondIndex) {
  if(parseInt(firstNumber) || parseInt(firstNumber) == 0) {
    return { lines:firstNumber,index:firstIndex};
  }
  if(parseInt(secondNumber) || parseInt(secondNumber) == 0) {
    return { lines:secondNumber,index:secondIndex};
  }
}

exports.noOfLines = noOfLines;

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
  if (lines.length <= noOfLines) {
    noOfLines = lines.length;
  }
  return lines.slice(0, noOfLines).join("\n");
};

exports.extractLines = extractLines;

//----------------------extractCharacters---------------
const extractCharacters = function(text, noOfChars) {
  let characters = text.split("");
  return characters.slice(0, noOfChars).join("");
};

exports.extractCharacters = extractCharacters;

//----------------------handleErrors---------------------

const handleErrors = function(option, noOfLines) {
  let optionError = "head: illegal option -- " + option[0] + "\nusage:head [-n lines | -c bytes] [file ...]";
  if (option != "c" && option != "n") {
    return optionError;
  }
  let errorMessage = new Object;
  errorMessage['n'] = "head: illegal line count -- " + noOfLines;
  errorMessage['c'] = "head: illegal byte count -- " + noOfLines;
  if ((noOfLines <= 0 || noOfLines.match(/[a-z A-Z]/))) {
    return errorMessage[option];
  }
};

exports.handleErrors = handleErrors;

//--------------------------getHead---------------------
const getHead = function(userArgs, fs) {
  let headDetails = extractInputs(userArgs);
  let { files, option, noOfLines } = headDetails;
  if (handleErrors(option, noOfLines)) {
    return handleErrors(option, noOfLines);
  }
  let type = { n: extractLines, c: extractCharacters };
  let head = "";
  let delimeter = "";

  for (let file of files) {
    if (!fs.existsSync(file)) {
      let error = "head: " + file + ": No such file or directory";
      head = head + delimeter + error;
      delimeter = "\n";
      continue;
    }

    let data = fs.readFileSync(file, "utf8");
    if (files.length == 1) {
      return type[option](data, noOfLines);
    }
    head = head + delimeter + createHeadLines(file) + "\n" + type[option](data, noOfLines);
    delimeter = "\n\n";
  }
  return head;
};

exports.getHead = getHead;

//-----------------------------------extractTailingLines---------------------------
  
const extractTailingLines = function (text, noOfLines) {
  let lines = text.split('\n')
  let trailingLines = Math.abs(lines.length - noOfLines);
  if (lines.length <= noOfLines) {
    trailingLines = 0;
  }
  return lines.slice(trailingLines, lines.length).join('\n');
}
exports.extractTailingLines = extractTailingLines;

//----------------------extractCharacters---------------
  
const extractTailingChars = function (text, noOfChars) {
  let characters = text.split('')
  let trailingChars = Math.abs(characters.length - noOfChars);
  if (characters.length <= noOfChars) {
    trailingChars = 0;
  }
  return characters.slice(trailingChars, characters.length).join('')
}

exports.extractTailingChars = extractTailingChars;

//------------------------------handleTailErrors------------------------
  
const handleTailErrors = function(option, noOfLines) {
  let optionError = 'tail: illegal option -- ' + option + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
  if (option != "c" && option != "n") {
    return optionError;
  }
  if(noOfLines == 0) {
    return;
  }
  
  let errorMessage = 'tail: illegal offset -- ' + noOfLines;
  if (noOfLines.match(/[a-z A-Z]/)) {
    return errorMessage;
  }
};

exports.handleTailErrors = handleTailErrors;

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