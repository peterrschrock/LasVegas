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
