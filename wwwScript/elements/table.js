var DrawableGameComponent = require('hna').DrawableGameComponent;
var Vector = require('hna').Vector2;
var util = require('hna').util;

function Table(game) {

  DrawableGameComponent.apply(this, arguments);

  this.holes = [
    new Vector( 40, 40),
    new Vector(260, 40),
    new Vector( 40,260),
    new Vector(260,260)
  ];

  this.drawOrder = 5;
}

util.inherits(Table, DrawableGameComponent);


Table.prototype.draw = function(context) {

  context.beginPath();
  context.lineWidth = 0;
  context.fillStyle = '#111';
  this.holes.forEach(function(pos) {
    context.moveTo(pos.x, pos.y);
    context.arc(pos.x,pos.y,20,0, 2 * Math.PI, false);
  });
  context.stroke();
  context.fill();
  context.closePath();

  // red drawing on table
  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = '#b00';

  context.arc( 70, 70,10, 2 * Math.PI, false);
  context.moveTo(80, 230);
  context.arc( 70,230,10, 2 * Math.PI, false);
  context.moveTo(240, 230);
  context.arc(230, 70,10, 2 * Math.PI, false);
  context.moveTo(240, 230);
  context.arc(230,230,10, 2 * Math.PI, false);

  context.moveTo( 60, 70);
  context.lineTo( 60,230);

  context.moveTo( 70, 60);
  context.lineTo(230, 60);

  context.moveTo(240, 70);
  context.lineTo(240,230);

  context.moveTo( 70,240);
  context.lineTo(230,240);

  context.moveTo(205, 150);
  context.arc(150,150,55, 2 * Math.PI, false);

  context.stroke();
  context.closePath();
};

module.exports = Table;