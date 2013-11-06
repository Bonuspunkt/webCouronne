var Ball = require('./ball');
var util = require('hna').util;
var Vector2 = require('hna').Vector2;
var mixin = require('../util').mixin;

var STATES = require('../states');

function PlayerBall(game, config) {

  mixin(config, {
    center: new Vector2(150,240),
    color: '#ffe',
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

PlayerBall.prototype.getPosition = function(e) {
  return new Vector2(e.pageX - this.bound.left, e.pageY - this.bound.top);
};

PlayerBall.prototype.isPuckPlacementValid = function(pos) {
  return pos.x >= 70 && pos.x <= 230 && pos.y >= 230 && pos.y <= 250;
};

PlayerBall.prototype.onMouseMove = function(e) {
  var pos = this.getPosition(e);

  switch (this.game.state) {
    case STATES.READY:
      this.center = pos;
      if (this.isPuckPlacementValid(this.center)) {
        this.color = '#FF0';
      } else {
        this.color = '#FFB';
      }
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
  this.game.state = STATES.RUNNING;

  this.moveVector = this.center.substract(this.lineEnd).multiply(0.2);
};

PlayerBall.prototype.draw = function(context) {
  Ball.prototype.draw.apply(this, arguments);

  if (this.game.state === STATES.STEADY) {
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = '#f00';

    var offset = this.lineEnd.substract(this.center).normalize().multiply(12);
    var start = this.center.add(offset);
    context.moveTo(start.x, start.y);
    context.lineTo(this.lineEnd.x, this.lineEnd.y);
    context.stroke();
    context.closePath();
  }
};

module.exports = PlayerBall;