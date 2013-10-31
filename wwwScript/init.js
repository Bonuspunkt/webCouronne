var game = require('./game');

var Ball = require('./elements/ball');
var Vector = require('hna').Vector2;

var draw = require('./draw');

module.exports = function() {
  game.elements = [];
  game.elements.push(
    new Ball(
      new Vector(150, 150),
      9.9, 10,
      new Vector(0,0),
      '#2F2'
    )
  );

  for (var i = 0; i < 6; i++) {
    game.elements.push(
      new Ball(
        new Vector(
          150 + 22 * Math.sin(2 * Math.PI * i / 6),
          150 + 22 * Math.cos(2 * Math.PI * i / 6)
        ),
        9.9, 10,
        new Vector(0,0),
        (i % 2 ? '#F22' : '#2F2')
      )
    );
  }

  for (var i = 0; i < 13; i++) {
    game.elements.push(
      new Ball(
        new Vector(
          150 + 44 * Math.sin(2 * Math.PI * i / 13),
          150 + 44 * Math.cos(2 * Math.PI * i / 13)
        ),
        9.9, 10,
        new Vector(0,0),
        (i % 2 ? '#2F2' : '#F22')
      )
    );
  }

  draw();
};