var events = {};

var game = module.exports = {
  run: false,
  elements: [],
  deadElements: [],
  on:  function(event, handler) {
    events[event] = events[event] || [];
    events[event].push(handler);
  },
  un: function(event, handler) {
    var handlers = events[event] || [];
    handlers.splice(handlers.indexOf(handler));
  },
  fireEvent: function(event) {
    var args = Array.prototype.slice.call(arguments, 1);

    var handlers = events[event] || [];
    handlers.forEach(function(handler) {
      handler.apply(this, args);
    });
  }
};