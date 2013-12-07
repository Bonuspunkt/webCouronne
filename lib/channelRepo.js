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
  },
  getStats: function() {
    return Object.keys(channels).map(function(channel) {
      return {
        channel: channel,
        users: channels[channel].getUsers()
      };
    });
  }
};


module.exports = channelStore;