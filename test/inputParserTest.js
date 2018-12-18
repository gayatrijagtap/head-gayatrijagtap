const assert = require('assert');
const {
    parseInput,
    extractCountWithFileIndex,
    extractOption,
    userOption
} = require('../src/inputParser.js');

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

//-------------------------extractCountWithFileIndex tests-------------------
describe("extractCountWithFileIndex", function () {
    it("should return count with file starting index when count is given along with option", function () {
        let actualOutput = extractCountWithFileIndex(["-c5", ""]);
        let expectedOutput = { count: 5, index: 1 };
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return count with file starting index when count is given without option', function () {
        let actualOutput = extractCountWithFileIndex(["-5", ""]);
        let expectedOutput = { count: 5, index: 1 };
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return count with file starting index when count and option are given seperately', function () {
        actualOutput = extractCountWithFileIndex(["-c", "2"]);
        expectedOutput = { count: 2, index: 2 };
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return default no of lines if it is not given', function () {
        let actualOutput = extractCountWithFileIndex(["file1", "file2"]);
        let expectedOutput = { count: 10, index: 0 };
        assert.deepEqual(actualOutput, expectedOutput);
    });
});