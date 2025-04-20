#!/usr/bin/env node

/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 description : excecutable
 example : node delta_deploy.js origin/master
 ****************************************************************************************************/

const fs = require('fs');
const yargs = require("yargs");
const { execSync } = require('child_process');

const methods = require('./delta_deploy/util/Methods');


const options = yargs
    .usage("Usage: -d <destinationBranch>")
    .option("d", { alias: "destination", describe: "destination branch", type: "string", demandOption: true })
    .option("s", { alias: "sourceFolder", describe: "source folder", type: "string" })
    .argv;


let targetBranch = options.destination;

if (methods.isArgumentValid(targetBranch)){return;}