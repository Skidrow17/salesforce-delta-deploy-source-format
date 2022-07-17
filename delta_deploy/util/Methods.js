
const {EXCLUDED_FILES, META_XML, FOLDER_SEPARATOR, NOT_REMOTE_BRANCH_SPECIFIED, REMOTE_BRANCH_NOT_CORRECT_FORMAT, FILE_DELETED_VERIFY_DEST_CHANGED} = require('../util/Constants');
const fse = require('fs-extra');


/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 @param {String} key - contains the key of the map
 @param {List<String>} value - contains the value of the map
 @param {Map<String, List<String>>} folderFileName - contains the map values
 description : method used to create a map with key as folder name
 and value a list of metadata files of that folder
 ****************************************************************************************************/

const addValueToKey = (key, value, folderFileName) => {
    folderFileName[key] ??= [];
    folderFileName[key].push(value);
};

/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 @param {String} stringToSplit - contains the string that we want to split
 @param {String} separator - contains the separator we want to use
 description : splits the string just on the first reference
 of the separator
 ****************************************************************************************************/

const splitOnce = (stringToSplit, separator) => {
    [first, ...rest] = stringToSplit.split(separator);
    return [first, rest.length > 0? rest.join(separator) : null];
};


/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 @param {Object[]} jsonObject - contains a json object
 description : converts jsonobject to a map
 ****************************************************************************************************/

const jsonToMap = (jsonObject) => {
    let folderObjectMap = new Map();
    for(let attributename in jsonObject){
        folderObjectMap.set(jsonObject[attributename].directoryName,jsonObject[attributename]);
    }
    return folderObjectMap;
};

/****************************************************************************************************
 author : Silvan Sholla
 date : 26/06/22
 @param {String} commandParam - checks the param validity
 description : return true in case there was an error and the program stops
 ****************************************************************************************************/

const isArgumentValid = (commandParam) => {
    if(commandParam == null){
        console.log(NOT_REMOTE_BRANCH_SPECIFIED);
        return true;
    }
    else if(commandParam.split('/').length != 2) {
        console.log(REMOTE_BRANCH_NOT_CORRECT_FORMAT);
        return true;
    }else{
        return false;
    }
};

/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 @param {List<String>} files - contains list of the paths of the files that got modified
 @param {String} sourceDirectory - contains the source folder path
 @param {String} destinationDirectory - contains the destination folder path
 description : coppies the modified/created files from the source folder
 to the destination folder
 ****************************************************************************************************/

const filesCopyFromSourceToDestinationFolder = (files,sourceDirectory,destinationDirectory) => {

    let folderFilesMap = new Map();

    files.forEach(function (file) {

        if(file.includes(sourceDirectory) && !EXCLUDED_FILES.has(file)) {

            /*
                Also deleted files are considered a change so there is a possiblity the file doesnt excist anymore
                so a check is needed
            */

            if(fse.existsSync(file)){
                fse.copySync(file,file.replace(sourceDirectory, destinationDirectory));
            } else {
                console.log(FILE_DELETED_VERIFY_DEST_CHANGED.replace('${file}', file));
            }

            /*
                in case the metadata file contains extra .meta.xml file copy that also
                its required for a successfull deploy
            */

            if(fse.existsSync(file.concat(META_XML))){
                fse.copySync(file.concat(META_XML),file.replace(sourceDirectory, destinationDirectory).concat(META_XML));
            }

            let objectFileMap = splitOnce(file.replace(sourceDirectory.concat(FOLDER_SEPARATOR),''),FOLDER_SEPARATOR);
            addValueToKey(objectFileMap[0],objectFileMap[1],folderFilesMap);
        }

    });

    return folderFilesMap;
}


/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 @param {String} filesCoppied - contains a map with folder name as key and list of metadata as value
 @param {String} destinationDirectory - contains the directory where the package.xml file will be saved
 @param {String} packageVersion - contains the version of the generated xml
 description : method used to generate package xml whith the differences between two branches
 member names not mentioned
 ****************************************************************************************************/

 const packageXMLGenerator = (filesCoppied, destinationDirectory, packageVersion) => {

    let rawData = fse.readFileSync(__dirname+'\\Metadata.json');
    let metadata = JSON.parse(rawData);
    let folderObjectMap = jsonToMap(metadata);

    let packageXML = '';
    packageXML = packageXML + '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<Package xmlns="http://soap.sforce.com/2006/04/metadata">\n';

    Object.keys(filesCoppied).forEach(function (folderName) {
        if(fse.lstatSync(destinationDirectory.concat(FOLDER_SEPARATOR+folderName)).isFile()){return;}
        packageXML = packageXML + '    <types>'+'\n';
        packageXML = packageXML + '        <members>*</members>' + '\n';
        packageXML = packageXML + '        <name>' + folderObjectMap.get(folderName).xmlName + '</name>'+'\n'
        packageXML = packageXML + '    </types>'+'\n';
    });

    packageXML = packageXML + '    <version>'+packageVersion+'</version>\n' +
        '</Package>';

    try {
        fse.writeFileSync(destinationDirectory+'/package.xml', packageXML);
    } catch (err) {
        console.error(err);
    }
}

exports.addValueToKey = addValueToKey;
exports.splitOnce = splitOnce;
exports.jsonToMap = jsonToMap;
exports.filesCopyFromSourceToDestinationFolder = filesCopyFromSourceToDestinationFolder;
exports.packageXMLGenerator = packageXMLGenerator;
exports.isArgumentValid = isArgumentValid;
