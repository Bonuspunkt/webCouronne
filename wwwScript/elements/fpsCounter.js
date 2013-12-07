var DrawableGameComponent = require('hna').DrawableGameComponent;
var util = require('hna').util;

var COUNT = 30;

function FpsCounter() {
  DrawableGameComponent.apply(this, arguments);

  this.array = new Array(COUNT);
  this.index = 0;

  this.drawOrder = 1e3;
}

util.inherits(FpsCounter, DrawableGameComponent);

FpsCounter.prototype.update = function(/* ticks */) {
  var now = Date.now();
  var ticks = now - this.lastRender;
  this.lastRender = now;

  this.array[this.index] = ticks;
  this.index = (this.index + 1) % COUNT;

  var tickSum = this.array.reduce(function(prev, curr) { return prev + curr; });
  this.fps = 1000 / (tickSum / COUNT) | 0;
};

FpsCounter.prototype.draw = function(context) {
  context.fillStyle = '#000';
  context.fillText(this.fps + 'fps', 10, 20);

  context.fillText(this.game.state, 10, 35);
};

module.exports = FpsCounter;