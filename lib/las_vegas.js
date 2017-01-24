let Game = require("./game");
let Board = require("./board");

document.addEventListener("DOMContentLoaded", function(){
  let canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.WIDTH;
  canvasEl.height = Game.HEIGHT;

  let ctx = canvasEl.getContext("2d");
  let game = new Game(5);
  new Board(game, ctx).start();
});
