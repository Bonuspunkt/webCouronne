require('./polyfill');

var canvasEl = document.querySelector('canvas');
var context = canvasEl.getContext('2d');

var game = require('./game');

var hookup = require('hookup');
var fpsCounter = require('./elements/fpsCounter');
var grid = require('./elements/grid')(canvasEl);
var gatherCollisions = require('./gatherCollisions');
var table = require('./elements/table');
var Vector = require('./vector');
var init = require('./init');

game.canvasEl = canvasEl;

grid.draw(context);
table.draw(context);

function step() {

  context.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // draw grid
  grid.draw(context);
  table.draw(context);


  // draw fps
  fpsCounter.update();
  fpsCounter.draw(context);

  // draw circles
  game.elements.forEach(function(item) {
    item.draw(context);
  });


  // draw end

  // collision detection
  var collisions = [];
  var interval = 1; // lastRender - currentRender
  while ((collisions = gatherCollisions()).length > 0 && interval > 0) {

    collisions.sort(function(a,b) {
      return a.time - b.time;
    });

    var collision = collisions[0];

    game.elements.forEach(function(el){
      el.update(collision.time);
    });
    collision.handle();

    interval -= collision.time;
  }

  if (interval > 0) {
    game.elements.forEach(function(el) { el.update(interval); });
  }
  game.elements.forEach(function(el) {
    el.moveVector = el.moveVector.times(0.99);
    if (el.moveVector.magnitude() < 0.02) {
      el.moveVector = new Vector(0,0);
    }
  });

  var movingEls = game.elements.filter(function(el) {
    return el.moveVector.magnitude() > 0;
  });

  if (movingEls.length !== 0) {
    requestAnimationFrame(step);
  } else {
    game.fireEvent('done');
  }
}
window.step = step;

init();