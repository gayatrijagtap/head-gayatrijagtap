//----------------------handleHeadErrors---------------------

const handleHeadErrors = function (option, count) {
    return invalidHeadOptionError(option) || invalidCountError(count, option);
};

//-------------------------------invalidHeadOptionError---------------------

const invalidHeadOptionError = function (optionCandidate) {
    let optionError = '';
    if (optionCandidate != 'c' && optionCandidate != 'n') {
        optionError = "head: illegal option -- " + optionCandidate[0] + "\nusage:head [-n lines | -c bytes] [file ...]";
    }
    return optionError;
}

//------------------------------invalidCountError-------------------------

const invalidCountError = function (count, option) {
    let countError = new Object;
    countError['n'] = "head: illegal line count -- " + count;
    countError['c'] = "head: illegal byte count -- " + count;
    if ((count <= 0 || count.match(/[A-z]/))) {
        return countError[option];
    }
    return '';
}

//------------------------------handleTailErrors------------------------

const handleTailErrors = function (option, count) {
    return invalidTailOptionError(option) || countZeroError(count) || illegalOffsetError(count);
};

//-----------------------------------invalidTailOptionError--------------------

const invalidTailOptionError = function (option) {
    let optionError = '';
    if (option != 'c' && option != 'n') {
        optionError = 'tail: illegal option -- ' + option + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    }
    return optionError;
}

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
    invalidHeadOptionError,
    invalidTailOptionError,
    invalidCountError
};