const {
  readFile,
  createFile,
  rootPath
} = require('./utils/common');
const uuid = require('uuid/v1');
const { index } = require('./utils/indexUtils');

module.exports = async (request, response) => {
  // validate the payload
  if (!validateRequest(request.body)) {
    response.statusCode = 400;
    return response.json(errors.validationError);
  }

  // store the doc and return a response with the generated UUID
  const uid = uuid();
  const createFileResp = await createFile(
    `${uid}.json`,
    `${rootPath}/data`,
    JSON.stringify({ ...request.body, uid }),
    true
  );
  if (createFileResp.error) {
    response.statusCode = 500;
    return response.json(errors.serverError);
  }
  response.statusCode = 202;
  response.json({
    processing: true,
    uid 
  });

  // index the doc
  index({...request.body, uid});
};

const validateRequest = (body) => {
  if (!body) {
    return false;
  }

  const { title, content } = body;

  if (!title || !content) {
    return false;
  }
  if (typeof title !== 'string' || typeof content !== 'string') {
    return false;
  }
  return true;
}

const errors = {
  validationError: {
    code: "IPAYLOAD",
    message: "indexing failed: payload must contain a title (string) field and a content (string) field",
    path: "/index"
  },
  serverError: {
    code: "FILESYSTEM",
    message: "indexing failed: the server met an unexpected condition",
    path: "/index"
  }
};