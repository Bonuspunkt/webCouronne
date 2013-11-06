var ContentManager = require('hna').ContentManager;
var GameComponentCollection = require('hna').GameComponentCollection;

function GameTime(elapsed, isRunningSlowly, total) {
  this.elapsed = elapsed;
  this.isRunningSlowly = isRunningSlowly;
  this.total = total;
}


function Game(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');

  this.components = new GameComponentCollection();
  this.contentManager = new ContentManager();

  this.tick = this.tick.bind(this);
}


Game.prototype.loadContent = function() {
  this.components.drawComponents.forEach(function(component) {
    component.loadContent();
  });
};

Game.prototype.draw = function(context) {

  context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.components.drawComponents.forEach(function(component) {
    if (!component.visible) { return; }
    component.draw(context);
  });
};

Game.prototype.update = function(gameTime) {
  this.components.updateComponents.forEach(function(component) {
    if (!component.enabled) { return; }
    component.update(gameTime);
  });
};

Game.prototype.tick = function() {
  var now = Date.now();
  this.gameTime.elapsedGameTime = now - this.lastDraw;
  this.gameTime.totalGameTime = now - this.startGame;
  this.gameTime.isRunningSlowly = this.gameTime.elapsedGameTime > 17;

  this.update(this.gameTime);
  this.draw(this.context);

  requestAnimationFrame(this.tick);
};


Game.prototype.init = function() {

  var onDone = function() {
    var now = Date.now();
    this.startGame = now;
    this.lastDraw = now;

    this.gameTime = new GameTime(0, false, 0);

    this.tick();
  }.bind(this);

  this.contentManager.on('done', onDone);

  this.loadContent();

  if (this.contentManager.done) {
    onDone();
  }
};

module.exports = Game;
