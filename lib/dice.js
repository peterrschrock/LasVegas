const Die = require("./die");

class Dice {
  constructor(diceLeft, color, playerCoords) {
    this.color = color;
    this.playerCoords = playerCoords;
    this.diceLeft = diceLeft;

    this.diceLocs = this.diceLocations();
    this.diceArray = [];

    this.setupDice();
  }

  setAmountDice(diceLeft){
    this.diceLeft = diceLeft;
  }

  roll(){
    let ans = Math.ceil(Math.rand() * 6);
  }

  diceLocations(){
    let centerX = ((this.playerCoords[2] - this.playerCoords[0]) / 2) + this.playerCoords[0];
    let centerY = ((this.playerCoords[3] - this.playerCoords[1]) / 2) + this.playerCoords[1];
    let centerDie = (this.diceLeft - 1) / 2;
    let diceLocations = [];
    // debugger
    for (var i = 0; i < this.diceLeft; i++) {
      let centerLoc;
      if(centerY > 300){
        centerLoc = [Math.floor(centerX - 12 + ((i - centerDie) * 37)), centerY - 25];
      } else{
        centerLoc = [centerX - 12 + ((i - centerDie) * 37), centerY];
      }
      diceLocations.push(centerLoc);
    }
    return diceLocations;
  }

  setupDice(){
    this.diceLocs = this.diceLocations();
    this.diceArray = this.diceLocs.map(location => new Die(this.color, location[0], location[1], Math.ceil(Math.random() * 6)));
  }


  rollDice(ctx){
    this.diceArray.forEach((die) => {
      die.rollInternal(Math.ceil(Math.random() * 6));
      die.renderDieBase(ctx);
      die.renderDieFace(ctx);
    });
  }

  showDice(ctx){
    this.diceArray.forEach((die) => {
      die.renderDieBase(ctx);
      die.renderDieFace(ctx, true);
    });
  }

  sortDice(ctx){
    let valueArray = this.dieValuesArray().sort();
    valueArray.forEach((value, idx) => {
      let die = this.diceArray[idx];
      die.rollInternal(value);
      // die.clearDie(ctx);
      die.renderDieBase(ctx);
      die.renderDieFace(ctx, true);
    });
  }

  dieValuesArray(){
    return this.diceArray.map(die => die.value);
  }
}

  module.exports = Dice;
