const configs = require('./configs')
const constants = require('./constants')

const handleHeadErrors = function (option, count) {
    return generateInvalidOptionError(option, constants.HEAD) || generateInvalidCountError(count, option);
};

const invalidOptionError = function (optionCandidate, command) {
    let errorMessage = new Object;
    errorMessage[constants.HEAD] = configs.headOptionError + optionCandidate[0] + configs.headUsageMessage;
    errorMessage[constants.TAIL] = configs.tailOptionError + optionCandidate[0] + configs.tailUsageMessage;
    return errorMessage[command];
}

const generateInvalidOptionError = function (optionCandidate, command) {
    if (optionCandidate != configs.byteOption && optionCandidate != configs.lineOption) {
        return invalidOptionError(optionCandidate, command);
    }
    return constants.EMPTY_CHAR;
}

const invalidCountError = function (count, option) {
    let countError = new Object;
    countError[configs.lineOption] = configs.headLineCountError + count;
    countError[configs.byteOption] = configs.headByteCountError + count;
    return countError[option];
}

const generateInvalidCountError = function (count, option) {
    if ((count <= 0 || count.match(/[A-z]/))) {
        return invalidCountError(count, option);
    }
    return constants.EMPTY_CHAR;
}

const handleTailErrors = function (option, count) {
    return generateInvalidOptionError(option, constants.TAIL) || countZeroError(count) || illegalOffsetError(count);
};

const countZeroError = function (count) {
    let error = constants.EMPTY_CHAR;
    if (count == 0) {
        error = constants.SPACE;
    }
    return error;
}

const illegalOffsetError = function (count) {
    let errorMessage = constants.EMPTY_CHAR;
    if (count.match(/[A-z]/)) {
        errorMessage = configs.tailOffsetError + count;
    }
    return errorMessage;
}

const missingFileError = function (file, existsSync, command) {
    let error = constants.EMPTY_CHAR;
    if (!existsSync(file)) {
        error = command + constants.COLON + constants.SPACE + file + configs.missingFileError;
    }
    return error;
};

module.exports = {
    handleHeadErrors,
    handleTailErrors,
    missingFileError,
    illegalOffsetError,
    countZeroError,
    generateInvalidCountError,
    generateInvalidOptionError
};