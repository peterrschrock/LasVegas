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
	      this.color = "#31c631";
	      this.topLeft = pos;
	      this.height = 200;
	      this.width = 80;
	    }
	
	    draw(ctx){
	      ctx.fillStyle = this.color;
	      ctx.fillRect(this.topLeft[0], this.topLeft[1], this.width, this.height);
	    }
	}
	
	module.exports = Casino;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map