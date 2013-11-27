require('./polyfill');

var Couronne = require('./couronne');
var canvasEl = document.querySelector('canvas');
var couronne = new Couronne(canvasEl);
couronne.init();

var wsUrl = window.location.href.replace(/^http/, 'ws');
var socket = new WebSocket(wsUrl);
socket.addEventListener('error', function() {
  console.log('error');
});
socket.addEventListener('close', function() {
  console.log('close');
});

require('./webSocket/logonWebSocket')(socket);

require('./webSocket/couronneWebSocket')(couronne, socket);

