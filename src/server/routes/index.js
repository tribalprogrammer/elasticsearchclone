var express = require("express");
var router = express.Router();
var path = require('path');

// serve the UI at "/"
router.route("/").get((request, response) => response.sendFile(path.join(`${__dirname}/../../client/build/index.html`)));

// POST route to index documents
const handleIndex = require("./createIndex");
router.route("/index").post(handleIndex);

// GET route to search keywords
const search = require("./searchIndex");
router.route("/search").get(search);

// GET route to serve each document
const viewDoc = require("./viewDoc");
router.route("/doc/:docid").get(viewDoc);

// Redirect /doc to / if docId is not specified
router.route("/doc").get((request, response) => response.redirect('/'));

module.exports = router;
