/*
    author : Silvan Sholla
    date : 25/6/22
*/

const fse = require('fs-extra');
const {META_XML,FOLDER_SEPARATOR} = require('../util/Constants');
const methods = require('../util/Methods');
const excludedFiles = new Set(["src/package.xml"]);

class SourceFilePackageGenerator {

    packageGenerator(files,sourceDirectory,destinationDirectory){

        let folderFilesMap = new Map();

        files.forEach(function (file) {
            if(file.includes(sourceDirectory) && !excludedFiles.has(file)) {
                fse.copySync(file,file.replace(sourceDirectory, destinationDirectory));
                
                /*
                  in case the metadata file contains extra .meta.xml file copy that also
                  its required for a successfull deploy 
                */
                  
                if(fse.existsSync(file.concat(META_XML))){
                    fse.copySync(file.concat(META_XML),file.replace(sourceDirectory, destinationDirectory).concat(META_XML));
                }

                let objectFileMap = methods.splitOnce(file.replace(sourceDirectory.concat(FOLDER_SEPARATOR),''),FOLDER_SEPARATOR);
                methods.addValueToKey(objectFileMap[0],objectFileMap[1],folderFilesMap);
            }
        });
        return folderFilesMap;
    }
}

module.exports = SourceFilePackageGenerator