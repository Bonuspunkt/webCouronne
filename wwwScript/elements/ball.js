var DrawableGameComponent = require('hna').DrawableGameComponent;
var util = require('hna').util;
var Vector2 = require('hna').Vector2;
var mixin = require('../util').mixin;

function Ball(game, config) {
  DrawableGameComponent.apply(this, arguments);

  // center, radius, mass, moveVector, color
  mixin(this, config, {
    radius: 10,
    mass: 10,
    moveVector: new Vector2(0, 0),
    color: '#F88',
    drawOrder: 50
  });

}
util.inherits(Ball, DrawableGameComponent);

Ball.prototype.draw = function(context) {
  context.beginPath();
  context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
  context.fillStyle = this.color;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = '#000';
  context.stroke();
  context.closePath();
};

Ball.prototype.update = function(gameTime) {
  if (typeof gameTime === 'number') {
    gameTime = { elapsed: gameTime };
  }

  this.center = this.center.add(this.moveVector.multiply(gameTime.elapsed));
};

module.exports = Ball;