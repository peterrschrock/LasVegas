const COORDS = [5, 12.5, 20];


class Die {
  constructor(color, topLeftX, topLeftY) {
    this.color = color;
    this.topLeftX = topLeftX;
    this.topLeftY = topLeftY;
    this.value = null;

  }

  rollInternal(value){
    this.value = value;
  }

  clearDie(ctx){
    ctx.clearRect(this.topLeftX, this.topLeftY, 25, 25);
  }

  renderDieBase(ctx){
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
    ctx.fillRect(this.topLeftX, this.topLeftY, 25, 25);
    ctx.strokeRect(this.topLeftX, this.topLeftY, 25, 25);
  }

  renderDieFace(ctx, organized = false, temp = false){
    let toRender = temp || this.value;
    switch (toRender) {
      case 1:
        this.renderDiePoint(ctx,5);
        break;
      case 2:
        if(organized || Math.random() > 0.5){
          this.renderDiePoint(ctx,1);
          this.renderDiePoint(ctx,9);
        }else{
          this.renderDiePoint(ctx,3);
          this.renderDiePoint(ctx,7);
        }
        break;
      case 3:
        this.renderDiePoint(ctx,5);
        if(organized || Math.random() > 0.5){
          this.renderDiePoint(ctx,1);
          this.renderDiePoint(ctx,9);
        }else{
          this.renderDiePoint(ctx,3);
          this.renderDiePoint(ctx,7);
        }
        break;
      case 4:
        this.renderDiePoint(ctx,1);
        this.renderDiePoint(ctx,9);
        this.renderDiePoint(ctx,3);
        this.renderDiePoint(ctx,7);
        break;
      case 5:
        this.renderDiePoint(ctx,1);
        this.renderDiePoint(ctx,9);
        this.renderDiePoint(ctx,3);
        this.renderDiePoint(ctx,7);
        this.renderDiePoint(ctx,5);
        break;
      case 6:
        this.renderDiePoint(ctx,1);
        this.renderDiePoint(ctx,9);
        this.renderDiePoint(ctx,3);
        this.renderDiePoint(ctx,7);
        if(organized || Math.random() > 0.5){
          this.renderDiePoint(ctx,4);
          this.renderDiePoint(ctx,6);
        }else{
          this.renderDiePoint(ctx,2);
          this.renderDiePoint(ctx,8);
        }
        break;
    }
  }

  renderDiePoint(ctx, faceLocation){
    ctx.fillStyle = "#000000";
    switch (faceLocation) {
      case 1:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[0], this.topLeftY + COORDS[0], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
      case 2:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[1], this.topLeftY + COORDS[0], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
      case 3:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[2], this.topLeftY + COORDS[0], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
      case 4:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[0], this.topLeftY + COORDS[1], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
      case 5:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[1], this.topLeftY + COORDS[1], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
      case 6:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[2], this.topLeftY + COORDS[1], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
      case 7:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[0], this.topLeftY + COORDS[2], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
      case 8:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[1], this.topLeftY + COORDS[2], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
      case 9:
        ctx.beginPath();
        ctx.arc(this.topLeftX + COORDS[2], this.topLeftY + COORDS[2], 3, 0, 2 * Math.PI, true);
        ctx.fill();
        break;
    }
  }
}

module.exports = Die;
