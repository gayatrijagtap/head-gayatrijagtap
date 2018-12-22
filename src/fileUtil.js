const { parseInput } = require('./inputParser.js');

const {
  handleHeadErrors,
  handleTailErrors,
  missingFileError
} = require('./errorHandler.js');

const extractHeadContent = function (delimeter, text, count) {
  let contentArray = text.split(delimeter);
  return contentArray.slice(0, Math.min(count, contentArray.length)).join(delimeter);
}

const extractTailContent = function (delimeter, text, count) {
  let contentArray = text.split(delimeter);
  let leadingCount = Math.max(contentArray.length - count, 0);
  return contentArray.slice(leadingCount, contentArray.length).join(delimeter);
}

const extractHeadLines = extractHeadContent.bind(null, '\n');

const extractHeadCharacters = extractHeadContent.bind(null, '');

const extractTailLines = extractTailContent.bind(null, '\n');

const extractTailCharacters = extractTailContent.bind(null, '');

const singleFileHeader = function (file) {
  return '';
}

const multipleFilesHeader = function (file) {
  return "==> " + file + " <==" + '\n';
}

const generateContent = function (headingGenerator, commandDetails, typeOfOption, fs, file) {
  let { option, count, command } = commandDetails;
  let heading = headingGenerator(file);
  let errorMessage = missingFileError(file, fs.existsSync, command);
  return errorMessage || heading + typeOfOption[option](fs.readFileSync(file, 'utf8'), count);
}

const generateSingleFileContent = generateContent.bind(null, singleFileHeader);

const generateMultipleFileContent = generateContent.bind(null, multipleFilesHeader);

const getSingleFileContent = function (commandDetails, type, fs) {
  let singleFileContent = '';
  if (commandDetails.files.length == 1) {
    let file = commandDetails.files[0];
    singleFileContent = generateSingleFileContent(commandDetails, type, fs, file);
  }
  return singleFileContent;
}

const typeOfOptionHead = { n: extractHeadLines, c: extractHeadCharacters };

const typeOfOptionTail = { n: extractTailLines, c: extractTailCharacters };

const getContent = function (command, typeOfOption, errorHandler, userArgs, fs) {
  let commandDetails = parseInput(userArgs);
  commandDetails.command = command;
  let { option, count } = commandDetails;
  return errorHandler(option, count) || getRequiredContent(commandDetails, typeOfOption, fs);
}

const getHead = getContent.bind(null, 'head', typeOfOptionHead, handleHeadErrors);

const getTail = getContent.bind(null, 'tail', typeOfOptionTail, handleTailErrors);

const getRequiredContent = function (commandDetails, typeOfOption, fs) {
  let contentGenerator = generateMultipleFileContent.bind(null, commandDetails, typeOfOption, fs);
  let requiredContent = commandDetails.files.map(contentGenerator);
  let singleFileContent = getSingleFileContent(commandDetails, typeOfOption, fs);
  return singleFileContent || requiredContent.join('\n');
}

module.exports = {
  getSingleFileContent,
  getTail,
  extractTailCharacters,
  extractTailLines,
  getHead,
  extractHeadCharacters,
  extractHeadLines,
  getRequiredContent,
  singleFileHeader,
  multipleFilesHeader
};