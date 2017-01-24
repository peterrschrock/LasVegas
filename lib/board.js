class Board {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
  }

  start() {
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    this.game.draw(this.ctx);
    this.lastTime = time;

    // requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = Board;
