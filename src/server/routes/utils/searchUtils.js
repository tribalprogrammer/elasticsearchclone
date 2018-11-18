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
  const termFrequency = {};
  words.forEach((word) => {
    termFrequency[word] = {};
    let index;
    try {
      index = require(`${indexPath}/${word}.json`);
    } catch (e) {
      return;
    }
    if (!inContent) {
      Object.keys(index.title).forEach((doc) => {
        termFrequency[word][doc] = termFrequency[word][doc] ?
        termFrequency[word][doc] + index.title[doc].length * 5 :
        index.title[doc].length * 5;
      });
    }
    if (!inTitle) {
      Object.keys(index.content).forEach((doc) => {
        termFrequency[word][doc] = termFrequency[word][doc] ?
        termFrequency[word][doc] + index.content[doc].length :
        index.content[doc].length;
      });
    }
  })
  scaledTFIDFMatrix = getScaledTFIDF(termFrequency);
  const ranking = getTFIDFBasedRankings(scaledTFIDFMatrix);
  return ranking;
}

const getScaledTFIDF = (tfMatrix) => {
  const scaledTFIDFMatrix = {};
  const termDFRatingMap = {};
  const totalNumberOfDocs = getFilesInDirectory(dataPath).length;
  Object.keys(tfMatrix).forEach((term) => {
    if (!termDFRatingMap[term]) {
      termDFRatingMap[term] = Object.keys(tfMatrix[term]).length;
    }
    Object.keys(tfMatrix[term]).forEach((doc) => {
      if (!scaledTFIDFMatrix[doc]) { scaledTFIDFMatrix[doc] = {}; }
      scaledTFIDFMatrix[doc][term] = 
      Math.log(1 + tfMatrix[term][doc]) *
      Math.log(totalNumberOfDocs / termDFRatingMap[term]) *
      2.303;
    });
  });
  return scaledTFIDFMatrix;
};

const getTFIDFBasedRankings = (scaledTFIDFMatrix) => {
  const tfIdfRating = {};
  Object.keys(scaledTFIDFMatrix).forEach((doc) => {
    tfIdfRating[doc] = 0;
    Object.keys(scaledTFIDFMatrix[doc]).forEach((term) => {
      tfIdfRating[doc] += scaledTFIDFMatrix[doc][term];
    })
  });

  const rankings = Object.keys(tfIdfRating).sort((doc1, doc2) => {
    return tfIdfRating[doc2] - tfIdfRating[doc1]; 
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