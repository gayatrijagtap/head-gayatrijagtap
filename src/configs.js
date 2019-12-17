const headUsageMessage = ["\nusage:head", "[-n", "lines", "|", "-c", "bytes]", "[file", "...]"].join(' ');
const tailUsageMessage = ['usage:', 'tail', '[-F', '|', '-f', '|', '-r]', '[-q]', '[-b', '#', '|', '-c', '#', '|', '-n', '#]', '[file', '...]'].join(' ');
const headOptionError = "head: illegal option -- ";
const tailOptionError = "tail: illegal option -- ";
const headLineCountError = "head: illegal line count -- ";
const headByteCountError = "head: illegal byte count -- ";
const tailOffsetError = 'tail: illegal offset -- ';
const missingFileError = ": No such file or directory";
const lineOption = 'n';
const byteOption = 'c';
const charEncoding = 'utf8';
const defaultCount = '10';

module.exports = {
headUsageMessage : headUsageMessage,
tailUsageMessage : tailUsageMessage,
headOptionError : headOptionError,
tailOptionError : tailOptionError,
headLineCountError : headLineCountError,
headByteCountError : headByteCountError,
tailOffsetError : tailOffsetError,
missingFileError : missingFileError,
lineOption : lineOption,
byteOption : byteOption,
charEncoding : charEncoding,
defaultCount : defaultCount
}