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

//-----------------------------generateSingleFileContent-----------------------

const generateSingleFileContent = function (commandDetails, type, fs) {
  let { files, option, count, command } = commandDetails;
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

const getRequiredContent = function (commandDetails, typeOfOption, fs) {
  let contentGenerator = generateContent.bind(null, commandDetails, fs, typeOfOption);
  let requiredContent = commandDetails.files.map(contentGenerator);
  let singleFileContent = generateSingleFileContent(commandDetails, typeOfOption, fs);
  return singleFileContent || requiredContent.join('');
}

//----------------------------------generateContent-----------------------------

const generateContent = function (commandDetails, fs, typeOfOption, file) {
  let { option, count, command } = commandDetails;
  let content = generateHeading(file) + '\n';
  content = content + typeOfOption[option](fs.readFileSync(file, 'utf8'), count) + '\n\n';
  return missingFileError(file, fs.existsSync, command) || content;
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
  generateSingleFileContent,
  getTrailingLines,
  getTail,
  extractTailCharacters,
  extractTailLines,
  getHead,
  extractHeadCharacters,
  extractHeadLines,
  generateHeading
};