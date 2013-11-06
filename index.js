var fs = require('fs');
var path = require('path');
var send = require('send');
var url = require('url');
var webmake = require('webmake');

var wwwRoot = path.resolve(__dirname, 'wwwRoot');

var wwwScriptRoot = path.resolve(__dirname, 'wwwScript', 'main.js');

module.exports = {
  handle: function (req, res) {

    if(req.url === '/script.js') {
      var webmakeOptions = {
        sourceMap: true,
        cache: true
      };
      res.writeHead(200, {'content-type': 'application/json'});
      webmake(wwwScriptRoot, webmakeOptions, function (err, content) {
        if (err) {
          console.log(err);
          res.end('console.log("' + err + '");');
        }
        res.end(content);
      });
      return;
    }

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
    });
  }
};