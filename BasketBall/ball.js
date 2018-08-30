function Ball() {
  this.x = random(400);
  this.y = 700;
  this.angle = 60;
  this.power = 50;
  this.velx = 5;
  this.vely = 0;
  this.accx = 0;
  this.accy = 1;
  this.d = 40
  this.isMoving = false;
  this.canShoot = true;
  this.wallDampening = 0.8;


  this.show = function() {
    fill(138, 43, 226);
    strokeWeight(0);
    ellipse(this.x,this.y, this.d,this.d);

    var html = `<p>&nbsp;&nbsp;Angle: `+String(this.angle)+`</p>`;
    document.getElementById('angle').innerHTML = html;
    var html = `<p>&nbsp;&nbsp;Power: `+String(this.power)+`</p>`;
    document.getElementById('power').innerHTML = html;
  }

  this.move = function(){
    if(this.isMoving){
      this.velx = this.velx + this.accx;
      this.vely = this.vely + this.accy;

      this.x += this.velx;
      this.y += this.vely;

      if(this.y >= height-this.d/2 && this.vely > 0){
        this.vely = -this.vely*this.wallDampening;
      }
      if(this.x >= width-this.d/2 && this.velx > 0){
        this.velx = -this.velx*this.wallDampening;
      }
      if(this.x <= 0+this.d/2 && this.velx < 0){
        this.velx = -this.velx*this.wallDampening;
      }
      if(this.y >= height-this.d/2){
        this.y = height-this.d/2;
        this.velx *= 0.99;
      }
    }

  }

  this.setAngle = function(addTo) {
    this.angle += addTo;
  }

  this.setPower = function(addTo) {
    this.power += addTo;
  }

  this.shoot = function(){
    if(this.canShoot){
      var deg_to_rad = (Math.PI / 180.0);

      this.vely = (this.power*0.8) * Math.sin(-this.angle*deg_to_rad);
      this.velx = (this.power*0.8) * Math.cos(-this.angle*deg_to_rad);
      this.isMoving = true;
      this.canShoot = false;
    }else{
      if(this.isMoving){
        this.isMoving = false;
      }else{
        this.isMoving = true;
      }
    }









  }

}
