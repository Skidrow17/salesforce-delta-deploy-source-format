const { execSync } = require('child_process');
const fs = require('fs');
const PackageXMLGenerator = require('./delta_deploy/services/PackageXMLGenerator')
const SourceFilePackageGenerator = require('./delta_deploy/services/SourceFilePackageGenerator')
const {SOURCE_FOLDER, DESTINATION_FOLDER} = require('./delta_deploy/util/Constants');

let branch = process.argv[2];

const sourceDestinationBranchesFilesDiff = execSync('git diff --name-only '+branch, { encoding: 'utf-8' }).split('\n');

//delete folder
fs.rmSync(DESTINATION_FOLDER, { recursive: true, force: true });
fs.mkdirSync(DESTINATION_FOLDER, {recursive: true});

//generate new package
const sfpg = new SourceFilePackageGenerator();
const pxmlg = new PackageXMLGenerator();

//copy files FromSource to Destinatior
let filesCoppied = sfpg.packageGenerator(sourceDestinationBranchesFilesDiff,SOURCE_FOLDER,DESTINATION_FOLDER);

//package xml generator
pxmlg.packageXMLGenerator(filesCoppied,DESTINATION_FOLDER);