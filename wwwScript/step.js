var gatherCollisions = require('./gatherCollisions');
var Vector2 = require('hna').Vector2;
var Ball = require('./elements/ball');

var STATES = require('./states');
var RESULTS = require('./results');

function sort(a,b) {
  return a.time - b.time;
}

module.exports = function step(gameTime) {
  var game = this;

  if (game.state !== STATES.RUNNING) { return; }

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
    el.moveVector = el.moveVector.multiply(0.985);
    if (el.moveVector.length() < 0.02) {
      el.moveVector = Vector2.zero;
    }
  });

  // dead
  game.markDeadPucks();

  if (game.isDone() &&
      this.state === STATES.RUNNING) {

    var result;
    // analyse dead collection
    if (game.deadCollection.indexOf(game.playerBall) !== -1) {
      result = RESULTS.FAILED;
    }
    else if (!this.deadCollection[0] ||
        this.deadCollection[0].player !== game.activePlayer) {
      result = RESULTS.FINISHED;
    } else {
      result = RESULTS.CONTINUE;
    }

    this.playerBall.enabled = true;

    this.emit('finished', result);

    // reset stuff
    //this.state = STATES.READY;
    game.deadCollection = [];
  }
};