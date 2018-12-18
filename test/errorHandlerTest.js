const assert = require('assert');
const {
    handleHeadErrors,
    handleTailErrors,
    missingFileError,
    illegalOffsetError,
    countZeroError,
    invalidHeadOptionError,
    invalidTailOptionError,
    invalidCountError
} = require('../src/errorHandler.js');

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
    it('should return empty string for the valid option', function () {
        let actualOutput = invalidHeadOptionError('n');
        let expectedOutput = '';
        assert.deepEqual(actualOutput, expectedOutput);
    });
})

//---------------------------------------invalidCountError tests------------------------

describe('invalidCountError', function () {
    it('should return illegal byte count error for invalid byte count and count zero', function () {
        let byteError = "head: illegal byte count -- " + "0";
        let actualOutput = invalidCountError('0', 'c');
        let expectedOutput = byteError;
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return illegal line count error for invalid line count and negative count', function () {
        let lineError = "head: illegal line count -- " + "-1";
        let actualOutput = invalidCountError('-1', 'n');
        let expectedOutput = lineError;
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return empty string if the count is valid', function () {
        let actualOutput = invalidCountError('1', 'n');
        let expectedOutput = '';
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
    it('should return empty string for valid option', function () {
        let actualOutput = invalidTailOptionError('n');
        let expectedOutput = '';
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