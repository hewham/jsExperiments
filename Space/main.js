
var ship;
var asteroids = [];
var lasers = [];
var health = [];
var bombs = [];
var bombCounter = 0;
var bombLimit = 2;

var special;
var specialLaser;
var specialDelay = 800;

var tealImg = null;
var redImg = null;
var specialCount = 0;
var isWarping = false;
var warpCount = 0;
var warpLines = [];

var withoutWarpTime = 1200;
var warpTime = 400;

// function preload() {
//   // tealImg = loadImage('teal.png');
//   // redImg = loadImage('red.png');
// }

function setup() {
  ship = null;
  asteroids = [];
  lasers = [];
  health = [];
  isWarping = false;
  warpCount = 0;
  specialCount = 0;

  createCanvas(windowWidth, windowHeight);
  ship = new Ship(tealImg, redImg);
  for (var i = 0; i < 30; i++) {
    asteroids.push(new Asteroid());
  }
  health.push(new Health(false));
  // specialLaser = new SpecialLaser();
  special = new Special();

  for (var i = 0; i < 160; i++) {
    warpLines[i] = new warpLine();
  }

}

function draw() {
  background(0);
  health[0].render();

  if(health[1]){
    health[1].render();
  }
  if(special.isShowing){
    special.render();
  }

  specialCount++;
  if(specialCount==specialDelay){
    if(!ship.hasSpecial){
      special.reset();
      // specialLaser.render();
    }
    specialCount = 0;
  }

  warpCount++;
  if(warpCount==withoutWarpTime && !isWarping){
    document.getElementById('danger-cont').innerHTML = `<p class="danger-text"></p>`;
    console.log("WARPING");
    this.isWarping = true;
    for (var i = 0; i < asteroids.length; i++) {
      asteroids[i].vel.x -= 2.6;
    }
    warpCount = 0;

  }else if((warpCount==withoutWarpTime-160 || warpCount==withoutWarpTime-100 || warpCount==withoutWarpTime-30) && !isWarping){
    document.getElementById('danger-cont').innerHTML = `<p class="danger-text">Danger</p>`;
  }else if((warpCount==withoutWarpTime-60 || warpCount==withoutWarpTime-130) && !isWarping){
    document.getElementById('danger-cont').innerHTML = `<p class="danger-text"></p>`;
  }else if(warpCount==warpTime && isWarping){
    console.log("STOP WARPING");
    this.isWarping = false;
    for (var i = 0; i < asteroids.length; i++) {
      asteroids[i].vel.x += 2.6;
    }
    warpCount = 0;
  }

  if(isWarping){
    for (var i = 0; i < warpLines.length; i++) {
      warpLines[i].fall();
      warpLines[i].show();
    }
  }


  ship.isBeingHurt = false;
  for (var i = 0; i < asteroids.length; i++) {
    if (ship.hits(asteroids[i])) {
      ship.isBeingHurt = true;
      if(ship.hasSpecial && ship.specialType==0){
        health[1].health -= 1;
        if(health[1].health == 0){
          ship.hasSpecial = false;
        }
      }else{
        health[0].health -= 1;
        if(health[0].health == 0){
          ship.explode();
        }
      }
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }


  if(ship.isBeingHurt){
    ship.img = redImg;
  }else{
    ship.img = tealImg;
  }

  if (ship.hits(special)){
    special.isShowing = false;
    if(special.type!=2){
      ship.hasSpecial = true;
      ship.specialType = special.type;
    }
    if(special.type==0){
      if(health[1]){
        health[1].health = 100;
      }else{
        health.push(new Health(true));
      }
    }else if(special.type==2){
      health[0].health = 100;
    }
  }

  if(bombs != []){
    for(let bomb of bombs){
      bomb.render();
      for (var i = asteroids.length - 1; i >= 0; i--){
        if(bomb.hits(asteroids[i])){
          if (asteroids[i].r > 10) {
            var newAsteroids = asteroids[i].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(i, 1);
        }
      }
    }
  }

  if(ship.firingSpecial){
    specialLaser.firing = true
    specialLaser.render();
    specialLaser.update(ship.pos, ship.heading);
  }

  for (var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
    lasers[i].update();
    if (lasers[i].offscreen()) {
      lasers.splice(i, 1);
    } else {
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if (lasers[i].hits(asteroids[j])) {
          if (asteroids[j].r > 10) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          break;
        }
      }
    }
  }

  ship.render();
  ship.turn();
  ship.update();
  ship.edges();


  document.getElementById('asteroid-count').innerHTML = `<p class="count-text">`+String(asteroids.length)+` Asteroids</p>`;
  if(ship.isDead){
    document.getElementById('retry-cont').innerHTML = `<p class="retry-text">Press Space To Play Again</p>`;
  }else{
    document.getElementById('retry-cont').innerHTML = ``;
  }
}

function keyReleased() {
  if(keyCode == UP_ARROW){
    ship.boosting(false);
  }
  else if(keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW){
    ship.setRotation(0);
  }
}

function keyPressed() {
  if (key == ' ') {
    if(!ship.isDead){
      if(!isWarping){
        if(ship.hasSpecial && ship.specialType==1){
          if(bombCounter+1 <= bombLimit){
            bombs.push(new Bomb(ship.pos));
            bombCounter++;
            if(bombCounter == bombLimit){
              ship.hasSpecial = false;
              bombCounter = 0;
            }
          }
        }else{
          lasers.push(new Laser(ship.pos, ship.heading));
          if(ship.hasSpecial && ship.specialType==0){
            lasers.push(new Laser(ship.pos, ship.heading+PI/128));
            lasers.push(new Laser(ship.pos, ship.heading-PI/128));
          }
        }
      }
    }else{
      this.setup();
    }
  } else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.1);
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.1);
  } else if (keyCode == UP_ARROW) {
    ship.boosting(true);
  }
}









