require('./polyfill');

var Couronne = require('./couronne');
var canvasEl = document.querySelector('canvas');
var couronne = new Couronne(canvasEl);
couronne.init();

var wsUrl = window.location.href.replace(/^http/, 'ws');
var socket = new WebSocket(wsUrl);

socket.addEventListener('message', function(e) {
  console.log(e.data);
});
socket.addEventListener('error', function() {
  console.log('error');
});
socket.addEventListener('close', function() {
  console.log('close');
});

require('./webSocket/logonWebSocket')(socket);

var Channel = require('./webSocket/channel');
var channel = new Channel(socket);

require('./webSocket/couronneWebSocket')(couronne, channel);

var playerList = document.querySelector('#playerlist');
require('./webSocket/playerListWebSocket')(playerList, channel);

var chatBox = document.querySelector('#chatbox');
require('./webSocket/chatBoxWebSocket')(chatBox, channel);
