/****************************************************************************************************
    author : Silvan Sholla
    date : 25/06/22
    description : excecutable 
    example : node delta_deploy.js origin/master
****************************************************************************************************/ 

const fs = require('fs');

const { execSync } = require('child_process');
const {SOURCE_FOLDER, DESTINATION_FOLDER, STANDARD_PACKAGE_VERSION} = require('./delta_deploy/util/Constants');
const methods = require('./delta_deploy/util/Methods');

let targetBranch = process.argv[2];

//run git command to find the differences between current and target branch
const sourceDestinationBranchesFilesDiff = execSync('git diff --name-only '.concat(targetBranch), { encoding: 'utf-8' }).split('\n');

//delete folder
fs.rmSync(DESTINATION_FOLDER, { recursive: true, force: true });
fs.mkdirSync(DESTINATION_FOLDER, {recursive: true});

//copy files FromSource to Destinatior
let filesCoppied = methods.filesCopyFromSourceToDestinationFolder(sourceDestinationBranchesFilesDiff,SOURCE_FOLDER,DESTINATION_FOLDER);

//package xml generator
methods.packageXMLGenerator(filesCoppied,DESTINATION_FOLDER,STANDARD_PACKAGE_VERSION);