const fs = require('fs');

let rawData = fs.readFileSync('delta_deploy/util/metadata.json');
let metadata = JSON.parse(rawData);
let folderObjectMap = new Map();
const {STANDARD_PACKAGE_VERSION} = require('../util/Constants');

//create the mapping with folder name as key and object(Metadata Name, prefix ..etc)
for(let attributename in metadata){
    folderObjectMap.set(metadata[attributename].directoryName,metadata[attributename]);
}

class PackageXMLGenerator {

    packageXMLGenerator(filesCoppied, destinationDirectory){

        let packageXML = '';
        packageXML = packageXML + '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Package xmlns="http://soap.sforce.com/2006/04/metadata">\n';
    
        Object.keys(filesCoppied).forEach(function (folderName) {
            packageXML = packageXML + '    <types>'+'\n';
            filesCoppied[folderName].forEach(function (metadataName) {
                if(folderName !== 'labels') {
                    packageXML = packageXML + '        <members>' + metadataName.replace('-meta.xml', '').replace(folderObjectMap.get(folderName).suffix,'').replace('.','') + '</members>' + '\n';
                }else{
                    packageXML = packageXML + '        <members>*</members>' + '\n';
                }
            });
            packageXML = packageXML + '        <name>' + folderObjectMap.get(folderName).xmlName + '</name>'+'\n'
            packageXML = packageXML + '    </types>'+'\n';
        });

        packageXML = packageXML + '    <version>'+STANDARD_PACKAGE_VERSION+'</version>\n' +
        '</Package>';
       
        try {
            fs.writeFileSync(destinationDirectory+'/package.xml', packageXML);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = PackageXMLGenerator;
