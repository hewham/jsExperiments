
var goal;
var car;

function setup() {
  createCanvas(800, 800);
  ball = new Ball();
  goal = new Goal();
}

function draw() {
  // background(20,20,20);
  background(200,200,255);
  ball.show();
  goal.show();
  ball.move();
  this.collide(ball, goal);
  // ellipse(goal.x, goal.y, 20, 20);
  // ellipse(0,0, 20, 20);
}


function collide(ball, goal){
  if(ball.y-ball.d < goal.y+5 && ball.x > goal.x && ball.x < goal.x+goal.width && ball.y > goal.y){
    console.log("BOUNCE OFF BOTTOM");
    ball.vely *= -1;
  }
  else if(ball.x+ball.d > goal.x-5 && ball.y < goal.y && ball.x < goal.x && ball.y > goal.y-goal.height){
    console.log("BOUNCE OFF LEFT SIDE");
    ball.velx *= -1;
  }
  else if(ball.x-ball.d < goal.x+goal.width+5 && ball.y < goal.y && ball.x > goal.x+goal.width && ball.y > goal.y-goal.height){
    console.log("BOUNCE OFF RIGHT SIDE");
    ball.velx *= -1;
  }

  if(ball.x > goal.x && ball.y < goal.y && ball.x < goal.x+goal.width && ball.y > goal.y-goal.height){
    console.log("GOAL");
    ball.velx = 0;
    ball.vely = 0;
    ball.accx = 0;
    ball.accy = 0;
    alert("You Won!");
    this.setup();
  }
}


function keyReleased() {
  if (key != ' ') {
    ball.setAngle(0);
  }
}


function keyPressed() {
  if (key === ' ') {
    ball.shoot();
  }

  if (keyCode === RIGHT_ARROW) {
    ball.setAngle(-1);
  } else if (keyCode === LEFT_ARROW) {
    ball.setAngle(1);
  }
  else if (keyCode === UP_ARROW) {
    ball.setPower(1);
  }
  else if (keyCode === DOWN_ARROW) {
    ball.setPower(-1);
  }
}
