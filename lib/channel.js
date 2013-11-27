var getPositions = require('../wwwScript/getPositions');
var safeJson = require('../wwwScript/webSocket/safeJson');

function Channel() {
  this.users = [];
}

Channel.prototype.add = function(user) {
  this.users.push(user);

  this.distribute({
    join: user.name,
    // obsolete
    action: 'join',
    user: user.name
  });

  user.send({
    users: this.getUsers(),
    // obsolete
    action: 'users',
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
    part: user.name,
    // obsolete
    action: 'part',
    user: user.name
  });

  this.check();
};

Channel.prototype.getUsers = function(channel) {
  return this.users.map(function(user) {
    return {
      name: user.name,
      player: user.player
    };
  })
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
      mode: modes,
      // obsolete
      action: 'mode',
      modes: modes
    });
  }

  // check/update state
  if (this.users.length >= 2 && this.state !== 'GO') {
    this.state = 'GO';
    this.distribute({
      gameState: {
        turn: 1,
        balls: getPositions()
      },
      // obsolete
      action: 'gameState',
      player: 1,
      state: getPositions()
    });
  }
  if (this.users.length < 2 && this.state === 'GO') {
    this.state = 'WAITING';
    this.distribute({
      gameState: { turn: 0 },
      // obsolete
      action: 'gameState',
      state: 'WAITING'
    });
  }
};

Channel.prototype.handleMessage = function(user, data) {
  if (data.action === 'msg') { // should be data.msg
    this.distribute({
      action: 'msg',
      user: user.name,
      text: message.text
    });
  }
  if (data.msg) {
    user: user.name,
    msg: data.msg
  }

}

module.exports = Channel;
