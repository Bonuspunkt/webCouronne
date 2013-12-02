var safeJson = require('./safeJson');

module.exports = function(playerList, channel) {
  var playerListEl = playerList.querySelector('ul');
  var users = [];
  var player = 0;

  function rebuildUserList() {
    playerListEl.innerHTML = '';
    users.forEach(function(user) {
      var userEl = document.createElement('li');
      userEl.textContent = '[' +
        (user.player === 0 ? 'SPEC' : user.player) +
        '] ' + user.name;
      if (user.player === player) {
        userEl.style.background = '#8f8';
      }
      playerListEl.appendChild(userEl);
    });
  }

  channel.on('users', function(newUsers) {
    users = newUsers;
    rebuildUserList();
  });
  channel.on('join', function(name) {
    users.push({ name: name });

    rebuildUserList();
  });

  channel.on('part', function(name) {
    var user = users.filter(function(user) {
      return user.name === name;
    })[0];

    var index = users.indexOf(user);
    users.splice(index, 1);

    rebuildUserList();
  });

  channel.on('mode', function(name, player) {
    var user = users.filter(function(user) {
      return user.name === name;
    })[0];
    user.player = player;

    rebuildUserList();
  });

  channel.on('activePlayer', function(activePlayer) {
    player = activePlayer;
    rebuildUserList();
  })
};
