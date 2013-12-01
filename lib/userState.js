var EventEmitter = require('events').EventEmitter;
var util = require('util');
var channelRepo = require('./channelRepo');
var safeJson = require('../wwwScript/webSocket/safeJson');

var STATES = {
  REQAUTH: 1,
  AUTHED: 2
};

function UserState(webSocket, channel) {
  EventEmitter.call(this);

  webSocket.on('message', this.handleMessage.bind(this));
  webSocket.on('close', this.emit.bind(this, 'close'));

  this.send = function(data) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    webSocket.send(data);
  }
  this.send({ action: 'auth' });
  this.state = STATES.REQAUTH;
  this.channel = channelRepo.get(channel);
}

util.inherits(UserState, EventEmitter);

UserState.prototype.handleMessage = function(message) {
  message = safeJson(message);

  if (this.state === STATES.REQAUTH &&
      message.action === 'nick') {

    if (!this.channel.isNameValid(message.name)) {
      this.send({ action: 'auth' });
      return;
    }

    this.name = message.name;
    this.state = STATES.AUTHED;

    this.send({ welcome: this.name });

    this.channel.add(this);
  }
  else {
    this.emit('message', message);
  }
};


module.exports = UserState;
