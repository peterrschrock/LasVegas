const Casino = require("./casino");
// const Bullet = require("./bullet");
// const Ship = require("./ship");
// const Util = require("./util");

class Game {
  constructor(numPlayers) {
    // let players
    this.casinos = [];
    this.buildCasinos();
  }

  buildCasinos(){
    let newCasino;
    for(let i=0; i < 6; i++) {
      newCasino = new Casino([(170 * i) + 50, (Game.HEIGHT / 2) - 100]);
      this.casinos.push(newCasino);
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
    ctx.fillStyle = Game.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

    this.casinos.forEach(casino => {
      casino.draw(ctx);
    });
  }


}

Game.BACKGROUND_COLOR = "#000000";
Game.WIDTH = 1070;
Game.HEIGHT = 600;

module.exports = Game;
