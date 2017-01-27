const Casino = require("./casino");
const Bill = require("./bill");
const Player = require("./player");

class Game {
  constructor(numPlayers, ctx) {
    // let players
    this.numPlayers = numPlayers;
    this.ctx = ctx;
    this.casinos = [];
    this.money = [];
    this.players = [];
    this.rolling = false;
    this.sorted = false;
    this.showing = false;

    this.colorNums = [0, 1, 2, 3, 4, 5];
    this.colorNums = this.shuffle(this.colorNums).slice(0, this.numPlayers);

    this.buildCasinos();
    this.dealMoney();
    this.populatePlayers();

    this.turn = Math.floor(Math.random() * this.players.length);

    this.draw();

    this.play();
  }

  gameOver(){
    let diceLeftArr = this.players.map(player => player.getAmountDice());
    if(diceLeftArr.reduce((a, b) => a + b, 0) > 0){
      return false;
    }else{
      return true;
    }
  }

  play(){
    this.playTurn();

  }


  playTurn(){
    let player = this.players[this.turn];
    player.dice.setupDice();
    this.rolling = true;
    setTimeout(() => {
      // debugger
      this.rolling = false;
      this.showing = true;
    }, 10);

    setTimeout(() => {
      this.showing = false;
    }, 25);

    setTimeout(() => {
      this.sorted = true;
    }, 30);

    setTimeout(() => {
      player = this.players[this.turn];
      let move = player.getMove();
      let numOfDiceWithMove = player.dice.dieValuesArray().filter(x => x === move).length;
      this.casinos[move - 1].takeBid(this.turn, numOfDiceWithMove);
      this.sorted = false;
      player.dice.setAmountDice(player.dice.diceLeft - numOfDiceWithMove);
    }, 40);

    setTimeout(() => {
      this.turn = (this.turn + 1) % this.players.length;
      let consecutiveDonePlayers = 0;
      // debugger
      while(this.players[this.turn].getAmountDice() === 0 && consecutiveDonePlayers < this.numPlayers) {
        this.turn = (this.turn + 1) % this.numPlayers;
        consecutiveDonePlayers += 1;
      }
      if (consecutiveDonePlayers < this.numPlayers) {
        this.playTurn();
        this.playTurn.bind(this);
      } else {
        this.resolveBids();
      }
    }, 45);
  }

  getPlaces(arr){
    let dict = {};
    arr.forEach((el, idx) => dict[el] = idx);
    arr = arr.sort((a,b) => b - a);
    let first;
    if(arr[1] === arr[0]){
      first = null;
    }else{
      first = dict[arr[0]];
    }

    arr = arr.filter(el => el !== arr[0]);
    let second;
    if(arr[1] === arr[0]){
      second = null;
    }else{
      second = dict[arr[0]];
    }

    arr = arr.filter(el => el !== arr[0]);
    let third;
    if(arr[1] === arr[0]){
      third = null;
    }else{
      third = dict[arr[0]];
    }

    return [first, second, third];
    // need to return player not number of dice bid
  }

  resolveBids(){
    // this.money
    let diceBids = JSON.parse(JSON.stringify(this.casinos.map(casino => casino.diceBids)));
    let winners = diceBids.map(diceBid => this.getPlaces(diceBid));
    winners.forEach((casinoWinners, casinoIdx) => {
      casinoWinners.forEach((winner, placeIdx) => {
        if(winner !== null && this.money[casinoIdx][placeIdx]){
          this.players[winner].money += this.money[casinoIdx][placeIdx].amount;
        }
      });
    });
    this.declareWinner();
  }

  declareWinner(){
    let moneyArray = this.players.map(player => player.money);

  }

  draw() {
    this.ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
    this.ctx.fillStyle = Game.BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

    this.casinos.forEach(casino => casino.draw(this.ctx));

    this.money.forEach((billSet, bSetIdx) => {
      billSet.forEach((bill, billIdx) => bill.draw(this.ctx, bSetIdx, billIdx));
    });

    this.players.forEach((player) => player.draw(this.ctx));
    let player = this.players[this.turn];
    if(this.rolling){
      player.playerRollDice(this.ctx);
      // debugger
    }else if(this.sorted){
      player.playerSortDice(this.ctx);
    }else if(this.showing){
      player.playerShowDice(this.ctx);
    }
  }

  buildCasinos(){
    let newCasino;
    for(let i=0; i < 6; i++) {
      newCasino = new Casino([(170 * i) + 50, (Game.HEIGHT / 2) - 100], this.numPlayers, this.colorNums);
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

  populatePlayers(){
    let playerNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    playerNums = this.shuffle(playerNums).slice(0, this.numPlayers);

    for(let i=0; i<this.numPlayers; i++){
      if(i === 0) {
        let newPlayer = new Player("human", playerNums[i], this.colorNums[i], i, this.numPlayers);
        this.players.push(newPlayer);
      } else {
        let newPlayer = new Player("cpu", playerNums[i], this.colorNums[i], i, this.numPlayers);
        this.players.push(newPlayer);
      }
    }
  }

  shuffle(array) {
    let i = 0;
    let j = 0;
    let holder = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      holder = array[i];
      array[i] = array[j];
      array[j] = holder;
    }
    return array;
  }
}

Game.BACKGROUND_COLOR = "#c2c4ce";
Game.WIDTH = 1070;
Game.HEIGHT = 600;

module.exports = Game;
