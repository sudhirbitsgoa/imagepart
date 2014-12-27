var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require('fs');

var conn = mongoose.createConnection('localhost', 'tests', 27017 );

conn.once('open', function() {

  var gfs = Grid( conn.db, mongoose.mongo );

  var source = fs.createReadStream('/home/sudhir/Desktop/asdf.mp4');

  var target = gfs.createWriteStream({
    filename: 'asdf.mp4'
  });

  source.pipe(target);

});
