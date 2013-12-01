var Vector2 = require('hna').Vector2;
var states = require('../states');
var safeJson = require('./safeJson');

module.exports = function(couronne, channel) {

  var active = false;

  channel.on('activate', function() {
    active = true;
    couronne.state = states.READY;
    couronne.tick();
  });
  channel.on('deactivate', function() {
    active = false;
    couronne.state = states.WAITING;
    couronne.tick();
  });

  channel.on('gameState', function(data) {
    data.balls.forEach(function(ball, index) {
      couronne.balls[index].center.x = ball.x;
      couronne.balls[index].center.y = ball.y;
      couronne.balls[index].player = ball.player;
      // ???
      //couronne.balls[index].enabled = ball.enabled === undefined ? true : ball.enabled;
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
    couronne.tick();
  })

  var playerBall, data;

  couronne.addEventListener('stateChange', function(newState) {
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

      case 1:
        if (!active) {
          couronne.state = 0;
          return;
        }
        console.log(couronne.deadCollection);
        var balls = couronne.balls.map(function(ball) {
          return {
            player: ball.player,
            x: ball.center.x,
            y: ball.center.y,
            enabled: ball.enabled
          };
        });
        channel.sendGameState(balls);
        break;
    }
  });
};