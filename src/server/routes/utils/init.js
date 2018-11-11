const { resolve } = require('path');
const { createDirectory, rootPath, createFile, fileExists } = require('./common');

module.exports = async () => {
  const rootDirError = createDirectory(rootPath).error;
  const dataDirError = createDirectory(`${rootPath}/data`).error;
  const indexDirError = createDirectory(`${rootPath}/index`).error;
  if (rootDirError || dataDirError || indexDirError) {
    console.error("Server failed to start");
    process.exit();
  }
}

