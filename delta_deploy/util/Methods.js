
const {EXCLUDED_FILES, META_XML, FOLDER_SEPARATOR} = require('../util/Constants');
const fse = require('fs-extra');



/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 @param key : contains the key of the map
 @param value : contains the value of the map
 @param folderFileName : map that the values are added
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
 @param s : contains the string that we want to split
 @param on : contains the separator we want to use
 description : splits the string just on the first reference
 of the separator
 ****************************************************************************************************/

const splitOnce = (s, on) => {
    [first, ...rest] = s.split(on);
    return [first, rest.length > 0? rest.join(on) : null];
};


/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 @param jsonObject : contains a json object
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
 date : 25/06/22
 @param files : contains list of the paths of the files that got modified
 @param sourceDirectory : contains the source folder path
 @param destinationDirectory : contains the destination folder path
 description : coppies the modified/created files from the source folder
 to the destination folder
 ****************************************************************************************************/

const filesCopyFromSourceToDestinationFolder = (files,sourceDirectory,destinationDirectory) => {

    let folderFilesMap = new Map();

    files.forEach(function (file) {
        if(file.includes(sourceDirectory) && !EXCLUDED_FILES.has(file)) {
            fse.copySync(file,file.replace(sourceDirectory, destinationDirectory));

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
 @param filesCoppied : contains a map with folder name as key and list of metadata as value
 @param destinationDirectory : contains the directory which i want to create the package.xml file
 description : method used to generate package xml whith the differences between two branches
 the current one with the one you specify when you run the command
 ****************************************************************************************************/

const packageXMLGenerator = (filesCoppied, destinationDirectory, packageVersion) => {

    let rawData = fse.readFileSync('delta_deploy/util/metadata.json');
    let metadata = JSON.parse(rawData);
    let folderObjectMap = jsonToMap(metadata);

    let packageXML = '';
    packageXML = packageXML + '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<Package xmlns="http://soap.sforce.com/2006/04/metadata">\n';

    Object.keys(filesCoppied).forEach(function (folderName) {
        packageXML = packageXML + '    <types>'+'\n';
        filesCoppied[folderName].forEach(function (metadataName) {
            if(folderName !== 'labels') {
                let metadataSuffix = '.'+folderObjectMap.get(folderName).suffix;
                let metaDataFiltered = metadataName.replace('-meta.xml', '').replace(metadataSuffix,'');
                packageXML = packageXML + '        <members>' + metaDataFiltered + '</members>' + '\n';
            }else{
                packageXML = packageXML + '        <members>*</members>' + '\n';
            }
        });
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