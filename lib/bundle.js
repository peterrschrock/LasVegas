/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	let Game = __webpack_require__(1);
	let Board = __webpack_require__(10);
	window.playing = false;
	window.numPlayers = 5;
	
	const startGame = function(){
	  let canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.WIDTH;
	  canvasEl.height = Game.HEIGHT;
	
	  let ctx = canvasEl.getContext("2d");
	  let game = new Game(window.numPlayers, ctx);
	  new Board(game, ctx).start();
	};
	
	document.addEventListener("DOMContentLoaded", startGame());
	
	document.getElementById("github").addEventListener("click", function(){
	  window.open('https://github.com/peterrschrock','_blank');
	});
	
	document.getElementById("linked-in").addEventListener("click", function(){
	  window.open('https://www.linkedin.com/in/peter-schrock-67a96aa9','_blank');
	});
	
	document.getElementById("about-game").addEventListener("click", function(){
	  window.playing = false;
	});
	
	document.getElementById("view-game").addEventListener("click", function(){
	  window.playing = true;
	});
	
	document.getElementById("new-game").addEventListener("click", function(){
	  window.playing = true;
	  startGame();
	});
	
	document.getElementById("increase-players").addEventListener("click", function(){
	  if(window.numPlayers < 5){
	    window.numPlayers += 1;
	  }
	});
	
	document.getElementById("decrease-players").addEventListener("click", function(){
	  if(window.numPlayers > 2){
	    window.numPlayers -= 1;
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Casino = __webpack_require__(2);
	const Bill = __webpack_require__(4);
	const Player = __webpack_require__(5);
	let Board = __webpack_require__(10);
	
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
	        if (window.playing) {
	            let player = this.players[this.turn];
	            this.rolling = true;
	            setTimeout(() => {
	
	                this.rolling = false;
	                this.showing = true;
	
	                setTimeout(() => {
	                    this.showing = false;
	
	                    setTimeout(() => {
	                        this.sorted = true;
	
	                        setTimeout(() => {
	                          // debugger
	                            player = this.players[this.turn];
	                            player.getMove(this, player, this.money, this.casinos, (move, that, player2, ctx)=>{
	                              if(player.playerType === 'human'){
	                                that.ctx = ctx;
	                                new Board(that, ctx).start();
	                              }
	                              let numOfDiceWithMove = player2.dice.dieValuesArray().filter(x => x === move).length;
	                              this.players.forEach(aPlayer => {
	                                aPlayer.moveData = [0,0];
	                              });
	                              player2.moveData = [move, numOfDiceWithMove];
	                              // debugger
	                              that.casinos[move - 1].takeBid(that.turn, numOfDiceWithMove);
	                              let billsToUpdate = that.money[move - 1];
	                              let updatedLeaders = that.getCurrentLeaders()[move - 1];
	                              // debugger
	                              billsToUpdate.forEach((bill, idx) => {
	                                let newLeader = updatedLeaders[idx];
	                                if (newLeader === null) {
	                                  bill.setLeader(null);
	                                } else {
	                                  // debugger
	                                  bill.setLeader(that.colorNums[newLeader]);
	                                }
	                              });
	                              that.sorted = false;
	                              player2.dice.setAmountDice(player2.dice.diceLeft - numOfDiceWithMove);
	                              player2.dice.setupDice();
	
	                              setTimeout(() => {
	                                that.turn = (that.turn + 1) % that.players.length;
	                                let consecutiveDonePlayers = 0;
	                                while (that.players[that.turn].getAmountDice() === 0 && consecutiveDonePlayers < that.numPlayers) {
	                                  that.turn = (that.turn + 1) % that.players.length;
	                                  consecutiveDonePlayers += 1;
	                                }
	                                if (consecutiveDonePlayers < that.numPlayers) {
	                                    // that.playTurn();
	                                  that.playTurn.bind(that)();
	                                } else {
	                                  that.resolveBids ();
	                                }
	                              }, 500);
	
	                            });
	
	                        }, 1000);
	
	                    }, 500);
	
	                }, 500);
	
	            }, 1000);
	
	        }
	        else {
	            setTimeout(() => {
	                this.playTurn.bind(this)();
	            }, 5);
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
	        // need to return player2 not number of dice bid
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
	            this.ctx.fillText(`2. Click on of Your Dice to Bid all Dice of that Value at the Matching Casino`, 535, 200);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Die = __webpack_require__(3);
	
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
	          die.rollInternal(this.diceBids[idx]);
	          die.renderDieFace(ctx, true);
	        }
	      });
	    }
	}
	
	module.exports = Casino;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const COORDS = [5, 12.5, 20];
	
	class Die {
	    constructor(color, topLeftX, topLeftY, value = null) {
	        this.color = color;
	        this.topLeftX = topLeftX;
	        this.topLeftY = topLeftY;
	        this.value = value;
	
	    }
	
	    rollInternal(value) {
	        this.value = value;
	    }
	
	    clearDie(ctx) {
	        ctx.clearRect(this.topLeftX, this.topLeftY, 25, 25);
	    }
	
	    renderDieBase(ctx) {
	        ctx.fillStyle = this.color;
	        ctx.strokeStyle = "#000000";
	        ctx.fillRect(this.topLeftX, this.topLeftY, 25, 25);
	        ctx.strokeRect(this.topLeftX, this.topLeftY, 25, 25);
	    }
	
	    renderDieFace(ctx, organized = false, temp = false) {
	        let toRender = temp || this.value;
	        switch (toRender) {
	            case 1:
	                this.renderDiePoint(ctx, 5);
	                break;
	            case 2:
	                if (organized || Math.random() > 0.5) {
	                    this.renderDiePoint(ctx, 1);
	                    this.renderDiePoint(ctx, 9);
	                } else {
	                    this.renderDiePoint(ctx, 3);
	                    this.renderDiePoint(ctx, 7);
	                }
	                break;
	            case 3:
	                this.renderDiePoint(ctx, 5);
	                if (organized || Math.random() > 0.5) {
	                    this.renderDiePoint(ctx, 1);
	                    this.renderDiePoint(ctx, 9);
	                } else {
	                    this.renderDiePoint(ctx, 3);
	                    this.renderDiePoint(ctx, 7);
	                }
	                break;
	            case 4:
	                this.renderDiePoint(ctx, 1);
	                this.renderDiePoint(ctx, 9);
	                this.renderDiePoint(ctx, 3);
	                this.renderDiePoint(ctx, 7);
	                break;
	            case 5:
	                this.renderDiePoint(ctx, 1);
	                this.renderDiePoint(ctx, 9);
	                this.renderDiePoint(ctx, 3);
	                this.renderDiePoint(ctx, 7);
	                this.renderDiePoint(ctx, 5);
	                break;
	            case 6:
	                this.renderDiePoint(ctx, 1);
	                this.renderDiePoint(ctx, 9);
	                this.renderDiePoint(ctx, 3);
	                this.renderDiePoint(ctx, 7);
	                if (organized || Math.random() > 0.5) {
	                    this.renderDiePoint(ctx, 4);
	                    this.renderDiePoint(ctx, 6);
	                } else {
	                    this.renderDiePoint(ctx, 2);
	                    this.renderDiePoint(ctx, 8);
	                }
	                break;
	            case 7:
	                this.renderDiePoint(ctx, 1);
	                this.renderDiePoint(ctx, 9);
	                this.renderDiePoint(ctx, 3);
	                this.renderDiePoint(ctx, 7);
	                this.renderDiePoint(ctx, 5);
	                this.renderDiePoint(ctx, 4);
	                this.renderDiePoint(ctx, 6);
	                break;
	            case 8:
	                this.renderDiePoint(ctx, 1);
	                this.renderDiePoint(ctx, 9);
	                this.renderDiePoint(ctx, 3);
	                this.renderDiePoint(ctx, 7);
	                this.renderDiePoint(ctx, 2);
	                this.renderDiePoint(ctx, 8);
	                this.renderDiePoint(ctx, 4);
	                this.renderDiePoint(ctx, 6);
	                break;
	        }
	    }
	
	    renderDiePoint(ctx, faceLocation) {
	        ctx.fillStyle = "#000000";
	        switch (faceLocation) {
	            case 1:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[0], this.topLeftY + COORDS[0], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	            case 2:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[1], this.topLeftY + COORDS[0], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	            case 3:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[2], this.topLeftY + COORDS[0], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	            case 4:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[0], this.topLeftY + COORDS[1], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	            case 5:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[1], this.topLeftY + COORDS[1], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	            case 6:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[2], this.topLeftY + COORDS[1], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	            case 7:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[0], this.topLeftY + COORDS[2], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	            case 8:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[1], this.topLeftY + COORDS[2], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	            case 9:
	                ctx.beginPath();
	                ctx.arc(this.topLeftX + COORDS[2], this.topLeftY + COORDS[2], 3, 0, 2 * Math.PI, true);
	                ctx.fill();
	                break;
	        }
	    }
	}
	
	module.exports = Die;


