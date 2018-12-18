# code review
- [x] unnecessary file getHead.js
- [x] inconsistency in commenting
- [x] can extract parsing and error handling functions to different file
- [x] exports can be written at the end of the file using module.exports
- [x] nyc output and coverage should be added to .gitignore

### lib.js
- [x] 4- headDetails // misleading name
- [x] 6- lines // poor name
- [x] 25- regex can be reduced
- [x] 70- smallerNumber // poor function can use Math.min()
- [ ] 95- invalidHeadOptionError // poor name
- [x] 97- if condition can be modified
- [ ] 119- extractTailLines and extractTailCharacters can be more simplified
- [x] 166- isNoOfLinesZero // poor name
- [x] 178- regex can be reduced
- [x] 188- command variable can be used
- [X] 203- line length more than 80 characters
- [X] 211- unused variable files
- [X] 222- variable defn can be simplified
- [x] 229- duplications in functions head and tail

### libTest.js
- [x] identity () and existsSync() could be replaced 
- [x] input data could be meaningful
- [x] could have declared input data globally

- [x] 44- could have used different it blocks
- [x] 67- redundant test cases // test cases for undefined and empty string can be written
- [x] 80- more test cases can be added // such as empty string, 0 or undefined
- [x] 177- more test cases can be added
- [x] 371- poor nesting
- [ ] 413- unnecessary if
- [x] 434- add more test cases