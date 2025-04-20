#!/usr/bin/env node

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
 // Get the diff for .csv files only
 const diff = execSync(`git diff ${targetBranch} -- ${folder} -- '*.csv'`, { encoding: 'utf8' });
 const lines = diff.split('\n');

 let currentFile = null;
 let addedLines = [], deletedLines = [];

 for (const line of lines) {
  if (line.startsWith('diff --git')) {
   // Save any previous file diffs
   if (currentFile) saveFileDelta(currentFile, addedLines, deletedLines);

   // Extract file path
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

 // Final file
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

 if (added.length) {
  fs.writeFileSync(
      path.join(deltaBase, 'added', fileName),
      [header, ...added].join('\n') + '\n'
  );
 }
 if (deleted.length) {
  fs.writeFileSync(
      path.join(deltaBase, 'deleted', fileName),
      [header, ...deleted].join('\n') + '\n'
  );
 }
 if (added.length && deleted.length) {
  fs.writeFileSync(
      path.join(deltaBase, 'updated', fileName),
      [header, ...deleted, ...added].join('\n') + '\n'
  );
 }
}