/***/ },
/* 4 */
/***/ function(module, exports) {

	let COLORS = ['#ff0000', '#8080ff', '#00ff00', '#ffff00', '#ffa500', '#ff00ff'];
	
	class Bill {
	    constructor(amount) {
	      this.color = "#c6e5c3";
	      this.height = 20;
	      this.width = 60;
	      this.amount = amount;
	      this.leader = null;
	    }
	
	    setLeader(leaderColor){
	      this.leader = leaderColor;
	    }
	
	    draw(ctx, casinoNum, placement){
	      let topLeftX = 95 + (170 * casinoNum);
	      let topLeftY = 235 + (30 * placement);
	
	      if(this.leader !== null){
	        ctx.fillStyle = COLORS[this.leader];
	        ctx.beginPath();
	        ctx.arc(topLeftX - 36, topLeftY + 10, 5, 0, 2 * Math.PI, true);
	        ctx.fill();
	      }
	
	      ctx.font = "14px sans-serif";
	      ctx.textAlign = "left";
	      ctx.fillStyle = "#000000";
	      ctx.fillText(`${this.getPlacement(placement)}:`, topLeftX - 30, topLeftY + 15);
	
	
	      ctx.fillStyle = this.color;
	      ctx.strokeStyle = "#000000";
	      ctx.fillRect(topLeftX, topLeftY, this.width, this.height);
	      ctx.strokeRect(topLeftX, topLeftY, this.width, this.height);
	
	      ctx.font = "14px sans-serif";
	      ctx.textAlign = "center";
	      ctx.fillStyle = "#000000";
	      ctx.fillText(`$${this.amount / 1000},000`, topLeftX + 30, 15 + topLeftY);
	    }
	
	    getPlacement(placement){
	      switch (placement) {
	        case 0:
	          return '1st';
	        case 1:
	          return '2nd';
	        case 2:
	          return '3rd';
	      }
	    }
	}
	
	module.exports = Bill;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Dice = __webpack_require__(6);
	const HumanPlayer = __webpack_require__(7);
	const CPUPlayer = __webpack_require__(8);
	const AIPlayer = __webpack_require__(9);
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
	        this.moveData = [0,0];
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
	        let allDice = this.dice;
	        let move;
	        let canvasEl = document.getElementsByTagName("canvas")[0];
	        let onClickFcn = event => {
	          let untriggered = true;
	          let x = event.pageX - canvasEl.offsetLeft;
	          let y = event.pageY - canvasEl.offsetTop;
	          allDice.diceArray.forEach(die => {
	            if( untriggered && x >= die.topLeftX && x <= die.topLeftX + 25
	                && y >= die.topLeftY && y <= die.topLeftY + 25) {
	                  untriggered = false;
	                  move = die.value;
	
	                  let canvasCloneEl = canvasEl.cloneNode(true);
	                  canvasEl.parentNode.replaceChild(canvasCloneEl, canvasEl);
	
	                  let ctx = canvasCloneEl.getContext("2d");
	
	
	                  cb(move, that, player, ctx);
	                  // canvasEl.removeEventListener('click',onClickFcn);
	
	                }
	          });
	        };
	        canvasEl.addEventListener('click', event => onClickFcn(event), false);
	    }
	
	    getCPUMove(that, player, bills, casinos, cb) {
	        let diceValuesArray = this.dice.dieValuesArray();
	        // let idx = Math.floor(Math.random() * diceValuesArray.length);
	        // let move = diceValuesArray[idx];
	        let move = AIPlayer.getMove(bills, casinos, this.playerId, diceValuesArray);
	        cb(move, that, player);
	    }
	
	    getMove(that, player, bills, casinos, cb) {
	        if (this.playerType === "human") {
	            // debugger
	            return this.getHumanMove(that, player, cb);
	        } else {
	            return this.getCPUMove(that, player, bills, casinos, cb);
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
	
	        if(this.moveData[0] > 0){
	          ctx.font = "20px sans-serif";
	          ctx.textAlign = "center";
	          ctx.fillStyle = "#000000";
	          let bidWord = "bids";
	          if(this.name === "You"){
	            bidWord = "bid";
	          }
	          let dieWord = "dice";
	          if(this.moveData[1] === 1){
	            dieWord = "die";
	          }
	          if(centerY === 0){
	            ctx.fillText(`${this.name} ${bidWord} ${this.moveData[1]} ${dieWord} at casino ${this.moveData[0]}!`, centerX, centerY + 150);
	          } else {
	            ctx.fillText(`${this.name} ${bidWord} ${this.moveData[1]} ${dieWord} at casino ${this.moveData[0]}!`, centerX, centerY - 78);
	          }
	        }
	
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Die = __webpack_require__(3);
	
	class Dice {
	    constructor(diceLeft, color, playerCoords) {
	        this.color = color;
	        this.playerCoords = playerCoords;
	        this.diceLeft = diceLeft;
	
	        this.diceLocs = this.diceLocations();
	        this.diceArray = [];
	
	        this.setupDice();
	    }
	
	    setAmountDice(diceLeft) {
	        this.diceLeft = diceLeft;
	    }
	
	    roll() {
	        let ans = Math.ceil(Math.rand() * 6);
	    }
	
	    diceLocations() {
	        let centerX = ((this.playerCoords[2] - this.playerCoords[0]) / 2) + this.playerCoords[0];
	        let centerY = ((this.playerCoords[3] - this.playerCoords[1]) / 2) + this.playerCoords[1];
	        let centerDie = (this.diceLeft - 1) / 2;
	        let diceLocations = [];
	        // debugger
	        for (var i = 0; i < this.diceLeft; i++) {
	            let centerLoc;
	            if (centerY > 300) {
	                centerLoc = [
	                    Math.floor(centerX - 12 + ((i - centerDie) * 37)),
	                    centerY - 25
	                ];
	            } else {
	                centerLoc = [
	                    centerX - 12 + ((i - centerDie) * 37),
	                    centerY
	                ];
	            }
	            diceLocations.push(centerLoc);
	        }
	        return diceLocations;
	    }
	
	    setupDice() {
	        this.diceLocs = this.diceLocations();
	        this.diceArray = this.diceLocs.map(location => new Die(this.color, location[0], location[1], Math.ceil(Math.random() * 6)));
	    }
	
	    rollDice(ctx) {
	        this.diceArray.forEach((die) => {
	            die.rollInternal(Math.ceil(Math.random() * 6));
	            die.renderDieBase(ctx);
	            die.renderDieFace(ctx);
	        });
	    }
	
	    showDice(ctx) {
	        this.diceArray.forEach((die) => {
	            die.renderDieBase(ctx);
	            die.renderDieFace(ctx, true);
	        });
	    }
	
	    showDiceBases(ctx) {
	        this.diceArray.forEach((die) => {
	            die.renderDieBase(ctx);
	        });
	    }
	
	    sortDice(ctx) {
	        let valueArray = this.dieValuesArray().sort();
	        valueArray.forEach((value, idx) => {
	            let die = this.diceArray[idx];
	            die.rollInternal(value);
	            // die.clearDie(ctx);
	            die.renderDieBase(ctx);
	            die.renderDieFace(ctx, true);
	        });
	    }
	
	    dieValuesArray() {
	        return this.diceArray.map(die => die.value);
	    }
	}
	
	module.exports = Dice;


/***/ },
/* 7 */
/***/ function(module, exports) {



/***/ },
/* 8 */
/***/ function(module, exports) {



/***/ },
/* 9 */
/***/ function(module, exports) {

	const randomAllocationProbabilities = [
	    [1],
	    [
	        0.8333333333333333, 0.16666666666666666
	    ],
	    [
	        0.7175925925925926, 0.2314814814814815, 0.05092592592592593
	    ],
	    [
	        0.6246249142661182, 0.26765046296296313, 0.09082433127572022, 0.016900291495198907
	    ],
	    [
	        0.5497479284947693, 0.28273327554234773, 0.12479787046563078, 0.03654605179596619, 0.006174873701290464
	    ],
	    [
	        0.48864005626357393,
	        0.2855164354271376,
	        0.15015503565828917,
	        0.05770678884921891,
	        0.015521958967025315,
	        0.0024597248347752584
	    ],
	    [
	        0.43814064334040925,
	        0.2810906335062934,
	        0.16790799043801888,
	        0.07742338639459535,
	        0.02741749220659768,
	        0.006965867076680246,
	        0.0010539870373371379
	    ],
	    [
	        0.3959369812189038,
	        0.27256806555053203,
	        0.17941726939596964,
	        0.09455244507402434,
	        0.04026787327676963,
	        0.013489377663121244,
	        0.0032875690668217558,
	        0.00048041875411542135
	    ],
	    [
	        0.36030563533236026,
	        0.26187008607465484,
	        0.1860403149315499,
	        0.10867374514430733,
	        0.05300477512531394,
	        0.021375725659127005,
	        0.006875338146995475,
	        0.0016234123967606596,
	        0.00023096718818415668
	    ]
	];
	
	class AIPlayer {
	  static getMove(bills, casinos, whichPlayer, diceValuesArray){
	    const diceLeftArr = this.getDiceLeft(casinos);
	    const deficitArrays = this.getDeficits(casinos, whichPlayer, diceLeftArr);
	    const winProbs = this.getWinProbs(deficitArrays, diceValuesArray, diceLeftArr[whichPlayer], diceLeftArr.length);
	    let move = this.getBestMove(winProbs, bills);
	
	    let idx = Math.floor(Math.random() * diceValuesArray.length);
	    return move;
	  }
	
	  static getBestMove(winProbs, bills){
	    let billVals = [];
	    bills.forEach(casinoSlot => {
	      let casinoArr = [];
	      casinoSlot.forEach(bill => {
	        casinoArr.push(bill.amount);
	      });
	      billVals.push(casinoArr);
	    });
	
	    let bestMove = winProbs[0][0];
	    // let bestMoveValue = winProbs[0][1] * billVals[bestMove - 1];
	    let bestMoveValue = 0;
	    winProbs.forEach(winProb => {
	      let value = 0;
	      winProb[1].forEach((chance, idx) => {
	        value += chance * billVals[idx][0];
	      });
	      if(value > bestMoveValue){
	        bestMoveValue = value;
	        bestMove = winProb[0];
	      }
	    });
	    return bestMove;
	  }
	
	  static getWinProbs(deficitArrays, diceValues, diceLeft, numPlayers){
	    const moves = this.unique(diceValues);
	    let solutions = [];
	    for (var i = 0; i < moves.length; i++) {
	      const move = moves[i];
	      let ifThisMoveArr = [];
	      // const deficitArray = deficitArrays[move - 1];
	      const diceSpent = diceValues.filter((x) => x == move).length;
	      const remainingDice = diceLeft - diceSpent;
	      const rands = randomAllocationProbabilities[remainingDice];
	      for (var m = 0; m < deficitArrays.length; m++) {
	        let deficitArray = deficitArrays[m].slice(0);
	
	        for (var j = rands.length - 1; j > -1; j--) {
	          for (var k = deficitArray.length - 1 - diceLeft; k > -1; k--) {
	            let toAdd = j;
	            if(move === m + 1){
	              toAdd += diceSpent;
	            }
	            const probabilityMass = deficitArray[k] * rands[j];
	            deficitArray[k + toAdd] += probabilityMass;
	            deficitArray[k] -= probabilityMass;
	          }
	        }
	        ifThisMoveArr.push(deficitArray);
	      }
	
	      let winsArr = [];
	      ifThisMoveArr.forEach(defArr => {
	        const ties = defArr[8];
	        const wins = defArr.slice(9).reduce( (a,b) => a + b, 0);
	        const winChance = wins + ties / ((numPlayers - 1) * 2);
	        winsArr.push(winChance);
	      });
	
	
	      solutions.push([move, winsArr]);
	    }
	    return solutions;
	  }
	
	  static unique(arr) {
	    var hash = {}, result = [];
	    for ( var i = 0, l = arr.length; i < l; ++i ) {
	        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
	            hash[ arr[i] ] = true;
	            result.push(arr[i]);
	        }
	    }
	    return result;
	}
	
	  static getDeficits(casinos, whichPlayer, diceLeftArr){
	    let dummyCasinosBids = [];
	    casinos.forEach(casino => {
	      dummyCasinosBids.push(casino.diceBids.slice(0));
	    });
	    return dummyCasinosBids.map( bids => {
	      const myDiceBid = bids[whichPlayer];
	      let deficitArr = [0, 0, 0, 0, 0, 0, 0, 0, 0,
	                        0, 0, 0, 0, 0, 0, 0, 0];
	      deficitArr[myDiceBid + 8] = 1;
	      for (var i = 0; i < bids.length; i++) {
	        if(i !== whichPlayer){
	          const cpuBidSoFar = bids[i];
	          const cpuDiceLeft = diceLeftArr[i];
	          const rands = randomAllocationProbabilities[cpuDiceLeft];
	          for (var j = rands.length - 1; j > -1; j--) {
	            const totalDicePlayed = j + cpuBidSoFar;
	            const defArrIdx = 8 - totalDicePlayed + myDiceBid;
	            for (var k = defArrIdx + 1; k < deficitArr.length; k++) {
	              deficitArr[defArrIdx] += deficitArr[k] * rands[j];
	              deficitArr[k] *= (1 - rands[j]);
	            }
	          }
	        }
	      }
	      return deficitArr;
	      // return myDiceBid - otherHighest;
	    });
	  }
	
	  static getDiceLeft(casinos){
	    const numPlayers = Object.keys(casinos[0].diceBids).length;
	    const diceLeftArr = [];
	    for (var i = 0; i < numPlayers; i++) {
	      diceLeftArr.push(8);
	    }
	    for (var i = 0; i < numPlayers; i++) {
	      casinos.forEach(casino => {
	        diceLeftArr[i] -= casino.diceBids[i];
	      });
	    }
	    return diceLeftArr;
	  }
	}
	
	module.exports = AIPlayer;


/***/ },
/* 10 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map