//----------------------handleHeadErrors---------------------

const handleHeadErrors = function (option, count) {
    return invalidHeadOptionError(option) || invalidCountError(count, option);
};

//-------------------------------invalidHeadOptionError---------------------

const invalidHeadOptionError = function (optionCandidate) {
    let optionError = "head: illegal option -- " + optionCandidate[0] + "\nusage:head [-n lines | -c bytes] [file ...]";
    if (optionCandidate != 'c' && optionCandidate != 'n') {
        return optionError;
    }
}

//------------------------------invalidCountError-------------------------

const invalidCountError = function (count, option) {
    let countError = new Object;
    countError['n'] = "head: illegal line count -- " + count;
    countError['c'] = "head: illegal byte count -- " + count;
    if ((count <= 0 || count.match(/[A-z]/))) {
        return countError[option];
    }
}

//------------------------------handleTailErrors------------------------

const handleTailErrors = function (option, count) {
    return invalidTailOptionError(option) || countZeroError(count) || illegalOffsetError(count);
};

//-----------------------------------invalidTailOptionError--------------------

const invalidTailOptionError = function (option) {
    let optionError = 'tail: illegal option -- ' + option + 'usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    if (option != 'c' && option != 'n') {
        return optionError;
    }
}

//--------------------------------countZeroError-----------------------------

const countZeroError = function (count) {
    if (count == 0) {
        return ' ';
    }
}

//---------------------------------illegalOffsetError-----------------------

const illegalOffsetError = function (count) {
    let errorMessage = 'tail: illegal offset -- ' + count;
    if (count.match(/[A-z]/)) {
        return errorMessage;
    }
}

//------------------------------missingFileError-------------------

const missingFileError = function (file, existsSync, command) {
    let error = command + ": " + file + ": No such file or directory";
    if (!existsSync(file)) {
        return error;
    }
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