var game = require('./game');

var canvasEl = game.canvasEl;

var grid = require('./elements/grid')(canvasEl);
var table = require('./elements/table');
var fpsCounter = require('./elements/fpsCounter');
var mousePos = require('./elements/mousePosition')(canvasEl);
var context = game.context;

module.exports = function draw() {
  context.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // draw grid
  grid.draw(context);
  table.draw(context);

  // draw fps
  fpsCounter.update();
  fpsCounter.draw(context);

  mousePos.draw(context);

  // draw circles
  game.elements.forEach(function(item) {
    item.draw(context);
  });
};