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
  getTail,
  handleTailErrors,
  extractTailCharacters,
  extractTailLines,
  handleHeadErrors,
  getHead,
  extractHeadCharacters,
  extractHeadLines,
  generateHeading
} = require("../src/lib.js");

const files = {
  file1: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12",
  file2: "abc def\n ghij \nklmn"
};
const fileNames = ['file1', 'file2'];
const readFileSync = file => files[file];
const existsSync = function (fileName) {
  return fileNames.includes(fileName);
}
const fs = { readFileSync, existsSync };

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
    let actualOutput = extractHeadLines(files.file1, 3);
    let expectedOutput = '1\n2\n3';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it('should return whole file if the length of file is smaller than or equal to given number of lines', function () {
    let actualOutput = extractHeadLines(files.file2, 7);
    let expectedOutput = 'abc def\n ghij \nklmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//----------------------extractHeadCharacters tests---------------
describe("extractHeadCharacters", function () {
  it("should return given number of characters from the top of the file", function () {
    let actualOutput = extractHeadCharacters(files.file1, 3);
    let expectedOutput = "1\n2";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given number of characters including new line', function () {
    let actualOutput = extractHeadCharacters(files.file2, 7);
    let expectedOutput = 'abc def';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//--------------------------getHead tests---------------------

describe("getHead", function () {
  it('should return head of the single file for default arguments', function () {
    let userArgs = ['file1'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return head of the single file for option n with given no of lines", function () {
    let userArgs = ["-n2", 'file1'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = "1\n2";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return head of the single file for option c with given no of characters', function () {
    let userArgs = ["-c", "4", 'file2'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = "abc ";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return head of the multiple files for default arguments', function () {
    let userArgs = ['file1', 'file2'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = '==> file1 <==\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n\n==> file2 <==\nabc def\n ghij \nklmn\n\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return head of the multiple files for option n with given no of lines", function () {
    let userArgs = ["-n2", 'file1', 'file2'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = '==> file1 <==\n1\n2\n\n==> file2 <==\nabc def\n ghij \n\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return head of the multiple files for option c with given no of characters', function () {
    let userArgs = ["-c", "4", 'file1', 'file2'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = '==> file1 <==\n1\n2\n\n\n==> file2 <==\nabc \n\n';
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
  it('should return empty string lines from bottom of the file when count is 0', function () {
    let actualOutput = extractTailLines(files.file1, 0);
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given number of lines from bottom of the file when the file is larger than count', function () {
    let actualOutput = extractTailLines(files.file1, 2);
    let expectedOutput = '11\n12';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return single line from bottom of the file when count is 1', function () {
    actualOutput = extractTailLines(files.file2, 1);
    expectedOutput = 'klmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it('should return whole file when count is greater than or equal to lines in file', function () {
    let actualOutput = extractTailLines(files.file2, 6);
    let expectedOutput = 'abc def\n ghij \nklmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//------------------------------------------getTrailingLines tests-------------------------

describe('getTrailingLines', function () {
  it('should return number of trailing lines for given length and number of lines', function () {
    assert.deepEqual(getTrailingLines(5, 6), 1);
  });
  it('should return 0 if there are no trailing lines', function () {
    assert.deepEqual(getTrailingLines(6, 6), 0);
  });
})

//-------------------------------------extractTailCharacters------------------------------

describe('extractTailCharacters', function () {
  it('should return empty string when count is 0', function () {
    let actualOutput = extractTailCharacters(files.file1, 0);
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given number of characters from the bottom of the file', function () {
    let actualOutput = extractTailCharacters(files.file1, 2);
    let expectedOutput = '12';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given number of characters from bottom of the file and should work for new line also', function () {
    actualOutput = extractTailCharacters(files.file1, 5);
    expectedOutput = '11\n12';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return given no of characters and should work for blank characters also', function () {
    let actualOutput = extractTailCharacters(files.file2, 8);
    let expectedOutput = 'ij \nklmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return whole file if no of characters is greater than or equal to no of characters in file', function () {
    let actualOutput = extractTailCharacters(files.file2, 20);
    let expectedOutput = 'abc def\n ghij \nklmn';
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
  it('should return empty string if given count is zero', function () {
    let actualOutput = countZeroError('0');
    let expectedOutput = ' ';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return undefined when count is greater than zero', function () {
    let actualOutput = countZeroError('1');
    let expectedOutput = undefined;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//------------------------------------illegalOffsetError tests--------------------------

describe('illegalOffsetError', function () {
  it('should return error when the given offset is alphaNumeric', function () {
    let errorMessage = 'tail: illegal offset -- ' + '5d';
    let actualOutput = illegalOffsetError('5d');
    let expectedOutput = errorMessage;
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return error when the given offset is character', function () {
    let errorMessage = 'tail: illegal offset -- ' + 'd';
    let actualOutput = illegalOffsetError('d');
    let expectedOutput = errorMessage;
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

//---------------------------------getTail tests----------------------------------

describe('getTail', function () {
  it('should return tail of the single file for default arguments', function () {
    let userArgs = ['file1'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = "3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return tail of the single file for option n with given no of lines", function () {
    let userArgs = ["-n2", 'file1'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = "11\n12";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return tail of the single file for option c with given no of characters', function () {
    let userArgs = ["-c", "4", 'file2'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = 'klmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return tail of the multiple files for default arguments', function () {
    let userArgs = ['file1', 'file2'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = '==> file1 <==\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n\n==> file2 <==\nabc def\n ghij \nklmn\n\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return tail of the multiple files for option n with given no of lines", function () {
    let userArgs = ["-n2", 'file1', 'file2'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = '==> file1 <==\n11\n12\n\n==> file2 <==\n ghij \nklmn\n\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return tail of the multiple files for option c with given no of characters', function () {
    let userArgs = ["-c", "4", 'file1', 'file2'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = '==> file1 <==\n1\n12\n\n==> file2 <==\nklmn\n\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

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