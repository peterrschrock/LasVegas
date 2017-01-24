let AVATARS = ['avatars/Amy.png', 'avatars/Anthony.png', 'avatars/Chloe.png',
              'avatars/Curtis.png', 'avatars/Hector.png', 'avatars/Pamela.png'];
let NAMES = ['Amy', 'Anthony', 'Chloe', 'Curtis', 'Hector', 'Pamela'];


class Player {
  constructor(playerType) {
    let idx = Math.floor(Math.random() * 6);
    this.avatar = AVATARS[idx];
    this.name = NAMES[idx];
  }

  draw(ctx, playerId, numPlayers){
    let location = this.getLocation(playerId, numPlayers);

    let img = new Image();
    img.addEventListener("load", function() {
      ctx.drawImage(img, location[0], location[1], 50, 50);
    }, false);
    img.src = this.avatar;
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
        }else{
          return([0, 400, 535, 600]);
        }
      case 2:
        
}

module.exports = Player;
