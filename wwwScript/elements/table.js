var table = {
  update: function() {},
  draw: function(context) {

    context.beginPath();
    context.lineWidth = 0;
    context.fillStyle = '#111';
    context.arc( 40, 40,20,0, 2 * Math.PI, false);
    context.moveTo(260, 50);
    context.arc(260, 40,20,0, 2 * Math.PI, false);
    context.moveTo(40, 270);
    context.arc( 40,260,20,0, 2 * Math.PI, false);
    context.moveTo(260, 270);
    context.arc(260,260,20,0, 2 * Math.PI, false);
    context.stroke();
    context.fill();
    context.closePath();

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
  }
};

module.exports = table;