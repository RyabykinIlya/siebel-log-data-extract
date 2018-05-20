var express = require('express');
var path = require('path');
var assert = require('assert');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, '../build')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
});