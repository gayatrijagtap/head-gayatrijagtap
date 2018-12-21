const headUsageMessage = ["\nusage:head", "[-n", "lines", "|", "-c", "bytes]", "[file", "...]"].join(' ');

const tailUsageMessage = ['usage:', 'tail', '[-F', '|', '-f', '|', '-r]', '[-q]', '[-b', '#', '|', '-c', '#', '|', '-n', '#]', '[file', '...]'].join(' ');

//----------------------handleHeadErrors---------------------

const handleHeadErrors = function (option, count) {
    return generateInvalidOptionError(option, 'head') || generateInvalidCountError(count, option);
};

//--------------------------------optionError--------------------------

const optionError = function (optionCandidate, command) {
    let errorMessage = new Object;
    errorMessage['head'] = "head: illegal option -- " + optionCandidate[0] + headUsageMessage;
    errorMessage['tail'] = 'tail: illegal option -- ' + optionCandidate[0] + tailUsageMessage;
    return errorMessage[command];
}

//-------------------------generateInvalidOptionError-------------------

const generateInvalidOptionError = function (optionCandidate, command) {
    if (optionCandidate != 'c' && optionCandidate != 'n') {
        return optionError(optionCandidate, command);
    }
    return '';
}

const invalidCountError = function (count, option) {
    let countError = new Object;
    countError['n'] = "head: illegal line count -- " + count;
    countError['c'] = "head: illegal byte count -- " + count;
    return countError[option];
}

//------------------------------generateInvalidCountError-------------------------

const generateInvalidCountError = function (count, option) {
    if ((count <= 0 || count.match(/[A-z]/))) {
        return invalidCountError(count, option);
    }
    return '';
}

//------------------------------handleTailErrors------------------------

const handleTailErrors = function (option, count) {
    return generateInvalidOptionError(option, 'tail') || countZeroError(count) || illegalOffsetError(count);
};

//--------------------------------countZeroError-----------------------------

const countZeroError = function (count) {
    let error = '';
    if (count == 0) {
        error = ' ';
    }
    return error;
}

//---------------------------------illegalOffsetError-----------------------

const illegalOffsetError = function (count) {
    let errorMessage = '';
    if (count.match(/[A-z]/)) {
        errorMessage = 'tail: illegal offset -- ' + count;
    }
    return errorMessage;
}

//------------------------------missingFileError-------------------

const missingFileError = function (file, existsSync, command) {
    let error = '';
    if (!existsSync(file)) {
        error = command + ": " + file + ": No such file or directory";
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