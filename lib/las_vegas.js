let Game = require("./game");
let Board = require("./board");
window.playing = false;

const startGame = function(numPlayers = 5){
  let canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.WIDTH;
  canvasEl.height = Game.HEIGHT;

  let ctx = canvasEl.getContext("2d");
  let game = new Game(numPlayers, ctx);
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
  // startGame();
});

document.getElementById("new-game").addEventListener("click", function(){
  startGame();
});
