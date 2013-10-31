"use strict";

function Ball(center, radius, mass, moveVector, color) {
  this.center = center;
  this.radius = radius;
  this.mass = mass;
  this.moveVector = moveVector;
  this.color = color || '#F88';
};

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

Ball.prototype.update = function(time) {
  this.center = this.center.add(this.moveVector.multiply(time));
}

module.exports = Ball;