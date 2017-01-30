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
        this.winner = false;
        this.winOpacity = 0.00;

        this.colorNums = [
            0,
            1,
            2,
            3,
            4,
            5
        ];
        this.colorNums = this.shuffle(this.colorNums).slice(0, this.numPlayers);

        this.buildCasinos();
        this.dealMoney();
        this.populatePlayers();

        this.turn = Math.floor(Math.random() * this.players.length);

        this.draw();

        this.play();
    }

    gameOver() {
        let diceLeftArr = this.players.map(player => player.getAmountDice());
        if (diceLeftArr.reduce((a, b) => a + b, 0) > 0) {
            return false;
        } else {
            return true;
        }
    }

    play() {
        this.playTurn();

    }

    playTurn() {
        // debugger
        if (window.playing) {

            let player = this.players[this.turn];
            this.rolling = true;
            setTimeout(() => {
                // debugger

                this.rolling = false;
                this.showing = true;

                setTimeout(() => {
                    this.showing = false;

                    setTimeout(() => {
                        this.sorted = true;

                        setTimeout(() => {
                            player = this.players[this.turn];
                            let move = player.getMove();
                            let numOfDiceWithMove = player.dice.dieValuesArray().filter(x => x === move).length;
                            this.casinos[move - 1].takeBid(this.turn, numOfDiceWithMove);
                            let billsToUpdate = this.money[move - 1];
                            let updatedLeaders = this.getCurrentLeaders()[move - 1];
                            // debugger
                            billsToUpdate.forEach((bill, idx) => {
                                let newLeader = updatedLeaders[idx];
                                if (newLeader === null) {
                                    bill.setLeader(null);
                                } else {
                                    // debugger
                                    bill.setLeader(this.colorNums[newLeader]);
                                }
                            });
                            this.sorted = false;
                            player.dice.setAmountDice(player.dice.diceLeft - numOfDiceWithMove);
                            player.dice.setupDice();

                            setTimeout(() => {
                                this.turn = (this.turn + 1) % this.players.length;
                                let consecutiveDonePlayers = 0;
                                // console.log(this.turn);
                                // console.log(this.players[this.turn].getAmountDice());
                                while (this.players[this.turn].getAmountDice() === 0 && consecutiveDonePlayers < this.numPlayers) {
                                    this.turn = (this.turn + 1) % this.players.length;
                                    consecutiveDonePlayers += 1;
                                }
                                // debugger
                                if (consecutiveDonePlayers < this.numPlayers) {
                                  this.playTurn.bind(this)();
                                  // this.playTurn();
                                } else {
                                  this.resolveBids ();
                                    // debugger
                                }
                            }, 5);

                        }, 10);

                    }, 5);

                }, 15);

            }, 10);

        } else {
            setTimeout(() => {
                this.playTurn();
                this.playTurn.bind(this);
            }, 100);
        }

    }

    getPlaces(arr) {
        let dict = {};
        arr.forEach((el, idx) => dict[el] = idx);
        arr = arr.sort((a, b) => b - a);
        let first;
        if (arr[1] === arr[0]) {
            first = null;
        } else {
            first = dict[arr[0]];
        }

        arr = arr.filter(el => el !== arr[0]);
        let second;
        if (arr[1] === arr[0]) {
            second = null;
        } else {
            second = dict[arr[0]];
        }

        arr = arr.filter(el => el !== arr[0]);
        let third;
        if (arr[1] === arr[0]) {
            third = null;
        } else {
            third = dict[arr[0]];
        }

        return [first, second, third];
        // need to return player not number of dice bid
    }

    getCurrentLeaders() {
        let diceBids = JSON.parse(JSON.stringify(this.casinos.map(casino => casino.diceBids)));
        let leaders = diceBids.map(diceBid => this.getPlaces(diceBid));
        return leaders;
    }

    resolveBids() {
      // debugger
        let winners = this.getCurrentLeaders();
        winners.forEach((casinoWinners, casinoIdx) => {
            casinoWinners.forEach((winner, placeIdx) => {
                if (winner !== null && this.money[casinoIdx][placeIdx]) {
                    this.players[winner].money += this.money[casinoIdx][placeIdx].amount;
                }
            });
        });
        this.declareWinner();
    }

    getMax(arr) {
        let maxIdx = 0;
        let maxVal = -1;
        let multipleMaxes = false;
        arr.forEach((el, idx) => {
            if (el > maxVal) {
                maxVal = el;
                maxIdx = idx;
                multipleMaxes = false;
            } else if (el === maxVal) {
                multipleMaxes = true;
            }
        });
        if (multipleMaxes) {
            return "multiple";
        } else {
            return maxIdx;
        }
    }

    declareWinner() {
        // debugger
        let moneyArray = this.players.map(player => player.money);
        this.winner = this.getMax(moneyArray);
    }

    draw() {
        if (window.playing) {
            this.ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
            this.ctx.fillStyle = Game.BACKGROUND_COLOR;
            this.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

            this.casinos.forEach(casino => casino.draw(this.ctx));

            this.money.forEach((billSet, bSetIdx) => {
                billSet.forEach((bill, billIdx) => bill.draw(this.ctx, bSetIdx, billIdx));
            });

            this.players.forEach((player) => {
                player.draw(this.ctx);
                player.playerShowDiceBases(this.ctx);
            });
            let player = this.players[this.turn];
            if (this.rolling) {
                player.playerRollDice(this.ctx);
                // debugger
            } else if (this.sorted) {
                player.playerSortDice(this.ctx);
            } else if (this.showing) {
                player.playerShowDice(this.ctx);
            }

            if (this.winner !== false) {
                if (this.winOpacity < 1) {
                    this.winOpacity += 0.005;
                }
                this.drawEndGameNotification();
            }
        } else {
            this.ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
            this.ctx.fillStyle = Game.BACKGROUND_COLOR;
            this.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

            this.ctx.font = "40px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#000000";
            this.ctx.fillText(`Las Vegas Rules`, 535, 100);

            this.ctx.font = "20px sans-serif";
            this.ctx.fillText(`1. Roll Dice`, 535, 150);
            this.ctx.fillText(`2. Bid Your Dice at a Casino Matching Your Roll`, 535, 200);
            this.ctx.fillText(`3. Win a Casino's Money if You Bid the Most`, 535, 250);
            this.ctx.fillText(`4. The Player With the Most Money Wins When Everyone is out of Dice`, 535, 300);

        }
    }

    drawEndGameNotification() {
        if (this.winner === "multiple") {
            this.ctx.fillStyle = "#ffffff";
        } else {
            this.ctx.fillStyle = this.players[this.winner].color;
        }
        this.ctx.globalAlpha = 0.7 * this.winOpacity;
        this.ctx.fillRect(50, 200, 970, 200);

        this.ctx.globalAlpha = this.winOpacity;
        this.ctx.font = "30px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#000000";
        if (this.winner === "multiple") {
            this.ctx.fillText(`The game is a tie`, 535, 315);
        } else if (this.winner === 0) {
            this.ctx.fillText(`${this.players[this.winner].name} win with $${this.players[this.winner].money / 1000},000!`, 535, 315);
        } else {
            this.ctx.fillText(`${this.players[this.winner].name} wins with $${this.players[this.winner].money / 1000},000!`, 535, 315);
        }

        this.ctx.strokeStyle = "#000000";
        this.ctx.globalAlpha = 1;
        this.ctx.strokeRect(50, 200, 970, 200);
    }

    buildCasinos() {
        let newCasino;
        for (let i = 0; i < 6; i++) {
            newCasino = new Casino([
                (170 * i) + 50,
                (Game.HEIGHT / 2) - 100
            ], this.numPlayers, this.colorNums);
            this.casinos.push(newCasino);
        }
    }

    dealMoney() {
        for (let i = 0; i < 6; i++) {
            let casinoBillSet = [];
            let totalMoney = 0;
            while (casinoBillSet.length < 3 && totalMoney < 50000) {
                let amt = this.generateBillAmount();
                totalMoney += amt;
                let newBill = new Bill(amt);
                casinoBillSet.push(newBill);
            }
            casinoBillSet.sort((a, b) => b.amount - a.amount);
            this.money.push(casinoBillSet);
        }
    }

    generateBillAmount() {
        return 10000 * Math.ceil(Math.random() * 10);
    }

    populatePlayers() {
        let playerNums = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14
        ];
        playerNums = this.shuffle(playerNums).slice(0, this.numPlayers);

        for (let i = 0; i < this.numPlayers; i++) {
            if (i === 0) {
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

Game.BACKGROUND_COLOR = "#808080";
Game.WIDTH = 1070;
Game.HEIGHT = 600;

module.exports = Game;
