"use strict";

function Vector(x, y) {
  this.x = x;
  this.y = y;
};

Vector.prototype.distance = function(vector) {
  return this.minus(vector).magnitude();
};

Vector.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.dot = function(vector) {
  return this.x * vector.x + this.y * vector.y
};


Vector.prototype.add = function(vector) {
  if (typeof vector === 'number') {
    return new Vector(
      this.x + vector,
      this.y + vector
    );
  }
  return new Vector(
      this.x + vector.x,
      this.y + vector.y
    );
}

Vector.prototype.minus = function(vector) {

  if (typeof vector === 'number') {
    return new Vector(
      this.x - vector,
      this.y - vector
    );
  }
  return new Vector(
    this.x - vector.x,
    this.y - vector.y
  );
}

Vector.prototype.normalize = function() {
  var magnitude = this.magnitude();
  return new Vector(
    this.x / magnitude,
    this.y / magnitude
  );
};

Vector.prototype.times = function(time) {
  return new Vector(
    this.x * time,
    this.y * time
  );
};


module.exports = Vector;