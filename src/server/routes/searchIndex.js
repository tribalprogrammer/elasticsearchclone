const uuid = require('uuid/v1');
const { search, sendResults } = require('./utils/searchUtils');
const {
  rootPath
} = require('./utils/common');
const url = require('url');

module.exports = async (request, response) => {
  // get query parameters
  const urlParts = url.parse(request.url, true);
  const { query } = urlParts;

  // validate request
  const validationError = validateRequest(query);
  if (validationError.code === 'IPARAMS') {
    response.statusCode = 400;
    return response.json(validationError);
  }

  // get request parameters;
  const { q, o, l} = query;

  // get search results
  const results = search(q);

  // send
  return response.json(sendResults(results, o, l));
};

const validateRequest = (query) => {
  if (!query) {
    return errors.noParams;
  }
  if (!query.q) {
    return errors.qManditory;
  }
  const { l, o} = query;
  if (o) {
    if (isNaN(parseInt(o))) {
      return errors.qInvalidOffset; 
    }
  }
  if (l) {
    if (isNaN(parseInt(l))) {
      return errors.qInvalidLimit;
    }
  }
  return {};
}

const errors = {
  noParams: {
    code: "IPARAMS",
    message: "request params absent",
    path: "/search"
  },
  qManditory : {
    code: "IPARAMS",
    message: 'query parameter "q" (string) is mandatory',
    path: "/search"
  },
  qInvalidLimit: {
    code: "IPARAMS",
    message: 'query parameter "l" (limit) must be a number',
    path: "/search"
  },
  qInvalidOffset: {
    code: "IPARAMS",
    message: 'query parameter "o" (offset) must be a number',
    path: "/search"
  }
}
