var fpsCounter = (function() {
  var COUNT = 30;
  var stored = new Array(COUNT);
  var curr = 0;
  var fps;

  var lastRender = Date.now();

  return {
    update: function(ticks) {
      var now = Date.now();
      var ticks = now - lastRender;
      lastRender = now;

      stored[curr] = ticks;
      curr = (curr + 1) % COUNT;

      var tickSum = stored.reduce(function(prev, curr) { return prev + curr; });
      fps = 1000 / (tickSum / COUNT) | 0;
    },

    draw: function(context) {
      context.fillStyle = '#000';
      context.fillText(fps + 'fps', 10, 20);
    }

  };
}());

module.exports = fpsCounter;