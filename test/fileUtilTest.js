const assert = require("assert");
const {
  getSingleFileContent,
  getTail,
  extractTailCharacters,
  extractTailLines,
  getHead,
  extractHeadCharacters,
  extractHeadLines,
  getRequiredContent,
  singleFileHeader,
  multipleFilesHeader,
  generateSingleFileContent
} = require("../src/fileUtil.js");

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
    let expectedOutput = '==> file1 <==\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n==> file2 <==\nabc def\n ghij \nklmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return head of the multiple files for option n with given no of lines", function () {
    let userArgs = ["-n2", 'file1', 'file2'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = '==> file1 <==\n1\n2\n==> file2 <==\nabc def\n ghij ';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return head of the multiple files for option c with given no of characters', function () {
    let userArgs = ["-c", "4", 'file1', 'file2'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = '==> file1 <==\n1\n2\n\n==> file2 <==\nabc ';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return error message if the first file is missing and give head of all the valid files', function () {
    let userArgs = ['-c', '2', 'file3', 'file1'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = 'head: file3: No such file or directory\n==> file1 <==\n1\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return head of the valid files and should give error message for missing file listed at ', function () {
    let userArgs = ['-c', '2', 'file1', 'file3'];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = '==> file1 <==\n1\n\nhead: file3: No such file or directory';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

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
    let expectedOutput = '==> file1 <==\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n==> file2 <==\nabc def\n ghij \nklmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return tail of the multiple files for option n with given no of lines", function () {
    let userArgs = ["-n2", 'file1', 'file2'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = '==> file1 <==\n11\n12\n==> file2 <==\n ghij \nklmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return tail of the multiple files for option c with given no of characters', function () {
    let userArgs = ["-c", "4", 'file1', 'file2'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = '==> file1 <==\n1\n12\n==> file2 <==\nklmn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return error message if the first file is missing and give tail of all the valid files', function () {
    let userArgs = ['-c', '2', 'file3', 'file1'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = 'tail: file3: No such file or directory\n==> file1 <==\n12';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return tail of the valid files and should give error message for missing file listed at ', function () {
    let userArgs = ['-c', '2', 'file1', 'file3'];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = '==> file1 <==\n12\ntail: file3: No such file or directory';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe('getSingleFileContent', function () {
  let data;
  let content;
  let fs = { existsSync: x => false };
  it('should return undefined when there is only one file in user inputs', function () {
    let actualOutput = getSingleFileContent({ files: [data, content], option: 'n', count: 1 }, fs, 'head');
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return undefined when there are more than one files', function () {
    let actualOutput = getSingleFileContent({ files: [data, content], option: 'n', count: 2 }, fs, 'tail');
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

describe('getRequiredContent', function () {
  it('should return lines from the top of the file for given count', function () {
    let typeOfOption = { n: extractHeadLines, c: extractHeadCharacters };
    let commandDetails = { option: 'n', count: '2', files: ['file1'], command: 'head' };
    let actualOutput = getRequiredContent(commandDetails, typeOfOption, fs);
    let expectedOutput = '1\n2';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return characters from the top of the file for given count', function () {
    let typeOfOption = { n: extractHeadLines, c: extractHeadCharacters };
    let commandDetails = { option: 'c', count: '2', files: ['file2'], command: 'head' };
    let actualOutput = getRequiredContent(commandDetails, typeOfOption, fs);
    let expectedOutput = 'ab';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return lines from the bottom of the file for given count', function () {
    let typeOfOption = { n: extractTailLines, c: extractTailCharacters };
    let commandDetails = { option: 'n', count: '2', files: ['file1'], command: 'tail' };
    let actualOutput = getRequiredContent(commandDetails, typeOfOption, fs);
    let expectedOutput = '11\n12';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return characters from the bottom of the file for given count', function () {
    let typeOfOption = { n: extractTailLines, c: extractTailCharacters };
    let commandDetails = { option: 'c', count: '2', files: ['file2'], command: 'tail' };
    let actualOutput = getRequiredContent(commandDetails, typeOfOption, fs);
    let expectedOutput = 'mn';
    assert.deepEqual(actualOutput, expectedOutput);
  });
})

describe("singleFileHeader", function () {
  it("should return empty string for the given file name", function () {
    let actualOutput = singleFileHeader("mars");
    let expectedOutput = "";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return empty string for empty string', function () {
    let actualOutput = singleFileHeader('');
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return empty string for undefined', function () {
    let actualOutput = singleFileHeader(undefined);
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("multipleFilesHeader", function () {
  it("should return the heading for the given file name", function () {
    let actualOutput = multipleFilesHeader("mars");
    let expectedOutput = "==> mars <==" + '\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return heading for empty string', function () {
    let actualOutput = multipleFilesHeader('');
    let expectedOutput = '==>  <==' + '\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return heading for undefined', function () {
    let actualOutput = multipleFilesHeader(undefined);
    let expectedOutput = '==> undefined <==' + '\n';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe('generateSingleFileContent', function () {
  it('should return line content with empty header when there is only one file in user inputs', function () {
    let typeOfOption = { n: extractHeadLines, c: extractHeadCharacters };
    let commandDetails = { option: 'n', count: '2', files: ['file1'], command: 'head' };
    let actualOutput = generateSingleFileContent(commandDetails, typeOfOption, fs, 'file1');
    let expectedOutput = '1\n2';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return byte content with empty header when there is only one file in user inputs', function () {
    let typeOfOption = { n: extractHeadLines, c: extractHeadCharacters };
    let commandDetails = { option: 'c', count: '2', files: ['file2'], command: 'head' };
    let actualOutput = generateSingleFileContent(commandDetails, typeOfOption, fs, 'file2');
    let expectedOutput = 'ab';
    assert.deepEqual(actualOutput, expectedOutput);
  });
})