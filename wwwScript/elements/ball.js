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
    player: 1,
    drawOrder: 50
  });

}
util.inherits(Ball, DrawableGameComponent);

Object.defineProperties(Ball.prototype, {
  center: {
    get: function() { return this._center; },
    set: function(value) {
      var oldValue = this._center;
      this._center = value;

      if (value instanceof Vector2 && oldValue instanceof Vector2 &&
          (value.x | 0) === (oldValue.x | 0) &&
          (value.y | 0) === (oldValue.y | 0)) { return; }
      this.fireEvent('requireRedraw');
    }
  },
  moveVector: {
    get: function() { return this._moveVector; },
    set: function(value) {
      var oldValue = this._moveVector;
      this._moveVector = value;

      if (value instanceof Vector2 && oldValue instanceof Vector2 &&
          oldValue.equals(value)) { return; }
      this.fireEvent('requireUpdate');
    }
  }
});

Ball.prototype.draw = function(context) {
  context.beginPath();
  context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
  context.fillStyle = this.getColor();
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = '#000';
  context.stroke();
  context.closePath();
};

Ball.prototype.getColor = function() {
  if (this.player === 1)
    return this.enabled ? '#2F2' : '#080';
  if (this.player === 2)
    return this.enabled ? '#F22' : '#800'
};

Ball.prototype.update = function(gameTime) {
  if (typeof gameTime === 'number') {
    gameTime = { elapsed: gameTime };
  }

  this.center = this.center.add(this.moveVector.multiply(gameTime.elapsed));
};

module.exports = Ball;