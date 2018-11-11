const {
  readFile,
  rootPath,
  fileExists,
  getFilesInDirectory,
} = require('./common');

const indexPath = `${rootPath}/index`;
const dataPath = `${rootPath}/data`;

const search = (query) => {
  let inTitle, inContent, queryString = query;
  if (query.indexOf(':title') === 0) {
    inTitle = true;
    queryString = query.substring(6);
  } else if (query.indexOf(':content') === 0) {
    inContent = true;
    queryString = query.substring(8);
  }
  
  const words = new Set(queryString.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ').split(" ").filter((w) => Boolean(w)));
  const occurenceInTitle = {};
  const occurenceInContent = {};
  const termFrequency = {};
  words.forEach((word) => {
    termFrequency[word] = {};
    if (!fileExists(`${word}.json`, indexPath)) {
      return;
    }
    const index = require(`${indexPath}/${word}.json`);
    if (!inContent) {
      Object.keys(index.title).forEach((doc) => {
        termFrequency[word][doc] = termFrequency[word][doc] ?
        termFrequency[word][doc] + index.title[doc].length * 5 :
        index.title[doc].length * 5;
        if (occurenceInTitle[doc]) {
          occurenceInTitle[doc][word] = index.title[doc];
        } else {
          occurenceInTitle[doc] = {
            [word]: index.title[doc]
          };
        }
      });
    }
    if (!inTitle) {
      Object.keys(index.content).forEach((doc) => {
        termFrequency[word][doc] = termFrequency[word][doc] ?
        termFrequency[word][doc] + index.content[doc].length :
        index.content[doc].length;
        if (occurenceInContent[doc]) {
          occurenceInContent[doc][word] = index.content[doc];
        } else {
          occurenceInContent[doc] = {
            [word]: index.content[doc]
          };
        }
      });
    }
  })

  scaledTFIDFMatrix = getScaledTFIDF(termFrequency);
  const ranking = getTFIDFBasedRankings(scaledTFIDFMatrix);
  return ranking;
}

const getScaledTFIDF = (tfMatrix) => {
  const scaledTFIDFMatrix = {};
  const totalNumberOfDocs = getFilesInDirectory(dataPath).length;
  Object.keys(tfMatrix).forEach((term) => {
    Object.keys(tfMatrix[term]).forEach((doc) => {
      if (!scaledTFIDFMatrix[doc]) { scaledTFIDFMatrix[doc] = {}; }
      scaledTFIDFMatrix[doc][term] = 
      Math.log(1 + tfMatrix[term][doc]) *
      Math.log(totalNumberOfDocs / Object.keys(tfMatrix[term]).length) *
      2.303;
    });
  });
  return scaledTFIDFMatrix;
}

const getTFIDFBasedRankings = (scaledTFIDFMatrix) => {
  const tfIdfRating = {};
  Object.keys(scaledTFIDFMatrix).forEach((doc) => {
    tfIdfRating[doc] = 0;
    Object.keys(scaledTFIDFMatrix[doc]).forEach((term) => {
      tfIdfRating[doc] += scaledTFIDFMatrix[doc][term];
    })
  });
  const rankings = Object.keys(tfIdfRating).map((doc) => {
    return { [doc]: tfIdfRating[doc] };
  }).sort((doc1, doc2) => doc2[Object.keys(doc2)[0]] - doc1[Object.keys(doc1)[0]])
  .map((doc) => {
    return Object.keys(doc)[0];
  });
  return rankings;
}

const sendResults = (results, o, l) => {
  let offset = 0, limit = undefined;
  if (o) {
    offset = parseInt(o);
  }
  if (l) {
    limit = parseInt(l);
  }
  return ({
    count: results.length,
    results: results.slice(
      (offset ? offset : 0),
      limit
    ).map((uid) => require(`${rootPath}/data/${uid}.json`))
  });
}

module.exports = {
  search,
  sendResults
};