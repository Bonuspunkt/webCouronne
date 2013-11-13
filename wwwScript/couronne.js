var Game = require('./game');
var Vector2 = require('hna').Vector2;
var util = require('hna').util;

var Grid = require('./elements/grid');
var Table = require('./elements/table');
var FpsCounter = require('./elements/fpsCounter');
var MousePosition = require('./elements/mousePosition');
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


function Couronne(canvas) {
  Game.apply(this, arguments);

  this.components.add(new Grid(this));
  this.table = new Table(this);
  this.components.add(this.table);
  this.components.add(new FpsCounter(this));
  this.components.add(new MousePosition(this));

  var greens = [];
  while (greens.length < 10) {
    var index = (Math.random() * 20) | 0;
    if (greens.indexOf(index) === -1) { greens.push(index); }
  }

  positions.forEach(function(pos, index) {
    this.components.add(
      new Ball(this, {
        center: pos,
        player: greens.indexOf(index) !== -1 ? 1 : 2,
        updateOrder: 10 + index
      })
    );
  }, this);

  this.playerBall = new PlayerBall(this, {});
  this.components.add(this.playerBall);

  this.state = STATES.READY;
}

util.inherits(Couronne, Game);

Couronne.prototype.update = step;

Object.defineProperty(Couronne.prototype, 'state', {
  set: function(value) {
    console.log('state changed to:', value);
    this._state = value;
  },
  get: function() {
    return this._state;
  }
})

module.exports = Couronne;