function Asteroid(pos, r) {
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(random(width), random(height))
  }
  if (r) {
    this.r = r * 0.5;
  } else {
    this.r = random(15, 50);
  }

  this.vel = p5.Vector.random2D(1);
  this.total = floor(random(5, 15));
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
  }

  this.update = function() {
    this.pos.add(this.vel);
  }

  this.render = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    //ellipse(0, 0, this.r * 2);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  this.breakup = function() {
    var newA = [];
    newA[0] = new Asteroid(this.pos, this.r);
    newA[1] = new Asteroid(this.pos, this.r);
    return newA;
  }

  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

}













function Bomb(spos) {
  this.pos = createVector(spos.x, spos.y);
  this.counter = 0;
  this.r = 370;
  this.exploding = false;



  this.render = function() {
    push();
    if(this.counter >= 0 && this.counter<=200){
      stroke(100);
      strokeWeight(10);
      point(this.pos.x, this.pos.y);
      stroke(255,100,0);
      strokeWeight(5);
      point(this.pos.x, this.pos.y);
    }
    if((this.counter>= 50 && this.counter <= 60) || (this.counter>= 100 && this.counter <= 110) || (this.counter>= 150 && this.counter <= 160)){
      stroke(0,196,172);
      strokeWeight(7);
    }
    if(this.counter>200 && this.counter < 230){
      this.exploding = true;
      stroke(255,100,0);
      strokeWeight(this.r);
    }
    if(this.counter>=230 && this.counter < 245){
      this.exploding = false;
      stroke(180,70,0);
      strokeWeight(325);
    }
    if(this.counter>=245 && this.counter < 260){
      stroke(150,50,0);
      strokeWeight(250);
    }
    point(this.pos.x, this.pos.y);

    this.counter++;
    pop();
  }

  this.hits = function(asteroid) {
    if(this.exploding){
      var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
      if (d < this.r/2) {
        return true;
      } else {
        return false;
      }
    }
  }


}













class Health {
  constructor(isShield) {
    this.health = 100;
    this.isShield = isShield;
  }

  render() {
    push();
    if(!this.isShield){
      fill(255,0,0);
      rect(0,0,400,10);
      fill(0, 192, 176);
      rect(0,0,this.health*4,10);
    }else{
      fill(255);
      rect(0,20,this.health*4,10);
    }
    pop();
  }
}

















function Laser(spos, angle) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);

  this.update = function() {
    this.pos.add(this.vel);
  }

  this.render = function() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      return true;
    } else {
      return false;
    }
  }

  this.offscreen = function() {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  }


}














class Ship {
  constructor(tealImg, redImg) {
    this.tealImg = tealImg;
    this.redImg = redImg;
    this.img = tealImg;
    this.pos = createVector(width / 2, height / 2);
    this.r = 20;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
    this.isExploding = false;
    this.isDead = false;
    this.isBeingHurt = false;
    this.hasSpecial = false;
    this.specialType = 0;
    this.firingSpecial = false;
  }


  boosting(b) {
    this.isBoosting = b;
  }

  update() {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }

  boost() {
    var force = p5.Vector.fromAngle(this.heading);
    if(!this.hasSpecial){
      force.mult(0.1);
    }else{
      force.mult(0.2);
    }
    this.vel.add(force);
  }

