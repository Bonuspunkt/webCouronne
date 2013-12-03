var EventEmitter = require('hna').EventEmitter;
var util = require('hna').util;
var safeJson = require('./safeJson');

function Channel(socket) {

  EventEmitter.call(this);

  this._users = [];

  Object.defineProperties(this, {
    users: {
      get: function() { return this._users.slice(); }
    },
    name: {
      get: function() { return this._name; }
    },
    player: {
      get: function() { return this._player; }
    }
  });


  socket.addEventListener('message', function(e) {

    var data = safeJson(e.data);

    if (data.welcome) {
      this.onWelcome(data);
    }
    else if (data.join) {
      this.onJoin(data);
    }
    else if (data.part) {
      this.onPart(data);
    }
    else if (data.mode) {
      this.onMode(data);
    }
    else if (data.users) {
      this.onUsers(data);
    }
    else if (data.msg) {
      this.emit('msg', data.user, data.msg);
    }
    else if (data.gameState) {
      this.onGameState(data);

      if (data.gameState.player) {
        this.emit('activePlayer', data.gameState.player);
      }
    }

  }.bind(this));

  this.send = function(object) {
    if (!this.active && !object.msg) { return; }

    if (object.gameState) {
      if (object.gameState.player) {
        this.emit('activePlayer', object.gameState.player);
      }
      object.gameState = this.transformGameState(object.gameState);
    }

    var data = JSON.stringify(object);
    socket.send(data);
  };
}

util.inherits(Channel, EventEmitter);

Channel.prototype.onWelcome = function(data) {
  this._name = data.welcome;
};

Channel.prototype.onJoin = function(data) {
  var name = data.join;
  this._users.push({ name: name });

  this.emit('join', name);
};

Channel.prototype.onPart = function(data) {
  var name = data.part;
  var user = this._users.filter(function(user) {
    return user.name === name;
  })[0];
  var index = this._users.indexOf(user);
  this._users.splice(index, 1);

  this.emit('part', name);
};

Channel.prototype.onMode = function(data) {
  var _this = this;
  data.mode.forEach(function(mode) {
    var user = this._users.filter(function(user) {
      return user.name === mode.user;
    })[0];
    user.player = mode.player;

    if (this.name === user.name) {
      this._player = mode.player;
    }

    _this.emit('mode', mode.user, mode.player);
  }, this);
};

Channel.prototype.onUsers = function(data) {
  this._users = data.users.map(function(u) {
    return {
      name: u.name,
      player: u.player
    };
  });
  this.emit('users', this.users);
};

Channel.prototype.onGameState = function(data) {
  var gameState = data.gameState;
  var balls = (gameState.balls || []).map(this.transformPosition, this);

  var emittedState = {
    player: gameState.player,
    balls: balls,
  };

  if (gameState.puck) {
    emittedState.puck = this.transformPosition(gameState.puck);
  }

  this.emit('gameState', emittedState);

  if (gameState.player === undefined) { return; }

  if (gameState.player === this.player) {
    this.active = true;
    this.emit('activate');
  } else {
    this.active = false;
    this.emit('deactivate');
  }
};

Channel.prototype.transformPosition = function(ball) {
  var result;

  switch (this.player) {

    case 0: // spec - rotate 90°
      result = {
        x: ball.y,
        y: ball.x,
        player: ball.player,
        enabled: ball.enabled
      };
      if (ball.move) {
        result.move = { x: ball.move.y, y: ball.move.x };
      }
      return result;

    case 1:
      result = {
        x: ball.x,
        y: ball.y,
        player: ball.player,
        enabled: ball.enabled
      };
      if (ball.move) {
        result.move = ball.move;
      }
      return result;

    case 2: // rotate 180°
      result = {
        x: 300 - ball.x,
        y: 300 - ball.y,
        player: ball.player,
        enabled: ball.enabled
      };
      if (ball.move) {
        result.move = { x: -ball.move.x, y: -ball.move.y };
      }
      return result;
  }
};

Channel.prototype.transformGameState = function(gameState) {
  if (gameState.balls) {
    gameState.balls = gameState.balls.map(this.transformPosition, this);
  }
  if (gameState.puck) {
    gameState.puck = this.transformPosition(gameState.puck);
  }
  return gameState;
};

module.exports = Channel;