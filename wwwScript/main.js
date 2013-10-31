require('./polyfill');

var canvasEl = document.querySelector('canvas');
var context = canvasEl.getContext('2d');

var game = require('./game');
game.canvasEl = canvasEl;
game.context = context;

var hookup = require('./hookup');
var init = require('./init');

init();