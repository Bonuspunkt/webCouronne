var Channel = require('./channel');
var channels = {};

var channelStore = {
  get: function(channelName) {
    var channel = channels[channelName];
    if (!channel) {
      channel = new Channel();
      channels[channelName] = channel;
    }
    return channel;
  }
};


module.exports = channelStore;