var game = require('./game');

var Ball = require('./elements/ball');
var Vector = require('./vector');

(function(){
  var data = {
    "ax":150,"ay":240,"aradius":10,"amass":10,"avx":0,"avy":-1
  };

  var inputs = document.querySelectorAll('input[name]');
  [].forEach.call(inputs, function(input) {
    input.value = data[input.name];
  });
}());



var submitEl = document.querySelector('input[type=submit]');
submitEl.focus();
submitEl.addEventListener('click', function(e) {
  e.preventDefault();

  submitEl.disabled = true;

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
    '#FF0'
  );
  game.elements.push(A);

  function removeBall() {
    submitEl.disabled = false;
    game.un('done', removeBall);
    var index =game.elements.indexOf(A);
    if (index === -1) { return; }

    game.elements.splice(game.elements.indexOf(A), 1);
    step();
  }
  game.on('done', removeBall);

  step();
});