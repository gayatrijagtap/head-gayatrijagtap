const assert = require("assert");
const {
  getSingleFileHead,
  getMissingFileError,
  isIllegalOffset,
  isNoOfLinesZero,
  isInvalidTailOption,
  getTrailingLines,
  greaterNumber,
  isInvalidCount,
  isInvalidOption,
  getOption,
  getNoOfLines,
  getTail,
  handleTailErrors,
  extractTailingChars,
  extractTailingLines,
  noOfLinesWithFileIndex,
  getNumberWithIndex,
  handleErrors,
  extractNumber,
  getHead,
  extractOption,
  extractNoOfLinesWithIndex,
  extractCharacters,
  extractHeadLines,
  extractInputs,
  createHeadLines
} = require("../src/lib.js");

//---------------------extractInputs tests-------------------
describe("extractInputs", function () {
  it("should return headDetails including option when option is given", function () {
    let userArgs = [, , "-n5", "file1"];
    let expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);

    userArgs = [, , "-n", "5", "file1"];
    expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);

    userArgs = [, , "-c5", "file1", "file2"];
    expectedOutput = { option: "c", noOfLines: 5, files: ["file1", "file2"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);
  });

  it("should return headDetails excluding option when option is not given", function () {
    let userArgs = [, , "-5", "file1"];
    let expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);

    userArgs = [, , "-5", "file1", "file2"];
    expectedOutput = { option: "n", noOfLines: 5, files: ["file1", "file2"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);
  });

  it("should return headDetails including all the files when multiple files as an input", function () {
    let userArgs = [, , "file1", "file2"];
    let expectedOutput = {
      option: "n",
      noOfLines: 10,
      files: ["file1", "file2"]
    };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);
  });
});

