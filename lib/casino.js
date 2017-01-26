const Die = require("./die");

let COLORS = ['#ff0000', '#8080ff', '#00ff00', '#ffff00', '#ffa500', '#ff00ff'];

class Casino {
    constructor(pos, numPlayers, colorNums) {
      this.numPlayers = numPlayers;
      this.color = "#dd7d6e";
      this.topLeftX = pos[0];
      this.topLeftY = pos[1];
      this.height = 200;
      this.width = 120;
      this.casinoNumber = (pos[0] - 50) / 170;
      this.diceBids = [0,0,0,0,0].slice(0, numPlayers);
      this.playerColors = colorNums.map(num => COLORS[num]);
      this.showDice = [];

      this.setupShowDice();

    }

    getDieCoords(idx){
      switch (idx) {
        case 0:
          if(this.numPlayers < 4){
            return [this.topLeftX + 47.5, this.topLeftY + 165];
          }else{
            return [this.topLeftX + 71.66, this.topLeftY + 165];
          }
        case 1:
          if(this.numPlayers < 3){
            return [this.topLeftX + 47.5, this.topLeftY + 130];
          }else if(this.numPlayers < 4){
            return [this.topLeftX + 23.33, this.topLeftY + 130];
          } else {
            return [this.topLeftX + 23.33, this.topLeftY + 165];
          }
        case 2:
          if(this.numPlayers < 5){
            return [this.topLeftX + 71.66, this.topLeftY + 130];
          } else {
            return [this.topLeftX + 11.25, this.topLeftY + 130];
          }
        case 3:
          if(this.numPlayers < 5){
            return [this.topLeftX + 71.66, this.topLeftY + 130];
          } else {
            return [this.topLeftX + 47.5, this.topLeftY + 130];
          }
        case 4:
          return [this.topLeftX + 83.75, this.topLeftY + 130];

      }
    }

    setupShowDice(){
      this.playerColors.forEach((color, idx) => {
        let dieCoords = this.getDieCoords(idx);
        let newDie = new Die(color, dieCoords[0], dieCoords[1]);
        this.showDice.push(newDie);
      });
    }

    takeBid(playerId, amount){
      this.diceBids[playerId] += amount;
    }



    draw(ctx){
      ctx.fillStyle = this.color;
      ctx.strokeStyle = "#000000";
      ctx.fillRect(this.topLeftX, this.topLeftY, this.width, this.height);
      ctx.strokeRect(this.topLeftX, this.topLeftY, this.width, this.height);
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#000000";
      ctx.strokeText(`Casino #${this.casinoNumber + 1}`, this.topLeftX + 60, this.topLeftY + 25);


      this.showDice.map((die, idx) => {
        die.renderDieBase(ctx);
        if(this.diceBids[idx] > 0){
          die.renderDieFace(ctx, true);
        }
      });
    }
}

module.exports = Casino;
