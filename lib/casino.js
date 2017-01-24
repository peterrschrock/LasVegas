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
