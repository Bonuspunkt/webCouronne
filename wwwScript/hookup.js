var game = require('./game');

var Ball = require('./elements/ball');
var Vector = require('./vector');

(function(){
  var data = {
    "ax":10,"ay":200,"aradius":5,"amass":10,"avx":1,"avy":0,
    "bx":390,"by":200,"bradius":5,"bmass":10,"bvx":-1,"bvy":0
  };

  var inputs = document.querySelectorAll('input[name]');
  [].forEach.call(inputs, function(input) {
    input.value = data[input.name];
  });
}());


var submitEl = document.querySelector('input[type=submit]');
submitEl.addEventListener('click', function(e) {
  e.preventDefault();

  if (game.run) {
    this.value = 'RUN';
    game.run = false;
    return;
  }
  this.value = 'STOP';
  game.run = true;

  var values = {};
  var inputs = document.querySelectorAll('input[name]');
  [].forEach.call(inputs, function(input) {
    values[input.name] = Number(input.value);
  });

  A = new Ball(
    new Vector(values.ax, values.ay),
    values.aradius,
    values.amass,
    new Vector(values.avx, values.avy),
    '#F88'
  );
  B = new Ball(
    new Vector(values.bx, values.by),
    values.bradius,
    values.bmass,
    new Vector(values.bvx, values.bvy),
    '#8F8'
  );

  game.elements = [A,B];

  step();
});