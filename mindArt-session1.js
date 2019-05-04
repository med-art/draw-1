//screen bHeight 2560 1440

var img_background, img_brush, img_rake; // all images
var sound1, sound2; // wind, trees, etc
var bool_button1 = 0; // bool_button1ean toggle
var bool_button2 = 4; // bool_button1ean toggle
var gui_img = [];
var pebble = [];
var pebbleu = [];
var tempX = [];
var tempY = [];
var tempX2 = 0;
var tempY2 = 0;
var tempcount = 0;
var randomScalar = [];
var tempID = [];

// declare all brush variables
var rakeX = 0, rakeY = 0, rake2X = 0, rake2Y = 0, rake3X = 0, rake3Y = 0, angle1, segLength;
var offsetX = 0, offsetY = 0;


//button spacing
//margin from right
var margin, buttonWidth, buttonSpacing;



function preload() {

// brush loads

  img_brush = loadImage('assets/brush.png');
  img_rake = loadImage('assets/rake1.png');
  img_rake2 = loadImage('assets/rake2.png');
  img_background = loadImage('assets/sand_01.jpg')
  sound1 = loadSound('assets/sound1.mp3')
  sound2 = loadSound('assets/sound2.mp3')
  sound3 = loadSound('assets/sound3.mp3')

  for (var i = 1; i < 9; i++) {
    gui_img[i] = loadImage('assets/gui' + i + '.png');
  }

  for (var i = 1; i < 8; i++) {
    pebble[i] = loadImage('assets/wpebble' + i + '.png');
  }

  for (var i = 1; i < 8; i++) {
    pebbleu[i] = loadImage('assets/wpebbleu' + i + '.png');
  }

}

function setup() {
  // frameRate(1000);
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // effectively ignores retina displays
  img_background.loadPixels();
  //  tint(255, 50); // opacity control for future version
  image(img_background, 0, 0, width, height);
  //  image(gui_img[4], width - 300, 450, 150, 150);
  //  img_background.resize(width, height);



  segLength = width / 40;



  img_brush.resize(width/15, width/20);

  img_rake.resize(width/30, width/15);



  img_rake2.resize(width/60, width/10);

  // set button margin and spacing relative to the windowWidth

margin = width / 10;
buttonWidth = width / 12;
buttonSpacing = width / 11;


}


function draw() {

  blendMode(BLEND);
  for (var k = 0; k < tempcount; k++) {
    image(pebbleu[tempID[k]], tempX[k], tempY[k], randomScalar[k], randomScalar[k]);
  }

  image(gui_img[bool_button1 + 1], width - margin, (height/2)-buttonSpacing, buttonWidth, buttonWidth);
  image(gui_img[bool_button2], width - margin, height/2, buttonWidth, buttonWidth)
  image(gui_img[8], width - margin, (height/2)+buttonSpacing, buttonWidth, buttonWidth);



  //pebble1
}

function mousePressed() {

  //button1 distance recorder
  let d = dist(mouseX, mouseY, width-margin+(buttonWidth/2), (height/2)-buttonSpacing+(buttonWidth/2));
  if (d < buttonWidth/2) {


    bool_button1++;
    if (bool_button1 >= 3) {
      bool_button1 = 0;
    }



    console.log("brush" + bool_button1);
  }

  //button2 distance recorder
  let d2 = dist(mouseX, mouseY, width-margin+(buttonWidth/2), (height/2)+(buttonWidth/2));
  if (d2 < buttonWidth/2) {
    if (sound1.isPlaying()) {
      sound1.stop();
      sound2.loop();

      bool_button2 = 6;

    } else if (sound2.isPlaying()) {
      sound2.stop();
      sound3.play();
      bool_button2 = 7;
    } else if (sound3.isPlaying()) {
      sound3.stop();
      bool_button2 = 4;
    } else {
      sound1.loop()
      bool_button2 = 5;
    }
  }



  //button3 distance recorder
  let d3 = dist(mouseX, mouseY, width-margin+(buttonWidth/2), (height/2)+buttonSpacing+(buttonWidth/2));
  if (d3 < buttonWidth/2) {
    image(img_background, 0, 0, width, height);

    // basic random counter to determine how many pebbles will be present on the screen;
    tempcount = int(random(0, 3));



    // now a loop based on that random number, to place the pebbles on screen
    for (var k = 0; k < tempcount; k++) {
      randomScalar[k] = int(random(120, 350)); // scale
      tempID[k] = int(random(1, 7)); // which pebble iteration
      tempX[k] = int(random(0, width - randomScalar[k]));
      tempY[k] = int(random(0, height - randomScalar[k]));



      image(pebble[tempID[k]], tempX[k], tempY[k], randomScalar[k], randomScalar[k]);

    }

  }

}


function mouseDragged() {

  if (bool_button1 === 3) {
    blendMode(BLEND);

    loadPixels();
    for (var y = (mouseY - 20); y < (mouseY + 20); y++) {
      for (var x = (mouseX - 20); x < (mouseX + 20); x++) {
        var index = (x + y * width) * 4;
        // Below, the reason for adding the existing pixels back on is to fake a 50%
        // opacity/alpha, which I suspect is not otherwise possible with a Pixel update
        // The opacity feels too strong, consder revising to give 2/3 weight to the old values
        pixels[index + 0] = (img_background.pixels[index + 0]);
        pixels[index + 1] = (img_background.pixels[index + 1]);
        pixels[index + 2] = (img_background.pixels[index + 2]);
        // pixels[index + 3] = 255; // uncessary to add alpha from old pixel valyue
      }
    }
    updatePixels();
  }

  if (bool_button1 === 0) {



    blendMode(OVERLAY);
    // this desperately needs to be smoothed out.

    dx = mouseX - rake3X;
    dy = mouseY - rake3Y;
    angle1 = atan2(dy, dx);
    rake3X = mouseX - (cos(angle1) * (segLength/2));
    rake3Y = mouseY - (sin(angle1) * (segLength/2));

    segment(rake3X, rake3Y, angle1, img_brush, -(width/30), -(width/40))



    // reference for brush offset at https://p5js.org/examples/interaction-follow-1.html
  }

  if (bool_button1 === 1) {

    blendMode(OVERLAY);

    dx = mouseX - rakeX;
    dy = mouseY - rakeY;
    angle1 = atan2(dy, dx);
    rakeX = mouseX - (cos(angle1) * segLength);
    rakeY = mouseY - (sin(angle1) * segLength);

    segment(rakeX, rakeY, angle1, img_rake, offsetX,  -(width/30))
  }

  if (bool_button1 === 2) {
    blendMode(OVERLAY);

    dx = mouseX - rake2X;
    dy = mouseY - rake2Y;
    angle1 = atan2(dy, dx);
    rake2X = mouseX - (cos(angle1) * segLength);
    rake2Y = mouseY - (sin(angle1) * segLength);

    segment(rake2X, rake2Y, angle1, img_rake2, offsetX, -(width/20))
  }

  return false;
}

function segment(rakeX, rakeY, a, rake, offsetX, offsetY) {
  push();
  translate(rakeX, rakeY);
  rotate(a);
  image(rake, offsetX, offsetY, 0, 0);
  pop();
}


// function windowResized() {
//
//   setup();
//
// }
