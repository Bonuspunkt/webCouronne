var game = require('./game');
var detectCollision = require('detectCollision');
var resolveCollision = require('resolveCollision');

var Vector = require('./vector');


function gatherCollisions() {
  var els = game.elements;
  var collisions = [];
  var i;

  for (i = 0; i < els.length; i++) {
    var el = els[i];

    // item.center.x + item.moveVector.x * time = item.Radius;
    // item.moveVector.x * time = item.Radius - item.center.x
    // time = ( item.Radius - item.center.x ) / item.moveVector.x

    var collidesLeft = el.center.x + el.moveVector.x < el.radius
        && ( el.radius - el.center.x ) / el.moveVector.x;
    var collidesRight = el.center.x + el.moveVector.x > game.canvasEl.width - el.radius
        && ( game.canvasEl.width - el.radius - el.center.x ) / el.moveVector.x;
    var collidesTop = el.center.y + el.moveVector.x < el.radius
        && ( el.radius - el.center.y ) / el.moveVector.y;
    var collidesBottom = el.center.y + el.moveVector.y > game.canvasEl.height - el.radius
        && ( game.canvasEl.height - el.radius - el.center.y ) / el.moveVector.x;

    if (collidesLeft !== false && collidesLeft <= 1) {
      collisions.push({
        time: collidesLeft,
        handle: (function() {
          var el = els[i];
          return function() {
            el.moveVector = new Vector(-el.moveVector.x, el.moveVector.y);
          };
        }())
      })
    }
    if (collidesRight !== false && collidesRight <= 1) {
      collisions.push({
        time: collidesTop,
        handle: (function() {
          var el = els[i];
          return function() {
            el.moveVector = new Vector(-el.moveVector.x, el.moveVector.y);
          };
        }())
      })
    }
    if (collidesTop !== false && collidesTop <= 1) {
      collisions.push({
        time: collidesTop,
        handle: (function() {
          var el = els[i];
          return function() {
            el.moveVector = new Vector(el.moveVector.x, -el.moveVector.y);
          };
        }())
      })
    }
    if (collidesBottom !== false && collidesBottom <= 1) {
      collisions.push({
        time: collidesLeft,
        handle: (function() {
          var el = els[i];
          return function() {
            el.moveVector = new Vector(el.moveVector.x, -el.moveVector.y);
          };
        }())
      })
    }
  }

  for (i = 0; i < els.length; i++) {
    for (var j = i+1; j < els.length; j++) {
      var collision = detectCollision(els[i], els[j]);
      if (collision !== false) {
        collisions.push({
          time: collision,
          handle: (function() {
            var a = els[i];
            var b = els[j];
            return function() {
              resolveCollision(a, b);
            };
          }())
        });
      }
    }
  }
  return collisions;
}

module.exports = gatherCollisions;