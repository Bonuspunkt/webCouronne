#!/usr/bin/env node

var http = require('http');
var WebSocketHelper = require('./webSocketHelper');

var module = require('../index');

var server = http.createServer();

var port = process.argv[2] || 8080;

server.on('request', function(req, res) {
  console.log(req.method, req.url);
  module.handle(req, res);
});

server.on('upgrade', function (request, socket, head) {

  console.log(request.headers.upgrade, request.url);

  var helper = WebSocketHelper(request, socket, head);

  if (module.upgrade) {
    return module.upgrade(helper);
  }

  helper.close();
});

server.listen(port);
console.log('running at http://0.0.0.0:' + port + '/');
