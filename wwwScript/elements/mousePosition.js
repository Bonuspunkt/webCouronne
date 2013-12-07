var DrawableGameComponent = require('hna').DrawableGameComponent;
var util = require('hna').util;

function MousePosition(game) {
  DrawableGameComponent.apply(this, arguments);

  this.drawOrder = 1e3;

  var canvas = game.canvas;

  function getPosition(e) {
    return {
      x: e.pageX - bound.left,
      y: e.pageY - bound.top
    };
  }

  function isPuckPlacementValid(pos) {
    return pos.x >= 70 && pos.y <= 230 && pos.y >= 230 && pos.y <= 270;
  }

  this.position = { x: 0, y: 0 };
  var bound = canvas.getBoundingClientRect();
  canvas.addEventListener('mousemove', function(e) {
    this.position = getPosition(e);
    if (isPuckPlacementValid(this.position)) {
      // position puck
      // TODO: requestDraw
    }
  }.bind(this));

  canvas.addEventListener('mousedown', function() {
    // check if valid to place puck
    // place puck
    // switch to puck direction & force
  });

  canvas.addEventListener('mouseup', function() {
    // TODO: fire puck
  });

}

util.inherits(MousePosition, DrawableGameComponent);

MousePosition.prototype.draw = function(context) {
  context.fillStyle = '#000';
  context.fillText('x: ' + (this.position.x | 0), 10, 80);
  context.fillText('y: ' + (this.position.y | 0), 10, 100);
};


module.exports = MousePosition;
