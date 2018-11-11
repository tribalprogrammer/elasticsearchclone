// init project
const Express = require("express");
const bodyParser = require("body-parser");
const app = new Express();
const path = require('path');
const port = process.env.PORT || 3000;

// use bodyParser for parsing request bodies
app.use(bodyParser.json());

// router and static content
const router = require("./routes");
app.use("/", router);

// serve static content for the UI
app.use('/static', Express.static(path.join(__dirname, '..', 'client', 'build', 'static')));

// init server: create required directories on FS
const serverInit = require("./routes/utils/init");
serverInit();

// listen for requests
var listener = app.listen(port, function () {
  console.log("Elasticsearch clone is running at " + port);
});
