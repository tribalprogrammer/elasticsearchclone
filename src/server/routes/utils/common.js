const fs = require("fs");
const os = require("os");
const util = require('util');
const writeFileAtomic = require('write-file-atomic');

const rootPath = `${os.homedir()}/.elasticsearchclone`;
const writeFile = util.promisify(writeFileAtomic);

const createDirectory = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath);
    } else {
      return { error: false };
    }
  } catch(mkdirError) {
    console.error(`Error creating directory ${dirPath}\n${JSON.stringify(mkdirError, null, 2)}`);
    return { error: true, body: JSON.parse(JSON.stringify(mkdirError)) };
  }
  console.log(`Created directory: ${dirPath}`);
  return { error: false };
}

const createFile = async (fileName, dirPath, content, create) => {
  if (create) {
    console.log(`Creating file: ${dirPath}/${fileName}`)
  }
  const { error, body } = createDirectory(dirPath);
  if (error) {
    return { error: true, body };
  }
  try {
    const writeFileResp = await writeFile(`${dirPath}/${fileName}`, content);
  } catch (e) {
    console.error(`Error creating file ${dirPath}/${fileName}\n${JSON.stringify(e, null, 2)}`);
    return { error: true, body: JSON.parse(JSON.stringify(e))};
  }
  return { error: false };
};

const readFile = (fileName, dirPath) => {
  let content;
  try {
    content = fs.readFileSync(
      `${dirPath}/${fileName}`,
      {
        encoding: "utf-8"
      }
    );
  } catch (e) {
    return {
      error: JSON.parse(JSON.stringify(e))
    };
  }
  return { content };
}

const fileExists = (fileName, dirPath) => {
  if (fs.existsSync(`${dirPath}/${fileName}`)) {
    return true;
  }
  return false;
}

const getFilesInDirectory = (dirPath) => {
  return fs.readdirSync(dirPath);
}

module.exports = {
  readFile,
  createFile,
  createDirectory,
  rootPath,
  fileExists,
  getFilesInDirectory
};
