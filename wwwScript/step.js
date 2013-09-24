var game = require('./game');
var gatherCollisions = require('./gatherCollisions');
var Vector = require('vector');
var table = require('elements/table');

function sort(a,b) {
  return a.time - b.time;
}

module.exports = function step() {
  // collision detection
  var collisions = [];
  var interval = 1; // lastRender - currentRender
  while ((collisions = gatherCollisions()).length > 0 && interval > 0) {

    collisions.sort(sort);

    var collision = collisions[0];

    game.elements.forEach(function(el){
      el.update(collision.time);
    });
    collision.handle();

    interval -= collision.time;
  }

  if (interval > 0) {
    game.elements.forEach(function(el) { el.update(interval); });
  }
  game.elements.forEach(function(el) {
    el.moveVector = el.moveVector.times(0.99);
    if (el.moveVector.magnitude() < 0.02) {
      el.moveVector = new Vector(0,0);
    }
  });

  table.holes.forEach(function(hole) {
    game.elements.forEach(function(el, index) {
      var distance = hole.minus(el.center).magnitude();
      if (distance < 15) {
        game.elements.splice(index, 1);
        game.deadElements.push(el);

        switch (el.color) {
          case '#FF0':
            el.color = '#880';
            break;
          case '#F22':
            el.color = '#800';
            break;
          case '#2F2':
            el.color = '#080';
            break;
        }
      }
    });
  });
};