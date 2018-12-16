const assert = require("assert");
const {
  singleFileOutput,
  missingFileError,
  illegalOffsetError,
  isNoOfLinesZero,
  invalidTailOptionError,
  getTrailingLines,
  smallerNumber,
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
  noOfLinesWithFileIndex,
  extractHeadCharacters,
  extractHeadLines,
  extractInputs,
  createHeadLines
} = require("../src/lib.js");

//---------------------extractInputs tests-------------------
describe("extractInputs", function () {
  it('should return headDetails for single file with default option and no of lines' , function() {
    let actualOutput = extractInputs(['file1']);
    let expectedOutput = {option:'n',noOfLines:10,files:['file1']};
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it("should return headDetails with given option , no of lines and file", function () {
    let actualOutput = extractInputs(["-n5", "file1"]);
    let expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(actualOutput, expectedOutput);

    actualOutput = extractInputs(["-n", "5", "file1"]);
    expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(actualOutput, expectedOutput);

    actualOutput = extractInputs(["-c5", "file1", "file2"]);
    expectedOutput = { option: "c", noOfLines: 5, files: ["file1", "file2"] };
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return headDetails with default option when option is not passed", function () {
    let actualOutput = extractInputs(["-5", "file1"]);
    let expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(actualOutput, expectedOutput);

    userArgs = ["-5", "file1", "file2"];
    actualOutput = extractInputs(userArgs);
    expectedOutput = { option: "n", noOfLines: 5, files: ["file1", "file2"] };
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return headDetails with default option and no of lines when multiple files are passed", function () {
    let actualOutput = extractInputs(["file1", "file2"]);
    let expectedOutput = { option: "n",noOfLines: 10,files: ["file1", "file2"] };
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

//-------------------------createHeadLines tests--------------
describe("createHeadLines", function () {
  it("should return the heading for the given file name", function () {
    let actualOutput = createHeadLines("mars");
    let expectedOutput = "==> mars <==";
    assert.deepEqual(actualOutput,expectedOutput);

    actualOutput = createHeadLines("sample");
    expectedOutput = "==> sample <==";
    assert.deepEqual(actualOutput,expectedOutput);
  });
});

//-----------------------------extractHeadLines tests------------
describe("extractHeadLines", function () {
  it("should return the head with given number of lines if the length of file is greater than number of lines", function () {
    let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    let expectedOutput = "fhash\nhsakh\nfkdsh";
    assert.deepEqual(extractHeadLines(data, 3), expectedOutput);
  });

  it( 'should return whole file if the length of file is smaller than or equal to given number of lines' , function() {
    let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    let expectedOutput = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    assert.deepEqual(extractHeadLines(data, 7), expectedOutput);
  });
});

//------------------------------smallerNumber tests--------------

describe( 'smallerNumber' , function() {
  it( 'should return second number if firstNumber is greater than second number' , function() {
    assert.deepEqual(smallerNumber(10,6),6);
  });

  it( 'should return first numbers if second number is greater than first number' , function() {
    assert.deepEqual(smallerNumber(2,6),2);
  });

  it( 'should return first number if both are equal' , function() {
  assert.deepEqual(smallerNumber(6, 6), 6);
  });
})

//----------------------extractHeadCharacters tests---------------
describe("extractHeadCharacters", function () {
  let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk";
  it("should return given number of characters from the top of the file", function () {
    let actualOutput = extractHeadCharacters(data, 3);
    let expectedOutput = "fha";
    assert.deepEqual(actualOutput,expectedOutput);
  });  
  it( 'should return given number of characters including new line' , function() {
    let actualOutput = extractHeadCharacters(data, 7);
    let expectedOutput = "fhash\nh";
    assert.deepEqual(actualOutput,expectedOutput);
  });
});

//--------------------------extractOption tests---------------
describe("extractOption", function () {
  it("should return byte option from the given input", function () {
    assert.deepEqual(extractOption("-c5"), "c");
  });
  it('should extract line option from the given input' , function() {
    assert.deepEqual(extractOption("-n"), "n");
  });
  it('should return default option when no option is passed' , function() {
      assert.deepEqual(extractOption("-5"), "n");
  });
});

//----------------------------userOption tests--------------------

describe( 'userOption' , function() {
  it( 'should return option if the option is given with number' , function() {
    assert.deepEqual(userOption('-s5'),'s');
  });
  it( 'should return option from the given input' , function() {
    assert.deepEqual(userOption('-s'),'s');
  });
  it( 'should not return if option is not passed' , function() {
    assert.deepEqual(userOption('-5'));
  });
})

//-------------------------noOfLinesWithFileIndex tests-------------------
describe("noOfLinesWithFileIndex", function () {
  it("should extract no of lines with file starting index if it is given along with character", function () {
    let actualOutput = noOfLinesWithFileIndex(["-c5", ""]);
    let expectedOutput = { lines: 5, index: 1 };
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it( 'should extract no of lines with file starting index from the given input' , function() {
    let actualOutput = noOfLinesWithFileIndex(["-5", ""]);
    let expectedOutput = { lines: 5, index: 1 }; 
    assert.deepEqual(actualOutput,expectedOutput);

    actualOutput = noOfLinesWithFileIndex(["-c", "2"]);
    expectedOutput = { lines: 2, index: 2 };
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it( 'should return default no of lines if it is not given' , function() {
    let actualOutput = noOfLinesWithFileIndex(["file1", "file2"]);
    let expectedOutput = { lines: 10, index: 0 };
    assert.deepEqual(actualOutput,expectedOutput);
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
    assert.deepEqual(actualOutput,expectedOutput);
  });

  it( 'should return head of the file for option c with given no of characters' , function() {
    let data = "grldfjd";
    let userArgs = ["-c", "4", data];
    let actualOutput = getHead(userArgs, fs);
    let expectedOutput = "grld";
    assert.deepEqual(actualOutput,expectedOutput);
  });
});

//-------------------------handleHeadErrors tests----------------
describe("handleHeadErrors", function () {
  it("should return error message for illegal option", function () {
    let optionError =
      "head: illegal option -- " + "s" +
      "\nusage:head [-n lines | -c bytes] [file ...]";
    let actualOutput = handleHeadErrors("s", "12");
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput, expectedOutput);

    actualOutput = handleHeadErrors("sd", "1");
    expectedOutput = optionError;
    assert.deepEqual(actualOutput,expectedOutput);
  });

  it("should return error message for illegal line count", function () {
    let lineError = "head: illegal line count -- " + "0";
    let actualOutput = handleHeadErrors("n", 0);
    let expectedOutput = lineError;
    assert.deepEqual(actualOutput,expectedOutput);

    lineError = "head: illegal line count -- " + "-1";
    actualOutput = handleHeadErrors("n", -1);
    expectedOutput = lineError;
    assert.deepEqual(actualOutput,expectedOutput);
  });

  it("should return error message for illegal byte count", function () {
    let byteError = "head: illegal byte count -- " + "0";
    let actualOutput = handleHeadErrors("c", 0);
    let expectedOutput = byteError;
    assert.deepEqual(actualOutput,expectedOutput);

    byteError = "head: illegal byte count -- " + "-1";
    actualOutput = handleHeadErrors("c", -1);
    expectedOutput = byteError;
    assert.deepEqual(actualOutput,expectedOutput);
  });
});

//--------------------------------------invalidHeadOptionError tests----------------------

describe( 'invalidHeadOptionError' , function() {
  let optionError = "head: illegal option -- " + 's' + "\nusage:head [-n lines | -c bytes] [file ...]";
  it( 'should return error for the invalid option' , function() {
    let actualOutput = invalidHeadOptionError('s');
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it( 'should return undefined for the valid option' , function() {
    let actualOutput = invalidHeadOptionError('n');
    let expectedOutput = undefined;
    assert.deepEqual(actualOutput,expectedOutput);
  });
})

//---------------------------------------invalidCountError tests------------------------

describe( 'invalidCountError' , function() {
  it( 'should return illegal byte count error for invalid byte count' , function() {
    let byteError = "head: illegal byte count -- " + "0";
    let actualOutput = invalidCountError(0,'c');
    let expectedOutput = byteError;
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it( 'should return illegal line count error for invalid line count' , function() {
    let lineError = "head: illegal line count -- " + "-1";
    let actualOutput = invalidCountError(-1,'n');
    let expectedOutput = lineError;
    assert.deepEqual(actualOutput,expectedOutput);
  });
})

//--------------------------------------extractTailLines tests------------------------

describe('extractTailLines', function () {
  let text = 'dfs\ndfs\nfd\ngre\ngfe';
  it('should return given number of lines from bottom of the file when the file is larger than no of lines', function () {
    let actualOutput = extractTailLines(text, 2);
    let expectedOutput = 'gre\ngfe';
    assert.deepEqual(actualOutput,expectedOutput);

    actualOutput = extractTailLines(text, 1);
    expectedOutput = 'gfe';
    assert.deepEqual(actualOutput,expectedOutput);
  });

  it( 'should return whole file when no of lines is greater than or equal to lines in file' , function() {
    let actualOutput = extractTailLines(text, 6);
    let expectedOutput = text;
    assert.deepEqual(actualOutput,expectedOutput);
  });
})

//------------------------------------------getTrailingLines tests-------------------------

describe( 'getTrailingLines' , function() {
  it( 'should return number of trailing lines for given length and number of lines' , function() {
    assert.deepEqual(getTrailingLines(5,6),1);
  });
  it( 'should return 0 if there are no trailing lines' , function() {
    assert.deepEqual(getTrailingLines(5,4),0);
    assert.deepEqual(getTrailingLines(6,6),0);
  });
})

//-------------------------------------extractTailCharacters------------------------------

describe('extractTailCharacters', function () {
  let text = 'jd djf \n kfd fdhj';
  it('should return given number of characters from the bottom of the file', function () {
    let actualOutput = extractTailCharacters(text, 2);
    let expectedOutput = 'hj';
    assert.deepEqual(actualOutput,expectedOutput);

    actualOutput = extractTailCharacters(text, 5);
    expectedOutput = ' fdhj';
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it( 'should return given no of characters and should work for blank characters also' , function() {
    let actualOutput = extractTailCharacters(text, 8);
    let expectedOutput = 'kfd fdhj';
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it( 'should return whole file if no of characters is greater than or equal to no of characters in file' , function() {
    let actualOutput = extractTailCharacters(text, 20);
    let expectedOutput = text;
    assert.deepEqual(actualOutput,expectedOutput);
  });
})

//----------------------------------handleTailErrors tests---------------------------------

describe('handleTailErrors', function () {
  it('should give error for illegal option', function () {
    let optionError = 'tail: illegal option -- ' + 's' + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    let actualOutput = handleTailErrors('s', 1);
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it('should give error for illegal offset', function () {
    let errorMessage = 'tail: illegal offset -- ' + '5d';
    let actualOutput = handleTailErrors('n', '5d');
    let expectedOutput = errorMessage;
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it('should return empty string if the number of lines is 0', function () {
    let actualOutput = handleTailErrors('n', '0');
    let expectedOutput = ' ';
    assert.deepEqual(actualOutput,expectedOutput);
  });
})

//----------------------------------invalidTailOptionError tests----------------------

describe( 'invalidTailOptionError' , function() {
  it( 'should give error for illegal option' , function() {
    let optionError = 'tail: illegal option -- ' + 's' + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    let actualOutput = invalidTailOptionError('s');
    let expectedOutput = optionError;
    assert.deepEqual(actualOutput,expectedOutput);
  });
})

//----------------------------------isNoOfLinesZero tests------------------------------

describe( 'isNoOfLinesZero' , function() {
  it( 'should return empty string if given number of lines is zero' , function() {
    let actualOutput = isNoOfLinesZero('0');
    let expectedOutput = ' '; 
    assert.deepEqual(actualOutput,expectedOutput);

    actualOutput = isNoOfLinesZero('1');
    expectedOutput = undefined;
    assert.deepEqual(actualOutput,expectedOutput);
  });
})

//------------------------------------illegalOffsetError tests--------------------------

describe( 'illegalOffsetError' , function() {
  it( 'should return error for the given illegal offset' , function() {
    let errorMessage = 'tail: illegal offset -- ' + '5d';
    let actualOutput = illegalOffsetError('5d');
    let expectedOutput = errorMessage;
    assert.deepEqual(actualOutput,expectedOutput);
  });
})

//---------------------------------getTail tests----------------------------------

describe('getTail', function () {  
  let readFileSync = file => file;
  let existsSync = file => true;
  let fs = { readFileSync, existsSync };
  it('should return tail of the file with given specifications' , function() {
    let data = "fsdjfhsdh\ndfjkshjk\ndsfjdfdkjfs";
    let userArgs = ["-n2", data];
    let actualOutput = getTail(userArgs, fs);
    let expectedOutput = "dfjkshjk\ndsfjdfdkjfs";
    assert.deepEqual(actualOutput,expectedOutput);

    data = "grldfjd";
    userArgs = ["-c", "4", data];
    actualOutput = getTail(userArgs, fs);
    expectedOutput = "dfjd";
    assert.deepEqual(actualOutput,expectedOutput); 
  });
})

//------------------------------------missingFileError tests----------------------

describe('missingFileError' , function() {
  const isExists = function(data) {
    if(data) {
      return true;
    }
  }
  let data = false;
  let headError = "head: " + data + ": No such file or directory";
  let tailError = "tail: " + data + ": No such file or directory";
  it('should return error for missing file for head' , function() {
    let actualOutput = missingFileError(data,isExists,'head');
    let expectedOutput = headError;
    assert.deepEqual(actualOutput,expectedOutput);
  });
  it('should return error for missing file for tail' , function() {
    let actualOutput = missingFileError(data,isExists,'tail');
    let expectedOutput = tailError;
    assert.deepEqual(actualOutput,expectedOutput);  
  });
})

//----------------------------------singleFileOutput tests----------------------

describe('singleFileOutput' , function() {
  let data;
  let content;
  let fs = {existsSync:x=>false};
  it('should return head without headline if there is only one file in user inputs' , function() {
    let actualOutput = singleFileOutput({files:[data,content],option:'n',noOfLines:1},fs,'head');
    let expectedOutput = undefined;
    assert.deepEqual(actualOutput,expectedOutput);
  });
})