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

function Couronne(canvas) {
  Game.apply(this, arguments);

  this.components.add(new Grid(this));
  this.table = new Table(this);
  this.components.add(this.table);
  this.components.add(new FpsCounter(this));
  this.components.add(new MousePosition(this));

  this.components.add(
    new Ball(this, {
      center: new Vector2(150, 150),
      color: '#2F2'
    })
  );

  var i;
  for (i = 0; i < 6; i++) {
    this.components.add(
      new Ball(this, {
        center: new Vector2(
          150 + 22 * Math.sin(2 * Math.PI * i / 6),
          150 + 22 * Math.cos(2 * Math.PI * i / 6)
        ),
        color: (i % 2 ? '#F22' : '#2F2')
      })
    );
  }

  for (i = 0; i < 13; i++) {
    this.components.add(
      new Ball(this, {
        center: new Vector2(
          150 + 44 * Math.sin(2 * Math.PI * i / 13),
          150 + 44 * Math.cos(2 * Math.PI * i / 13)
        ),
        color: (i % 2 ? '#2F2' : '#F22')
      })
    );
  }

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