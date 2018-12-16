const assert = require("assert");
const {
  getSingleFileHead,
  getMissingFileError,
  getIllegalOffsetError,
  isNoOfLinesZero,
  getInvalidTailOptionError,
  getTrailingLines,
  greaterNumber,
  getInvalidCountError,
  getInvalidHeadOptionError,
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
    expectedOutput = { option: "n", noOfLines: 5, files: ["file1", "file2"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);
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
    assert.deepEqual(createHeadLines("mars"), "==> mars <==");
    assert.deepEqual(createHeadLines("sample"), "==> sample <==");
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

//------------------------------greaterNumber tests--------------

describe( 'greaterNumber' , function() {
  it( 'should modify noOfLines to given length if the noOfLines is greater than length' , function() {
    assert.deepEqual(greaterNumber(10,6),6);
  });

  it( 'should return noOfLines if the noOfLines is less than the given length' , function() {
    assert.deepEqual(greaterNumber(2,6),2);
  });

  it( 'should return noOfLines if the noOf lines and length are equal' , function() {
  assert.deepEqual(greaterNumber(6, 6), 6);
  });
})

//----------------------extractHeadCharacters tests---------------
describe("extractHeadCharacters", function () {
  let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk";
  it("should return the head with the given number of characters", function () {
    let expectedOutput = "fha";
    assert.deepEqual(extractHeadCharacters(data, 3), expectedOutput);
  });  
  it( 'should work for new line also' , function() {
    let expectedOutput = "fhash\nh";
    assert.deepEqual(extractHeadCharacters(data, 7), expectedOutput);
  });
});

//--------------------------extractOption tests---------------
describe("extractOption", function () {
  it("should extract option when option is given with number of lines", function () {
    assert.deepEqual(extractOption("-c5"), "c");
  });
  it('should extract option when option is given alone' , function() {
    assert.deepEqual(extractOption("-c"), "c");
  });
  it('should return default option when no option is given' , function() {
      assert.deepEqual(extractOption("-5"), "n");
  });
});

//----------------------------userOption tests--------------------

describe( 'userOption' , function() {
  it( 'should return option if the option is given with number' , function() {
    assert.deepEqual(userOption('-s5'),'s');
  });
  it( 'should return option if the option is given alone' , function() {
    assert.deepEqual(userOption('-s'),'s');
  });
  it( 'should return nothing if the option is not there' , function() {
    assert.deepEqual(userOption('-5'));
  });
})

//-------------------------noOfLinesWithFileIndex tests-------------------
describe("noOfLinesWithFileIndex", function () {
  it("should extract no of lines if it is given along with character", function () {
    assert.deepEqual(noOfLinesWithFileIndex(["-c5", ""]), { lines: 5, index: 1 });
  });
  it( 'should extract no of lines if no of lines is given alone' , function() {
    assert.deepEqual(noOfLinesWithFileIndex(["-5", ""]), { lines: 5, index: 1 });
    assert.deepEqual(noOfLinesWithFileIndex(["-c", "2"]), { lines: 2, index: 2 });
  });
  it( 'should return default no of lines if it is not given' , function() {
    assert.deepEqual(noOfLinesWithFileIndex(["file1", "file2"]), { lines: 10, index: 0 });
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
    assert.deepEqual(getHead(userArgs, fs), "fsdjfhsdh\ndfjkshjk");
  });

  it( 'should return head of the file for option c with given no of characters' , function() {
    let data = "grldfjd";
    let userArgs = ["-c", "4", data];
    assert.deepEqual(getHead(userArgs, fs), "grld");
  });
});

//-------------------------handleHeadErrors tests----------------
describe("handleHeadErrors", function () {
  it("should return error message for illegal option", function () {
    let optionError =
      "head: illegal option -- " +
      "s" +
      "\nusage:head [-n lines | -c bytes] [file ...]";
    assert.deepEqual(handleHeadErrors("s", "12"), optionError);
    assert.deepEqual(handleHeadErrors("sd", "1"), optionError);
  });

  it("should return error message for illegal line count", function () {
    let lineError = "head: illegal line count -- " + "0";
    assert.deepEqual(handleHeadErrors("n", 0), lineError);
    lineError = "head: illegal line count -- " + "-1";
    assert.deepEqual(handleHeadErrors("n", -1), lineError);
  });

  it("should return error message for illegal byte count", function () {
    let byteError = "head: illegal byte count -- " + "0";
    assert.deepEqual(handleHeadErrors("c", 0), byteError);
    byteError = "head: illegal byte count -- " + "-1";
    assert.deepEqual(handleHeadErrors("c", -1), byteError);
  });
});

//--------------------------------------getInvalidHeadOptionError tests----------------------

describe( 'getInvalidHeadOptionError' , function() {
  let optionError = "head: illegal option -- " + 's' + "\nusage:head [-n lines | -c bytes] [file ...]";
  it( 'should return error for the invalid option' , function() {
    assert.deepEqual(getInvalidHeadOptionError('s'),optionError);
  });
  it( 'should return undefined for the valid option' , function() {
    assert.deepEqual(getInvalidHeadOptionError('n'),);
  });
})

//---------------------------------------getInvalidCountError tests------------------------

describe( 'getInvalidCountError' , function() {
  it( 'should return illegal byte count error for invalid byte count' , function() {
    let byteError = "head: illegal byte count -- " + "0";
    assert.deepEqual(getInvalidCountError(0,'c'),byteError);
  });
  it( 'should return illegal line count error for invalid line count' , function() {
    let lineError = "head: illegal line count -- " + "-1";
    assert.deepEqual(getInvalidCountError(-1,'n'),lineError);
  });
})

//--------------------------------------extractTailLines tests------------------------

describe('extractTailLines', function () {
  let text = 'dfs\ndfs\nfd\ngre\ngfe';
  it('should return given number of tailing lines when the file is larger than no of lines', function () {
    assert.deepEqual(extractTailLines(text, 2), 'gre\ngfe');
    assert.deepEqual(extractTailLines(text, 1), 'gfe');
  });
  it( 'should return whole file when no of lines is greater than or equal to lines in file' , function() {
    assert.deepEqual(extractTailLines(text, 6), text);
  });
})

//------------------------------------------getTrailingLines tests-------------------------

describe( 'getTrailingLines' , function() {
  it( 'should return number of trailing lines for given length and number of lines' , function() {
    assert.deepEqual(getTrailingLines(5,6),1);
  });
  it( 'should return 0 if length is greater than or equal to no of lines' , function() {
    assert.deepEqual(getTrailingLines(5,4),0);
    assert.deepEqual(getTrailingLines(6,6),0);
  });
})

//-------------------------------------extractTailCharacters------------------------------

describe('extractTailCharacters', function () {
  let text = 'jd djf \n kfd fdhj';
  it('should return given number of tailing characters from the text', function () {
    assert.deepEqual(extractTailCharacters(text, 2), 'hj');
    assert.deepEqual(extractTailCharacters(text, 5), ' fdhj');
  });
  it( 'should return given no of characters and should work for blank characters also' , function() {
    assert.deepEqual(extractTailCharacters(text, 8), 'kfd fdhj');
  });
  it( 'should return whole file if no of characters is greater than or equal to no of characters in file' , function() {
    assert.deepEqual(extractTailCharacters(text, 20), text);
  });
})

//----------------------------------handleTailErrors tests---------------------------------

describe('handleTailErrors', function () {
  it('should give error for illegal option', function () {
    let optionError = 'tail: illegal option -- ' + 's' + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    assert.deepEqual(handleTailErrors('s', 1), optionError);
  });
  it('should give error for illegal offset', function () {
    let errorMessage = 'tail: illegal offset -- ' + '5d';
    assert.deepEqual(handleTailErrors('n', '5d'), errorMessage);
  });
  it('should return empty string if the number of lines is 0', function () {
    assert.deepEqual(handleTailErrors('n', '0'),' ');
  });
})

//----------------------------------getInvalidTailOptionError tests----------------------

describe( 'getInvalidTailOptionError' , function() {
  it( 'should give error for illegal option' , function() {
    let optionError = 'tail: illegal option -- ' + 's' + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    assert.deepEqual(getInvalidTailOptionError('s'),optionError);
  });
})

//----------------------------------isNoOfLinesZero tests------------------------------

describe( 'isNoOfLinesZero' , function() {
  it( 'should return empty string if given number of lines is zero' , function() {
    assert.deepEqual(isNoOfLinesZero('0'),' ');
    assert.deepEqual(isNoOfLinesZero('1'));
  });
})

//------------------------------------getIllegalOffsetError tests--------------------------

describe( 'getIllegalOffsetError' , function() {
  it( 'should return error for the given illegal offset' , function() {
    let errorMessage = 'tail: illegal offset -- ' + '5d';
    assert.deepEqual(getIllegalOffsetError('5d'),errorMessage);
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
    assert.deepEqual(getTail(userArgs, fs), "dfjkshjk\ndsfjdfdkjfs");

    data = "grldfjd";
    userArgs = ["-c", "4", data];
    assert.deepEqual(getTail(userArgs, fs), "dfjd"); 
  });
})

//------------------------------------getMissingFileError tests----------------------

describe('getMissingFileError' , function() {
  const isExists = function(data) {
    if(data) {
      return true;
    }
  }
  let data = false;
  let headError = "head: " + data + ": No such file or directory";
  let tailError = "tail: " + data + ": No such file or directory";
  it('should return error for missing file for head' , function() {
    assert.deepEqual(getMissingFileError(data,isExists,'head'),headError);
  });
  it('should return error for missing file for tail' , function() {
    assert.deepEqual(getMissingFileError(data,isExists,'tail'),tailError);  
  });
})

//----------------------------------getSingleFileHead tests----------------------

describe('getSingleFileHead' , function() {
  let data;
  let content;
  let fs = {existsSync:x=>false};
  it('should return head without headline if there is only one file in user inputs' , function() {
    assert.deepEqual(getSingleFileHead({files:[data,content],option:'n',noOfLines:1},fs,'head'),);
  });
})