const assert = require("assert");
const {
  singleFileOutput,
  getTrailingLines,
  getTail,
  extractTailCharacters,
  extractTailLines,
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