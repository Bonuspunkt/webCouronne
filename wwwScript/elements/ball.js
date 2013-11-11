var DrawableGameComponent = require('hna').DrawableGameComponent;
var util = require('hna').util;
var Vector2 = require('hna').Vector2;
var mixin = require('../util').mixin;

function Ball(game, config) {
  DrawableGameComponent.apply(this, arguments);

  mixin(this, config, {
    radius: 10,
    mass: 10,
    moveVector: new Vector2(0, 0),
    color: '#F88',
    drawOrder: 50
  });

}
util.inherits(Ball, DrawableGameComponent);

Object.defineProperty(Ball.prototype, 'center', {
  get: function() { return this._center; },
  set: function(value) {
    var oldValue = this._center;
    this._center = value;

    if (value instanceof Vector2 && oldValue instanceof Vector2 &&
        (value.x | 0) === (oldValue.x | 0) &&
        (value.y | 0) === (oldValue.y | 0)) { return; }
    this.fireEvent('requireRedraw');
  }
});

Object.defineProperty(Ball.prototype, 'color', {
  get: function() { return this._color; },
  set: function(value) {
    var oldValue = this._color;
    if (value === oldValue) { return; }
    this._color = value;
    this.fireEvent('requireRedraw');
  }
});

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

Ball.prototype.die = function() {
  this.enabled = false;

  if (this.color === '#2F2') {
    this.color = '#080';
  }
  else if (this.color === '#F22') {
    this.color = '#800';
  }
};

module.exports = Ball;