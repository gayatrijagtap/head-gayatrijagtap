const assert = require("assert");
const {
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
  generateHeading
} = require("../src/lib.js");

//---------------------parseInput tests-------------------
describe("parseInput", function () {
  it('should return commandDetails for single file with default option and count', function () {
    let actualOutput = parseInput(['file1']);
    let expectedOutput = { option: 'n', count: 10, files: ['file1'] };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return commandDetails for multiple files with default option and count', function () {
    let actualOutput = parseInput(['file1', 'file2']);
    let expectedOutput = { option: 'n', count: 10, files: ['file1', 'file2'] };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return commandDetails when option and count are not seperated", function () {
    let actualOutput = parseInput(["-n5", "file1"]);
    let expectedOutput = { option: "n", count: 5, files: ["file1"] };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return commandDetails when option and count are seperated', function () {
    let actualOutput = parseInput(["-n", "5", "file1"]);
    let expectedOutput = { option: "n", count: 5, files: ["file1"] };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return commandDetails when option and count are provided with multiple files', function () {
    let actualOutput = parseInput(["-c5", "file1", "file2"]);
    let expectedOutput = { option: "c", count: 5, files: ["file1", "file2"] };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return commandDetails with default option for single file when option is not passed", function () {
    let actualOutput = parseInput(["-5", "file1"]);
    let expectedOutput = { option: "n", count: 5, files: ["file1"] };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return commandDetails with default option for multiple files when option is not passed', function () {
    let userArgs = ["-5", "file1", "file2"];
    let actualOutput = parseInput(userArgs);
    let expectedOutput = { option: "n", count: 5, files: ["file1", "file2"] };
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//-------------------------generateHeading tests--------------
describe("generateHeading", function () {
  it("should return the heading for the given file name", function () {
    let actualOutput = generateHeading("mars");
    let expectedOutput = "==> mars <==";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return heading for empty string', function () {
    let actualOutput = generateHeading('');
    let expectedOutput = '==>  <==';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return heading for undefined', function () {
    let actualOutput = generateHeading(undefined);
    let expectedOutput = '==> undefined <==';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//-----------------------------extractHeadLines tests------------
describe("extractHeadLines", function () {
  it("should return the head with given number of lines if the length of file is greater than number of lines", function () {
    let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    let expectedOutput = "fhash\nhsakh\nfkdsh";
    assert.deepEqual(extractHeadLines(data, 3), expectedOutput);
  });

  it('should return whole file if the length of file is smaller than or equal to given number of lines', function () {
    let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    let expectedOutput = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    assert.deepEqual(extractHeadLines(data, 7), expectedOutput);
  });
});

//----------------------extractHeadCharacters tests---------------
describe("extractHeadCharacters", function () {
  let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk";
  it("should return given number of characters from the top of the file", function () {
    let actualOutput = extractHeadCharacters(data, 3);
    let expectedOutput = "fha";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given number of characters including new line', function () {
    let actualOutput = extractHeadCharacters(data, 7);
    let expectedOutput = "fhash\nh";
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//--------------------------extractOption tests---------------
describe("extractOption", function () {
  it("should return byte option from the given input when option and count are given together", function () {
    assert.deepEqual(extractOption("-c5"), "c");
  });
  it('should extract line option from the given input when option and count are not given together', function () {
    assert.deepEqual(extractOption("-n"), "n");
  });
  it('should return default option when no option is passed', function () {
    assert.deepEqual(extractOption("-5"), "n");
  });
});

//----------------------------userOption tests--------------------

describe('userOption', function () {
  it('should return option when option and count are given together', function () {
    assert.deepEqual(userOption('-s5'), 's');
  });
  it('should return option when option and count are not given together', function () {
    assert.deepEqual(userOption('-s'), 's');
  });
  it('should return undefined if option is not passed', function () {
    assert.deepEqual(userOption('-5'), undefined);
  });
})

//-------------------------countWithFileIndex tests-------------------
describe("countWithFileIndex", function () {
  it("should return count with file starting index when count is given along with option", function () {
    let actualOutput = countWithFileIndex(["-c5", ""]);
    let expectedOutput = { count: 5, index: 1 };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return count with file starting index when count is given without option', function () {
    let actualOutput = countWithFileIndex(["-5", ""]);
    let expectedOutput = { count: 5, index: 1 };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return count with file starting index when count and option are given seperately', function () {
    actualOutput = countWithFileIndex(["-c", "2"]);
    expectedOutput = { count: 2, index: 2 };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return default no of lines if it is not given', function () {
    let actualOutput = countWithFileIndex(["file1", "file2"]);
    let expectedOutput = { count: 10, index: 0 };
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//--------------------------getHead tests---------------------

describe("getHead", function () {
  let readFileSync = file => file;
  let existsSync = file => true;
  let fs = { readFileSync, existsSync };

  it("should return head of the file for option n with given no of lines", function () {
    let data = "fsdjfhsdh\ndfjkshjk\ndsfjdfdkjfs";
    let userArgs = ["-n2", data];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = "fsdjfhsdh\ndfjkshjk";
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it('should return head of the file for option c with given no of characters', function () {
    let data = "grldfjd";
    let userArgs = ["-c", "4", data];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = "grld";
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//-------------------------handleHeadErrors tests----------------
describe("handleHeadErrors", function () {

  it("should return error message for illegal option when optionCandidate is character", function () {
    let optionError =
      "head: illegal option -- " + "s" +
      "\nusage:head [-n lines | -c bytes] [file ...]";
    let actualOutput = handleHeadErrors("s", "12");
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return error message for illegal option when optionCandidate is alphaNumeric', function () {
    let optionError =
      "head: illegal option -- " + "a" +
      "\nusage:head [-n lines | -c bytes] [file ...]";
    let actualOutput = handleHeadErrors("a1", "1");
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return error message for illegal line count when count is zero", function () {
    let lineError = "head: illegal line count -- " + "0";
    let actualOutput = handleHeadErrors("n", 0);
    let expectedOutput = lineError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return error message for illegal line count when count is negative', function () {
    lineError = "head: illegal line count -- " + "-1";
    actualOutput = handleHeadErrors("n", -1);
    expectedOutput = lineError;
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return error message for illegal byte count when count is zero", function () {
    let byteError = "head: illegal byte count -- " + "0";
    let actualOutput = handleHeadErrors("c", 0);
    let expectedOutput = byteError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return error message for illegal byte count when count is negative', function () {
    byteError = "head: illegal byte count -- " + "-1";
    actualOutput = handleHeadErrors("c", -1);
    expectedOutput = byteError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//--------------------------------------invalidHeadOptionError tests----------------------

describe('invalidHeadOptionError', function () {
  let optionError = "head: illegal option -- " + 's' + "\nusage:head [-n lines | -c bytes] [file ...]";
  it('should return error for the invalid option', function () {
    let actualOutput = invalidHeadOptionError('s');
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return undefined for the valid option', function () {
    let actualOutput = invalidHeadOptionError('n');
    let expectedOutput = undefined;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//---------------------------------------invalidCountError tests------------------------

describe('invalidCountError', function () {
  it('should return illegal byte count error for invalid byte count and count zero', function () {
    let byteError = "head: illegal byte count -- " + "0";
    let actualOutput = invalidCountError(0, 'c');
    let expectedOutput = byteError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return illegal line count error for invalid line count and negative count', function () {
    let lineError = "head: illegal line count -- " + "-1";
    let actualOutput = invalidCountError(-1, 'n');
    let expectedOutput = lineError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//--------------------------------------extractTailLines tests------------------------

describe('extractTailLines', function () {
  let text = 'dfs\ndfs\nfd\ngre\ngfe';
  it('should return empty string lines from bottom of the file when count is 0', function () {
    let actualOutput = extractTailLines(text, 0)
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given number of lines from bottom of the file when the file is larger than count', function () {
    let actualOutput = extractTailLines(text, 2);
    let expectedOutput = 'gre\ngfe';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return single line from bottom of the file when count is 1', function () {
    actualOutput = extractTailLines(text, 1);
    expectedOutput = 'gfe';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it('should return whole file when count is greater than or equal to lines in file', function () {
    let actualOutput = extractTailLines(text, 6);
    let expectedOutput = text;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//------------------------------------------getTrailingLines tests-------------------------

describe('getTrailingLines', function () {
  it('should return number of trailing lines for given length and number of lines', function () {
    assert.deepEqual(getTrailingLines(5, 6), 1);
  });
  it('should return 0 if there are no trailing lines', function () {
    assert.deepEqual(getTrailingLines(5, 4), 0);
    assert.deepEqual(getTrailingLines(6, 6), 0);
  });
})

//-------------------------------------extractTailCharacters------------------------------

describe('extractTailCharacters', function () {
  let text = 'jd djf \n kfd fdhj';
  it('should return empty string when count is 0', function () {
    let actualOutput = extractTailCharacters(text, 0);
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given number of characters from the bottom of the file', function () {
    let actualOutput = extractTailCharacters(text, 2);
    let expectedOutput = 'hj';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given number of characters from bottom of the file and should work for new line also', function () {
    actualOutput = extractTailCharacters(text, 5);
    expectedOutput = ' fdhj';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given no of characters and should work for blank characters also', function () {
    let actualOutput = extractTailCharacters(text, 8);
    let expectedOutput = 'kfd fdhj';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return whole file if no of characters is greater than or equal to no of characters in file', function () {
    let actualOutput = extractTailCharacters(text, 20);
    let expectedOutput = text;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//----------------------------------handleTailErrors tests---------------------------------

describe('handleTailErrors', function () {
  it('should give error for illegal option', function () {
    let optionError = 'tail: illegal option -- ' + 's' + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    let actualOutput = handleTailErrors('s', 1);
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should give error for illegal offset', function () {
    let errorMessage = 'tail: illegal offset -- ' + '5d';
    let actualOutput = handleTailErrors('n', '5d');
    let expectedOutput = errorMessage;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return empty string if the number of lines is 0', function () {
    let actualOutput = handleTailErrors('n', '0');
    let expectedOutput = ' ';
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//----------------------------------invalidTailOptionError tests----------------------

describe('invalidTailOptionError', function () {
  it('should give error for illegal option', function () {
    let optionError = 'tail: illegal option -- ' + 's' + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    let actualOutput = invalidTailOptionError('s');
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should give error when option is alphaNumeric', function () {
    let optionError = 'tail: illegal option -- ' + 's1' + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    let actualOutput = invalidTailOptionError('s1');
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//----------------------------------countZeroError tests------------------------------

describe('countZeroError', function () {
  it('should return empty string if given number of lines is zero', function () {
    let actualOutput = countZeroError('0');
    let expectedOutput = ' ';
    assert.deepEqual(actualOutput, expectedOutput);

    actualOutput = countZeroError('1');
    expectedOutput = undefined;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//------------------------------------illegalOffsetError tests--------------------------

describe('illegalOffsetError', function () {
  it('should return error for the given illegal offset', function () {
    let errorMessage = 'tail: illegal offset -- ' + '5d';
    let actualOutput = illegalOffsetError('5d');
    let expectedOutput = errorMessage;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//---------------------------------getTail tests----------------------------------

describe('getTail', function () {
  let readFileSync = file => file;
  let existsSync = file => true;
  let fs = { readFileSync, existsSync };
  it('should return tail of the file with given specifications', function () {
    let data = "fsdjfhsdh\ndfjkshjk\ndsfjdfdkjfs";
    let userArgs = ["-n2", data];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = "dfjkshjk\ndsfjdfdkjfs";
    assert.deepEqual(actualOutput, expectedOutput);

    data = "grldfjd";
    userArgs = ["-c", "4", data];
    actualOutput = getTail(userArgs, fs);
    expectedOutput = "dfjd";
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//------------------------------------missingFileError tests----------------------

describe('missingFileError', function () {
  const isExists = function (data) {
    if (data) {
      return true;
    }
  }
  let data = false;
  let headError = "head: " + data + ": No such file or directory";
  let tailError = "tail: " + data + ": No such file or directory";
  it('should return error for missing file for head', function () {
    let actualOutput = missingFileError(data, isExists, 'head');
    let expectedOutput = headError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return error for missing file for tail', function () {
    let actualOutput = missingFileError(data, isExists, 'tail');
    let expectedOutput = tailError;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//----------------------------------singleFileOutput tests----------------------

describe('singleFileOutput', function () {
  let data;
  let content;
  let fs = { existsSync: x => false };
  it('should return head without headline if there is only one file in user inputs', function () {
    let actualOutput = singleFileOutput({ files: [data, content], option: 'n', count: 1 }, fs, 'head');
    let expectedOutput = undefined;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})