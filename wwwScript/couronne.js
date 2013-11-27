var Game = require('./game');
var util = require('hna').util;

var Grid = require('./elements/grid');
var Table = require('./elements/table');
var Ball = require('./elements/ball');
var PlayerBall = require('./elements/playerBall');

var step = require('./step');
var STATES = require('./states');
var getPositions = require('./getPositions');

var positions = getPositions();

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

  this.balls = [];
  positions.forEach(function(pos, index) {
    var ball = new Ball(this, {
      center: pos,
      player: pos.player,
      drawOrder: 100 + index
    });

    this.components.add(ball);
    this.balls.push(ball);
  }, this);

  this.playerBall = new PlayerBall(this, {});
  this.balls.push(this.playerBall);
  this.components.add(this.playerBall);

  this.state = STATES.WAITING;


  this.deadCollection = [];
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