var gatherCollisions = require('./gatherCollisions');
var Vector2 = require('hna').Vector2;
var Ball = require('./elements/ball');

var STATES = require('./states');

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

    // analyse dead collection
    if (game.deadCollection.indexOf(game.playerBall) !== -1) {
      var playerBall = game.balls.filter(function(ball) {
        return !ball.enabled && ball.player === game.activePlayer;
      })[0];
      if (playerBall) {
        playerBall.enabled = true;
        // TODO: circle through initial positions and find an not occupied place
        var positions = require('./getPositions')();
        var positionValid = false;
        for (var i = 0; i < positions.length || positionValid; i++) {
          positionValid = this.balls.every(function(ball) {
            return playerBall !== ball &&
              ball.center.distance(positions[i]) > 10;
          })
        }
        playerBall.center = new Vector2(positions[i-1].x, positions[i-1].y);
      }
    }
    else if (!this.deadCollection[0] ||
      this.deadCollection[0].player !== game.player) {
      game.player = game.player === 1 ? 2 : 1;
    }

    // reset stuff
    this.state = STATES.READY;
    this.playerBall.reset();
    game.deadCollection = [];


  }
};