//-------------------------createHeadLines tests--------------
describe("createHeadLines", function () {
  it("should return the heading for the given function", function () {
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

//----------------------extractCharacters tests---------------
describe("extractCharacters", function () {
  let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk";
  it("should return the head with the given number of characters", function () {
    let expectedOutput = "fha";
    assert.deepEqual(extractCharacters(data, 3), expectedOutput);
  });  
  it( 'should work for new line also' , function() {
    let expectedOutput = "fhash\nh";
    assert.deepEqual(extractCharacters(data, 7), expectedOutput);
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

//----------------------------getOption tests--------------------

describe( 'getOption' , function() {
  it( 'should return option if the option is given with number' , function() {
    assert.deepEqual(getOption('-s5'),'s');
  });
  it( 'should return option if the option is given alone' , function() {
    assert.deepEqual(getOption('-s'),'s');
  });
  it( 'should return nothing if the option is not there' , function() {
    assert.deepEqual(getOption('-5'));
  });
})

//-------------------------extractNoOfLinesWithIndex tests-------------------
describe("extractNoOfLinesWithIndex", function () {
  it("should extract no of lines if it is given along with character", function () {
    assert.deepEqual(extractNoOfLinesWithIndex(["-c5", ""]), { lines: 5, index: 3 });
  });
  it( 'should extract no of lines if no of lines is given alone' , function() {
    assert.deepEqual(extractNoOfLinesWithIndex(["-5", ""]), { lines: 5, index: 3 });
    assert.deepEqual(extractNoOfLinesWithIndex(["-c", "2"]), { lines: 2, index: 4 });
  });
  it( 'should return default no of lines if it is not given' , function() {
    assert.deepEqual(extractNoOfLinesWithIndex(["file1", "file2"]), { lines: 10, index: 2 });
  });
});

//--------------------------getHead tests---------------------

describe("getHead", function () {
  let readFileSync = file => file;
  let existsSync = file => true;
  let fs = { readFileSync, existsSync };

  it("should return head of the file for option n with given no of lines", function () {
    let data = "fsdjfhsdh\ndfjkshjk\ndsfjdfdkjfs";
    let userArgs = [, , "-n2", data];
    assert.deepEqual(getHead(userArgs, fs), "fsdjfhsdh\ndfjkshjk");
  });

  it( 'should return head of the file for option c with given no of characters' , function() {
    let data = "grldfjd";
    let userArgs = [, , "-c", "4", data];
    assert.deepEqual(getHead(userArgs, fs), "grld");
  });
});

//----------------------validateNoOfLines tests--------------
describe("extractNumber", function () {
  it("should extract Number from list when number is given at first index", function () {
    assert.deepEqual(extractNumber(["-n", "1"]));
  });
  it( 'should extract number from list when number is given along with character' , function() {
    assert.deepEqual(extractNumber(["-n12", "temp.js"]), {
      lines: "12",
      index: 3
    });
  });
  it( 'should extract number from list when number is given at 0th index' , function() {
    assert.deepEqual(extractNumber(["-100", "temp.js"]), {
      lines: "100",
      index: 3
    });
  });
});

//-------------------------handleErrors tests----------------
describe("handleErrors", function () {
  it("should return error message for illegal option", function () {
    let optionError =
      "head: illegal option -- " +
      "s" +
      "\nusage:head [-n lines | -c bytes] [file ...]";
    assert.deepEqual(handleErrors("s", "12"), optionError);
    assert.deepEqual(handleErrors("sd", "1"), optionError);
  });

  it("should return error message for illegal line count", function () {
    let lineError = "head: illegal line count -- " + "0";
    assert.deepEqual(handleErrors("n", 0), lineError);
    lineError = "head: illegal line count -- " + "-1";
    assert.deepEqual(handleErrors("n", -1), lineError);
  });

  it("should return error message for illegal byte count", function () {
    let byteError = "head: illegal byte count -- " + "0";
    assert.deepEqual(handleErrors("c", 0), byteError);
    byteError = "head: illegal byte count -- " + "-1";
    assert.deepEqual(handleErrors("c", -1), byteError);
  });
});

//--------------------------------------isInvalidOption tests----------------------

describe( 'isInvalidOption' , function() {
  let optionError = "head: illegal option -- " + 's' + "\nusage:head [-n lines | -c bytes] [file ...]";
  it( 'should return error for the invalid option' , function() {
    assert.deepEqual(isInvalidOption('s'),optionError);
  });
  it( 'should return undefined for the valid option' , function() {
    assert.deepEqual(isInvalidOption('n'),);
  });
})

//---------------------------------------isInvalidCount tests------------------------

describe( 'isInvalidCount' , function() {
  it( 'should return illegal byte count error for invalid byte count' , function() {
    let byteError = "head: illegal byte count -- " + "0";
    assert.deepEqual(isInvalidCount(0,'c'),byteError);
  });
  it( 'should return illegal line count error for invalid line count' , function() {
    let lineError = "head: illegal line count -- " + "-1";
    assert.deepEqual(isInvalidCount(-1,'n'),lineError);
  });
})

//-------------------------------------getNumberWithIndex tests-------------------------

describe('getNumberWithIndex', function () {
  it('should return number and index if the given input is a number', function () {
    assert.deepEqual(getNumberWithIndex('12', 3), { lines: '12', index: 3 });
    assert.deepEqual(getNumberWithIndex('1', 3), { lines: '1', index: 3 });
  });
})

//----------------------------------noOfLines tests----------------------------

describe('noOfLinesWithFileIndex', function () {
  it('should return noOfLines from the given input', function () {
    assert.deepEqual(noOfLinesWithFileIndex('5', '', 3, 4), { lines: '5', index: 3 });
    assert.deepEqual(noOfLinesWithFileIndex("c", "5", 3, 4), { lines: '5', index: 4 });
    assert.deepEqual(noOfLinesWithFileIndex("d", "0", 3, 4), { lines: '0', index: 4 });
  });
})

//--------------------------------------extractTailingLines tests------------------------

describe('extractTailingLines', function () {
  let text = 'dfs\ndfs\nfd\ngre\ngfe';
  it('should return given number of tailing lines when the file is larger than no of lines', function () {
    assert.deepEqual(extractTailingLines(text, 2), 'gre\ngfe');
    assert.deepEqual(extractTailingLines(text, 1), 'gfe');
  });
  it( 'should return whole file when no of lines is greater than or equal to lines in file' , function() {
    assert.deepEqual(extractTailingLines(text, 6), text);
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

//-------------------------------------extractTailingChars------------------------------

describe('extractTailingChars', function () {
  let text = 'jd djf \n kfd fdhj';
  it('should return given number of tailing characters from the text', function () {
    assert.deepEqual(extractTailingChars(text, 2), 'hj');
    assert.deepEqual(extractTailingChars(text, 5), ' fdhj');
  });
  it( 'should return given no of characters and should work for blank characters also' , function() {
    assert.deepEqual(extractTailingChars(text, 8), 'kfd fdhj');
  });
  it( 'should return whole file if no of characters is greater than or equal to no of characters in file' , function() {
    assert.deepEqual(extractTailingChars(text, 20), text);
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
  it('should return nothing if the number of lines is 0', function () {
    assert.deepEqual(handleTailErrors('n', '0'));
  });
})

//----------------------------------isInvalidTailOption tests----------------------

describe( 'isInvalidTailOption' , function() {
  it( 'should give error for illegal option' , function() {
    let optionError = 'tail: illegal option -- ' + 's' + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    assert.deepEqual(isInvalidTailOption('s'),optionError);
  });
})

//----------------------------------isNoOfLinesZero tests------------------------------

describe( 'isNoOfLinesZero' , function() {
  it( 'should return if given number of lines is zero' , function() {
    assert.deepEqual(isNoOfLinesZero('0'));
    assert.deepEqual(isNoOfLinesZero('1'));
  });
})

//------------------------------------isIllegalOffset tests--------------------------

describe( 'isIllegalOffset' , function() {
  it( 'should return error for the given illegal offset' , function() {
    let errorMessage = 'tail: illegal offset -- ' + '5d';
    assert.deepEqual(isIllegalOffset('5d'),errorMessage);
  });
})

//---------------------------------getTail tests----------------------------------

describe('getTail', function () {  
  let readFileSync = file => file;
  let existsSync = file => true;
  let fs = { readFileSync, existsSync };
  it('should return tail of the file with given specifications' , function() {
    let data = "fsdjfhsdh\ndfjkshjk\ndsfjdfdkjfs";
    let userArgs = [, , "-n2", data];
    assert.deepEqual(getTail(userArgs, fs), "dfjkshjk\ndsfjdfdkjfs");

    data = "grldfjd";
    userArgs = [, , "-c", "4", data];
    assert.deepEqual(getTail(userArgs, fs), "dfjd"); 
  });
})

//-------------------------------------getNoOfLines tests---------------------------

describe( 'getNoOfLines' , function() {
  it( 'should return number of the lines from the given input' , function() {
    assert.deepEqual(getNoOfLines('5',3),{lines:'5',index:3});
    assert.deepEqual(getNoOfLines('fd',3),);
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