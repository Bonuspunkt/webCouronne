var Ball = require('./ball');
var util = require('hna').util;
var Vector2 = require('hna').Vector2;
var mixin = require('../util').mixin;

var STATES = require('../states');

function PlayerBall(game, config) {

  mixin(config, {
    center: new Vector2(150,240),
    player: 0,
    drawOrder: 100
  });

  Ball.apply(this, arguments);

  var canvas = game.canvas;
  this.bound = canvas.getBoundingClientRect();

  canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
  canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
  canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
}
util.inherits(PlayerBall, Ball);

Object.defineProperty(PlayerBall.prototype, 'lineEnd', {
  get: function() { return this._lineEnd; },
  set: function(value) {
    var oldValue = this._lineEnd;
    this._lineEnd = value;

    if (value instanceof Vector2 && oldValue instanceof Vector2 &&
        (value.x | 0) === (oldValue.x | 0) &&
        (value.y | 0) === (oldValue.y | 0)) { return; }
    this.fireEvent('requireRedraw');
  }
});

PlayerBall.prototype.getPosition = function(e) {
  return new Vector2(e.pageX - this.bound.left, e.pageY - this.bound.top);
};

PlayerBall.prototype.isPuckPlacementValid = function(pos) {
  var self = this;
  pos = pos || this.center;

  return pos.x >= 70 && pos.x <= 230 && pos.y >= 230 && pos.y <= 250 &&
    !this.game.components.updateComponents.some(function(cmp) {
      return cmp instanceof Ball && self !== cmp &&
        cmp.center.substract(self.center).length() < 2 * self.radius;
    });
};

PlayerBall.prototype.isShotValid = function() {
  var moveVector = this.center.substract(this.lineEnd);
  if (moveVector.y > 0) return false;
  if (moveVector.length() <= 12) return false;
  return true;
};

PlayerBall.prototype.onMouseMove = function(e) {
  var pos = this.getPosition(e);

  switch (this.game.state) {
    case STATES.READY:
      this.center = pos;
      break;

    case STATES.STEADY:
      this.lineEnd = pos;
      break;

    case STATES.RUNNING:
      return;
  }
};

PlayerBall.prototype.onMouseDown = function(e) {
  var pos = this.lineEnd = this.getPosition(e);
  if (this.game.state === STATES.READY &&
      this.isPuckPlacementValid(pos)) {
    this.game.state = STATES.STEADY;
  }
};

PlayerBall.prototype.onMouseUp = function(e) {
  if (this.game.state !== STATES.STEADY) { return; }
  if (!this.isShotValid()) {
    this.game.state = STATES.READY;
    return;
  }
  this.game.state = STATES.RUNNING;

  var moveVector = this.center.substract(this.lineEnd);
  moveVector = moveVector.substract(moveVector.normalize().multiply(12));
  if (moveVector.length() > 30) {
    moveVector = moveVector.normalize().multiply(30);
  }
  this.moveVector = moveVector.multiply(0.3);
};

PlayerBall.prototype.getColor = function() {
  if (this.game.state === STATES.READY && !this.isPuckPlacementValid()) {
    return '#FFB';
  }
  return this.enabled ? '#FF0' : '#880'
};

PlayerBall.prototype.draw = function(context) {
  Ball.prototype.draw.apply(this, arguments);

  if (this.game.state === STATES.STEADY) {
    if (this.center.equals(this.lineEnd)) { return; }

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = this.isShotValid() ? '#f00' : '#888';

    var offset = this.lineEnd.substract(this.center).normalize().multiply(12);
    var start = this.center.add(offset);
    context.moveTo(start.x, start.y);

    var shotVector = this.lineEnd.substract(start);
    if (shotVector.length() > 30) {
      shotVector = shotVector.normalize().multiply(30);
    }
    context.lineTo(start.x + shotVector.x, start.y + shotVector.y);
    context.stroke();
    context.closePath();
  }
};

PlayerBall.prototype.reset = function() {
  mixin(this, {
    center: new Vector2(150,240),
    moveVector: new Vector2(0,0),
    drawOrder: 100,
    enabled: true
  });
};

PlayerBall.prototype.die = function() {
  Ball.prototype.die.apply(this, arguments);
  this.color = '#880';
};

module.exports = PlayerBall;