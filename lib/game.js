const Casino = require("./casino");
const Bill = require("./bill");
const Player = require("./player");

class Game {
  constructor(numPlayers) {
    // let players
    this.casinos = [];
    this.money = [];
    this.players = [];

    this.buildCasinos();
    this.dealMoney();
    this.populatePlayers(numPlayers);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
    ctx.fillStyle = Game.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

    this.casinos.forEach(casino => casino.draw(ctx));

    this.money.forEach((billSet, bSetIdx) => {
      billSet.forEach((bill, billIdx) => bill.draw(ctx, bSetIdx, billIdx));
    });

    this.players.forEach((player, idx) => player.draw(ctx, idx, this.players.length));
  }

  buildCasinos(){
    let newCasino;
    for(let i=0; i < 6; i++) {
      newCasino = new Casino([(170 * i) + 50, (Game.HEIGHT / 2) - 100]);
      this.casinos.push(newCasino);
    }
  }

  dealMoney(){
    for(let i=0; i<6; i++) {
      let casinoBillSet = [];
      let totalMoney = 0;
      while(casinoBillSet.length < 3 && totalMoney < 50000 ){
        let amt = this.generateBillAmount();
        totalMoney += amt;
        let newBill = new Bill(amt);
        casinoBillSet.push(newBill);
      }
      casinoBillSet.sort((a, b) => b.amount - a.amount);
      this.money.push(casinoBillSet);
    }
  }

  generateBillAmount(){
    return 10000 * Math.ceil(Math.random() * 10);
  }

  populatePlayers(numPlayers){
    for(let i=0; i<6; i++){
      if(i === 0) {
        let newPlayer = new Player("human");
        this.players.push(newPlayer);
      } else {
        let newPlayer = new Player("cpu");
        this.players.push(newPlayer);
      }
    }
  }
}

Game.BACKGROUND_COLOR = "#c2c4ce";
Game.WIDTH = 1070;
Game.HEIGHT = 600;

module.exports = Game;
