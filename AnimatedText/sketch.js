

var font;
var vehicles = [];
let userInput;
var points;

function preload() {
  font = loadFont('http://www.giggot.com/hew/js/AnimatedText/AvenirNextLTPro-Demi.otf');
}

function setup() {
  createCanvas(windowWidth, 300);
  start();
}
function start() {
  vehicles = [];

  points = font.textToPoints(document.getElementById("userinput").value, 100, 200, 192, {
    sampleFactor: 0.25
  });

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y);
    vehicles.push(vehicle);
  }
}

function changed(){
  start();
}

function draw() {
  background(51);
  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }
}
