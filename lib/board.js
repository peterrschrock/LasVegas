class Board {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
  }

  start() {
    // this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    // const timeDelta = time - this.lastTime;

    this.game.draw();
    // this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = Board;
