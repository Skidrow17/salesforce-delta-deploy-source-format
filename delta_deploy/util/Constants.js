module.exports.META_XML = '-meta.xml';
module.exports.FOLDER_SEPARATOR = '/';
module.exports.STANDARD_PACKAGE_VERSION = '52.0';
module.exports.SOURCE_FOLDER = 'src';
module.exports.DESTINATION_FOLDER = 'delta_deploy/package';
module.exports.EXCLUDED_FILES = new Set(["src/package.xml"]);

//Git Commands
module.exports.GIT_DIFF_NAME_COMMAND = 'git diff --name-only {!branchName}';
module.exports.GIT_FETCH_ALL_COMMAND = 'git fetch {!remoteBranch}';


//Error Messages
module.exports.NOT_REMOTE_BRANCH_SPECIFIED = 'You need to specify the target branch. Your command should look like, node delta_deploy.js {remoteName}/{branchName}';
module.exports.REMOTE_BRANCH_NOT_CORRECT_FORMAT = 'Remote Branch format should be like {remoteName}/{branchName}';