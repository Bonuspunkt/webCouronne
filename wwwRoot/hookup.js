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

(function() {
  var requestAnimationFrame =
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function(callback) { window.setTimeout(callback, 1000 / 60); };
  window.requestAnimationFrame = requestAnimationFrame;
}());

var fpsCounter = (function() {
  var COUNT = 30;
  var stored = new Array(COUNT);
  var curr = 0;
  var fps;

  var lastRender = Date.now();

  return {
    update: function(ticks) {
      var now = Date.now();
      var ticks = now - lastRender;
      lastRender = now;

      stored[curr] = ticks;
      curr = (curr + 1) % COUNT;

      var tickSum = stored.reduce(function(prev, curr) { return prev + curr; });
      fps = 1000 / (tickSum / COUNT) | 0;
    },

    draw: function(context) {
      context.fillStyle = '#000';
      context.fillText(fps + 'fps', 10, 20);
    }

  };
}())

var canvasEl = document.querySelector('canvas');
var context = canvasEl.getContext('2d');

var A, B,run;
function step() {

  context.clearRect(0, 0, canvasEl.width, canvasEl.height);

  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = '#bbb';
  for (var x = 10; x < 400; x += 10) {
    context.moveTo(x, 0);
    context.lineTo(x, 400);
  }
  for (var y = 10; y < 400; y += 10) {
    context.moveTo(0, y);
    context.lineTo(400, y);
  }
  context.stroke();
  context.closePath();

  fpsCounter.update();
  fpsCounter.draw(context);

  [A,B].forEach(function(item, i) {
    context.beginPath();
    context.arc(item.center.x, item.center.y, item.radius, 0, 2 * Math.PI, false);
    context.fillStyle = (i === 0) ? '#F88' : '#88F';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#000';
    context.stroke();
    context.closePath();
  });

  [A, B].forEach(function(item) {
    if (item.center.x < item.radius) {
      item.moveVector = new Vector(-item.moveVector.x, item.moveVector.y);
    }
    if (item.center.x > canvasEl.width - item.radius) {
      item.moveVector = new Vector(-item.moveVector.x, item.moveVector.y);
    }
    if (item.center.y < item.radius) {
      item.moveVector = new Vector(item.moveVector.x, -item.moveVector.y);
    }
    if (item.center.y > canvasEl.height - item.radius) {
      item.moveVector = new Vector(item.moveVector.x, -item.moveVector.y);
    }

  })

  var collision = detectCollision(A, B);
  if (collision === false) {
    [A, B].forEach(function(item) {
      item.center = item.center.add(item.moveVector);
    });
  } else {
    [A, B].forEach(function(item) {
      item.center = item.center.add(
        item.moveVector.times(collision)
      );
    });
    resolveCollision(A, B);
    [A, B].forEach(function(item) {
      item.center = item.center.add(
        item.moveVector.times(1 - collision)
      );
    });
  }
  if (run) {
    requestAnimationFrame(step);
  }
}

var submitEl = document.querySelector('input[type=submit]');
submitEl.addEventListener('click', function(e) {
  e.preventDefault();

  if (run) {
    this.value = 'RUN';
    run = false;
    return;
  }
  this.value = 'STOP';
  run = true;

  var values = {};
  var inputs = document.querySelectorAll('input[name]');
  [].forEach.call(inputs, function(input) {
    values[input.name] = Number(input.value);
  });

  A = new Ball(
    new Vector(values.ax, values.ay),
    values.aradius,
    values.amass,
    new Vector(values.avx, values.avy)
  );
  B = new Ball(
    new Vector(values.bx, values.by),
    values.bradius,
    values.bmass,
    new Vector(values.bvx, values.bvy)
  );

  step();
});