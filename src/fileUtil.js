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

//--------------------------extractHeadContent--------------------

const extractHeadContent = function (delimeter, text, count) {
  let contentArray = text.split(delimeter);
  return contentArray.slice(0, Math.min(count, contentArray.length)).join(delimeter);
}

//---------------------------extractTailContent----------------------

const extractTailContent = function (delimeter, text, count) {
  let contentArray = text.split(delimeter);
  let leadingCount = Math.max(contentArray.length - count, 0);
  return contentArray.slice(leadingCount, contentArray.length).join(delimeter);
}

const extractHeadLines = extractHeadContent.bind(null, '\n');

const extractHeadCharacters = extractHeadContent.bind(null, '');

const extractTailLines = extractTailContent.bind(null, '\n');

const extractTailCharacters = extractTailContent.bind(null, '');

//---------------------------getLeadingCount-------------------------

const getLeadingCount = function (count, length) {
  return Math.max(length - count, 0);
}

//-----------------------------getSingleFileContent-----------------------

const getSingleFileContent = function (commandDetails, type, fs) {
  let singleFileContent = '';
  if (commandDetails.files.length == 1) {
    singleFileContent = generateSingleFileContent(commandDetails, type, fs);
  }
  return singleFileContent;
}

//-----------------------------generateSingleFileContent-----------------

const generateSingleFileContent = function (commandDetails, type, fs) {
  let { files, option, count, command } = commandDetails;
  let error = missingFileError(files[0], fs.existsSync, command);
  return error || type[option](fs.readFileSync(files[0], 'utf8'), count);
}

//----------------------------getHead-------------------------------

const getHead = function (userArgs, fs) {
  let commandDetails = parseInput(userArgs);
  commandDetails.command = 'head';
  let { option, count } = commandDetails;
  return handleHeadErrors(option, count) || getRequiredContent(commandDetails, typeOfOptionHead, fs);
};

//------------------------------getRequiredContent-------------------------

const getRequiredContent = function (commandDetails, typeOfOption, fs) {
  let contentGenerator = generateContent.bind(null, commandDetails, fs, typeOfOption);
  let requiredContent = commandDetails.files.map(contentGenerator);
  let singleFileContent = getSingleFileContent(commandDetails, typeOfOption, fs);
  return singleFileContent || requiredContent.join('\n');
}

//----------------------------------generateContent-----------------------------
const typeOfOptionHead = { n: extractHeadLines, c: extractHeadCharacters };

const typeOfOptionTail = { n: extractTailLines, c: extractTailCharacters };

const generateContent = function (commandDetails, fs, typeOfOption, file) {
  let { option, count, command } = commandDetails;
  let errorMessage = missingFileError(file, fs.existsSync, command);
  return errorMessage || generateHeading(file) + '\n' + typeOfOption[option](fs.readFileSync(file, 'utf8'), count);
}

//----------------------------------getTail------------------------

const getTail = function (userArgs, fs) {
  let commandDetails = parseInput(userArgs);
  commandDetails.command = 'tail';
  let { option, count } = commandDetails;
  return handleTailErrors(option, count) || getRequiredContent(commandDetails, typeOfOptionTail, fs);
};

module.exports = {
  getSingleFileContent,
  getLeadingCount,
  getTail,
  extractTailCharacters,
  extractTailLines,
  getHead,
  extractHeadCharacters,
  extractHeadLines,
  generateHeading,
  getRequiredContent
};