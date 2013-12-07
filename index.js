var fs = require('fs');
var path = require('path');
var send = require('send');
var url = require('url');
var webmake = require('webmake');

var UserState = require('./lib/userState');

var wwwRoot = path.resolve(__dirname, 'wwwRoot');

var wwwScriptRoot = path.resolve(__dirname, 'wwwScript', 'main.js');

module.exports = {
  handle: function (req, res) {

    if (req.url === '/stats') {
      res.writeHead(200, {'content-type': 'application/json'});
      res.end(JSON.stringify(
        require('./lib/channelRepo').getStats(),
        null, '  '));
      return;
    }

    if(req.url === '/script.js') {
      var webmakeOptions = {
        sourceMap: true,
        cache: true
      };
      res.writeHead(200, {'content-type': 'application/javascript'});
      webmake(wwwScriptRoot, webmakeOptions, function (err, content) {
        if (err) {
          console.log(err);
          res.end('console.log("' + err + '");');
        }
        res.end(content);
      });
      return;
    }

    if (req.url.indexOf('/c/') === 0) {
      req.url = '/';
    }

    send(req, url.parse(req.url).pathname)
      .root(wwwRoot)
      .pipe(res);
  },

  upgrade: function(helper) {
    var url = helper.request.url;
    var webSocket = helper.accept();

    // todo: userState.create()
    new UserState(webSocket, url);
  }
};