var express = require('express');
var path = require('path');
var assert = require('assert');
var app = express();

app.set('port', 3000);

app.use(express.static(path.join(__dirname, '../src')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
});

const Browser = require('zombie');

browser = new Browser({debug: true, runScripts: true });
          
describe('Siebel Log Extract Info Tests', function() {  

  before(function(done) {
    browser.visit('http://localhost:3000/index.html', done);
  });

  it('should be successful', function() {
    browser.assert.success();
  });

  it('should see welcome page and check for title', function() {
    assert.equal(browser.text('title'), "Siebel Log Info Extract");   
  });

  after(function(done) {
    server.close(done);
  });
});
