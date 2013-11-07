var gatherCollisions = require('./gatherCollisions');
var Vector2 = require('hna').Vector2;
var Ball = require('./elements/ball');

var STATES = require('./states');

function sort(a,b) {
  return a.time - b.time;
}

module.exports = function step(gameTime) {
  var game = this;
  // collision detection
  var collisions = [];
  var interval = 1;
  while ((collisions = gatherCollisions(game)).length > 0 && interval > 0) {

    collisions.sort(sort);

    var collision = collisions[0];

    game.components.updateComponents.forEach(function(el){
      el.update(collision.time);
    });
    collision.handle();

    interval -= collision.time;
  }

  if (interval > 0) {
    game.components.updateComponents.forEach(function(el) { el.update(interval); });
  }
  // slowdown
  game.components.updateComponents.filter(function(cmp) {
    return cmp instanceof Ball;
  }).forEach(function(el) {
    if (!el.moveVector) { return; }
    el.moveVector = el.moveVector.multiply(0.99);
    if (el.moveVector.length < 0.02) {
      el.moveVector = new Vector2(0,0);
    }
  });

  // dead
  game.table.holes.forEach(function(hole) {
    game.components.drawComponents.filter(function(cmp) {
      return cmp instanceof Ball && cmp.enabled;
    }).forEach(function(el) {
      var distance = hole.substract(el.center).length;
      if (distance < 15) {
        el.enabled = false;
        el.drawOrder--;

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

  var alive = game.components.drawComponents.some(function(cmp) {
    return cmp instanceof Ball && cmp.enabled &&
      cmp.moveVector.x !== 0 && cmp.moveVector.y !== 0;
  });
  if (!alive && this.state === STATES.RUNNING) {
    this.state = STATES.READY;
    this.playerBall.reset();
  }
};