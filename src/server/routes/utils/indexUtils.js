const {
  readFile,
  createFile,
  rootPath,
  fileExists
} = require('./common');

let dataPath = `${rootPath}/data`;
let indexPath = `${rootPath}/index`;

const index = async ({title, content, uid}) => {
  const titleTokens = extractTokens(title);
  const contentTokens = extractTokens(content);
  handleTokens(titleTokens, 'title', uid);
  handleTokens(contentTokens, 'content', uid);
}

const handleTokens = async (tokens, type, uid) => {
  const numOfTokens = tokens.length;
  let numOfRetries = 0;
  for (let _i = 0; _i < numOfTokens && numOfRetries < 10;) {
    // convert each token to lower case
    const token = tokens[_i].toLowerCase();
    // ignore the token if the length is less than 2
    // create a file for a token if it doesnt exist and store occurences in title and content
    if (!fileExists(`${token}.json`, indexPath)) {
      const tokenMap = {
        title: {},
        content: {}
      };
      tokenMap[type][uid] = [_i];
      const createFileResp = await createFile(
        `${token}.json`,
        indexPath,
        JSON.stringify(tokenMap),
        true
      );
      if (createFileResp.error) {
        console.error(createFileResp.error);
        numOfRetries++;
        continue;
      } else {
        numOfRetries = 0;
        _i++;
      }
    } else {
      const tokenMap = require(`${indexPath}/${token}.json`);
      if (tokenMap[type][uid]) {
        tokenMap[type][uid].push(_i);
      } else {
        tokenMap[type][uid] = [_i];
      }
      const createFileResp = await (createFile(`${token}.json`, indexPath, JSON.stringify(tokenMap)))
      if (createFileResp.error) {
        console.error(createFileResp.error);
        numOfRetries++;
        continue;
      } else {
        numOfRetries = 0;
        _i++;
      }
    }
  }
}

const extractTokens = (data) => {
  const wordArray = data.replace(/[^a-zA-Z0-9]/g, ' ').split(" ").filter((w) => Boolean(w));
  return wordArray
}

module.exports = {
  index,
};