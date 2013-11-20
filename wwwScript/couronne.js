var Game = require('./game');
var Vector2 = require('hna').Vector2;
var util = require('hna').util;

var Grid = require('./elements/grid');
var Table = require('./elements/table');
var Ball = require('./elements/ball');
var PlayerBall = require('./elements/playerBall');

var step = require('./step');
var STATES = require('./states');


// initPositions
var positions = [];
positions.push(new Vector2(150, 150));
for (i = 0; i < 6; i++) {
  positions.push(new Vector2(
    150 + 22 * Math.sin(2 * Math.PI * i / 6),
    150 + 22 * Math.cos(2 * Math.PI * i / 6)
  ));
}
for (i = 0; i < 13; i++) {
  positions.push(new Vector2(
    150 + 44 * Math.sin(2 * Math.PI * i / 13),
    150 + 44 * Math.cos(2 * Math.PI * i / 13)
  ));
}

var flatRequestAnimationFrame = (function() {
  var alreadyQueued = false;
  return function(fn) {
    if (alreadyQueued) { return; }
    alreadyQueued = true;
    requestAnimationFrame(function() {
      alreadyQueued = false;
      fn();
    });
  };
}());

function Couronne(canvas) {
  Game.apply(this, arguments);

  var _this = this;

  this.components.on('componentAdd', function(cmp) {
    cmp.on('requireRedraw', function() {
      flatRequestAnimationFrame(function() { _this.tick(); });
    });
    cmp.on('requireUpdate', function() {
      flatRequestAnimationFrame(function() { _this.tick(); });
    });
  });

  this.components.add(new Grid(this));
  this.table = new Table(this);
  this.components.add(this.table);

  var greens = [];
  while (greens.length < 10) {
    var index = (Math.random() * 20) | 0;
    if (greens.indexOf(index) === -1) { greens.push(index); }
  }

  this.balls = [];
  positions.forEach(function(pos, index) {
    var ball = new Ball(this, {
      center: pos,
      player: greens.indexOf(index) !== -1 ? 1 : 2,
      updateOrder: 10 + index
    });

    this.components.add(ball);
    this.balls.push(ball);
  }, this);

  this.playerBall = new PlayerBall(this, {});
  this.balls.push(this.playerBall);
  this.components.add(this.playerBall);

  this.state = STATES.READY;
}

util.inherits(Couronne, Game);

Couronne.prototype.tick = function(){
  var now = Date.now();
  this.gameTime.elapsedGameTime = now - this.lastDraw;
  this.gameTime.totalGameTime = now - this.startGame;
  this.gameTime.isRunningSlowly = this.gameTime.elapsedGameTime > 17;

  this.update(this.gameTime);
  this.draw(this.context);
};

Couronne.prototype.update = function() {
  step.apply(this, arguments);

};


util.autoEventedProperty(Couronne.prototype, 'state');

module.exports = Couronne;