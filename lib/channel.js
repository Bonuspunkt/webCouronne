var getPositions = require('../wwwScript/getPositions');
var safeJson = require('../wwwScript/webSocket/safeJson');

function Channel() {
  this.users = [];
}

Channel.prototype.add = function(user) {
  this.users.push(user);

  this.distribute({
    join: user.name
  });

  user.send({
    users: this.getUsers()
  });

  this.check();

  user.on('message', this.handleMessage.bind(this, user));
  user.on('close', this.remove.bind(this, user));
};

Channel.prototype.remove = function(user) {
  var index = this.users.indexOf(user);
  if (index === -1) { return; }
  this.users.splice(index, 1);

  this.distribute({
    part: user.name
  });

  this.check();
};

Channel.prototype.getUsers = function(channel) {
  return this.users.map(function(user) {
    return {
      name: user.name,
      player: user.player
    };
  });
};

Channel.prototype.distribute = function(data, excludes) {
  if (!Array.isArray(excludes)) { excludes = [excludes]; }

  this.users.forEach(function(user) {
    if (excludes.indexOf(user) !== -1) { return; }
    user.send(data);
  });
};

Channel.prototype.isNameValid = function(name) {
  return name && !this.users.some(function(u) { return  u.name === name; });
};

Channel.prototype.check = function() {
  var modes = [];

  // check/update players
  for (var i = 0; i < this.users.length; i++) {
    var player = this.users[i];
    var playerNo = i < 2 ? i + 1 : 0;

    if (player.player !== playerNo) {
      player.player = playerNo;
      modes.push({
        user: player.name,
        player: playerNo
      });
    }
  }

  // send mode updates
  if (modes.length) {
    this.distribute({
      mode: modes
    });
  }

  var playerChange = modes.filter(function(mode) {
    return [1,2].indexOf(mode.player) !== -1;
  }).length;

  // check/update state
  if (this.users.length >= 2) {
    if (this.state !== 'GO') {
      this.state = 'GO';
      this.distribute({
        gameState: {
          player: 1,
          balls: getPositions()
        }
      });
    }
    else if (playerChange) {
      this.distribute({
        gameState: {
          player: 1,
          balls: getPositions()
        }
      });
    }
  }
  if (this.users.length < 2 && this.state === 'GO') {
    this.state = 'WAITING';
    this.distribute({
      gameState: { player: -1 }
    });
  }
};

Channel.prototype.handleMessage = function(user, data) {
  if (data.msg) {
    this.distribute({
      msg: data.msg,
      user: user.name
    });
  }
  if (data.gameState) {
    this.distribute(data, user);

    var balls = data.gameState.balls;
    if (!balls) { return; }

    var playerOneDone = balls.filter(function(ball) {
      return ball.player === 1;
    }).every(function(ball) {
      return !ball.enabled;
    })
    var playerTwoDone = balls.filter(function(ball) {
      return ball.player === 2;
    }).every(function(ball) {
      return !ball.enabled;
    });

    if (!playerOneDone && !playerTwoDone) { return; }

    var userToMove;
    if (playerOneDone && !playerTwoDone) {
      userToMove = this.users[1];
      this.users.splice(1, 1);
      this.users.push(userToMove);
      this.check();
    }
    else if (!playerOneDone && playerTwoDone) {
      userToMove = this.users[0];
      this.users.splice(0, 1);
      this.users.push(userToMove)
      this.check();
    }
    else {
      userToMove = this.users[0];
      this.users[0] = this.users[1];
      this.users[1] = userToMove;
      this.check();
    }

  }

};

module.exports = Channel;
