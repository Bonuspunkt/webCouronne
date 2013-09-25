var fs = require('fs');
var path = require('path');
var send = require('send');
var url = require('url');

var wwwRoot = path.resolve(__dirname, 'wwwRoot');

var buildScript = require('./buildScript');
fs.watch(path.resolve(__dirname, 'wwwScript'), buildScript);
buildScript();


module.exports = {
  handle: function (req, res) {

    send(req, url.parse(req.url).pathname)
      .root(wwwRoot)
      .pipe(res);
  },

  upgrade: function(helper) {
    //helper.request decisoins?
    var webSocket = helper.accept();
    // TODO: launch
    webSocket.on('message', function(message) {
      console.log('wsIN', message);
    })
  }
};