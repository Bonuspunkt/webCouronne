require('./polyfill');

var Couronne = require('./couronne');
var canvasEl = document.querySelector('canvas');
var couronne = new Couronne(canvasEl);


couronne.init();