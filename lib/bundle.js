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
	let Board = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function(){
	  let canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.WIDTH;
	  canvasEl.height = Game.HEIGHT;
	
	  let ctx = canvasEl.getContext("2d");
	  let game = new Game();
	  new Board(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Casino = __webpack_require__(3);
	const Bill = __webpack_require__(4);
	
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
	    
	  }
	}
	
	Game.BACKGROUND_COLOR = "#c2c4ce";
	Game.WIDTH = 1070;
	Game.HEIGHT = 600;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	class Casino {
	    constructor(pos) {
	      this.color = "#dd7d6e";
	      this.topLeftX = pos[0];
	      this.topLeftY = pos[1];
	      this.height = 200;
	      this.width = 120;
	      this.casinoNumber = (pos[0] - 50) / 170;
	    }
	
	    draw(ctx){
	      ctx.fillStyle = this.color;
	      ctx.strokeStyle = "#000000";
	      ctx.fillRect(this.topLeftX, this.topLeftY, this.width, this.height);
	      ctx.strokeRect(this.topLeftX, this.topLeftY, this.width, this.height);
	      ctx.font = "20px sans-serif";
	      ctx.textAlign = "center";
	      ctx.strokeStyle = "#000000";
	      ctx.strokeText(`Casino #${this.casinoNumber + 1}`, this.topLeftX + 60, this.topLeftY + 50);
	    }
	}
	
	module.exports = Casino;


/***/ },
/* 4 */
/***/ function(module, exports) {

	class Bill {
	    constructor(amount) {
	      this.color = "#c6e5c3";
	      this.height = 20;
	      this.width = 60;
	      this.amount = amount;
	    }
	
	    draw(ctx, casinoNum, placement){
	      let topLeftX = 95 + (170 * casinoNum);
	      let topLeftY = 260 + (30 * placement);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map