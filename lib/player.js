let AVATARS = ['avatars/Amy.png', 'avatars/Angela.png', 'avatars/Anthony.png',
              'avatars/Antonio.png', 'avatars/Chloe.png', 'avatars/Curtis.png',
              'avatars/Hector.png', 'avatars/Joshua.png', 'avatars/Mary.png',
              'avatars/Mohammed.png', 'avatars/Pamela.png', 'avatars/Rhonda.png',
              'avatars/Terrance.png', 'avatars/William.png', 'avatars/Yvette.png'];

let NAMES = ['Amy', 'Angela', 'Anthony', 'Antonio', 'Chloe', 'Curtis', 'Hector',
            'Joshua', 'Mary', 'Mohammed', 'Pamela', 'Rhonda', 'Terrance',
            'William', 'Yvette', ];

let COLORS = ['#ff0000', '#0000ff', '#008000', '#ffff00', '#ffa500', '#800080'];

class Player {
  constructor(playerType, whichPlayer, whichColor) {
    this.avatar = AVATARS[whichPlayer];
    this.name = NAMES[whichPlayer];
    this.color = COLORS[whichColor];
    if(playerType === "human"){
      this.name = "You";
    }
  }

  draw(ctx, playerId, numPlayers){
    let boundries = this.getPlayerSpace(playerId, numPlayers);
    let centerX = (boundries[0] + boundries[2]) / 2;
    let centerY = 0;
    if(boundries[3] === 600){
      centerY = 528;
    }

    let img = new Image();
    img.addEventListener("load", function() {
      ctx.drawImage(img, centerX, centerY, 50, 72);
    }, false);
    img.src = this.avatar;


    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${this.name}`, centerX + 100, centerY + 35);

    ctx.fillStyle = this.color;
    ctx.fillRect(centerX - 40, centerY + 25, 30, 30);
  }

  getPlayerSpace(playerId, numPlayers){
    switch (playerId) {
      case 0:
        if(numPlayers < 4) {
          return([0, 400, 1070, 600]);
        }else{
          return([536,400, 1070, 600]);
        }
      case 1:
        if(numPlayers < 3) {
          return([0, 0, 1070, 200]);
        }else if(numPlayers < 4){
          return([0, 0, 535, 200]);
        }else{
          return([0, 400, 535, 600]);
        }
      case 2:
        if(numPlayers < 4){
          return([536, 0, 1070, 200]);
        }else if(numPlayers < 5) {
          return([0, 0, 535, 200]);
        }else{
          return([0, 0, 356, 200]);
        }
      case 3:
        if(numPlayers < 5) {
          return([536, 0, 1070, 200]);
        }else{
          return([357, 0, 713, 200]);
        }
      case 4:
        return([714, 0, 1070, 200]);
      }
    }

}

module.exports = Player;
