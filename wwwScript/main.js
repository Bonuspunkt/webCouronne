require('./polyfill');

var canvasEl = document.querySelector('canvas');
var context = canvasEl.getContext('2d');

var game = require('./game');

var hookup = require('hookup');
var fpsCounter = require('./elements/fpsCounter');
var grid = require('./elements/grid')(canvasEl);
var gatherCollisions = require('./gatherCollisions')

game.canvasEl = canvasEl;

function step() {

  context.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // draw grid
  grid.draw(context);

  // draw fps
  fpsCounter.update();
  fpsCounter.draw(context);

  // draw circles
  game.elements.forEach(function(item) {
    item.draw(context);
  });

  // collision detection
  var collisions = [];
  var interval = 1; // lastRender - currentRender
  while ((collisions = gatherCollisions()).length > 0 && interval > 0) {

    collisions.sort(function(a,b) {
      return a.time - b.time;
    });

    var collision = collisions[0];

    game.elements.forEach(function(obj){
      obj.update(collision.time);
    });
    collision.handle();

    interval -= collision.time;
  }

  if (interval > 0) {
    game.elements.forEach(function(el) { el.update(interval); });
  }

  // loop
  if (game.run) {
    requestAnimationFrame(step);
  }
}
window.step = step;
