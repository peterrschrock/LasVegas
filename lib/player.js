const Dice = require("./dice");
const HumanPlayer = require("./human_player");
const CPUPlayer = require("./cpu_player");
//test
let AVATARS = [
    'avatars/Amy.png',
    'avatars/Angela.png',
    'avatars/Anthony.png',
    'avatars/Antonio.png',
    'avatars/Chloe.png',
    'avatars/Curtis.png',
    'avatars/Hector.png',
    'avatars/Joshua.png',
    'avatars/Mary.png',
    'avatars/Mohammed.png',
    'avatars/Pamela.png',
    'avatars/Rhonda.png',
    'avatars/Terrance.png',
    'avatars/William.png',
    'avatars/Yvette.png'
];

let NAMES = [
    'Amy',
    'Angela',
    'Anthony',
    'Antonio',
    'Chloe',
    'Curtis',
    'Hector',
    'Joshua',
    'Mary',
    'Mohammed',
    'Pamela',
    'Rhonda',
    'Terrance',
    'William',
    'Yvette'
];

let COLORS = [
    '#ff0000',
    '#8080ff',
    '#00ff00',
    '#ffff00',
    '#ffa500',
    '#ff00ff'
];

class Player {
    constructor(playerType, whichPlayer, whichColor, playerId, numPlayers) {
        this.avatar = AVATARS[whichPlayer];
        this.name = NAMES[whichPlayer];
        this.color = COLORS[whichColor];
        if (playerType === "human") {
            this.name = "You";
        }
        this.playerId = playerId;
        this.numPlayers = numPlayers;
        this.playerCoords = this.getPlayerSpace();
        this.dice = new Dice(8, this.color, this.playerCoords);
        this.diceArray = this.dice.diceArray;
        this.money = 0;
        this.playerType = playerType;
    }

    getHumanMove(that, player, cb) {
        let diceValuesArray = this.dice.dieValuesArray();
        // let idx = Math.floor(Math.random * diceValuesArray.length);
        // return diceValuesArray[idx];
        let allDice = this.dice;
        let move;
        let canvasEl = document.getElementsByTagName("canvas")[0];
        canvasEl.addEventListener('click', event => {
          let x = event.pageX - canvasEl.offsetLeft;
          let y = event.pageY - canvasEl.offsetTop;
          allDice.diceArray.forEach(die => {
            if( x >= die.topLeftX && x <= die.topLeftX + 25
                && y >= die.topLeftY && y <= die.topLeftY + 25) {
                  move = die.value;
                  cb(move, that, player);
                }
          });
        }, false);
    }

    getCPUMove(that, player, cb) {
        let diceValuesArray = this.dice.dieValuesArray();
        let idx = Math.floor(Math.random() * diceValuesArray.length);
        let move = diceValuesArray[idx];
        cb(move, that, player);
    }

    getMove(that, player, cb) {
        if (this.playerType === "human") {
            return this.getHumanMove(that, player, cb);
        } else {
            return this.getCPUMove(that, player, cb);
        }
    }

    playerRollDice(ctx) {
        this.dice.rollDice(ctx);
    }

    playerShowDice(ctx) {
        this.dice.showDice(ctx);
    }

    playerShowDiceBases(ctx) {
        this.dice.showDiceBases(ctx);
    }

    playerSortDice(ctx) {
        this.dice.sortDice(ctx);
    }

    setAmountDice(diceLeft) {
        this.dice.setAmountDice(diceLeft);
    }

    getAmountDice() {
        return this.dice.diceLeft;
    }

    draw(ctx) {
        let centerX = (this.playerCoords[0] + this.playerCoords[2]) / 2;
        let centerY = 0;
        if (this.playerCoords[3] === 600) {
            centerY = 528;
        }

        let img = new Image();
        img.src = this.avatar;
        ctx.drawImage(img, centerX, centerY, 50, 72);

        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        ctx.fillText(`${this.name}`, centerX + 100, centerY + 35);
        ctx.fillText(`$${this.money / 1000},000`, centerX + 100, centerY + 60);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(centerX - 35, centerY + 35, 20, 0, 2 * Math.PI, true);
        ctx.fill();

    }

    getPlayerSpace() {
        switch (this.playerId) {
            case 0:
                if (this.numPlayers < 4) {
                    return ([0, 400, 1070, 600]);
                } else {
                    return ([536, 400, 1070, 600]);
                }
            case 1:
                if (this.numPlayers < 3) {
                    return ([0, 0, 1070, 200]);
                } else if (this.numPlayers < 4) {
                    return ([0, 0, 535, 200]);
                } else {
                    return ([0, 400, 535, 600]);
                }
            case 2:
                if (this.numPlayers < 4) {
                    return ([536, 0, 1070, 200]);
                } else if (this.numPlayers < 5) {
                    return ([0, 0, 535, 200]);
                } else {
                    return ([0, 0, 356, 200]);
                }
            case 3:
                if (this.numPlayers < 5) {
                    return ([536, 0, 1070, 200]);
                } else {
                    return ([357, 0, 713, 200]);
                }
            case 4:
                return ([714, 0, 1070, 200]);
        }
    }

}

module.exports = Player;