  hits(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2 + PI);
    if(!this.hasSpecial){
      fill(0);
    }else{
      if(this.specialType==0){
        fill(0,196,172);
      }else if(this.specialType==1){
        fill(255,100,0);
      }
    }
    imageMode(CENTER);
    if(!this.isExploding){
      if(this.isDead){
        this.r = 0.01;
        stroke(0);
      }else{
        stroke(0,196,172);
      }
      if(this.isBeingHurt){
        if(!this.hasSpecial){
          stroke(255,0,0);
        }else{
          strokeWeight(3);
          stroke(255);
        }
      }
    }else{
      stroke(255,0,0);
      this.r -= 0.20;
      this.rotation += 0.005;
      this.img = this.redImg;
      if(this.r <= 0.4){
        this.isExploding = false;
        this.isDead = true;
      }
    }

    // image(this.img,0,0,this.r*2,this.r*2);

    //For Triangle
    rotate(PI);
    triangle(-this.r*0.5, this.r*0.5, this.r*0.5, this.r*0.5, 0, -this.r*0.5);

    // if(this.firingSpecial){
    //   rotate(-PI/2);
    //   line(this.pos.x, this.pos.y, 10, 300);
    // }

    if(this.isBoosting){
      stroke(255,100,0);
      strokeWeight(2);
      rotate(PI);
      scale(0.33);
      translate(-this.r, -2.2*this.r);
      triangle(-this.r*0.5, this.r*0.5, this.r*0.5, this.r*0.5, 0, -this.r*0.5);
      translate(this.r,0);
      triangle(-this.r*0.5, this.r*0.5, this.r*0.5, this.r*0.5, 0, -this.r*0.5);
      translate(this.r,0);
      triangle(-this.r*0.5, this.r*0.5, this.r*0.5, this.r*0.5, 0, -this.r*0.5);
    }
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  setRotation(a) {
    this.rotation = a;
  }

  turn() {
    this.heading += this.rotation;
  }

  explode(){
    this.isExploding = true;
  }

  fireSpecialLaser(){
    this.firingSpecial = true;
  }

}











class Special {
  constructor(){
    this.pos = {};
    this.pos.x = random(windowWidth);
    this.pos.y = random(windowHeight);
    this.r = 18;
    this.isShowing = false;

    this.type = random(0,1);
    if(this.type <= 0.33){
      this.type = 0;
    }else if (this.type >= 0.33 && this.type <= 0.66){
      this.type = 1;
    }else if (this.type >= 0.66){
      this.type = 2;
    }

  }


  render() {
    if(this.isShowing){
      push();
      if(this.type == 0){
        stroke(0,192,176);
      }else if(this.type==1){
        stroke(255,100,0);
      }else if(this.type==2){
        stroke(0,255,0);
      }
      fill(0);
      ellipse(this.pos.x,this.pos.y,this.r,this.r);
      if(this.type==0){
        fill(0,192,176);
      }else if(this.type==1){
        fill(255,100,0);
      }else if(this.type==2){
        fill(0,255,0);
      }
      ellipse(this.pos.x,this.pos.y,8,8);
      pop();
    }
  }

  reset(){
    this.pos.x = random(windowWidth);
    this.pos.y = random(windowHeight);
    this.isShowing = true;

    this.type = random(0,1);
    if(this.type <= 0.33){
      this.type = 0;
    }else if (this.type >= 0.33 && this.type <= 0.66){
      this.type = 1;
    }else if (this.type >= 0.66){
      this.type = 2;
    }
  }
}












function SpecialLaser(spos, angle) {
  this.x = spos.x;
  this.y = spos.y;
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);

  this.angle = angle;
  this.firing = false;

  this.update = function(spos,angle) {
    this.pos = createVector(spos.x,spos.y);
    this.x = spos.x;
    this.y = spos.y;
    this.angle = angle;
  }

  this.render = function() {
    if(this.firing){
      push();
      stroke(0,196,172);
      strokeWeight(4);
      // rotate(this.angle - PI/2);
      rect(this.pos.x, this.pos.y, this.vel.x, this.vel.y);

      stroke(255,100,0);

      point(this.pos.x, this.pos.y);
      stroke(255,0,0);

      point(this.vel.x, this.vel.y);
      pop();
    }
  }
}














function warpLine() {
  this.x = random(width);
  this.y = random(width+500, width+50);
  this.z = random(0, 20);
  this.len = map(this.z, 0, 20, 100, 20);
  this.yspeed = map(this.z, 0, 20, 1, 20);

  this.fall = function() {
    this.y = this.y - this.yspeed;
    var grav = map(this.z, 0, 20, 0, 0.2);
    this.yspeed = this.yspeed + grav;

    if (this.y < 0) {
      this.y = random(width+200, width+100);
      this.yspeed = map(this.z, 0, 20, 4, 10);
    }
  }

  this.show = function() {
    var thick = map(this.z, 0, 20, 0.5, 2);
    strokeWeight(thick);
    stroke(0, 196, 172);
    line(this.y, this.x, this.y+this.len, this.x);
    strokeWeight(1);
  }
}


