var Vector2 = require('hna').Vector2;

module.exports = function() {
  var i;
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

  var greens = [];
  while (greens.length < 10) {
    var index = (Math.random() * 20) | 0;
    if (greens.indexOf(index) === -1) { greens.push(index); }
  }

  positions.forEach(function(position, index) {
    position.player = greens.indexOf(index) !== -1 ? 1 : 2
  });

  return positions;
};
