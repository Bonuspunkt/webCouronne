var Vector2 = require('hna').Vector2;
var states = require('../states');
var safeJson = require('./safeJson');
var RESULTS = require('../results');

module.exports = function(couronne, channel) {

  channel.on('activate', function() {
    couronne.state = states.READY;
    couronne.playerBall.enabled = true;
    couronne.tick();
  });
  channel.on('deactivate', function() {
    couronne.state = states.WAITING;
    couronne.tick();
  });

  channel.once('gameState', function() {
    couronne.player = channel.player;
  });

  channel.on('gameState', function(data) {
    data.balls.forEach(function(ball, index) {

      couronne.balls[index].center.x = ball.x;
      couronne.balls[index].center.y = ball.y;
      couronne.balls[index].player = ball.player;
      couronne.balls[index].enabled =
        ball.enabled === undefined ? true : ball.enabled;
      couronne.balls[index].moveVector = Vector2.zero;
    });

    if (data.puck) {
      var puck = data.puck;
      if (puck.x || puck.y) {
        couronne.playerBall.center =
          new Vector2(puck.x, puck.y);
      }
      if (puck.move) {
        couronne.playerBall.moveVector =
          new Vector2(puck.move.x, puck.move.y);
        couronne.state = 3;
      }
    }
    if (data.player) {
      couronne.activePlayer = data.player;
    }
    couronne.tick();
  });

  var playerBall, data;


  couronne.addEventListener('stateChange', function(newState) {
    if (!channel.active) { return; }
    switch (newState) {
      case 2:
        channel.send({
          gameState: {
            puck: couronne.playerBall.center
          }
        });
        break;

      case 3:
        channel.send({
          gameState: {
            puck: {
              move: couronne.playerBall.moveVector
            }
          }
        });
        break;
    }
  });

  couronne.addEventListener('finished', function(result) {

    if (!channel.active) { return; }

    if (result === RESULTS.FAILED) {
      var playerBall = couronne.balls.filter(function(ball) {
        return !ball.enabled && ball.player === couronne.activePlayer;
      })[0];
      if (playerBall) {
        playerBall.enabled = true;
        // TODO: circle through initial positions and find an not occupied place
        var positions = require('../getPositions')(false);
        var positionValid = false;
        for (var i = 0; i < positions.length; i++) {

          positionValid = couronne.balls.every(function(ball) {
            return ball.center.distance(positions[i]) > 20;
          });
          if (positionValid) {
            playerBall.center = new Vector2(positions[i].x, positions[i].y);
            break;
          }
        }
      }
    }

    if (result !== RESULTS.CONTINUE) {
      couronne.activePlayer = couronne.activePlayer === 1 ? 2 : 1;
    }

    var balls = couronne.balls.map(function(ball) {
      return {
        player: ball.player,
        x: ball.center.x,
        y: ball.center.y,
        enabled: ball.enabled
      };
    });
    channel.send({
      gameState: {
        result: result,
        player: couronne.activePlayer,
        balls: balls
      }
    });

    if (result !== RESULTS.CONTINUE) {
      couronne.state = 0;
      channel.active = false;
    } else {
      couronne.state = 1;
    }

  });

};