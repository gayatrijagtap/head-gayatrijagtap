const assert = require('assert');
const {getHead,extractOption,extractNoOfLines,extractCharacters,extractLines,extractInputs,createHeadLines} = require('../src/lib.js');

//---------------------extractInputs tests-------------------
describe( 'extractInputs' , function() {
  it( 'should return headDetails including option when option is given' , function() {

    let userArgs = [,,'-n5','file1'];
    let expectedOutput = {option:'n',noOfLines:5,files:['file1']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);

    userArgs = [,,'-n','5','file1'];
    expectedOutput = {option:'n',noOfLines:5,files:['file1']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);

    userArgs = [,,'-c5','file1','file2'];
    expectedOutput = {option:'c',noOfLines:5,files:['file1','file2']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);
  });

  it( 'should return headDetails excluding option when option is not given' , function() {

    let userArgs = [,,'-5','file1'];
    let expectedOutput = {option:'n',noOfLines:5,files:['file1']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);

    userArgs = [,,'-5','file1','file2'];
    expectedOutput = {option:'n',noOfLines:5,files:['file1','file2']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);
  });

  it( 'should return headDetails including all the files when multiple files as an input' , function() {
    let userArgs = [,,'file1','file2'];
    let expectedOutput = {option:'n',noOfLines:10,files:['file1','file2']};
    assert.deepEqual(extractInputs(userArgs),expectedOutput);
  });
})

//-------------------------createHeadLines tests--------------
describe( 'createHeadLines' , function() {
  it( 'should return the heading for the given function' , function() {
    assert.deepEqual(createHeadLines('mars'),'==> mars <==');
    assert.deepEqual(createHeadLines('sample'),'==> sample <==');
  });
})

//-----------------------------extractLines tests------------
describe( 'extractLines' , function() {
  it( 'should return the head with given number of lines' , function() {

    let data = 'fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n'
    let expectedOutput = 'fhash\nhsakh\nfkdsh'
    assert.deepEqual(extractLines(data,3),expectedOutput);

    data = 'fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n'
    expectedOutput = 'fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk'
    assert.deepEqual(extractLines(data,7),expectedOutput);
  });
})

//----------------------extractCharacters tests---------------
describe( 'extractCharacters' , function() {
  it( 'should return the head with the given number of characters' , function() {
    let data = 'fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk'
    let expectedOutput = 'fha';
    assert.deepEqual(extractCharacters(data,3),expectedOutput);
    expectedOutput = 'fhash\nh';
    assert.deepEqual(extractCharacters(data,7),expectedOutput);
  });
})

//--------------------------extractOption tests---------------
describe( 'extractOption' , function() {
  it( 'should extract the -c or -n option for given input' , function() {
    assert.deepEqual(extractOption('-c5'),'c');
    assert.deepEqual(extractOption('-c'),'c');
    assert.deepEqual(extractOption('-5'),'n');
  });
})

//-------------------------extractNoOfLines tests-------------------
describe( 'extractNoOfLines' , function() {
  it( 'should extract the no of lines from the given input' , function() {
    assert.deepEqual(extractNoOfLines(['-c5','']),{lines:5,index:3});
    assert.deepEqual(extractNoOfLines(['-5','']),{lines:5,index:3});
    assert.deepEqual(extractNoOfLines(['-c','2']),{lines:2,index:4});
    assert.deepEqual(extractNoOfLines(['file1','file2']),{lines:10,index:2});
  });
})

//--------------------------getHead tests---------------------

describe( 'getHead' , function() {

  let readFileSync = file => file;
  let existsSync = file => true;
  let fs = {readFileSync,existsSync};

  it( 'should return head of the file with given specifications' , function() {
    let data = 'fsdjfhsdh\ndfjkshjk\ndsfjdfdkjfs';
    let userArgs = [,,'-n2',data]
    assert.deepEqual(getHead(userArgs,fs),'fsdjfhsdh\ndfjkshjk');

    data = 'grldfjd';
  userArgs = [,,'-c','4',data];
    assert.deepEqual(getHead(userArgs,fs),'grld');
  });
})
