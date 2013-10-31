function MousePosition(canvas) {

  function getPosition(e) {
    return {
      x: e.pageX - bound.left,
      y: e.pageY - bound.top
    };
  }

  function isPuckPlacementValid(pos) {
    return pos.x >= 70 && pos.y <= 230 && pos.y >= 230 && pos.y <= 270;
  }

  var position = { x: 0, y: 0 };
  var bound = canvas.getBoundingClientRect();
  canvas.addEventListener('mousemove', function(e) {
    position = getPosition(e);
    if (isPuckPlacementValid(position)) {
      // position puck
      // TODO: requestDraw
    }
  });

  canvas.addEventListener('mousedown', function() {
    // check if valid to place puck
    // place puck
    // switch to puck direction & force
  });

  canvas.addEventListener('mouseup', function() {
    // TODO: fire puck
  });

  this.update = function(){};
  this.draw = function(context) {
      context.fillStyle = '#000';
      context.fillText('x: ' + position.x, 10, 80);
      context.fillText('y: ' + position.y, 10, 100);
  };
}

/*
  area
  70, 230
  70, 250
  230, 230
  230, 250
*/

module.exports = function(canvas) {
  return new MousePosition(canvas);
};