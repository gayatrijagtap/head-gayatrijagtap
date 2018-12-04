const assert = require('assert');
const {extractCharacters,extractLines,extractInputs,createHeadLines} = require('../src/lib.js');

describe( 'extractInputs' , function() {
  it( 'should return headDetails including option when option is given' , function() {

    let userArgs = [,,'-n5','file1'];
    let expectedOutput = {option:'n',noOfLines:5,files:['file1']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);

    userArgs = [,,'-n','5','file1'];
    expectedOutput = {option:'n',noOfLines:5,files:['file1']};

    userArgs = [,,'-c5','file1','file2'];
    expectedOutput = {option:'c',noOfLines:5,files:['file1','file2']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);
  });

  it( 'should return headDetails excluding option when option is not given' , function() {

    let userArgs = [,,'-5','file1'];
    let expectedOutput = {noOfLines:5,files:['file1']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);

    userArgs = [,,'-5','file1','file2'];
    expectedOutput = {noOfLines:5,files:['file1','file2']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);
  });

  it( 'should return headDetails including all the files when multiple files as an input' , function() {
    let userArgs = [,,'file1','file2'];
    let expectedOutput = {noOfLines:10,files:['file1','file2']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);
  });
})

describe( 'createHeadLines' , function() {
  it( 'should return the heading for the given function' , function() {
    assert.deepEqual(createHeadLines('mars'),'==> mars <==');
    assert.deepEqual(createHeadLines('sample'),'==> sample <==');
  });
})

describe( 'extractLines' , function() {
  it( 'should return the head with given number of lines' , function() {

    let data = 'fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk'
    let expectedOutput = 'fhash\nhsakh\nfkdsh'
    assert.deepEqual(extractLines(data,3),expectedOutput);

    data = 'fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk'
    expectedOutput = 'fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk'
    assert.deepEqual(extractLines(data,7),expectedOutput);
  });
})

describe( 'extractCharacters' , function() {
  it( 'should return the head with the given number of characters' , function() {
    let data = 'fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk'
    let expectedOutput = 'fha';
    assert.deepEqual(extractCharacters(data,3),expectedOutput);
    expectedOutput = 'fhash\nh';
    assert.deepEqual(extractCharacters(data,7),expectedOutput);
  });
})
