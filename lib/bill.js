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
