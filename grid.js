var app = require('express')();
var GridStore = require('mongodb').GridStore;
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;

var dbConnection;
MongoClient.connect("mongodb://localhost:27017/test?auto_reconnect", {journal: true}, function(err, db) {
  dbConnection = db;
  console.log("there is ",err);
  app.listen(3000);
});

function StreamGridFile(req, res, GridFile) {
  if(req.headers['range']) {

    // Range request, partialle stream the file
    console.log('Range Reuqest');
    var parts = req.headers['range'].replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];

    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : GridFile.length -1;
    var chunksize = (end-start)+1;

    console.log('Range ',start,'-',end);

    res.writeHead(206, {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + GridFile.length,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': GridFile.contentType
    });

    // Set filepointer
    GridFile.seek(start, function() {
      // get GridFile stream
      var stream = GridFile.stream(true);

      // write to response
      stream.on('data', function(buff) {
        // count data to abort streaming if range-end is reached
        // perhaps theres a better way?
        start += buff.length;
        if(start >= end) {
          // enough data send, abort
          GridFile.close();
          res.end();
        } else {
          res.write(buff);
        }
      });
    });

  } else {

    // stream back whole file
    console.log('No Range Request');
    res.header('Content-Type', GridFile.contentType);
    res.header('Content-Length', GridFile.length);
    var stream = GridFile.stream(true);
    stream.pipe(res);
  }
}

app.get('/', function(req, res) {
  console.log('GET request');
  new GridStore(dbConnection, new ObjectID("549e88e42109ec3c146f9b4a"), null, 'r').open(function(err, GridFile) {
    if(!GridFile) {
      console.log("there is error");
      res.send(404,'Not Found');
      return;
    }

    StreamGridFile(req, res, GridFile)
  });
});
