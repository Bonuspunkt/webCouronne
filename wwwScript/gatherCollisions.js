var game = require('./game');
var detectCollision = require('detectCollision');
var resolveCollision = require('resolveCollision');

var Vector = require('./vector');


function gatherCollisions() {
  var els = game.elements;
  var collisions = [];
  var i;

  function collideBorder(flag, el, xFactor, yFactor) {
    if (flag !== false && flag <= 1) {
      collisions.push({
        time: flag,
        handle: function() {
          el.moveVector = new Vector(
            xFactor * el.moveVector.x,
            yFactor * el.moveVector.y);
        }
      });
    }
  }

  for (i = 0; i < els.length; i++) {
    var el = els[i];

    // item.center.x + item.moveVector.x * time = item.Radius;
    // item.moveVector.x * time = item.Radius - item.center.x
    // time = ( item.Radius - item.center.x ) / item.moveVector.x

    var collidesLeft = el.center.x + el.moveVector.x < el.radius
        && el.moveVector.x < 0
        && ( el.radius - el.center.x ) / el.moveVector.x;
    var collidesRight = el.center.x + el.moveVector.x > game.canvasEl.width - el.radius
        && el.moveVector.x > 0
        && ( game.canvasEl.width - el.radius - el.center.x ) / el.moveVector.x;
    var collidesTop = el.center.y + el.moveVector.x < el.radius
        && el.moveVector.y < 0
        && ( el.radius - el.center.y ) / el.moveVector.y;
    var collidesBottom = el.center.y + el.moveVector.y > game.canvasEl.height - el.radius
        && el.moveVector.y > 0
        && ( game.canvasEl.height - el.radius - el.center.y ) / el.moveVector.x;

    collideBorder(collidesLeft, els[i], -1, 1);
    collideBorder(collidesRight, els[i], -1, 1);
    collideBorder(collidesTop, els[i], 1, -1);
    collideBorder(collidesBottom, els[i], 1, -1);
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