var game = require('./game');

var Ball = require('./elements/ball');
var Vector = require('hna').Vector2;

var step = require('./step');
var draw = require('./draw');

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
    var index = game.elements.indexOf(A);
    if (index !== -1) {
      game.elements.splice(index, 1);
    } else {
      index = game.deadElements.indexOf(A);
      game.elements.splice(index, 1)
      alert('puck dead');
    }
    step();

  }
  game.on('done', removeBall);

  var intervalId = setInterval(function() {

    step();

    var movingEls = game.elements.filter(function(el) {
      return el.moveVector.length > 0;
    });

    if (movingEls.length === 0) {
      game.fireEvent('done');
      clearInterval(intervalId);
    }
    requestAnimationFrame(draw);
  }, 1000/60);

  step();
});