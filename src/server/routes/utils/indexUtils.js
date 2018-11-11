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
  await handleTokens(titleTokens, 'title', uid);
  await handleTokens(contentTokens, 'content', uid);
}

const handleTokens = async (tokens, type, uid) => {
  let _i = 0;
  for (const term of tokens) {
    // convert each token to lower case
    const token = term.toLowerCase();
    // ignore the token if the length is less than 2
    // create a file for a token if it doesnt exist and store occurences in title and content
    if (!fileExists(`${token}.json`, indexPath)) {
      const tokenMap = {
        title: {},
        content: {}
      };
      tokenMap[type][uid] = [_i];
      const response = await createFile(
        `${token}.json`,
        indexPath,
        JSON.stringify(tokenMap),
        true
      );
      if (response.error) {
        console.error("Could not create file");
      }
    } else {
      const tokenMap = require(`${indexPath}/${token}.json`);
      if (tokenMap[type][uid]) {
        tokenMap[type][uid].push(_i);
      } else {
        tokenMap[type][uid] = [_i];
      }
      const response = await (createFile(`${token}.json`, indexPath, JSON.stringify(tokenMap)));
      if (response.error) {
        console.error('Could not write to file');
      }
    }
    _i++;
  }
}

const extractTokens = (data) => {
  const wordArray = data.replace(/[^a-zA-Z0-9]/g, ' ').split(" ").filter((w) => Boolean(w));
  return wordArray;
}

module.exports = {index, };