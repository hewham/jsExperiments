
function Goal() {
  this.x = random(400,700);
  this.y = random(0,400);
  this.width = 80;
  this.height = 50;

  this.show = function() {
    var thick = 5
    strokeWeight(thick);
    // stroke(none);
    rect(this.x,this.y,80,10);
    rect(this.x,this.y,10,-50);
    rect(this.x+70,this.y,10,-50);
  }
}
