function Grid(canvas){

  return {
    update: function() {},
    draw: function(context) {
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = '#bbb';

      for (var x = 10; x < canvas.width; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
      }

      for (var y = 10; y < canvas.height; y += 10) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
      }

      context.stroke();
      context.closePath();
    }
  };
}

module.exports = Grid;