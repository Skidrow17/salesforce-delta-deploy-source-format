#!/usr/bin/env node

/****************************************************************************************************
 author : Silvan Sholla
 date : 25/06/22
 description : Executable to diff CSV folder against a branch and classify changes
 example : node delta_deploy.js -d main -s ./data
 ****************************************************************************************************/

const fs = require('fs');
const path = require('path');
const yargs = require("yargs");
const { execSync } = require('child_process');
const methods = require('./delta_deploy/util/Methods');

const options = yargs
    .usage("Usage: -d <destinationBranch> -s <sourceFolder>")
    .option("d", { alias: "destination", describe: "destination branch", type: "string", demandOption: true })
    .option("s", { alias: "sourceFolder", describe: "source folder", type: "string", demandOption: true })
    .argv;

const targetBranch = options.destination;
const folder = options.sourceFolder;
const deltaBase = 'delta_output';

if (methods.isArgumentValid(targetBranch)) return;
if (!fs.existsSync(folder)) {
 console.error(`Folder "${folder}" does not exist.`);
 return;
}

// Clean or create output structure
['added', 'deleted', 'updated'].forEach(type => {
 const dir = path.join(deltaBase, type);
 fs.rmSync(dir, { recursive: true, force: true });
 fs.mkdirSync(dir, { recursive: true });
});

try {
 const diff = execSync(`git diff ${targetBranch} -- ${folder} -- '*.csv'`, { encoding: 'utf8' });
 const lines = diff.split('\n');

 let currentFile = null;
 let addedLines = [], deletedLines = [];

 for (const line of lines) {
  if (line.startsWith('diff --git')) {
   if (currentFile) saveFileDelta(currentFile, addedLines, deletedLines);
   const match = line.match(/b\/(.+\.csv)$/);
   if (match) {
    currentFile = match[1];
    addedLines = [];
    deletedLines = [];
   }
  } else if (line.startsWith('+') && !line.startsWith('+++')) {
   addedLines.push(line.substring(1));
  } else if (line.startsWith('-') && !line.startsWith('---')) {
   deletedLines.push(line.substring(1));
  }
 }

 if (currentFile) saveFileDelta(currentFile, addedLines, deletedLines);

} catch (err) {
 console.error(`Error running git diff: ${err.message}`);
}

function saveFileDelta(filePath, added, deleted) {
 const relPath = path.relative(folder, filePath);
 const fileName = path.basename(relPath);

 let header = '';
 try {
  const fullFilePath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullFilePath, 'utf8');
  header = fileContents.split('\n')[0];
 } catch (err) {
  console.warn(`Could not read header from ${filePath}: ${err.message}`);
 }

 const { added: cleanAdded, deleted: cleanDeleted, updated } = classifyChangesByRow(added, deleted);

 if (cleanAdded.length) {
  fs.writeFileSync(
      path.join(deltaBase, 'added', fileName),
      [header, ...cleanAdded].join('\n') + '\n'
  );
 }
 if (cleanDeleted.length) {
  fs.writeFileSync(
      path.join(deltaBase, 'deleted', fileName),
      [header, ...cleanDeleted].join('\n') + '\n'
  );
 }
 if (updated.length) {
  const updatedLines = updated.map(pair => pair.new);
  fs.writeFileSync(
      path.join(deltaBase, 'updated', fileName),
      [header, ...updatedLines].join('\n') + '\n'
  );
 }
}

function classifyChangesByRow(added, deleted) {
 const updated = [];
 const trulyAdded = [];
 const trulyDeleted = [];

 const addedMap = new Map();
 added.forEach(line => {
  const key = line.split(',')[0].trim();
  addedMap.set(key, line);
 });

 const deletedMap = new Map();
 deleted.forEach(line => {
  const key = line.split(',')[0].trim();
  deletedMap.set(key, line);
 });

 for (const [key, newLine] of addedMap.entries()) {
  if (deletedMap.has(key)) {
   updated.push({ old: deletedMap.get(key), new: newLine });
   deletedMap.delete(key);
  } else {
   trulyAdded.push(newLine);
  }
 }

 for (const [_, line] of deletedMap.entries()) {
  trulyDeleted.push(line);
 }

 return { added: trulyAdded, deleted: trulyDeleted, updated };
}
