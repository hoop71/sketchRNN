let sketchRNN;
let currentStroke;
let x, y;
let nextPen = 'down';

function preload() {
  sketchRNN = ml5.sketchRNN('cat');
}

function setup() {
  createCanvas(400, 400);
  x = width / 2;
  y = height / 2;
  background(255);
  sketchRNN.generate(gotStrokePath);
  console.log('model loaded');
}

function gotStrokePath(err, strokePath) {
  // console.log(strokePath);
  currentStroke = strokePath;
}

function draw() {
  if (currentStroke) {
    stroke(1);
    strokeWeight(4);

    if (nextPen === 'end') {
      noLoop(); // kill sketch and stop
      return;
    }

    if (nextPen === 'down') {
      line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }

    // currentStroke.pen looks at next dx, dy, where the draw ended
    nextPen = currentStroke.pen;
    x += currentStroke.dx;
    y += currentStroke.dy;
    currentStroke = null;
    sketchRNN.generate(gotStrokePath);
  }
}
