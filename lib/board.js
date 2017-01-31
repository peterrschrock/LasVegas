class Board {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
  }

  start() {
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    this.game.draw();
    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = Board;
