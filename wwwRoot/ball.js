"use strict";

function Ball(center, radius, mass, moveVector) {
  this.center = center;
  this.radius = radius;
  this.mass = mass;
  this.moveVector = moveVector;
}

module.exports = Ball;