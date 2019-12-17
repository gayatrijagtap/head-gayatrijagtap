const configs = require('./configs')
const constants = require('./constants')

const parseInput = function (userArgs) {
    let commandDetails = new Object();
    commandDetails.option = extractOption(userArgs[0]);
    let { count, index } = extractCountWithFileIndex(userArgs.slice(0, 2));
    commandDetails.count = count;
    commandDetails.files = userArgs.slice(index, userArgs.length);
    return commandDetails;
};

const extractOption = function (optionCandidate) {
    return userOption(optionCandidate) || configs.lineOption;
};

const userOption = function (optionCandidate) {
    if (optionCandidate.match(/^-[A-m O-z]/)) {
        return optionCandidate[1];
    }
    return constants.EMPTY_CHAR;
}

const extractCountWithFileIndex = function (userArgs) {
    if (userArgs[0].match(/^-[0-9]/)) {
        return { count: userArgs[0].slice(1), index: 1 };
    }
    if (userArgs[0].match(/^-.[0-9]/)) {
        return { count: userArgs[0].slice(2), index: 1 };
    }
    if (userArgs[0].match(/^-/) && userArgs[1].match(/[0-9]/)) {
        return { count: userArgs[1], index: 2 }
    }
    return { count: configs.defaultCount, index: 0 };
};

module.exports = {
    parseInput,
    extractOption,
    userOption,
    extractCountWithFileIndex
};