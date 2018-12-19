const { parseInput } = require('./inputParser.js');
const {
  handleHeadErrors,
  handleTailErrors,
  missingFileError
} = require('./errorHandler.js');

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

//-----------------------------generateSingleFileOutput-----------------------

const generateSingleFileOutput = function (commandDetails, type, fs, command) {
  let { files, option, count } = commandDetails;
  if (files.length == 1 && fs.existsSync(files[0])) {
    return missingFileError(files[0], fs.existsSync, command) || type[option](fs.readFileSync(files[0], 'utf8'), count);
  }
  return '';
}

//----------------------------getHead-------------------------------

const getHead = function (userArgs, fs) {
  let commandDetails = parseInput(userArgs);
  commandDetails.command = 'head';
  let { option, count } = commandDetails;
  let typesOfOption = { n: extractHeadLines, c: extractHeadCharacters };
  return handleHeadErrors(option, count) || getRequiredContent(commandDetails, typesOfOption, fs);
};

//------------------------------getRequiredContent-------------------------

const getRequiredContent = function (commandDetails, typesOfOption, fs) {
  let { files, option, count } = commandDetails;
  let content = '';
  for (let file of files) {
    content = content + (missingFileError(file, fs.existsSync, commandDetails.command) ||
      generateHeading(file) + '\n' + typesOfOption[option](fs.readFileSync(file, 'utf8'), count)) + '\n\n';
  }
  return generateSingleFileOutput(commandDetails, typesOfOption, fs, commandDetails.command) || content;
}

//----------------------------------getTail------------------------

const getTail = function (userArgs, fs) {
  let commandDetails = parseInput(userArgs);
  commandDetails.command = 'tail';
  let { option, count } = commandDetails;
  let typesOfOption = { n: extractTailLines, c: extractTailCharacters };
  return handleTailErrors(option, count) || getRequiredContent(commandDetails, typesOfOption, fs);
};

module.exports = {
  generateSingleFileOutput,
  getTrailingLines,
  getTail,
  extractTailCharacters,
  extractTailLines,
  getHead,
  extractHeadCharacters,
  extractHeadLines,
  generateHeading
};