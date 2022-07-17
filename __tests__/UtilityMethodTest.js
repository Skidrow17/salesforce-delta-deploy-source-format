const utilMethod = require('../delta_deploy/util/Methods.js')
const {NOT_REMOTE_BRANCH_SPECIFIED, REMOTE_BRANCH_NOT_CORRECT_FORMAT} = require('../delta_deploy/util/Constants.js');
const fse = require('fs-extra');


test('splitOnce', () => {
    var separatedString  = "hello/world/!!";
    var separator = "/";
    expect(utilMethod.splitOnce(separatedString, separator).length).toBe(2);
});

test('addValueToKey', () => {

    let mapToList = new Map();

    utilMethod.addValueToKey('key1', 'value1', mapToList);
    utilMethod.addValueToKey('key1', 'value2', mapToList);
    utilMethod.addValueToKey('key1', 'value3', mapToList);
    utilMethod.addValueToKey('key2', 'value1', mapToList);

    expect(mapToList).toMatchObject({ key1: [ 'value1', 'value2', 'value3' ], key2: [ 'value1' ] });
});


test('jsonToMap', () => {

    let jsonObj = [{
		"directoryName": "authproviders",
		"suffix": "authprovider",
		"xmlName": "AuthProvider"
	},
	{
		"directoryName": "aura",
		"suffix": "",
		"xmlName": "AuraDefinitionBundle"
	}];

    expect(utilMethod.jsonToMap(jsonObj)).not.toBe(undefined);
});

test('isArgumentValid', () => {
    let argument = null;

    expect(utilMethod.isArgumentValid(argument)).toBe(true);

    argument = 'origin';

    expect(utilMethod.isArgumentValid(argument)).toBe(true);

    argument = 'origin/master';

    expect(utilMethod.isArgumentValid(argument)).toBe(false);
});


test('filesCopyFromSourceToDestinationFolder', () => {

    fse.mkdirSync('src/classes/testClass.cls', {recursive: true});
    fse.mkdirSync('src/classes/testClass.cls-meta.xml', {recursive: true});


    let files = ['src/classes/testClass.cls','src/classes/nonExcistingTestClass.cls'];
    let sourceDirectory = 'src';
    let destinationDirectory = 'package';

    expect(utilMethod.filesCopyFromSourceToDestinationFolder(files,sourceDirectory,destinationDirectory)).not.toBe(null);

    fse.rmSync('src/classes/testClass.cls', { recursive: true, force: true });
    fse.rmSync('src/classes/testClass.cls', { recursive: true, force: true });

});

test('packageXMLGenerator', () => {
    fse.mkdirSync('src/classes/testClass.cls', {recursive: true});
    fse.mkdirSync('src/classes/testClass.cls-meta.xml', {recursive: true});

    let filesCoppied = { classes: [ 'testClass.cls', 'testClass.cls-meta.xml'] };
    let destinationDirectory = 'src';
    let packageVersion = '52.0';

    jest.mock('fs-extra')
    expect(utilMethod.packageXMLGenerator(filesCoppied, destinationDirectory, packageVersion)).not.toBe(null);
    
    jest.spyOn(fse, 'mkdirSync');

    fse.rmSync('src/classes/testClass.cls', { recursive: true, force: true });
    fse.rmSync('src/classes/testClass.cls', { recursive: true, force: true });

});