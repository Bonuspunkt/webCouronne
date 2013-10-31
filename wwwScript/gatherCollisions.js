var game = require('./game');
var detectCollision = require('./detectCollision');
var resolveCollision = require('./resolveCollision');

var Vector = require('hna').Vector2;


function minCheck(el, xy, min) {
  return el.center[xy] + el.moveVector[xy] < min + el.radius &&
    el.moveVector[xy] < 0 &&
    (el.radius - el.center[xy] - min) / el.moveVector[xy];
}
function maxCheck(el, xy, max) {
  return el.center[xy] + el.moveVector[xy] > max - el.radius &&
    el.moveVector[xy] > 0 &&
    ( max - el.radius - el.center[xy] ) / el.moveVector[xy];
}
function getResolver(a, b) {
  return function() {
    resolveCollision(a, b);
  }
}

function gatherCollisions() {
  var els = game.elements;
  var collisions = [];
  var i;

  function collideBorder(flag, el, xFactor, yFactor) {
    if (flag === false) { return; }
    if (flag > 1) { return; }

    collisions.push({
      time: flag,
      handle: function() {
        el.moveVector = new Vector(
          xFactor * el.moveVector.x,
          yFactor * el.moveVector.y);
      }
    });
  }

  // circle-border-collision
  for (i = 0; i < els.length; i++) {
    var el = els[i];

    var collidesLeft = minCheck(el, 'x', 0);
    var collidesRight = maxCheck(el, 'x', game.canvasEl.width);
    var collidesTop = minCheck(el, 'y', 0);
    var collidesBottom = maxCheck(el, 'y', game.canvasEl.height);

    collideBorder(collidesLeft, els[i], -1, 1);
    collideBorder(collidesRight, els[i], -1, 1);
    collideBorder(collidesTop, els[i], 1, -1);
    collideBorder(collidesBottom, els[i], 1, -1);
  }

  // circle-circle-collision
  for (i = 0; i < els.length; i++) {
    for (var j = i+1; j < els.length; j++) {
      var collision = detectCollision(els[i], els[j]);
      if (collision !== false) {
        collisions.push({
          time: collision,
          handle: getResolver(els[i], els[j])
        });
      }
    }
  }
  return collisions;
}

module.exports = gatherCollisions;