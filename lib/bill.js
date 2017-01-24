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
