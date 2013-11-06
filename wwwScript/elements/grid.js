var DrawableGameComponent = require('hna').DrawableGameComponent;
var util = require('hna').util;

function Grid(game) {
  DrawableGameComponent.apply(this, arguments);
}
util.inherits(Grid, DrawableGameComponent);

Grid.prototype.draw = function(context) {
  var canvas = this.game.canvas;

  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = '#bbb';

  for (var x = 10; x < canvas.width; x += 10) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }

  for (var y = 10; y < canvas.height; y += 10) {
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
  }

  context.stroke();
  context.closePath();
};

module.exports = Grid;