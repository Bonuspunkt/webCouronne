#!/usr/bin/env node

var test = require('tap').test;
var EventEmitter = require('hna').EventEmitter;
var Channel = require('./channel');

var NAME = 'dude';
var NAME2 = 'car';

test('should emit join', function(assert) {

  var webSocket = new EventEmitter();
  var channel = new Channel(webSocket);
  channel.on('join', function(user) {
    assert.equal(user, NAME);

    assert.deepEqual(channel.users, [{ name: NAME }]);

    assert.end();
  });

  webSocket.emit('message', {
    data: JSON.stringify({ join: NAME })
  });

});

test('should emit part', function(assert) {

  var webSocket = new EventEmitter();
  var channel = new Channel(webSocket);
  channel.on('part', function(user) {
    assert.equal(user, NAME);
    assert.equal(channel.users.length, 0);

    assert.end();
  });

  webSocket.emit('message', {
    data: JSON.stringify({ join: NAME })
  });


  webSocket.emit('message', {
    data: JSON.stringify({ part: NAME })
  });

});

test('should emit mode', function(assert) {
  assert.plan(5);

  var webSocket = new EventEmitter();
  var channel = new Channel(webSocket);
  channel.once('mode', function(user, player) {
    assert.equal(user, NAME);
    assert.equal(player, 1);

    channel.once('mode', function(user2, player2) {
      assert.equal(user2, NAME2);
      assert.equal(player2, 2);
    });
  });

  webSocket.emit('message', {
    data: JSON.stringify({ welcome: NAME })
  });

  webSocket.emit('message', {
    data: JSON.stringify({ join: NAME })
  });

  webSocket.emit('message', {
    data: JSON.stringify({ join: NAME2 })
  });

  webSocket.emit('message', {
    data: JSON.stringify({
      mode: [
        { user: NAME, player: 1 },
        { user: NAME2, player: 2 }]
    })
  });

  assert.deepEqual(channel.users, [
    { name: NAME, player: 1 },
    { name: NAME2, player: 2 }
  ]);

  assert.end();
});


test('should emit users', function(assert) {

  var webSocket = new EventEmitter();
  var channel = new Channel(webSocket);

  var expected = [{
    name: NAME, player: 1,
  },{
    name: NAME2, player: 2
  }];

  channel.on('users', function(users) {
    assert.deepEqual(users, expected);
    assert.deepEqual(channel.users, expected);

    assert.end();
  });


  webSocket.emit('message', {
    data: JSON.stringify({
      users: expected
    })
  });

});


test('should emit msg', function(assert) {

  var expected = 'aklsdfjak';

  var webSocket = new EventEmitter();
  var channel = new Channel(webSocket);

  channel.on('msg', function(user, msg) {
    assert.equal(user, NAME);
    assert.equal(msg, expected);

    assert.end();
  });

  webSocket.emit('message', {
    data: JSON.stringify({
      user: NAME,
      msg: expected
    })
  });

});


test('name and player has been set', function(assert) {

  var webSocket = new EventEmitter();
  var channel = new Channel(webSocket);

  webSocket.emit('message', {
    data: JSON.stringify({ welcome: NAME })
  });
  webSocket.emit('message', {
    data: JSON.stringify({ join: NAME })
  });
  webSocket.emit('message', {
    data: JSON.stringify({
      mode: [ { user: NAME, player: 1 } ]
    })
  });

  assert.equal(channel.name, NAME);
  assert.equal(channel.player, 1);
  assert.end();
});

test('gameState player one', function(assert) {

  var webSocket = new EventEmitter();
  var channel = new Channel(webSocket);

  var expected = {
    player: 1,
    balls: [{
      x: 100,
      y: 100,
      player: 1
    }]
  };


  channel.on('gameState', function(gameState) {
    assert.deepEqual(gameState, expected);
  });

  webSocket.emit('message', {
    data: JSON.stringify({ welcome: NAME })
  });
  webSocket.emit('message', {
    data: JSON.stringify({ join: NAME })
  });
  webSocket.emit('message', {
    data: JSON.stringify({
      mode: [ { user: NAME, player: 1 } ]
    })
  });
  webSocket.emit('message', {
    data: JSON.stringify({ gameState: expected })
  });

  assert.end();
});

test('gameState player two', function(assert) {

  var webSocket = new EventEmitter();
  var channel = new Channel(webSocket);

  var expected = {
    player: 1,
    balls: [{
      x: 100,
      y: 100,
      player: 1
    }]
  };


  channel.on('gameState', function(gameState) {
    assert.deepEqual(gameState, {
      player: 1,
      balls: [{
        x: 200,
        y: 200,
        player: 1
      }]
    });
  });

  webSocket.emit('message', {
    data: JSON.stringify({ welcome: NAME })
  });
  webSocket.emit('message', {
    data: JSON.stringify({ join: NAME })
  });
  webSocket.emit('message', {
    data: JSON.stringify({
      mode: [ { user: NAME, player: 2 } ]
    })
  });
  webSocket.emit('message', {
    data: JSON.stringify({ gameState: expected })
  });

  assert.end();
});

test('gameState should emit activePlayer', function(assert) {

  assert.plan(2);

  var webSocket = new EventEmitter();
  webSocket.send = function(){};
  var channel = new Channel(webSocket);
  channel.on('activePlayer', function(player) {
    assert.equal(player, 1);
  });

  webSocket.emit('message', {
    data: JSON.stringify({ gameState: { player: 1 } })
  });
  channel.active = true;
  channel.send({ gameState: { player: 1 } });

  assert.end();
});