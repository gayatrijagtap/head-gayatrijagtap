# code review
```
- [x] unnecessary file getHead.js
- [x] inconsistency in commenting
- [] can extract parsing and error handling functions to different file
- [x] exports can be written at the end of the file using module.exports
- [x] nyc output and coverage should be added to .gitignore
```

### lib.js
```
- [x] 4- headDetails // misleading name
- [x] 6- lines // poor name
- [x] 25- regex can be reduced
- [x] 70- smallerNumber // poor function can use Math.min()
- [] 95- invalidHeadOptionError // poor name
- [x] 97- if condition can be modified
- [] 119- extractTailLines and extractTailCharacters can be more simplified
- [x] 166- isNoOfLinesZero // poor name
- [x] 178- regex can be reduced
- [x] 188- command variable can be used
- [] 203- line length more than 80 characters
- [] 211- unused variable files
- [] 222- variable defn can be simplified
- [] 229- duplications in functions head and tail
```

### libTest.js
```
- [] identity () and existsSync() could be replaced 
- [] input data could be meaningful
- [] could have declared input data globally

- [] 44- could have used different it blocks
- [] 67- redundant test cases // test cases for undefined and empty string can be written
- [] 80- more test cases can be added // such as empty string, 0 or undefined
- [] 177- more test cases can be added
- [] 371- poor nesting
- [] 413- unnecessary if
- [] 434- add more test cases
```